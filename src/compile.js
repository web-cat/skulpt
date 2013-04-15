/** @param {...*} x */
var out;

Sk._futureResult = null;

/**
 * @constructor
 * @param {string} filename
 * @param {SymbolTable} st
 * @param {number} flags
 * @param {string=} sourceCodeForAnnotation used to add original source to listing if desired
 */
function Compiler(filename, st, flags, sourceCodeForAnnotation)
{
    this.filename = filename;
    this.st = st;
    this.flags = flags;
    this.interactive = false;
    this.nestlevel = 0;

    this.u = null;
    this.stack = [];

    this.result = [];

    this.gensymcount = 0;

    this.allUnits = [];

    this.source = sourceCodeForAnnotation ? sourceCodeForAnnotation.split("\n") : false;
}

/**
 * @constructor
 *
 * Stuff that changes on entry/exit of code blocks. must be saved and restored
 * when returning to a block.
 *
 * Corresponds to the body of a module, class, or function.
 */

function CompilerUnit()
{
    this.ste = null;
    this.name = null;

    this.private_ = null;
    this.firstlineno = 0;
    this.lineno = 0;
    this.linenoSet = false;
    this.localnames = [];

    this.blocknum = 0;
    this.blocks = [];
    this.curblock = 0;

    this.scopename = null;

    this.prefixCode = '';
    this.varDeclsCode = '';
    this.switchCode = '';
    this.suffixCode = '';

    // stack of where to go on a break
    this.breakBlocks = [];
    // stack of where to go on a continue
    this.continueBlocks = [];
    this.exceptBlocks = [];
    this.finallyBlocks = [];
}

CompilerUnit.prototype.activateScope = function()
{
    var self = this;

    out = function() {
        var b = self.blocks[self.curblock];
        for (var i = 0; i < arguments.length; ++i)
            b.push(arguments[i]);
    };
};

Compiler.prototype.getSourceLine = function(lineno)
{
    goog.asserts.assert(this.source);
    return this.source[lineno - 1];
};

Compiler.prototype.annotateSource = function(ast)
{
    if (this.source)
    {
        var lineno = ast.lineno;
        var col_offset = ast.col_offset;
        out("\n//\n// line ", lineno, ":\n// ", this.getSourceLine(lineno), "\n// ");
        for (var i = 0; i < col_offset; ++i) out(" ");
        out("^\n//\n");

        out("\nSk.currLineNo = ", lineno,
            "; Sk.currColNo = ",col_offset,
            "; Sk.currFilename = '",this.filename,"';\n");  //  Added by RNL
    }
};

Compiler.prototype.gensym = function(hint)
{
    hint = hint || '';
    hint = '$' + hint;
    hint += this.gensymcount++;
    return hint;
};

Compiler.prototype.niceName = function(roughName)
{
    return this.gensym(roughName.replace("<", "").replace(">", "").replace(" ", "_"));
}

var reservedWords_ = { 'abstract': true, 'as': true, 'boolean': true,
    'break': true, 'byte': true, 'case': true, 'catch': true, 'char': true,
    'class': true, 'continue': true, 'const': true, 'debugger': true,
    'default': true, 'delete': true, 'do': true, 'double': true, 'else': true,
    'enum': true, 'export': true, 'extends': true, 'false': true,
    'final': true, 'finally': true, 'float': true, 'for': true,
    'function': true, 'goto': true, 'if': true, 'implements': true,
    'import': true, 'in': true, 'instanceof': true, 'int': true,
    'interface': true, 'is': true, 'long': true, 'namespace': true,
    'native': true, 'new': true, 'null': true, 'package': true,
    'private': true, 'protected': true, 'public': true, 'return': true,
    'short': true, 'static': true, 'super': true, 'switch': true,
    'synchronized': true, 'this': true, 'throw': true, 'throws': true,
    'transient': true, 'true': true, 'try': true, 'typeof': true, 'use': true,
    'var': true, 'void': true, 'volatile': true, 'while': true, 'with': true
};

function fixReservedWords(name)
{
    if (reservedWords_[name] !== true)
        return name;
    return name + "_$rw$";
}

function mangleName(priv, ident)
{
    var name = ident.v;
    if (priv === null || name === null || name.charAt(0) !== '_' || name.charAt(1) !== '_')
        return ident;
    // don't mangle __id__
    if (name.charAt(name.length - 1) === '_' && name.charAt(name.length - 2) === '_')
        return ident;
    // don't mangle classes that are all _ (obscure much?)
    if (priv.v.replace(/_/g, '') === '')
        return ident;
    priv = priv.v.replace(/^_*/, '');
    return '_' + priv + name;
}

/**
 * @param {string} hint basename for gensym
 * @param {...*} rest
 */
Compiler.prototype._gr = function(hint, rest)
{
    // Modified by allevato
    var v = "$ctx." + this.gensym(hint);
    out(v, "=");
    for (var i = 1; i < arguments.length; ++i)
    {
        out(arguments[i]);
    }
    out(";");
    return v;
}

Compiler.prototype._jumpfalse = function(test, block)
{
    var cond = this._gr('jfalse', "(", test, "===false||!Sk.misceval.isTrue(", test, "))");
    out("if(", cond, "){/*test failed */$frm.blk=", block, ";Sk.yield();continue;}");
};

Compiler.prototype._jumpundef = function(test, block)
{
    out("if(", test, "===undefined){$frm.blk=", block, ";Sk.yield();continue;}");
};

Compiler.prototype._jumptrue = function(test, block)
{
    var cond = this._gr('jtrue', "(", test, "===true||Sk.misceval.isTrue(", test, "))");
    out("if(", cond, "){/*test passed */$frm.blk=", block, ";Sk.yield();continue;}");
};

/**
 * @param {number} block
 */
Compiler.prototype._jump = function(block)
{
    out("$frm.blk=", block, ";/* jump */Sk.yield();continue;");
};

Compiler.prototype.ctupleorlist = function(e, data, tuporlist)
{
    goog.asserts.assert(tuporlist === 'tuple' || tuporlist === 'list');
    if (e.ctx === Store)
    {
        for (var i = 0; i < e.elts.length; ++i)
        {
            this.vexpr(e.elts[i], "Sk.abstr.objectGetItem(" + data + "," + i + ")");
        }
    }
    else if (e.ctx === Load)
    {
        var items = [];
        for (var i = 0; i < e.elts.length; ++i)
        {
            items.push(this._gr('elem', this.vexpr(e.elts[i])));
        }
        return this._gr('load'+tuporlist, "new Sk.builtins['", tuporlist, "']([", items, "])");
    }
};

Compiler.prototype.cdict = function(e)
{
    goog.asserts.assert(e.values.length === e.keys.length);
    var items = [];
    for (var i = 0; i < e.values.length; ++i)
    {
        var v = this.vexpr(e.values[i]); // "backwards" to match order in cpy
        items.push(this.vexpr(e.keys[i]));
        items.push(v);
    }
    return this._gr('loaddict', "new Sk.builtins['dict']([", items, "])");
};

Compiler.prototype.clistcompgen = function(tmpname, generators, genIndex, elt)
{
    var start = this.newBlock('list gen start');
    var skip = this.newBlock('list gen skip');
    var anchor = this.newBlock('list gen anchor');

    var l = generators[genIndex];
    var toiter = this.vexpr(l.iter);
    var iter = this._gr("iter", "Sk.abstr.iter(", toiter, ")");
    this._jump(start);
    this.setBlock(start);

    // load targets
    var nexti = this._gr('next', "Sk.abstr.iternext(", iter, ")");
    this._jumpundef(nexti, anchor); // todo; this should be handled by StopIteration
    var target = this.vexpr(l.target, nexti);

    var n = l.ifs.length;
    for (var i = 0; i < n; ++i)
    {
        var ifres = this.vexpr(l.ifs[i]);
        this._jumpfalse(ifres, start);
    }

    if (++genIndex < generators.length)
    {
        this.clistcompgen(tmpname, generators, genIndex, elt);
    }

    if (genIndex >= generators.length)
    {
        var velt = this.vexpr(elt);
        out(tmpname, ".v.push(", velt, ");"); // todo;
        this._jump(skip);
        this.setBlock(skip);
    }

    this._jump(start);

    this.setBlock(anchor);

    return tmpname;
};

