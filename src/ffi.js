Sk.ffi = Sk.ffi || {};

/**
 * maps from Javascript Object/Array/string to Python dict/list/str.
 *
 * only works on basic objects that are being used as storage, doesn't handle
 * functions, etc.
 */
Sk.ffi.remapToPy = function(obj)
{
    if (obj === null)
    {
        return null;
    }
    else if (Object.prototype.toString.call(obj) === "[object Array]")
    {
        var arr = [];
        for (var i = 0; i < obj.length; ++i)
            arr.push(Sk.ffi.remapToPy(obj[i]));
        return new Sk.builtin.list(arr);
    }
    else if (typeof obj === "object")
    {
        var kvs = [];
        for (var k in obj)
        {
            kvs.push(Sk.ffi.remapToPy(k));
            kvs.push(Sk.ffi.remapToPy(obj[k]));
        }
        return new Sk.builtin.dict(kvs);
    }
    else if (typeof obj === "string")
        return new Sk.builtin.str(obj);
    else if (typeof obj === "number")
		return new Sk.builtin.nmber(obj, undefined);
	else if (typeof obj === "boolean")
        return obj;
    goog.asserts.fail("unhandled remap type " + typeof(obj));
};
goog.exportSymbol("Sk.ffi.remapToPy", Sk.ffi.remapToPy);

/**
 * maps from Python dict/list/str to Javascript Object/Array/string.
 */
Sk.ffi.remapToJs = function(obj)
{
    if (obj instanceof Sk.builtin.dict)
    {
        var ret = {};
        for (var iter = obj.tp$iter(), k = iter.tp$iternext();
                k !== undefined;
                k = iter.tp$iternext())
        {
            var v = obj.mp$subscript(k);
            if (v === undefined)
                v = null;
            var kAsJs = Sk.ffi.remapToJs(k);
            // todo; assert that this is a reasonble lhs?
            ret[kAsJs] = Sk.ffi.remapToJs(v);
        }
        return ret;
    }
    else if (obj instanceof Sk.builtin.list || obj instanceof Sk.builtin.tuple)
    {
        var ret = [];
        for (var i = 0; i < obj.v.length; ++i)
            ret.push(Sk.ffi.remapToJs(obj.v[i]));
        return ret;
    }
    else if (obj instanceof Sk.builtin.nmber)
    {
        return Sk.builtin.asnum$(obj);
    }
    else if (obj instanceof Sk.builtin.lng)
    {
        return Sk.builtin.asnum$(obj);
    }
    else if (obj === null || typeof obj === "number" || typeof obj === "boolean")
        return obj;
    else
        return obj.v;
};
goog.exportSymbol("Sk.ffi.remapToJs", Sk.ffi.remapToJs);

/*
 * Added by allevato
 *
 * Takes a kwargs array (which alternates [name, value, name, value...])
 * and returns a JS object with the appropriate keys/values.
 */
Sk.ffi.kwargsToJs = function(kwargs)
{
    var dict = {};

    for (var index = 0; index < kwargs.length; index += 2)
    {
        var pykey = kwargs[index];
        var pyval = kwargs[index + 1];

        dict[Sk.ffi.remapToJs(pykey)] = Sk.ffi.remapToJs(pyval);
    }

    return dict;
};
goog.exportSymbol("Sk.ffi.kwargsToJs", Sk.ffi.kwargsToJs);

Sk.ffi.callback = function(fn)
{
    if (fn === undefined) return fn;
    return function() {
        return Sk.misceval.apply(fn, undefined, undefined, undefined, Array.prototype.slice.call(arguments, 0));
    };
};
goog.exportSymbol("Sk.ffi.callback", Sk.ffi.callback);

Sk.ffi.stdwrap = function(type, towrap)
{
    var inst = new type();
    inst['v'] = towrap;
    return inst;
};
goog.exportSymbol("Sk.ffi.stdwrap", Sk.ffi.stdwrap);

/**
 * for when the return type might be one of a variety of basic types.
 * number|string, etc.
 */
Sk.ffi.basicwrap = function(obj)
{
	if (obj instanceof Sk.builtin.nmber)
		return Sk.builtin.asnum$(obj);
	if (obj instanceof Sk.builtin.lng)
		return Sk.builtin.asnum$(obj);
    if (typeof obj === "number" || typeof obj === "boolean")
        return obj;
    if (typeof obj === "string")
        return new Sk.builtin.str(obj);
    goog.asserts.fail("unexpected type for basicwrap");
};
goog.exportSymbol("Sk.ffi.basicwrap", Sk.ffi.basicwrap);

Sk.ffi.unwrapo = function(obj)
{
    if (obj === undefined) return undefined;
    return obj['v'];
};
goog.exportSymbol("Sk.ffi.unwrapo", Sk.ffi.unwrapo);

Sk.ffi.unwrapn = function(obj)
{
    if (obj === null) return null;
    return obj['v'];
};
goog.exportSymbol("Sk.ffi.unwrapn", Sk.ffi.unwrapn);

/**
 * Converts a variable table (either $gbl or $loc from a stack frame) into
 * a Python dictionary. This function is used to implement the globals() and
 * locals() built-ins.
 *
 * @param vars the variable table
 * @return the Python dictionary with the variables
 */
Sk.ffi.varTableToDict = function(vars)
{
  var kvs = [];

  for (var name in vars)
  {
    if (vars.hasOwnProperty(name))
    {
      kvs.push(Sk.ffi.remapToPy(name));

      var value = vars[name];
      if (value.__proto__.ob$type)
      {
        kvs.push(value);
      }
      else
      {
        kvs.push(Sk.ffi.remapToPy(value));
      }
    }
  }

  return new Sk.builtin.dict(kvs);
};
goog.exportSymbol("Sk.ffi.varTableToDict", Sk.ffi.varTableToDict);

/**
 * Checks the number of arguments to a function (usually called from a JS
 * module) and throws a TypeError if there is a mismatch.
 *
 * @param name the name of the function
 * @param args the argument list
 * @param count the expected argument count
 */
Sk.ffi.checkArgs = function(name, args, count)
{
  if (typeof(count) === 'number')
  {
    if (args.length != count)
    {
      var verb = (args.length == 1) ? 'was' : 'were';
      throw new Sk.builtin.TypeError(name + '() takes ' + count + ' positional '
        + 'arguments but ' + args.length + ' ' + verb + ' given');
    }
  }
  else
  {
    var low = count[0];
    var high = count[1];

    if (args.length < low || args.length > high)
    {
      var verb = (args.length == 1) ? 'was' : 'were';
      throw new Sk.builtin.TypeError(name + '() takes between '
        + low + ' and ' + high + ' positional arguments but '
        + args.length + ' ' + verb + ' given');
    }
  }
};
goog.exportSymbol("Sk.ffi.checkArgs", Sk.ffi.checkArgs);
