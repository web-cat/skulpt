var interned = {};

/**
 * @constructor
 * @param {*} x
 * @extends Sk.builtin.object
 */
Sk.builtin.str = function(x)
{
    if (x === undefined) throw "error: trying to str() undefined (should be at least null)";
    if (x instanceof Sk.builtin.str && x !== Sk.builtin.str.prototype.ob$type) return x;
    if (!(this instanceof Sk.builtin.str)) return new Sk.builtin.str(x);

    // convert to js string
    var ret;
    if (x === true) ret = "True";
    else if (x === false) ret = "False";
    else if (x === null) ret = "None";
    else if (typeof x === "number")
    {
        ret = x.toString();
        if (ret === "Infinity") ret = "inf";
        else if (ret === "-Infinity") ret = "-inf";
    }
    else if (typeof x === "string")
        ret = x;
    else if (x.tp$str !== undefined)
    {
        ret = x.tp$str();
        if (!(ret instanceof Sk.builtin.str)) throw new Sk.builtin.ValueError("__str__ didn't return a str");
        return ret;
    }
    else if (x.__str__ !== undefined) {
        return Sk.misceval.callsim(x.__str__,x);
    }
    else 
        return Sk.misceval.objectRepr(x);

    // interning required for strings in py
    if (Object.prototype.hasOwnProperty.call(interned, "1"+ret)) // note, have to use Object to avoid __proto__, etc. failing
    {
        return interned["1"+ret];
    }

    this.__class__ = Sk.builtin.str;
    this.v = ret;
    this["v"] = this.v;
    interned["1"+ret] = this;
    return this;

};
goog.exportSymbol("Sk.builtin.str", Sk.builtin.str);

Sk.builtin.str.$emptystr = new Sk.builtin.str('');

Sk.builtin.str.prototype.mp$subscript = function(index)
{
    if (typeof index === "number" && Math.floor(index) === index /* not a float*/ )
    {
        if (index < 0) index = this.v.length + index;
        if (index < 0 || index >= this.v.length) throw new Sk.builtin.IndexError("string index out of range");
        return new Sk.builtin.str(this.v.charAt(index));
    }
    else if (index instanceof Sk.builtin.slice)
    {
        var ret = '';
        index.sssiter$(this, function(i, wrt) {
                if (i >= 0 && i < wrt.v.length)
                    ret += wrt.v.charAt(i);
                });
        return new Sk.builtin.str(ret);
    }
    else
        throw new TypeError("string indices must be numbers, not " + typeof index);
};

Sk.builtin.str.prototype.sq$length = function()
{
    return this.v.length;
};
Sk.builtin.str.prototype.sq$concat = function(other) { return new Sk.builtin.str(this.v + other.v); };
Sk.builtin.str.prototype.sq$repeat = function(n)
{
    var ret = "";
    for (var i = 0; i < n; ++i)
        ret += this.v;
    return new Sk.builtin.str(ret);
};
Sk.builtin.str.prototype.sq$item = function() { goog.asserts.fail(); };
Sk.builtin.str.prototype.sq$slice = function(i1, i2)
{
    return new Sk.builtin.str(this.v.substr(i1, i2 - i1));
};

Sk.builtin.str.prototype.sq$contains = function(ob) {
    if ( ob.v === undefined || ob.v.constructor != String) {
        throw new TypeError("TypeError: 'In <string> requires string as left operand");
    }
    if (this.v.indexOf(ob.v) != -1) {
        return true;
    } else {
        return false;
    }

}

Sk.builtin.str.prototype.tp$name = "str";
Sk.builtin.str.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
Sk.builtin.str.prototype.tp$iter = function()
{
    var ret =
    {
        tp$iter: function() { return ret; },
        $obj: this,
        $index: 0,
        tp$iternext: function()
        {
            // todo; StopIteration
            if (ret.$index >= ret.$obj.v.length) return undefined;
           return new Sk.builtin.str(ret.$obj.v.substr(ret.$index++, 1));
        }
    };
    return ret;
};