Compiler.prototype.clistcomp = function(e)
{
    goog.asserts.assert(e instanceof ListComp);
    var tmp = this._gr("_compr", "new Sk.builtins['list']([])"); // note: _ is impt. for hack in name mangling (same as cpy)
    return this.clistcompgen(tmp, e.generators, 0, e.elt);
};

Compiler.prototype.cyield = function(e)
{
    if (this.u.ste.blockType !== FunctionBlock)
        throw new SyntaxError("'yield' outside function");
    var val = 'null';
    if (e.value)
        val = this.vexpr(e.value);
    var nextBlock = this.newBlock('after yield');
    // return a pair: resume target block and yielded value
    out("Sk._frameLeave();return [/*resume*/", nextBlock, ",/*ret*/", val, "];");
    this.setBlock(nextBlock);
    return '$gen.gi$sentvalue'; // will either be null if none sent, or the value from gen.send(value)
}

Compiler.prototype.ccompare = function(e)
{
    goog.asserts.assert(e.ops.length === e.comparators.length);
    var cur = this.vexpr(e.left);
    var n = e.ops.length;
    var done = this.newBlock("done");
    var fres = this._gr('compareres', 'null');

    for (var i = 0; i < n; ++i)
    {
        var rhs = this.vexpr(e.comparators[i]);
        var res = this._gr('compare', "Sk.misceval.richCompareBool(", cur, ",", rhs, ",'", e.ops[i].prototype._astname, "')");
        out(fres, '=', res, ';');
        this._jumpfalse(res, done);
        cur = rhs;
    }
    this._jump(done);
    this.setBlock(done);
    return fres;
};

Compiler.prototype.ccall = function(e)
{
    var func = this.vexpr(e.func);
    var args = this.vseqexpr(e.args);
    var retval;

    // added by allevato
    var beforecall = this.newBlock('before call');
    this._jump(beforecall);
    this.setBlock(beforecall);

    if (e.keywords.length > 0 || e.starargs || e.kwargs)
    {
        var kwarray = [];
        for (var i = 0; i < e.keywords.length; ++i)
        {
            kwarray.push("'" + e.keywords[i].arg.v + "'");
            kwarray.push(this.vexpr(e.keywords[i].value));
        }
        var keywords = "[" + kwarray.join(",") + "]";
        var starargs = "undefined";
        var kwargs = "undefined";
        if (e.starargs)
            starargs = this.vexpr(e.starargs);
        if (e.kwargs)
            kwargs = this.vexpr(e.kwargs);
        retval = this._gr('call', "Sk.misceval.call(", func, "," , kwargs, ",", starargs, ",", keywords, args.length > 0 ? "," : "", args, ")");
    }
    else
    {
        retval = this._gr('call', "Sk.misceval.callsim(", func, args.length > 0 ? "," : "", args, ")");
    }

    // added by allevato
    var aftercall = this.newBlock('after call');
    this._jump(aftercall);
    this.setBlock(aftercall);

    return retval;
};

Compiler.prototype.csimpleslice = function(s, ctx, obj, dataToStore)
{
    goog.asserts.assert(s.step === null);
    var lower = 'null', upper = 'null';
    if (s.lower)
        lower = this.vexpr(s.lower);
    if (s.upper)
        upper = this.vexpr(s.upper);

    // todo; don't require making a slice obj, and move logic into general sequence place
    switch (ctx)
    {
        case AugLoad:
        case Load:
            return this._gr("simpsliceload", "Sk.misceval.applySlice(", obj, ",", lower, ",", upper, ")");
        case AugStore:
        case Store:
            out("Sk.misceval.assignSlice(", obj, ",", lower, ",", upper, ",", dataToStore, ");");
            break;
        case Del:
            out("Sk.misceval.assignSlice(", obj, ",", lower, ",", upper, ",null);");
            break;
        case Param:
        default:
            goog.asserts.fail("invalid simple slice");
    }
};

Compiler.prototype.cslice = function(s, ctx, obj, dataToStore)
{
    goog.asserts.assert(s instanceof Slice);
    var low = s.lower ? this.vexpr(s.lower) : 'null';
    var high = s.upper ? this.vexpr(s.upper) : 'null';
    var step = s.step ? this.vexpr(s.step) : 'null';
    return this._gr('slice', "new Sk.builtins['slice'](", low, ",", high, ",", step, ")");
};

Compiler.prototype.vslice = function(s, ctx, obj, dataToStore)
{
    var kindname = null;
    var subs;
    switch (s.constructor)
    {
        case Index:
            kindname = "index";
            subs = this.vexpr(s.value);
            break;
        case Slice:
            if (!s.step)
                return this.csimpleslice(s, ctx, obj, dataToStore);
            if (ctx !== AugStore)
                subs = this.cslice(s, ctx, obj, dataToStore);
            break;
        case Ellipsis:
        case ExtSlice:
            goog.asserts.fail("todo;");
            break;
        default:
            goog.asserts.fail("invalid subscript kind");
    }
    return this.chandlesubscr(kindname, ctx, obj, subs, dataToStore);
};

Compiler.prototype.chandlesubscr = function(kindname, ctx, obj, subs, data)
{
    if (ctx === Load || ctx === AugLoad)
        return this._gr('lsubscr', "Sk.abstr.objectGetItem(", obj, ",", subs, ")");
    else if (ctx === Store || ctx === AugStore)
        out("Sk.abstr.objectSetItem(", obj, ",", subs, ",", data, ");");
    else if (ctx === Del)
        out("Sk.abstr.objectDelItem(", obj, ",", subs, ");");
    else
        goog.asserts.fail("handlesubscr fail");
};

Compiler.prototype.cboolop = function(e)
{
    goog.asserts.assert(e instanceof BoolOp);
    var jtype;
    var ifFailed;
    if (e.op === And)
        jtype = this._jumpfalse;
    else
        jtype = this._jumptrue;
    var end = this.newBlock('end of boolop');
    var s = e.values;
    var n = s.length;
    var retval;
    for (var i = 0; i < n; ++i)
    {
        var expres = this.vexpr(s[i])
        if (i === 0)
        {
            retval = this._gr('boolopsucc', expres);
        }
        out(retval, "=", expres, ";");
        jtype.call(this, expres, end);
    }
    this._jump(end);
    this.setBlock(end);
    return retval;
};


/**
 *
 * compiles an expression. to 'return' something, it'll gensym a var and store
 * into that var so that the calling code doesn't have avoid just pasting the
 * returned name.
 *
 * @param {Object} e
 * @param {string=} data data to store in a store operation
 * @param {Object=} augstoreval value to store to for an aug operation (not
 * vexpr'd yet)
 */
