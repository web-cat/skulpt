(function () {
  var isClass;

  window.Sk = {
    builtin : {},
    misceval: {},
    ffi: {},
    sysmodules: {}
  };

  Sk.ffi.checkArgs = function (name, args, count) {
    var verb, low, high;

    verb = (args.length == 1) ? 'was' : 'were';

    if (typeof(count) === 'number') {
      if (args.length !== count) {   
        throw new Error(name + '() takes ' + count + ' positional arguments but ' +
                        args.length + ' ' + verb + ' given');
      }   
    } else {
      low = count[0]; high = count[1];

      if (args.length < low || args.length > high) {   
        throw new Sk.builtin.TypeError(name + '() takes between ' + low + ' and ' +
                                       high + ' positional arguments but ' +
                                      args.length + ' ' + verb + ' given');
      }
    }
  };

  Sk.builtin.func = function (value) { return value; };
  Sk.ffi.unwrapo = function (value) {
    if(typeof(value) === 'object') {
      return value.getValue();
    } else {
      return value;
    }
  };

  Sk.builtin.asnum$ = function (value) {
    if(typeof(value) === 'object') {
      return value.getValue();
    } else {
      return value;
    }
  };

  Sk.builtin.NotImplementedError = function (message) { this.message = message };
  Sk.builtin.NotImplementedError.prototype = Error.prototype;
  Sk.builtin.TypeError = function (message) { this.message = message };
  Sk.builtin.TypeError.prototype = Error.prototype;
  Sk.builtin.ValueError = function (message) { this.message = message };
  Sk.builtin.ValueError.prototype = Error.prototype;

  Sk.builtin.bool = function (value) { this.value = value; };
  Sk.builtin.list = function (value) { this.value = value; };
  Sk.builtin.int_ = function (value) { this.value = value; this.skType = 'int'};
  Sk.builtin.float_ = function (value) { this.value = value; };
  Sk.builtin.str = function (value) { this.value = value; };

  Sk.builtin.bool.prototype.getValue = Sk.builtin.list.prototype.getValue = Sk.builtin.int_.prototype.getValue =
    Sk.builtin.float_.prototype.getValue = Sk.builtin.str.prototype.getValue = function () { return this.value; };

  Sk.misceval.buildClass = function (mod, func, name, bases) {
    var classFunc, base;

    classFunc = function () {
      var args;

      args = [this].concat(Array.prototype.slice.call(arguments));

      this.__init__.apply({}, args);
      this.tp$name = name; 
      return this;
    };

    func(null, classFunc.prototype);

    bases.forEach(function (base) {
      for(methodName in base.prototype) {
        if(!classFunc.prototype[methodName]) {
          classFunc.prototype[methodName] = base.prototype[methodName];
        }
      }
    });

    return classFunc;
  };

  isClass = function (func) {
    return func.prototype.hasOwnProperty('__init__');
  };

  Sk.misceval.callsim = function (func) {
    var factoryFunc;

    if(isClass(func)) {
      factoryFunc = func.bind.apply(func, Array.prototype.slice.call(arguments));
      return new factoryFunc();
    } else {
      return func.apply({}, Array.prototype.slice.call(arguments, 1));
    }
  };

  // This only returns a value in the synchronous case
  // In the async case, spy on or stub out Sk.future.continueWith
  // to verify if it was called with the correct return value
  Sk.future = function (wrapperFunc) {
    var ret;

    ret = {};

    wrapperFunc(Sk.future.continueWith.bind(ret));

    return ret.val;
  };

  Sk.future.continueWith = function (val) { this.val = val; };

  Sk.sysmodules.mp$subscript = function (name) {
    switch(name) {
      case 'image.color': return { $d: window.colorMod() };
      case 'image.pixel': return { $d: window.pixelMod() };
      case 'sound.sample': return { $d: window.sampleMod() };
    }
  }

  Sk.transformUrl = function (url) { return url; };

  Sk.misceval.print_ = function () {};

}());
