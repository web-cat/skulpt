// Note: the hacky names on int, long, float have to correspond with the
// uniquization that the compiler does for words that are reserved in
// Javascript. This is a bit hokey.
Sk.builtins = {
'abs': Sk.builtin.abs,
//'all': Sk.builtin.all, // Added by allevato
//'any': Sk.builtin.any, // Added by allevato
//'ascii': Sk.builtin.ascii, // Added by allevato
//'bin': Sk.builtin.bin, // Added by allevato
//'bool': Sk.builtin.bool, // Added by allevato
//'bytearray': Sk.builtin.bytearray, // Added by allevato
//'bytes': Sk.builtin.bytes, // Added by allevato
'chr': Sk.builtin.chr,
//'classmethod': Sk.builtin.classmethod, // Added by allevato
//'compile': Sk.builtin.compile, // Added by allevato
//'complex': Sk.builtin.complex, // Added by allevato
//'delattr': Sk.builtin.delattr, // Added by allevato
'dict': Sk.builtin.dict,
'dir': Sk.builtin.dir,
//'divmod': Sk.builtin.divmod, // Added by allevato
//'enumerate': Sk.builtin.enumerate, // Added by allevato
//'eval': Sk.builtin.eval, // Added by allevato
//'exec': Sk.builtin.exec, // Added by allevato
'fabs': Sk.builtin.abs, //  Added by RNL
//'filter': Sk.builtin.filter, // Added by allevato
'float_$rw$': Sk.builtin.float_,
//'format': Sk.builtin.format, // Added by allevato
//'frozenset': Sk.builtin.frozenset, // Added by allevato
'getattr': Sk.builtin.getattr,
'globals': Sk.builtin.globals, // Added by allevato
//'hasattr': Sk.builtin.hasattr, // Added by allevato
'hash': Sk.builtin.hash,
//'help': Sk.builtin.help, // Added by allevato
//'hex': Sk.builtin.hex, // Added by allevato
//'id': Sk.builtin.id, // Added by allevato
'input': Sk.builtin.input,
'int_$rw$': Sk.builtin.int_,
'isinstance': Sk.builtin.isinstance,
//'issubclass': Sk.builtin.issubclass, // Added by allevato
//'iter': Sk.builtin.iter, // Added by allevato
'len': Sk.builtin.len,
'list': Sk.builtin.list,
'locals': Sk.builtin.locals, // Added by allevato
//'map': Sk.builtin.map, // Added by allevato
'max': Sk.builtin.max,
//'memoryview': Sk.builtin.memoryview, // Added by allevato
'min': Sk.builtin.min,
//'next': Sk.builtin.next, // Added by allevato
'object': Sk.builtin.object,
//'oct': Sk.builtin.oct, // Added by allevato
'open': Sk.builtin.open,
'ord': Sk.builtin.ord,
//'pow': Sk.builtin.pow, // Added by allevato
//'property': Sk.builtin.property, // Added by allevato
'range': Sk.builtin.range,
'repr': Sk.builtin.repr,
//'reversed': Sk.builtin.reversed, // Added by allevato
'round': Sk.builtin.round, //  Added by allevato
'set': Sk.builtin.set,
//'setattr': Sk.builtin.setattr, // Added by allevato
'slice': Sk.builtin.slice,
//'sorted': Sk.builtin.sorted, // Added by allevato
//'staticmethod': Sk.builtin.staticmethod, // Added by allevato
'str': Sk.builtin.str,
'sum': Sk.builtin.sum,
//'super': Sk.builtin.super, // Added by allevato
'tuple': Sk.builtin.tuple,
'type': Sk.builtin.type,
//'vars': Sk.builtin.vars, // Added by allevato
//'zip': Sk.builtin.zip, // Added by allevato

'AttributeError': Sk.builtin.AttributeError,
'ValueError': Sk.builtin.ValueError,

'file': Sk.builtin.file,
'function': Sk.builtin.func,
'generator': Sk.builtin.generator,
'long_$rw$': Sk.builtin.lng,
'method': Sk.builtin.method,
/*'read': Sk.builtin.read,*/
'jseval': Sk.builtin.jseval,
'jsmillis': Sk.builtin.jsmillis,
'long_div_mode': Sk.builtin.lng.longDivideMode
};
goog.exportSymbol("Sk.builtins", Sk.builtins);