Compiler.prototype.vexpr = function(e, data, augstoreval)
{
    if (e.lineno > this.u.lineno)
    {
        this.u.lineno = e.lineno;
        this.u.linenoSet = false;
    }
    //this.annotateSource(e);
    switch (e.constructor)
    {
        case BoolOp:
            return this.cboolop(e);
        case BinOp:
            return this._gr('binop', "Sk.abstr.numberBinOp(", this.vexpr(e.left), ",", this.vexpr(e.right), ",'", e.op.prototype._astname, "')");
        case UnaryOp:
            return this._gr('unaryop', "Sk.abstr.numberUnaryOp(", this.vexpr(e.operand), ",'", e.op.prototype._astname, "')");
        case Lambda:
            return this.clambda(e);
        case IfExp:
            return this.cifexp(e);
        case Dict:
            return this.cdict(e);
        case ListComp:
            return this.clistcomp(e);
        case GeneratorExp:
            return this.cgenexp(e);
        case Yield:
            return this.cyield(e);
        case Compare:
            return this.ccompare(e);
        case Call:
            return this.ccall(e);
        case Num:
            if (typeof e.n === "number")
                return e.n;
            else if (e.n instanceof Sk.builtin.lng)
                return "Sk.longFromStr('" + e.n.tp$str().v + "')";
            goog.asserts.fail("unhandled Num type");
        case Str:
            return this._gr('str', "new Sk.builtins['str'](", e.s['$r']().v, ")");
        case Attribute:
            var val;
            if (e.ctx !== AugStore)
                val = this.vexpr(e.value);
            switch (e.ctx)
            {
                case AugLoad:
                case Load:
                    return this._gr("lattr", "Sk.abstr.gattr(", val, ",", e.attr['$r']().v, ")");
                case AugStore:
                    out("if(", data, "!==undefined){"); // special case to avoid re-store if inplace worked
                    val = this.vexpr(augstoreval || null); // the || null can never happen, but closure thinks we can get here with it being undef
                    out("Sk.abstr.sattr(", val, ",", e.attr['$r']().v, ",", data, ");");
                    out("}");
                    break;
                case Store:
                    out("Sk.abstr.sattr(", val, ",", e.attr['$r']().v, ",", data, ");");
                    break;
                case Del:
                    goog.asserts.fail("todo;");
                    break;
                case Param:
                default:
                    goog.asserts.fail("invalid attribute expression");
            }
            break;
        case Subscript:
            var val;
            switch (e.ctx)
            {
                case AugLoad:
                case Load:
                case Store:
                case Del:
                    return this.vslice(e.slice, e.ctx, this.vexpr(e.value), data);
                case AugStore:
                    out("if(", data, "!==undefined){"); // special case to avoid re-store if inplace worked
                    val = this.vexpr(augstoreval || null); // the || null can never happen, but closure thinks we can get here with it being undef
                    this.vslice(e.slice, e.ctx, val, data);
                    out("}");
                    break;
                case Param:
                default:
                    goog.asserts.fail("invalid subscript expression");
            }
            break;
        case Name:
            return this.nameop(e.id, e.ctx, data);
        case List:
            return this.ctupleorlist(e, data, 'list');
        case Tuple:
            return this.ctupleorlist(e, data, 'tuple');
        default:
            goog.asserts.fail("unhandled case in vexpr");
    }
};

/**
 * @param {Array.<Object>} exprs
 * @param {Array.<string>=} data
 */
Compiler.prototype.vseqexpr = function(exprs, data)
{
    goog.asserts.assert(data === undefined || exprs.length === data.length);
    var ret = [];
    for (var i = 0; i < exprs.length; ++i)
        ret.push(this.vexpr(exprs[i], data === undefined ? undefined : data[i]));
    return ret;
};

Compiler.prototype.caugassign = function(s)
{
    goog.asserts.assert(s instanceof AugAssign);
    var e = s.target;
    switch (e.constructor)
    {
        case Attribute:
            var auge = new Attribute(e.value, e.attr, AugLoad, e.lineno, e.col_offset);
            var aug = this.vexpr(auge);
            var val = this.vexpr(s.value);
            var res = this._gr('inplbinopattr', "Sk.abstr.numberInplaceBinOp(", aug, ",", val, ",'", s.op.prototype._astname, "')");
            auge.ctx = AugStore;
            return this.vexpr(auge, res, e.value)
        case Subscript:
            var auge = new Subscript(e.value, e.slice, AugLoad, e.lineno, e.col_offset);
            var aug = this.vexpr(auge);
            var val = this.vexpr(s.value);
            var res = this._gr('inplbinopsubscr', "Sk.abstr.numberInplaceBinOp(", aug, ",", val, ",'", s.op.prototype._astname, "')");
            auge.ctx = AugStore;
            return this.vexpr(auge, res, e.value)
        case Name:
            var to = this.nameop(e.id, Load);
            var val = this.vexpr(s.value);
            var res = this._gr('inplbinop', "Sk.abstr.numberInplaceBinOp(", to, ",", val, ",'", s.op.prototype._astname, "')");
            return this.nameop(e.id, Store, res);
        default:
            goog.asserts.fail("unhandled case in augassign");
    }
};

/**
 * optimize some constant exprs. returns 0 if always 0, 1 if always 1 or -1 otherwise.
 */
Compiler.prototype.exprConstant = function(e)
{
    switch (e.constructor)
    {
        case Num:
            return Sk.misceval.isTrue(e.n);
        case Str:
            return Sk.misceval.isTrue(e.s);
        case Name:
            // todo; do __debug__ test here if opt
        default:
            return -1;
    }
};

Compiler.prototype.newBlock = function(name)
{
    var ret = this.u.blocknum++;
    this.u.blocks[ret] = [];
    this.u.blocks[ret]._name = name || '<unnamed>';
    return ret;
};
Compiler.prototype.setBlock = function(n)
{
    goog.asserts.assert(n >= 0 && n < this.u.blocknum);
    this.u.curblock = n;
};

Compiler.prototype.pushBreakBlock = function(n)
{
    goog.asserts.assert(n >= 0 && n < this.u.blocknum);
    this.u.breakBlocks.push(n);
};
Compiler.prototype.popBreakBlock = function()
{
    this.u.breakBlocks.pop();
};

Compiler.prototype.pushContinueBlock = function(n)
{
    goog.asserts.assert(n >= 0 && n < this.u.blocknum);
    this.u.continueBlocks.push(n);
};
Compiler.prototype.popContinueBlock = function()
{
    this.u.continueBlocks.pop();
};

Compiler.prototype.pushExceptBlock = function(n)
{
    goog.asserts.assert(n >= 0 && n < this.u.blocknum);
    this.u.exceptBlocks.push(n);
};
Compiler.prototype.popExceptBlock = function()
{
    this.u.exceptBlocks.pop();
};

Compiler.prototype.pushFinallyBlock = function(n)
{
    goog.asserts.assert(n >= 0 && n < this.u.blocknum);
    this.u.finallyBlocks.push(n);
};
Compiler.prototype.popFinallyBlock = function()
{
    this.u.finallyBlocks.pop();
};

Compiler.prototype.setupExcept = function(eb)
{
    out("$exc.push(", eb, ");try{");
    //this.pushExceptBlock(eb);
};

Compiler.prototype.endExcept = function()
{
    out("$exc.pop();}catch($err){");
    out("$frm.blk=$exc.pop();");
    out("Sk.yield();continue;}");
};

Compiler.prototype.outputLocals = function(unit)
{
    var have = {};
    //print("args", unit.name.v, JSON.stringify(unit.argnames));
    for (var i = 0; unit.argnames && i < unit.argnames.length; ++i)
        have[unit.argnames[i]] = true;
    unit.localnames.sort();
    var output = [];
    for (var i = 0; i < unit.localnames.length; ++i)
    {
        var name = unit.localnames[i];
        if (have[name] === undefined)
        {
            output.push(name);
            have[name] = true;
        }
    }
    if (output.length > 0)
        return "var " + output.join(",") + "; /* locals */";
    return "";
};