Sk.builtin.str.prototype.tp$richcompare = function(other, op)
{
    if (!(other instanceof Sk.builtin.str)) return undefined;

    if (this === other)
    {
        switch (op)
        {
            case 'Eq': case 'LtE': case 'GtE':
                return true;
            case 'NotEq': case 'Lt': case 'Gt':
                return false;
        }
    }
    var lenA = this.v.length;
    var lenB = other.v.length;
    var minLength = Math.min(lenA, lenB);
    var c = 0;
    if (minLength > 0)
    {
        for (var i = 0; i < minLength; ++i)
        {
            if (this.v[i] != other.v[i])
            {
                c = this.v[i].charCodeAt(0) - other.v[i].charCodeAt(0);
                break;
            }
        }
    }
    else
    {
        c = 0;
    }

    if (c == 0)
    {
        c = (lenA < lenB) ? -1 : (lenA > lenB) ? 1 : 0;
    }

    switch (op)
    {
        case 'Lt': return c < 0;
        case 'LtE': return c <= 0;
        case 'Eq': return c == 0;
        case 'NotEq': return c != 0;
        case 'Gt': return c > 0;
        case 'GtE': return c >= 0;
        default:
            goog.asserts.fail();
    }
};

Sk.builtin.str.prototype['$r'] = function()
{
    // single is preferred
    var quote = "'";
    if (this.v.indexOf("'") !== -1 && this.v.indexOf('"') === -1)
    {
        quote = '"';
    }
    var len = this.v.length;
    var ret = quote;
    for (var i = 0; i < len; ++i)
    {
        var c = this.v.charAt(i);
        if (c === quote || c === '\\')
            ret += '\\' + c;
        else if (c === '\t')
            ret += '\\t';
        else if (c === '\n')
            ret += '\\n';
        else if (c === '\r')
            ret += '\\r';
        else if (c < ' ' || c >= 0x7f)
        {
            var ashex = c.charCodeAt(0).toString(16);
            if (ashex.length < 2) ashex = "0" + ashex;
            ret += "\\x" + ashex;
        }
        else
            ret += c;
    }
    ret += quote;
    return new Sk.builtin.str(ret);
};


Sk.builtin.str.re_escape_ = function(s)
{
    var ret = [];
	var re = /^[A-Za-z0-9]+$/;
    for (var i = 0; i < s.length; ++i)
    {
        var c = s.charAt(i);

        if (re.test(c))
        {
            ret.push(c);
        }
        else
        {
            if (c === "\\000")
                ret.push("\\000");
            else
                ret.push("\\" + c);
        }
    }
    return ret.join('');
};

Sk.builtin.str.prototype['lower'] = new Sk.builtin.func(function(self)
{
    return new Sk.builtin.str(self.v.toLowerCase());
});

Sk.builtin.str.prototype['upper'] = new Sk.builtin.func(function(self)
{
    return new Sk.builtin.str(self.v.toUpperCase());
});

Sk.builtin.str.prototype['capitalize'] = new Sk.builtin.func(function(self)
{
    return new Sk.builtin.str(self.v.charAt(0).toUpperCase()+self.v.substring(1));
});

Sk.builtin.str.prototype['join'] = new Sk.builtin.func(function(self, seq)
{
    var arrOfStrs = [];
    for (var it = seq.tp$iter(), i = it.tp$iternext(); i !== undefined; i = it.tp$iternext())
    {
        if (i.constructor !== Sk.builtin.str) throw "TypeError: sequence item " + arrOfStrs.length + ": expected string, " + typeof i + " found";
        arrOfStrs.push(i.v);
    }
    return new Sk.builtin.str(arrOfStrs.join(self.v));
});

Sk.builtin.str.prototype['split'] = new Sk.builtin.func(function(self, on, howmany)
{
    var res;
    if (! on) {
        res = self.v.trim().split(/[\s]+/, howmany);
    } else {
        res = self.v.split(new Sk.builtin.str(on).v, howmany);
    }
    var tmp = [];
    for (var i = 0; i < res.length; ++i)
    {
        tmp.push(new Sk.builtin.str(res[i]));
    }
    return new Sk.builtin.list(tmp);
});

Sk.builtin.str.prototype['strip'] = new Sk.builtin.func(function(self, chars)
{
    goog.asserts.assert(!chars, "todo;");
    return new Sk.builtin.str(self.v.replace(/^\s+|\s+$/g, ''));
});

Sk.builtin.str.prototype['lstrip'] = new Sk.builtin.func(function(self, chars)
{
    goog.asserts.assert(!chars, "todo;");
    return new Sk.builtin.str(self.v.replace(/^\s+/g, ''));
});

Sk.builtin.str.prototype['rstrip'] = new Sk.builtin.func(function(self, chars)
{
    goog.asserts.assert(!chars, "todo;");
    return new Sk.builtin.str(self.v.replace(/\s+$/g, ''));
});

