var $builtinmodule = function() {
  var mod, sampleWrapper;

  mod = {};

  sampleWrapper = {
    getSound : new Sk.builtin.func(function (sample) {
      Sk.ffi.checkArgs('getSound', arguments, 1);
      return sample._sound;
    }),

    getSampleValue : new Sk.builtin.func(function (sample) {
      Sk.ffi.checkArgs('getSampleValue', arguments, 1);
      return Sk.builtin.float_(sample._internalSound.getLeftSample(sample._index));
    }),

    setSampleValue : new Sk.builtin.func(function (sample, value) {
      Sk.ffi.checkArgs('setSampleValue', arguments, 2);
      sample._internalSound.setLeftSample(sample._index, Sk.ffi.unwrapo(value));
    }),
  };

  mod.Sample = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, sound, index) {
      Sk.ffi.checkArgs('__init__', arguments, 3);
      self._sound = sound;
      self._internalSound = sound._sound;
      self._index = Sk.ffi.unwrapo(index);
    });

    $loc.__str__ = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return Sk.builtin.str('Sample at ' + self._index + ' with value ' +
                            self._internalSound.getLeftSample(self._index));
    });

    $loc.__repr__ = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('__repr__', arguments, 1);
      return Sk.builtin.str('Sample at ' + self._index + ' with value ' +
                            self._internalSound.getLeftSample(self._index));
    });

    goog.object.extend($loc, sampleWrapper);
  }, 'Sample', []);

  goog.object.extend(mod, sampleWrapper);

  return mod;
};