Compiler.prototype.outputAllUnits = function()
{
    var ret = '';
    for (var j = 0; j < this.allUnits.length; ++j)
    {
        var unit = this.allUnits[j];
        ret += unit.prefixCode;
        ret += unit.varDeclsCode;
        ret += this.outputLocals(unit);
        ret += unit.switchCode;
        var blocks = unit.blocks;
        for (var i = 0; i < blocks.length; ++i)
        {
            ret += "case " + i + ": /* --- " + blocks[i]._name + " --- */";
            ret += blocks[i].join('');

            ret += "goog.asserts.fail('unterminated block');";
        }
        ret += unit.suffixCode;
    }
    return ret;
};

Compiler.prototype.cif = function(s)
{
    goog.asserts.assert(s instanceof If_);
    var constant = this.exprConstant(s.test);
    if (constant === 0)
    {
        if (s.orelse) 
            this.vseqstmt(s.orelse);
    }
    else if (constant === 1)
    {
        this.vseqstmt(s.body);
    }
    else
    {
        var end = this.newBlock('end of if');
        var next = this.newBlock('next branch of if');

        var test = this.vexpr(s.test);
        this._jumpfalse(this.vexpr(s.test), next);
        this.vseqstmt(s.body);
        this._jump(end);

        this.setBlock(next);
        if (s.orelse)
            this.vseqstmt(s.orelse);
        this._jump(end);
    }
    this.setBlock(end);

};

Compiler.prototype.cwhile = function(s)
{
    var constant = this.exprConstant(s.test);
    if (constant === 0)
    {
        if (s.orelse)
            this.vseqstmt(s.orelse);
    }
    else
    {
        var top = this.newBlock('while test');
        this._jump(top);
        this.setBlock(top);

        var next = this.newBlock('after while');
        var orelse = s.orelse.length > 0 ? this.newBlock('while orelse') : null;
        var body = this.newBlock('while body');

        this._jumpfalse(this.vexpr(s.test), orelse ? orelse : next);
        this._jump(body);

        this.pushBreakBlock(next);
        this.pushContinueBlock(top);

        this.setBlock(body);
        this.vseqstmt(s.body);
        this._jump(top);

        this.popContinueBlock();
        this.popBreakBlock();

        if (s.orelse.length > 0)
        {
            this.setBlock(orelse);
            this.vseqstmt(s.orelse);
        }

        this.setBlock(next);
    }
};

Compiler.prototype.cfor = function(s)
{
    var start = this.newBlock('for start');
    var cleanup = this.newBlock('for cleanup');
    var end = this.newBlock('for end');

    this.pushBreakBlock(end);
    this.pushContinueBlock(start);

    // get the iterator
    var toiter = this.vexpr(s.iter);
    var iter;
    if (this.u.ste.generator)
    {
        // if we're in a generator, we have to store the iterator to a local
        // so it's preserved (as we cross blocks here and assume it survives)
        iter = "$loc." + this.gensym("iter");
        out(iter, "=Sk.abstr.iter(", toiter, ");");
    }
    else
        iter = this._gr("iter", "Sk.abstr.iter(", toiter, ")");

    this._jump(start);

    this.setBlock(start);

    // load targets
    var nexti = this._gr('next', "Sk.abstr.iternext(", iter, ")");
    this._jumpundef(nexti, cleanup); // todo; this should be handled by StopIteration
    var target = this.vexpr(s.target, nexti);

    // execute body
    this.vseqstmt(s.body);
    
    // jump to top of loop
    this._jump(start);

    this.setBlock(cleanup);
    this.popContinueBlock();
    this.popBreakBlock();

    this.vseqstmt(s.orelse);
    this._jump(end);

    this.setBlock(end);
};

Compiler.prototype.craise = function(s)
{
    if (s.type.id.v === "StopIteration")
    {
        // currently, we only handle StopIteration, and all it does it return
        // undefined which is what our iterator protocol requires.
        //
        // totally hacky, but good enough for now.
        out("return undefined;");
    }
    else
    {
        // todo;
        var inst = '';
        if (s.inst)
            inst = this.vexpr(s.inst);
        out("throw new ", this.vexpr(s.type), "(", inst, ");");
    }
};

Compiler.prototype.ctryexcept = function(s)
{
    var except = this.newBlock("except");
    var orelse = this.newBlock("orelse");
    var end = this.newBlock("end");

    this.setupExcept(except);

    this.vseqstmt(s.body);

    this.endExcept();

    this._jump(orelse);

    this.setBlock(except);
    var n = s.handlers.length;
    for (var i = 0; i < n; ++i)
    {
        var handler = s.handlers[i];
        if (handler.type && i < n - 1)
            throw new SyntaxError("default 'except:' must be last");
        except = this.newBlock("except_" + i + "_");
        if (handler.type)
        {
            // todo; not right at all
            this._jumpfalse(this.vexpr(handler.type), except);
        }
        // todo; name
        this.vseqstmt(handler.body);
    }

    this.setBlock(orelse);
    this.vseqstmt(s.orelse);
    this._jump(end);
    this.setBlock(end);
};

Compiler.prototype.ctryfinally = function(s)
{
    out("/*todo; tryfinally*/");
};

Compiler.prototype.cassert = function(s)
{
    /* todo; warnings method
    if (s.test instanceof Tuple && s.test.elts.length > 0)
        Sk.warn("assertion is always true, perhaps remove parentheses?");
    */

    var test = this.vexpr(s.test);
    var end = this.newBlock("end");
    this._jumptrue(test, end);
    // todo; exception handling
    // maybe replace with goog.asserts.fail?? or just an alert?
    out("throw new Sk.builtins.AssertionError(", s.msg ? this.vexpr(s.msg) : "", ");");
    this.setBlock(end);
};

Compiler.prototype.cimportas = function(name, asname, mod)
{
    var src = name.v;
    var dotLoc = src.indexOf(".");
    //print("src", src);
    //print("dotLoc", dotLoc);
    var cur = mod;
    if (dotLoc !== -1)
    {
        // if there's dots in the module name, __import__ will have returned
        // the top-level module. so, we need to extract the actual module by
        // getattr'ing up through the names, and then storing the leaf under
        // the name it was to be imported as.
        src = src.substr(dotLoc + 1);
        //print("src now", src);
        while (dotLoc !== -1)
        {
            dotLoc = src.indexOf(".");
            var attr = dotLoc !== -1 ? src.substr(0, dotLoc) : src;
            cur = this._gr('lattr', "Sk.abstr.gattr(", cur, ",'", attr, "')");
            src = src.substr(dotLoc + 1);
        }
    }
    return this.nameop(asname, Store, cur);
};

Compiler.prototype.cimport = function(s)
{
    var n = s.names.length;
    for (var i = 0; i < n; ++i)
    {
        var alias = s.names[i];
        var mod = this._gr('module', "Sk.builtin.__import__(", alias.name['$r']().v, ",$gbl,$loc,[])");

        if (alias.asname)
        {
            this.cimportas(alias.name, alias.asname, mod);
        }
        else
        {
            var tmp = alias.name;
            var lastDot = tmp.v.indexOf('.');
            if (lastDot !== -1)
                tmp = new Sk.builtin.str(tmp.v.substr(0, lastDot));
            this.nameop(tmp, Store, mod);
        }
    }
};

Compiler.prototype.cfromimport = function(s)
{
    var n = s.names.length;
    var names = [];
    for (var i = 0; i < n; ++i)
        names[i] = s.names[i].name['$r']().v;
    var mod = this._gr('module', "Sk.builtin.__import__(", s.module['$r']().v, ",$gbl,$loc,[", names, "])");
    for (var i = 0; i < n; ++i)
    {
        var alias = s.names[i];
        if (i === 0 && alias.name.v === "*")
        {
            goog.asserts.assert(n === 1);
            out("Sk.importStar(", mod, ");");
            return;
        }

        var got = this._gr('item', "Sk.abstr.gattr(", mod, ",", alias.name['$r']().v, ")");
        var storeName = alias.name;
        if (alias.asname)
            storeName = alias.asname;
        this.nameop(storeName, Store, got);
    }
};

