/**
 * Base namespace for Skulpt. This is the only symbol that Skulpt adds to the
 * global namespace. Other user accessible symbols are noted and described
 * below.
 */

var Sk = Sk || {};

/**
 * Resets Skulpt's global runtime data. This is called automatically in
 * Sk.configure and Sk.importMain, but there may be situations where you
 * need to reset manually (for example, if you're implementing some kind
 * of REPL).
 */
Sk.reset = function()
{
    Sk._moduleStack = [];
    Sk._frames = [];

    Sk._initingObjects = [];
    Sk._initingObjectsIndex = 0;

    delete Sk._preservedFrames;
    delete Sk._frameRestoreIndex;
    delete Sk._futureResult;
};

/**
 *
 * Set various customizable parts of Skulpt.
 *
 * output: Replacable output redirection (called from print, etc.).
 * read: Replacable function to load modules with (called via import, etc.)
 * sysargv: Setable to emulate arguments to the script. Should be an array of JS
 * strings.
 * syspath: Setable to emulate PYTHONPATH environment variable (for finding
 * modules). Should be an array of JS strings.
 *
 * Any variables that aren't set will be left alone.
 */
Sk.configure = function(options)
{
    // added by allevato
    Sk.reset();

    Sk.output = options["output"] || Sk.output;
    goog.asserts.assert(typeof Sk.output === "function");

    Sk.input = options["input"] || Sk.input;
    goog.asserts.assert(typeof Sk.input === "function");

    Sk.debugout = options["debugout"] || Sk.debugout;
    goog.asserts.assert(typeof Sk.debugout === "function");

    Sk.read = options["read"] || Sk.read;
    goog.asserts.assert(typeof Sk.read === "function");

    Sk.transformUrl = options["transformUrl"] || Sk.transformUrl;
    goog.asserts.assert(typeof Sk.transformUrl === "function");

    Sk.sysargv = options["sysargv"] || Sk.sysargv;
    goog.asserts.assert(goog.isArrayLike(Sk.sysargv));

    // added by allevato: When the code is running in the browser,
    // it is running in the same UI thread as the rest of the page, so the
    // code is suspended at regular intervals to give the DOM an opportunity
    // to update and for user input to take place. The "suspend interval" is
    // the number of milliseconds that should pass between suspensions.
    // Higher values of this parameter will increase the speed of the Python
    // code because less time will be spent yielding back to the DOM thread,
    // but will also make the browser significantly less responsive. Lower
    // values will make the browser more responsive but significantly slow
    // down execution. The default is 100 milliseconds.
    Sk.suspendInterval = options["suspendInterval"] || 100;
    goog.asserts.assert(typeof Sk.suspendInterval === "number");

    if (options["syspath"])
    {
        Sk.syspath = options["syspath"];
        goog.asserts.assert(goog.isArrayLike(Sk.syspath));
        // assume that if we're changing syspath we want to force reimports.
        // not sure how valid this is, perhaps a separate api for that.
        Sk.realsyspath = undefined;
        Sk.sysmodules = new Sk.builtin.dict([]);
    }

    Sk.misceval.softspace_ = false;
};
goog.exportSymbol("Sk.configure", Sk.configure);

/*
 * Replacable output redirection (called from print, etc).
 */
Sk.output = function(x) {};

/*
 * Replacable input redirection (called from input, etc).
 */
Sk.input = function(x) { return prompt(x); };

/*
 * Replacable function to load modules with (called via import, etc.)
 * todo; this should be an async api
 */
Sk.read = function(x) { throw "Sk.read has not been implemented"; };

/*
 * Transform a URL. This is used by modules that make web requests,
 * since cross-origin requests are usually not allowed for security
 * reasons.
 *
 * For example, a web application that uses Skulpt can implement this
 * function to make the URL passthrough the local service. For example,
 * transform "http://foreignsite.com" to
 * "http://localservice.com/proxy?url=http://foreignsite.com".
 *
 * Note that this function should take and return a JS string (not a
 * wrapped Skulpt string).
 */
Sk.transformUrl = function(x) { return x; };

/*
 * Setable to emulate arguments to the script. Should be array of JS strings.
 */
Sk.sysargv = [];

// lame function for sys module
Sk.getSysArgv = function()
{
    return Sk.sysargv;
};
goog.exportSymbol("Sk.getSysArgv", Sk.getSysArgv);


/**
 * Setable to emulate PYTHONPATH environment variable (for finding modules).
 * Should be an array of JS strings.
 */
Sk.syspath = [];

Sk.inBrowser = goog.global.document !== undefined;

/**
 * Internal function used for debug output.
 * @param {...} args
 */
Sk.debugout = function(args) {};

