(function () {
  var isClass;

  window.Sk = {
    builtin : {},
    misceval: {},
    ffi: {},
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

  Sk.builtin.asnum$ = Sk.builtin.func = Sk.ffi.unwrapo = function (value) { return value; };

  Sk.builtin.TypeError = Error;

  Sk.builtin.float_ = Sk.builtin.str = function (value) { this.value = value; };

  Sk.builtin.float_.prototype.getValue = Sk.builtin.str.prototype.getValue = function () { return this.value; }

  Sk.misceval.buildClass = function (mod, func, name) {
    var classFunc;

    classFunc = function () {
      var args;

      args = [this].concat(Array.prototype.slice.call(arguments));

      this.__init__.apply({}, args);
      this.tp$name = name; 
      return this;
    };

    func(null, classFunc.prototype);

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
      return func.apply({}, Array.prototype.slice.call(arguments));
    }
  };

  Sk.future = function (wrapperFunc) {
    var returnValue;

    wrapperFunc(function (val) { returnValue = val; });

    return returnValue;
  };

}());