/**
 * builds a code object (js function) for various constructs. used by def,
 * lambda, generator expressions. it isn't used for class because it seemed
 * different enough.
 *
 * handles:
 * - setting up a new scope
 * - decorators (if any)
 * - defaults setup
 * - setup for cell and free vars
 * - setup and modification for generators
 *
 * @param {Object} n ast node to build for
 * @param {Sk.builtin.str} coname name of code object to build
 * @param {Array} decorator_list ast of decorators if any
 * @param {arguments_} args arguments to function, if any
 * @param {Function} callback called after setup to do actual work of function
 *
 * @returns the name of the newly created function or generator object.
 *
 */
Compiler.prototype.buildcodeobj = function(n, coname, decorator_list, args, callback)
{
    var decos = [];
    var defaults = [];
    var vararg = null;
    var kwarg = null;

    // decorators and defaults have to be evaluated out here before we enter
    // the new scope. we output the defaults and attach them to this code
    // object, but only once we know the name of it (so we do it after we've
    // exited the scope near the end of this function).
    if (decorator_list)
        decos = this.vseqexpr(decorator_list);
    if (args && args.defaults)
        defaults = this.vseqexpr(args.defaults);
    if (args && args.vararg)
        vararg = args.vararg;
    if (args && args.kwarg)
        kwarg = args.kwarg;

    //
    // enter the new scope, and create the first block
    //
    var scopename = this.enterScope(coname, n, n.lineno);

    var isGenerator = this.u.ste.generator;
    var hasFree = this.u.ste.hasFree;
    var hasCell = this.u.ste.childHasFree;

    var entryBlock = this.newBlock('codeobj entry');

    //
    // the header of the function, and arguments
    //
    var cachedscope = "$moddata.scopes['" + scopename + "']";

    // modified by allevato
    this.u.prefixCode = cachedscope + "=" + cachedscope + "||(function " + this.niceName(coname.v) + "$(";

    var funcArgs = [];
    if (isGenerator)
        funcArgs.push("$gen");
    else
    {
        if (kwarg)
            funcArgs.push("$kwa");
        for (var i = 0; args && i < args.args.length; ++i)
            funcArgs.push(this.nameop(args.args[i].id, Param));
    }
    if (hasFree)
        funcArgs.push("$free");
    this.u.prefixCode += funcArgs.join(",");

    this.u.prefixCode += "){";

    if (isGenerator) this.u.prefixCode += "\n// generator\n";
    if (hasFree) this.u.prefixCode += "\n// has free\n";
    if (hasCell) this.u.prefixCode += "\n// has cell\n";

    //
    // set up standard dicts/variables
    //
    var locals = "$ctx.$loc||{}";
    if (isGenerator)
    {
        entryBlock = "$gen.gi$resumeat";
        locals = "$ctx.$loc||$gen.gi$locals";
    }
    var cells = "";
    if (hasCell)
        cells = ",$cell=$ctx.$cell||{}";

    // note special usage of 'this' to avoid having to slice globals into
    // all function invocations in call
    //
    // FIXME (allevato): I think the use of "this" here for the globals causes
    // problems when calling functions from within a method after an async
    // continuation... not sure how to fix it yet. Here's a snippet that fails:
    //
    // class Foo:
    //   def ask(self):
    //     self.x = input("Enter a number: ")
    //
    //   def lastValue(self):
    //     return int(self.x)
    //
    // foo = Foo()
    // foo.ask()
    //
    // while foo.lastValue() != 0:
    //   print foo.lastValue() * foo.lastValue()
    //   foo.ask()
    //
    this.u.varDeclsCode += "var $frm=Sk._frameEnter(" + entryBlock + ");";
    this.u.varDeclsCode += "var $ctx=$frm.ctx,$exc=$ctx.$exc||[],$loc=" + locals + cells + ",$gbl=$ctx.$gbl||this;"
      + "$ctx.$exc=$exc; " + (hasCell ? "$ctx.$cell=$cell; " : "") + "$ctx.$gbl=$gbl; $ctx.$loc=$loc;"
    for (var i = 0; i < funcArgs.length; ++i)
    {
      this.u.varDeclsCode += "$ctx." + funcArgs[i] + "=" + "$ctx." + funcArgs[i] + "||" + funcArgs[i] + ";";
    }

    //
    // copy all parameters that are also cells into the cells dict. this is so
    // they can be accessed correctly by nested scopes.
    //
    for (var i = 0; args && i < args.args.length; ++i)
    {
        var id = args.args[i].id;
        if (this.isCell(id))
            this.u.varDeclsCode += "$cell." + id.v + "=" + id.v + ";";
    }

    //
    // initialize default arguments. we store the values of the defaults to
    // this code object as .$defaults just below after we exit this scope.
    //
    if (defaults.length > 0)
    {
        // defaults have to be "right justified" so if there's less defaults
        // than args we offset to make them match up (we don't need another
        // correlation in the ast)
        var offset = args.args.length - defaults.length;
        for (var i = 0; i < defaults.length; ++i)
        {
            var argname = this.nameop(args.args[i + offset].id, Param);
            
            if (isGenerator)
            {
              this.u.varDeclsCode += "if($ctx.$loc." + argname +
                "===undefined)$ctx.$loc." + argname + "=" +
                scopename + ".$defaults[" + i + "];";
            }
            else
            {
              this.u.varDeclsCode += "if(" + argname + "===undefined)$ctx." +
                argname + "=" + scopename + ".$defaults[" + i + "];";
            }
        }
    }

    //
    // initialize vararg, if any
    //
    if (vararg)
    {
        var start = funcArgs.length;
        this.u.varDeclsCode += "$ctx." + vararg.v + "=new Sk.builtins['tuple'](Array.prototype.slice.call(arguments," + start + ")); /*vararg*/";
    }

    //
    // initialize kwarg, if any
    //
    if (kwarg)
    {
        this.u.varDeclsCode += "$ctx." + kwarg.v + "=new Sk.builtins['dict']($kwa);";
    }

    //
    // finally, set up the block switch that the jump code expects
    //
    this.u.switchCode += "while(true){switch($frm.blk){";
    this.u.suffixCode = "}break;}});";
    this.u.suffixCode += "var " + scopename + "=" + cachedscope + ";";

    //
    // jump back to the handler so it can do the main actual work of the
    // function
    //
    callback.call(this, scopename);

    //
    // get a list of all the argument names (used to attach to the code
    // object, and also to allow us to declare only locals that aren't also
    // parameters).
    var argnames;
    if (args && args.args.length > 0)
    {
        var argnamesarr = [];
        for (var i = 0; i < args.args.length; ++i)
            argnamesarr.push(args.args[i].id.v);

        argnames = argnamesarr.join("', '");
        // store to unit so we know what local variables not to declare
        this.u.argnames = argnamesarr;
    }

    //
    // and exit the code object scope
    //
    this.exitScope();

    //
    // attach the default values we evaluated at the beginning to the code
    // object so that it can get at them to set any arguments that are left
    // unset.
    //
    if (defaults.length > 0)
        out(scopename, ".$defaults=[", defaults.join(','), "];");


    //
    // attach co_varnames (only the argument names) for keyword argument
    // binding.
    //
    if (argnames)
    {
        out(scopename, ".co_varnames=['", argnames, "'];");
    }

    //
    // attach flags
    //
    if (kwarg)
    {
        out(scopename, ".co_kwargs=1;");
    }

    //
    // build either a 'function' or 'generator'. the function is just a simple
    // constructor call. the generator is more complicated. it needs to make a
    // new generator every time it's called, so the thing that's returned is
    // actually a function that makes the generator (and passes arguments to
    // the function onwards to the generator). this should probably actually
    // be a function object, rather than a js function like it is now. we also
    // have to build the argument names to pass to the generator because it
    // needs to store all locals into itself so that they're maintained across
    // yields.
    //
    // todo; possibly this should be outside?
    // 
    var frees = "";
    if (hasFree)
    {
        frees = ",$cell";
        // if the scope we're in where we're defining this one has free
        // vars, they may also be cell vars, so we pass those to the
        // closure too.
        var containingHasFree = this.u.ste.hasFree;
        if (containingHasFree)
            frees += ",$free";
    }
    if (isGenerator)
        if (args && args.args.length > 0)
            return this._gr("gener", "(function(){var $origargs=Array.prototype.slice.call(arguments);return new Sk.builtins['generator'](", scopename, ",$gbl,$origargs", frees, ");})");
        else
            return this._gr("gener", "(function(){return new Sk.builtins['generator'](", scopename, ",$gbl,[]", frees, ");})");
    else
        return this._gr("funcobj", "new Sk.builtins['function'](", scopename, ",$gbl", frees ,")");
};