Sk.builtin.str.prototype['partition'] = new Sk.builtin.func(function(self, sep)
{
    var sepStr = new Sk.builtin.str(sep);
    var pos = self.v.indexOf(sepStr.v);
    if (pos < 0)
    {
        return new Sk.builtin.tuple([self, Sk.builtin.str.$emptystr, Sk.builtin.str.$emptystr]);
    }

    return new Sk.builtin.tuple([
        new Sk.builtin.str(self.v.substring(0, pos)),
        sepStr,
        new Sk.builtin.str(self.v.substring(pos + sepStr.v.length))]);
});

Sk.builtin.str.prototype['rpartition'] = new Sk.builtin.func(function(self, sep)
{
    var sepStr = new Sk.builtin.str(sep);
    var pos = self.v.lastIndexOf(sepStr.v);
    if (pos < 0)
    {
        return new Sk.builtin.tuple([Sk.builtin.str.$emptystr, Sk.builtin.str.$emptystr, self]);
    }

    return new Sk.builtin.tuple([
        new Sk.builtin.str(self.v.substring(0, pos)),
        sepStr,
        new Sk.builtin.str(self.v.substring(pos + sepStr.v.length))]);
});

Sk.builtin.str.prototype['count'] = new Sk.builtin.func(function(self, pat) {
    var m = new RegExp(pat.v,'g');
    var ctl = self.v.match(m)
    if (! ctl) {
        return 0;
    } else {
        return ctl.length;
    }
    
});

Sk.builtin.str.prototype['ljust'] = new Sk.builtin.func(function(self, len) {
    if (self.v.length >= len) {
        return self;
    } else {
        var newstr = Array.prototype.join.call({length:Math.floor(len-self.v.length)+1}," ");
        return new Sk.builtin.str(self.v+newstr);
    }
});

Sk.builtin.str.prototype['rjust'] = new Sk.builtin.func(function(self, len) {
    if (self.v.length >= len) {
        return self;
    } else {
        var newstr = Array.prototype.join.call({length:Math.floor(len-self.v.length)+1}," ");
        return new Sk.builtin.str(newstr+self.v);
    }

});

Sk.builtin.str.prototype['center'] = new Sk.builtin.func(function(self, len) {
    if (self.v.length >= len) {
        return self;
    } else {
        var newstr1 = Array.prototype.join.call({length:Math.floor((len-self.v.length)/2)+1}," ");
        var newstr = newstr1+self.v+newstr1;
        if (newstr.length < len ) {
            newstr = newstr + " "
        }
        return new Sk.builtin.str(newstr);
    }

});

Sk.builtin.str.prototype['find'] = new Sk.builtin.func(function(self, tgt, start) {
   return self.v.indexOf(tgt.v,start);
});

Sk.builtin.str.prototype['index'] = new Sk.builtin.func(function(self, tgt, start) {
   return self.v.indexOf(tgt.v,start);
});

Sk.builtin.str.prototype['rfind'] = new Sk.builtin.func(function(self, tgt, start) {
   return self.v.lastIndexOf(tgt.v,start);
});

Sk.builtin.str.prototype['rindex'] = new Sk.builtin.func(function(self, tgt, start) {
   return self.v.lastIndexOf(tgt.v,start);
});

Sk.builtin.str.prototype['replace'] = new Sk.builtin.func(function(self, oldS, newS, count)
{
    if (oldS.constructor !== Sk.builtin.str || newS.constructor !== Sk.builtin.str)
        throw new Sk.builtin.TypeError("expecting a string");
    goog.asserts.assert(count === undefined, "todo; replace() with count not implemented");
    var patt = new RegExp(Sk.builtin.str.re_escape_(oldS.v), "g");
    return new Sk.builtin.str(self.v.replace(patt, newS.v));
});

Sk.builtin.str.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj('str', Sk.builtin.str);