/**
 * A basic run loop for Skulpt-generated code. Since this fork of Skulpt has
 * yield/resume-style execution, a loop is needed to catch the
 * SuspendExecution exceptions that the Sk.yield() primitve throws, and then
 * resume execution afterwards.
 *
 * The function that simpleRun takes as an argument is a function that kicks
 * off the actual execution. The most basic example would be:
 *
 *   Sk.simpleRun(function() { return Sk.importMain('module name'); });
 *
 * This simpleRun function returns whatever value the passed in function
 * returns. This makes it easy to return the imported module, to access its
 * locals table and so forth.
 *
 * If the executing Python code throws any exceptions that a type other than
 * SuspendExecution, the exception will be rethrown out of simpleRun so that
 * the caller can catch it.
 *
 * WARNING: This function is NOT appropriate for in-browser execution -- it
 * is a hard loop that will block the browser UI thread. Use the
 * Sk.runInBrowser function for this instead, which uses a repeated
 * setTimeout mechanism to ensure that the UI has an opportunity to update.
 *
 * @param start the function that starts a Skulpt execution; see the example
 *              above
 * @return the result of start
 */
Sk.simpleRun = function(start)
{
    var result;
    var running = true;
    var firsttime = true;

    while (running)
    {
        running = false;
        try
        {
            if (!firsttime)
            {
                Sk.resume();
            }
            else
            {
                firsttime = false;
                result = start();
            }
        }
        catch (e)
        {
            if (e instanceof SuspendExecution)
            {
                running = true;
            }
            else
            {
                throw e;
            }
        }
    }

    return result;
};
goog.exportSymbol("Sk.simpleRun", Sk.simpleRun);

/**
 * A browser-friendly run loop for Skulpt-generated code. Since this fork of
 * Skulpt has yield/resume-style execution, this function uses a setTimeout
 * "loop" to execute the code; the code is started, and when it yields, it
 * is resumed with another call to setTimeout. This allows the Python code
 * to give some idle time to the browser UI thread, allowing it to update the
 * DOM and handle user interaction (for example, to let them click a button
 * to stop long-running code).
 *
 * The function that runInBrowser takes as an argument is a function that
 * kicks off the actual execution. The most basic example would be:
 *
 *   Sk.runInBrowser(function() { return Sk.importMain('module name'); });
 *
 * This runInBrowser function can optionally take two other arguments: the
 * first is a callback function called when the code successfully completes
 * execution (takes no arguments); the second is a callback function called
 * if an exception occurs while the code is executing (takes one argument,
 * the exception that was thrown).
 *
 * @param {function()} start
 * @param {function()=} onSuccess
 * @param {function(Object)=} onError
 */
Sk.runInBrowser = function(start, onSuccess, onError)
{
    /**
     * @param {boolean} first
     * @param {Object=} continuationResult
     */
    var runner = function(first, continuationResult) {
        var resume = false;
        var success = false;

        try
        {
            if (first)
            {
                start();
            }
            else
            {
                Sk.resume(continuationResult);
            }
            
            success = true;
        }
        catch (e)
        {
            if (e instanceof SuspendExecution)
            {
                if (e.future)
                {
                    e.future(function(result) { runner(false, result); });
                }
                else
                {
                    resume = true;
                }
            }
            else
            {
                resume = false;
                success = false;

                if (onError)
                {
                    onError(e);
                }
                else
                {
                    goog.global.console.log(e);
                }
            }
        }

        if (resume)
        {
            Sk._nextRunTimeout = window.setTimeout(
              function() { runner(false); }, 1);
        }
        else if (success && onSuccess)
        {
            onSuccess();
        }
    };

    runner(true);
};

Sk.cancelInBrowser = function()
{
  window.clearTimeout(Sk._nextRunTimeout);
  delete Sk._nextRunTimeout;
};

goog.exportSymbol("Sk.runInBrowser", Sk.runInBrowser);
goog.exportSymbol("Sk.cancelInBrowser", Sk.cancelInBrowser);


(function() {
    // set up some sane defaults based on availability
    if (goog.global.write !== undefined) Sk.output = goog.global.write;
    else if (goog.global.console !== undefined && goog.global.console.log !== undefined) Sk.output = function (x) {goog.global.console.log(x);};
    else if (goog.global.print !== undefined) Sk.output = goog.global.print;

    if (goog.global.print !== undefined) Sk.debugout = goog.global.print;
}());

// override for closure to load stuff from the command line.
if (!Sk.inBrowser)
{
    goog.writeScriptTag_ = function(src)
    {
        if (!goog.dependencies_.written[src])
        {
            goog.dependencies_.written[src] = true;
            goog.global.eval(goog.global.read("support/closure-library/closure/goog/" + src));
        }
    };
}

goog.require("goog.asserts");