Compiler.prototype.cfunction = function(s)
{
    goog.asserts.assert(s instanceof FunctionDef);
    var funcorgen = this.buildcodeobj(s, s.name, s.decorator_list, s.args, function(scopename)
            {
                this.vseqstmt(s.body);
                out("Sk._frameLeave();return null;"); // if we fall off the bottom, we want the ret to be None
            });
    this.nameop(s.name, Store, funcorgen);
};

Compiler.prototype.clambda = function(e)
{
    goog.asserts.assert(e instanceof Lambda);
    var func = this.buildcodeobj(e, new Sk.builtin.str("<lambda>"), null, e.args, function(scopename)
            {
                var val = this.vexpr(e.body);
                out("Sk._frameLeave();return ", val, ";");
            });
    return func;
};

Compiler.prototype.cifexp = function(e)
{
    var next = this.newBlock('next of ifexp');
    var end = this.newBlock('end of ifexp');
    var ret = this._gr('res', 'null');

    var test = this.vexpr(e.test);
    this._jumpfalse(test, next);

    out(ret, '=', this.vexpr(e.body), ';');
    this._jump(end);

    this.setBlock(next);
    out(ret, '=', this.vexpr(e.orelse), ';');
    this._jump(end);

    this.setBlock(end);
    return ret;
};

Compiler.prototype.cgenexpgen = function(generators, genIndex, elt)
{
    var start = this.newBlock('start for ' + genIndex);
    var skip = this.newBlock('skip for ' + genIndex);
    var ifCleanup = this.newBlock('if cleanup for ' + genIndex);
    var end = this.newBlock('end for ' + genIndex);

    var ge = generators[genIndex];

    var iter;
    if (genIndex === 0)
    {
        // the outer most iterator is evaluated in the scope outside so we
        // have to evaluate it outside and store it into the generator as a
        // local, which we retrieve here.
        iter = "$loc.$iter0";
    }
    else
    {
        var toiter = this.vexpr(ge.iter);
        iter = "$loc." + this.gensym("iter");
        out(iter, "=", "Sk.abstr.iter(", toiter, ");");
    }
    this._jump(start);
    this.setBlock(start);

    // load targets
    var nexti = this._gr('next', "Sk.abstr.iternext(", iter, ")");
    this._jumpundef(nexti, end); // todo; this should be handled by StopIteration
    var target = this.vexpr(ge.target, nexti);

    var n = ge.ifs.length;
    for (var i = 0; i < n; ++i)
    {
        var ifres = this.vexpr(ge.ifs[i]);
        this._jumpfalse(ifres, start);
    }

    if (++genIndex < generators.length)
    {
        this.cgenexpgen(generators, genIndex, elt);
    }

    if (genIndex >= generators.length)
    {
        var velt = this.vexpr(elt);
        out("Sk._frameLeave();return [", skip, "/*resume*/,", velt, "/*ret*/];");
        this.setBlock(skip);
    }

    this._jump(start);

    this.setBlock(end);

    if (genIndex === 1)
        out("Sk._frameLeave();return null;");
};

Compiler.prototype.cgenexp = function(e)
{
    var gen = this.buildcodeobj(e, new Sk.builtin.str("<genexpr>"), null, null, function(scopename)
            {
                this.cgenexpgen(e.generators, 0, e.elt);
            });

    // call the generator maker to get the generator. this is kind of dumb,
    // but the code builder builds a wrapper that makes generators for normal
    // function generators, so we just do it outside (even just new'ing it
    // inline would be fine).
    var gener = this._gr("gener", gen, "()");
    // stuff the outermost iterator into the generator after evaluating it
    // outside of the function. it's retrieved by the fixed name above.
    out(gener, ".gi$locals.$iter0=Sk.abstr.iter(", this.vexpr(e.generators[0].iter), ");");
    return gener;
};



Compiler.prototype.cclass = function(s)
{
    goog.asserts.assert(s instanceof ClassDef);
    var decos = s.decorator_list;

    // decorators and bases need to be eval'd out here
    //this.vseqexpr(decos);
    
    var bases = this.vseqexpr(s.bases);

    var scopename = this.enterScope(s.name, s, s.lineno);
    var entryBlock = this.newBlock('class entry');

    var cachedscope = "$moddata.scopes['" + scopename + "']";

    // modified by allevato
    this.u.prefixCode = cachedscope + "=" + cachedscope + "||(function $" + s.name.v + "$class_outer($globals,$locals,$rest){" +
      "var $gbl=$outergbl=$globals,$loc=$outerloc=$locals;";
    this.u.switchCode += "return(function " + s.name.v + "(){";
    
    this.u.switchCode += "var $frm=Sk._frameEnter(" + entryBlock + ");" +
      "var $ctx=$frm.ctx,$exc=$ctx.$exc||[],$gbl=$ctx.$gbl||$globals,$loc=$ctx.$loc||$locals;" +
      "$ctx.$exc=$exc;$ctx.$gbl=$gbl;$ctx.$loc=$loc;" +
      "while(true){switch($frm.blk){\n";
    this.u.suffixCode = "};Sk._frameLeave();break;}}).apply(null,$rest);});";
    this.u.suffixCode += "var " + scopename + "=" + cachedscope + ";";

    this.u.private_ = s.name;
    
    this.cbody(s.body);
    out("break;");

    // build class

    // apply decorators

    this.exitScope();

    // added by allevato
    var beforebuildclass = this.newBlock('before build class');
    this._jump(beforebuildclass);
    this.setBlock(beforebuildclass);

    // todo; metaclass
    var wrapped = this._gr("built", "Sk.misceval.buildClass($gbl,", scopename, ",", s.name['$r']().v, ",[", bases, "])");

    // store our new class under the right name
    this.nameop(s.name, Store, wrapped);

    // added by allevato
    var afterbuildclass = this.newBlock('after build class');
    this._jump(afterbuildclass);
    this.setBlock(afterbuildclass);
};

Compiler.prototype.ccontinue = function(s)
{
    if (this.u.continueBlocks.length === 0)
        throw new SyntaxError("'continue' outside loop");
    // todo; continue out of exception blocks
    this._jump(this.u.continueBlocks[this.u.continueBlocks.length - 1]);
};

/**
 * compiles a statement
 */