Sk.builtin.str.prototype.nb$remainder = function(rhs)
{
    // % format op. rhs can be a value, a tuple, or something with __getitem__ (dict)

    // From http://docs.python.org/library/stdtypes.html#string-formatting the
    // format looks like:
    // 1. The '%' character, which marks the start of the specifier.
    // 2. Mapping key (optional), consisting of a parenthesised sequence of characters (for example, (somename)).
    // 3. Conversion flags (optional), which affect the result of some conversion types.
    // 4. Minimum field width (optional). If specified as an '*' (asterisk), the actual width is read from the next element of the tuple in values, and the object to convert comes after the minimum field width and optional precision.
    // 5. Precision (optional), given as a '.' (dot) followed by the precision. If specified as '*' (an asterisk), the actual width is read from the next element of the tuple in values, and the value to convert comes after the precision.
    // 6. Length modifier (optional).
    // 7. Conversion type.
    //
    // length modifier is ignored

    if (rhs.constructor !== Sk.builtin.tuple && (rhs.mp$subscript === undefined || rhs.constructor === Sk.builtin.str)) rhs = new Sk.builtin.tuple([rhs]);
    
    // general approach is to use a regex that matches the format above, and
    // do an re.sub with a function as replacement to make the subs.

    //           1 2222222222222222   33333333   444444444   5555555555555  66666  777777777777777777
    var regex = /%(\([a-zA-Z0-9]+\))?([#0 +\-]+)?(\*|[0-9]+)?(\.(\*|[0-9]+))?[hlL]?([diouxXeEfFgGcrs%])/g;
    var index = 0;
    var replFunc = function(substring, mappingKey, conversionFlags, fieldWidth, precision, precbody, conversionType)
    {
        var i;
        if (mappingKey === undefined || mappingKey === "" ) i = index++; // ff passes '' not undef for some reason

        var zeroPad = false;
        var leftAdjust = false;
        var blankBeforePositive = false;
        var precedeWithSign = false;
        var alternateForm = false;
        if (conversionFlags)
        {
            if (conversionFlags.indexOf("-") !== -1) leftAdjust = true;
            else if (conversionFlags.indexOf("0") !== -1) zeroPad = true;

            if (conversionFlags.indexOf("+") !== -1) precedeWithSign = true;
            else if (conversionFlags.indexOf(" ") !== -1) blankBeforePositive = true;

            alternateForm = conversionFlags.indexOf("#") !== -1;
        }

        if (precision)
        {
            precision = parseInt(precision.substr(1), 10);
        }

        var formatNumber = function(n, base)
        {
            var j;
            var r;
            var neg = false;
            var didSign = false;
            if (typeof n === "number")
            {
                if (n < 0)
                {
                    n = -n;
                    neg = true;
                }
                r = n.toString(base);
            }
            else if (n instanceof Sk.builtin.lng)
            {
                r = n.str$(base, false);
                neg = n.compare(0) < 0;
            }

            goog.asserts.assert(r !== undefined, "unhandled number format");

            var precZeroPadded = false;

            if (precision)
            {
                //print("r.length",r.length,"precision",precision);
                for (j = r.length; j < precision; ++j)
                {
                    r = '0' + r;
                    precZeroPadded = true;
                }
            }

            var prefix = '';

            if (neg) prefix = "-";
            else if (precedeWithSign) prefix = "+" + prefix;
            else if (blankBeforePositive) prefix = " " + prefix;

            if (alternateForm)
            {
                if (base === 16) prefix += '0x';
                else if (base === 8 && !precZeroPadded && r !== "0") prefix += '0';
            }

            return [prefix, r];
        };

        var handleWidth = function(args)
        {
            var prefix = args[0];
            var r = args[1];
            var j;
            if (fieldWidth)
            {
                fieldWidth = parseInt(fieldWidth, 10);
                var totLen = r.length + prefix.length;
                if (zeroPad)
                    for (j = totLen; j < fieldWidth; ++j)
                        r = '0' + r;
                else if (leftAdjust)
                    for (j = totLen; j < fieldWidth; ++j)
                        r = r + ' ';
                else
                    for (j = totLen; j < fieldWidth; ++j)
                        prefix = ' ' + prefix;
            }
            return prefix + r;
        };

        var value;
        //print("Rhs:",rhs, "ctor", rhs.constructor);
        if (rhs.constructor === Sk.builtin.tuple)
        {
            value = rhs.v[i];
        }
        else if (rhs.mp$subscript !== undefined)
        {
            var mk = mappingKey.substring(1, mappingKey.length - 1);
            //print("mk",mk);
            value = rhs.mp$subscript(new Sk.builtin.str(mk));
        }
        else throw new Sk.builtin.AttributeError(rhs.tp$name + " instance has no attribute 'mp$subscript'");
        var r;
        var base = 10;
        switch (conversionType)
        {
            case 'd':
            case 'i':
                return handleWidth(formatNumber(value, 10));
            case 'o':
                return handleWidth(formatNumber(value, 8));
            case 'x':
                return handleWidth(formatNumber(value, 16));
            case 'X':
                return handleWidth(formatNumber(value, 16)).toUpperCase();

            case 'e':
            case 'E':
            case 'f':
            case 'F':
            case 'g':
            case 'G':
                var convName = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(conversionType.toLowerCase())];
                var result = (value)[convName](precision);
                if ('EFG'.indexOf(conversionType) !== -1) result = result.toUpperCase();
                // todo; signs etc.
                return handleWidth(['', result]);

            case 'c':
                if (typeof value === "number")
                    return String.fromCharCode(value);
                else if (value instanceof Sk.builtin.lng)
                    return String.fromCharCode(value.str$(10,false)[0]);
                else if (value.constructor === Sk.builtin.str)
                    return value.v.substr(0, 1);
                else
                    throw new TypeError("an integer is required");
                break; // stupid lint

            case 'r':
                r = Sk.builtin.repr(value);
                if (precision) return r.v.substr(0, precision);
                return r.v;
            case 's':
                //print("value",value);
                //print("replace:");
                //print("  index", index);
                //print("  substring", substring);
                //print("  mappingKey", mappingKey);
                //print("  conversionFlags", conversionFlags);
                //print("  fieldWidth", fieldWidth);
                //print("  precision", precision);
                //print("  conversionType", conversionType);
                r = new Sk.builtin.str(value);
                if (precision) return r.v.substr(0, precision);
                return r.v;
            case '%':
                return '%';
        }
    };
    
    var ret = this.v.replace(regex, replFunc);
    return new Sk.builtin.str(ret);
};

// Python 3 prefers the "format" method to the overloaded % operator.
// Added by allevato
Sk.builtin.str.prototype['format'] = new Sk.builtin.func(function() {
    var self = arguments[0];
    
    // Turn all {} in string into {0}, {1}, etc.
    var count = 0;
    var v = self.v.replace(/{}/g, function(){ return '{' + count++ + '}' })
    var args = Array.prototype.slice.call(arguments, 1);

    return new Sk.builtin.str(v.replace(/{([a-zA-Z0-9_]+)(:((\.[0-9]+)?[bcdefoxX]))?}/g,
      function(match, key, unused, format, precision) {
        var val = args[key];
        if (val == null
            && args[0].constructor == Sk.builtin.dict)
        {
        	val = args[0].mp$subscript(new Sk.builtin.str(key));
        }
        
        if (val != null)
        {
        	// unwrap Python string, if needed
            if (val.constructor === Sk.builtin.str)
            {
            	val = val.v;
            }
            if (format != null)
            {
                val = vsprintf("%" + format, [val]);
            }
            return val;
        }
        else
        {
            return match;
        }
    }));
//    return Sk.builtin.str.prototype.nb$remainder.call(
//        self, new Sk.builtin.tuple(args));
});


// sprintf code, adapted from https://github.com/alexei/sprintf.js, is:

// Copyright (c) 2007-2013, Alexandru Marasteanu <hello [at) alexei (dot] ro>
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// * Redistributions of source code must retain the above copyright
//   notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright
//   notice, this list of conditions and the following disclaimer in the
//   documentation and/or other materials provided with the distribution.
// * Neither the name of this software nor the names of its contributors may be
//   used to endorse or promote products derived from this software without
//   specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
var sprintf = function() {
		if (!sprintf.cache.hasOwnProperty(arguments[0])) {
			sprintf.cache[arguments[0]] = sprintf.parse(arguments[0]);
		}
		return sprintf.format.call(null, sprintf.cache[arguments[0]], arguments);
	};

sprintf.format = function(parse_tree, argv) {
		var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			}
			else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw(vsprintf('[sprintf] property "%s" does not exist', [match[2][k]]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				}
				else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw(vsprintf('[sprintf] expecting number but found %s', [get_type(arg)]));
				}
				switch (match[8]) {
					case 'b': arg = arg.toString(2); break;
					case 'c': arg = String.fromCharCode(arg); break;
					case 'd': arg = parseInt(arg, 10); break;
					case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
					case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
					case 'o': arg = arg.toString(8); break;
					case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
					case 'u': arg = arg >>> 0; break;
					case 'x': arg = arg.toString(16); break;
					case 'X': arg = arg.toString(16).toUpperCase(); break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

sprintf.cache = {};

sprintf.parse = function(fmt) {
		var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			}
			else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			}
			else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [], replacement_field = match[2], field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else {
								throw('[sprintf] huh?');
							}
						}
					}
					else {
						throw('[sprintf] huh?');
					}
					match[2] = field_list;
				}
				else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else {
				throw('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

var vsprintf = function(fmt, argv) {
		var _argv = argv.slice(0);
		_argv.splice(0, 0, fmt);
		return sprintf.apply(null, _argv);
	};

function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}

function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
		return output.join('');
	}