Compiler.prototype.vstmt = function(s)
{
    this.u.lineno = s.lineno;
    this.u.linenoSet = false;

    this.annotateSource(s);

    switch (s.constructor)
    {
        case FunctionDef:
            this.cfunction(s);
            break;
        case ClassDef:
            this.cclass(s);
            break;
        case Return_:
            if (this.u.ste.blockType !== FunctionBlock)
                throw new SyntaxError("'return' outside function");
            if (s.value)
                out("Sk._frameLeave();return ", this.vexpr(s.value), ";");
            else
                out("Sk._frameLeave();return null;");
            break;
        case Delete_:
            this.vseqexpr(s.targets);
            break;
        case Assign:
            var n = s.targets.length;
            var val = this.vexpr(s.value);
            for (var i = 0; i < n; ++i)
                this.vexpr(s.targets[i], val);
            break;
        case AugAssign:
            return this.caugassign(s);
        case Print:
            this.cprint(s);
            break;
        case For_:
            return this.cfor(s);
        case While_:
            return this.cwhile(s);
        case If_:
            return this.cif(s);
        case Raise:
            return this.craise(s);
        case TryExcept:
            return this.ctryexcept(s);
        case TryFinally:
            return this.ctryfinally(s);
        case Assert:
            return this.cassert(s);
        case Import_:
            return this.cimport(s);
        case ImportFrom:
            return this.cfromimport(s);
        case Global:
            break;
        case Expr:
            this.vexpr(s.value);
            break;
        case Pass:
            break;
        case Break_:
            if (this.u.breakBlocks.length === 0)
                throw new SyntaxError("'break' outside loop");
            this._jump(this.u.breakBlocks[this.u.breakBlocks.length - 1]);
            break;
        case Continue_:
            this.ccontinue(s);
            break;
        default:
            goog.asserts.fail("unhandled case in vstmt");
    }
};

Compiler.prototype.vseqstmt = function(stmts)
{
    for (var i = 0; i < stmts.length; ++i) this.vstmt(stmts[i]);
};

var OP_FAST = 0;
var OP_GLOBAL = 1;
var OP_DEREF = 2;
var OP_NAME = 3;
var D_NAMES = 0;
var D_FREEVARS = 1;
var D_CELLVARS = 2;

Compiler.prototype.isCell = function(name)
{
    var mangled = mangleName(this.u.private_, name).v;
    var scope = this.u.ste.getScope(mangled);
    var dict = null;
    if (scope === CELL)
        return true;
    return false;
};

/**
 * @param {Sk.builtin.str} name
 * @param {Object} ctx
 * @param {string=} dataToStore
 */
Compiler.prototype.nameop = function(name, ctx, dataToStore)
{
    if ((ctx === Store || ctx === AugStore || ctx === Del) && name.v === "__debug__")
        this.error("can not assign to __debug__");
    if ((ctx === Store || ctx === AugStore || ctx === Del) && name.v === "None")
        this.error("can not assign to None");

    if (name.v === "None") return "null";
    if (name.v === "True") return "true";
    if (name.v === "False") return "false";

    var mangled = mangleName(this.u.private_, name).v;
    var op = 0;
    var optype = OP_NAME;
    var scope = this.u.ste.getScope(mangled);
    var dict = null;
    switch (scope)
    {
        case FREE:
            dict = "$free";
            optype = OP_DEREF;
            break;
        case CELL:
            dict = "$cell";
            optype = OP_DEREF;
            break;
        case LOCAL:
            // can't do FAST in generators or at module/class scope
            // removed by allevato; nested functions need to be stored in $ctx
            // so that they can be called after async continuation
            //if (this.u.ste.blockType === FunctionBlock && !this.u.ste.generator)
            //    optype = OP_FAST;
            break;
        case GLOBAL_IMPLICIT:
            if (this.u.ste.blockType === FunctionBlock)
                optype = OP_GLOBAL;
            break;
        case GLOBAL_EXPLICIT:
            optype = OP_GLOBAL;
        default:
            break;
    }

    // have to do this after looking it up in the scope
    mangled = fixReservedWords(mangled);

    //print("mangled", mangled);
    // TODO TODO TODO todo; import * at global scope failing here
    goog.asserts.assert(scope || name.v.charAt(1) === '_');

    // in generator or at module scope, we need to store to $loc, rather that
    // to actual JS stack variables.
    var mangledNoPre = mangled;
    if (this.u.ste.generator || this.u.ste.blockType !== FunctionBlock)
        mangled = "$loc." + mangled;
    else if (optype === OP_FAST || optype === OP_NAME)
        this.u.localnames.push(mangled);

    switch (optype)
    {
        case OP_FAST:
            switch (ctx)
            {
                case Load:
                case Param:
                    return mangled;
                case Store:
                    out(mangled, "=", dataToStore, ";");
                    break;
                case Del:
                    out("delete ", mangled, ";");
                    break;
                default:
                    goog.asserts.fail("unhandled");
            }
            break;
        case OP_NAME:
            // Added by allevato
            mangled = "$ctx." + mangled;
            switch (ctx)
            {
                case Load:
                    var v = "$ctx." + this.gensym('loadname');
                    // can't be || for loc.x = 0 or null
                    out(v, "=", mangled, "!==undefined?",mangled,":Sk.misceval.loadname('",mangledNoPre,"',$gbl);");
                    return v;
                case Store:
                    out(mangled, "=", dataToStore, ";");
                    break;
                case Del:
                    out("delete ", mangled, ";");
                    break;
                case Param:
                    return mangledNoPre;
                default:
                    goog.asserts.fail("unhandled");
            }
            break;
        case OP_GLOBAL:
            switch (ctx)
            {
                case Load:
                    return this._gr("loadgbl", "Sk.misceval.loadname('", mangledNoPre, "',$gbl)");
                case Store:
                    out("$gbl.", mangledNoPre, "=", dataToStore, ';');
                    break;
                case Del:
                    out("delete $gbl.", mangledNoPre);
                    break;
                default:
                    goog.asserts.fail("unhandled case in name op_global");
            }
            break;
        case OP_DEREF:
            switch (ctx)
            {
                case Load:
                    return dict + "." + mangledNoPre;
                case Store:
                    out(dict, ".", mangledNoPre, "=", dataToStore, ";");
                    break;
                case Param:
                    return mangledNoPre;
                default:
                    goog.asserts.fail("unhandled case in name op_deref");
            }
            break;
        default:
            goog.asserts.fail("unhandled case");
    }
};

Compiler.prototype.enterScope = function(name, key, lineno)
{
    var u = new CompilerUnit();
    u.ste = this.st.getStsForAst(key);
    u.name = name;
    u.firstlineno = lineno;

    this.stack.push(this.u);
    this.allUnits.push(u);
    var scopeName = this.gensym('scope');
    u.scopename = scopeName;

    this.u = u;
    this.u.activateScope();

    this.nestlevel++;

    return scopeName;
};

Compiler.prototype.exitScope = function()
{
    var prev = this.u;
    this.nestlevel--;
    if (this.stack.length - 1 >= 0)
        this.u = this.stack.pop();
    else
        this.u = null;
    if (this.u)
        this.u.activateScope();

    if (prev.name.v !== "<module>") // todo; hacky
        out(prev.scopename, ".co_name=new Sk.builtins['str'](", prev.name['$r']().v, ");");
};

Compiler.prototype.cbody = function(stmts)
{
    for (var i = 0; i < stmts.length; ++i)
        this.vstmt(stmts[i]);
};

Compiler.prototype.cprint = function(s)
{
    goog.asserts.assert(s instanceof Print);
    var dest = 'null';
    if (s.dest)
        dest = this.vexpr(s.dest);

    var n = s.values.length;
    // todo; dest disabled
    for (var i = 0; i < n; ++i)
        out('Sk.misceval.print_(', /*dest, ',',*/ "new Sk.builtins['str'](", this.vexpr(s.values[i]), ').v);');
    if (s.nl)
        out('Sk.misceval.print_(', /*dest, ',*/ '"\\n");');
};

Compiler.prototype.cmod = function(mod)
{
    //print("-----");
    //print(Sk.astDump(mod));
    var modf = this.enterScope(new Sk.builtin.str("<module>"), mod, 0);
    var cachedscope = "$moddata.scopes['" + modf + "']";

    var entryBlock = this.newBlock('module entry');
    // modified by allevato
    this.u.prefixCode = cachedscope + "=" + cachedscope + "||(function($modname){";
    this.u.varDeclsCode = "var $frm=Sk._frameEnter(" + entryBlock + ");" +
      "var $ctx=$frm.ctx,$exc=$ctx.$exc||[],$gbl=$ctx.$gbl||{},$loc=$ctx.$loc||$gbl; $gbl.__name__=$modname;" +
      "$ctx.$exc=$exc;$ctx.$gbl=$gbl;$ctx.$loc=$loc;";
    this.u.switchCode = "while(true){switch($frm.blk){\n";
    this.u.suffixCode = "}}});";
    this.u.suffixCode += "var " + modf + "=" + cachedscope + ";";

    switch (mod.constructor)
    {
        case Module:
            this.cbody(mod.body);
            out("Sk._frameLeave();return $loc;");
            break;
        default:
            goog.asserts.fail("todo; unhandled case in compilerMod");
    }
    this.exitScope();

    this.result.push(this.outputAllUnits());
    return modf;
};

/**
 * @param {string} source the code
 * @param {string} filename where it came from
 * @param {string} mode one of 'exec', 'eval', or 'single'
 */
Sk.compile = function(source, filename, mode)
{
    //print("FILE:", filename);
    var cst = Sk.parse(filename, source);
    var ast = Sk.astFromParse(cst, filename);
    var st = Sk.symboltable(ast, filename);
    var c = new Compiler(filename, st, 0, source); // todo; CO_xxx
    var funcname = c.cmod(ast);
    var ret = c.result.join('');
    return {
        funcname: funcname,
        code: ret
    };
};


/**
 * @constructor
 * @param {Object=} future
 */
function SuspendExecution(future)
{
  this.future = future;
}

/**
 * Have a function call this to "suspend" the program so that you
 * can interactively provide the return value (like "input") or do
 * something else asynchronous without hanging the browser (like an
 * HTTP request).
 * 
 * This works as follows. Imagine that you have an input function
 * (like Sk.input) that you want to implement asynchronously by
 * displaying a text field in the browser window. In order to wait
 * for the user to type a response, program execution must be
 * suspended temporarily. So you could write Sk.input like this:
 *
 * Sk.input = function(prompt) {
 *   return Sk.future(function(continueWith) {
 *     // add #textfield to the DOM
 *     $('#textfield').change(function() {
 *       continueWith($('#textfield').val());
 *     });
 *   });
 * };
 *
 * The process:
 * 1. Surround the *entire body* of the asynchronous function in
 *    the call to Sk.future, because it will be invoked twice (once
 *    when it is initially called, to preserve the stack state and
 *    yield, and then a second time when the continueWith callback
 *    is invoked to resume execution), and you don't want to do
 *    anything that causes side effects.
 * 2. Sk.future takes a single parameter -- the function that will
 *    be executed to start the asynchronous process (in this case,
 *    add a text field to the DOM and hook up event listeners).
 * 3. The function that you give to Sk.future itself takes a single
 *    parameter, which is a handle to a function (continueWith)
 *    that you must call to provide the return value of the future.
 *    Once this is called, execution will resume.
 * 4. Once resumed, the Sk.future function will return the value
 *    that was passed to continueWith.
 *
 * @param perform the function that
 *    performs the actions that will return a value in the future
 */
Sk.future = function(perform)
{
  if (Sk._futureResult !== undefined)
  {
    var result = Sk._futureResult;
    delete Sk._futureResult;
    return result;
  }
  else
  {
    Sk._preservedFrames = Sk._frames;
    Sk._frameRestoreIndex = 0;
    Sk._frames = [];

    throw new SuspendExecution(perform);
  }
};

/**
 * Halt execution of the program until Sk.resume() is called. This is a
 * low-level primitive; most users who need to suspend execution (for
 * example, to wait for an asynchronous HTTP load to finish or to allow
 * interactive input) should use the higher-level Sk.future() instead.
 */
Sk.yield = function()
{
  var currentTime = Date.now();

  if (!Sk._lastYieldTime
    || (currentTime - Sk._lastYieldTime > Sk.suspendInterval))
  {
    Sk._lastYieldTime = currentTime;

    if (!Sk._preservedFrames ||
      Sk._preservedFrames.length < Sk._frames.length)
    {
      Sk._preservedFrames = Sk._frames;
      Sk._frameRestoreIndex = 0;
      Sk._frames = [];

      throw new SuspendExecution();
    }
    else
    {
      delete Sk._preservedFrames;
      delete Sk._frameRestoreIndex;
    }
  }
};

/**
 * Resumes execution after Sk.yield(). This is a low-level primitive;
 * clients using Sk.future() should communicate their result to the
 * continueWith callback that gets passed into their future function.
 *
 * @param {Object=} result the optional result
 */
Sk.resume = function(result)
{
  Sk._initingObjectsIndex = 0;
  Sk._futureResult = result;

  var moddata = Sk._moduleStack[Sk._moduleStack.length - 1];
  return moddata.code(moddata);
};

Sk._hasFrameToRestore = function()
{
  return Sk._preservedFrames &&
    Sk._frameRestoreIndex < Sk._preservedFrames.length;
};

Sk._frameEnter = function(entryBlock)
{
  var frm;

  if (Sk._hasFrameToRestore())
  {
    frm = Sk._preservedFrames[Sk._frameRestoreIndex++];
  }
  else
  {
    frm = { ctx: {}, blk: entryBlock };
  }

  Sk._frames.push(frm);

  return frm;
};

Sk._frameLeave = function()
{
  Sk._frames.pop();
};

/**
 * Executes a Python module that has been translated into Javascript.
 *
 * @param code a JS function that executes the code in the module
 * @return the locals dictionary for the module
 */
Sk._execModule = function(code)
{
  var moduleData = {
    scopes: {},
    code: code
  };

  Sk._moduleStack.push(moduleData);
  var result = code(moduleData);
  Sk._moduleStack.pop();

  return result;
};

Sk._createOrRetrieveObject = function(self, initializer)
{
  if (Sk._initingObjects[Sk._initingObjectsIndex] !== undefined)
  {
    self = Sk._initingObjects[Sk._initingObjectsIndex++];
  }
  else
  {
    initializer.call(self);
    Sk._initingObjects.push(self);
    Sk._initingObjectsIndex++;
  }

  return self;
};

Sk._finishCreatingObject = function()
{
  Sk._initingObjects.pop();
  Sk._initingObjectsIndex--;
};

goog.exportSymbol("Sk.compile", Sk.compile);
goog.exportSymbol("Sk.future", Sk.future);
goog.exportSymbol("Sk.yield", Sk.yield);
goog.exportSymbol("Sk.resume", Sk.resume);
goog.exportSymbol("Sk._hasFrameToRestore", Sk._hasFrameToRestore);
goog.exportSymbol("Sk._frameEnter", Sk._frameEnter);
goog.exportSymbol("Sk._frameLeave", Sk._frameLeave);
goog.exportSymbol("Sk._execModule", Sk._execModule);
goog.exportSymbol("Sk._createOrRetrieveObject", Sk._createOrRetrieveObject);
goog.exportSymbol("Sk._finishCreatingObject", Sk._finishCreatingObject);
goog.exportSymbol("SuspendExecution", SuspendExecution);
