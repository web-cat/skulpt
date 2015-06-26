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
      return new Sk.builtin.int_(pythy.Sound.mapFloatTo16BitInt(sample._internalSound.getLeftSample(sample._index)));
    }),

    setSampleValue : new Sk.builtin.func(function (sample, value) {
      Sk.ffi.checkArgs('setSampleValue', arguments, 2);
      if(!(value.skType && value.skType === 'int')) {
        throw new Sk.builtin.TypeError('Value must be an integer');
      }
      value = Sk.ffi.unwrapo(value);

      if(value < -32768) { value = -32768; }
      if(value > 32767) { value = 32767; }

      sample._internalSound.setLeftSample(sample._index, pythy.Sound.map16BitIntToFloat(value));
    }),
  };

  mod.Sample = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, sound, index) {
      Sk.ffi.checkArgs('__init__', arguments, 3);
      self._sound = sound;
      self._internalSound = sound._sound;
      self._index = index;
    });

    $loc.__str__ = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return new Sk.builtin.str('Sample at ' + self._index + ' with value ' +
                            pythy.Sound.mapFloatTo16BitInt(self._internalSound.getLeftSample(self._index)));
    });

    $loc.__repr__ = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('__repr__', arguments, 1);
      return new Sk.builtin.str('Sample at ' + self._index + ' with value ' +
                            pythy.Sound.mapFloatTo16BitInt(self._internalSound.getLeftSample(self._index)));
    });

    goog.object.extend($loc, sampleWrapper);
  }, 'Sample', []);

  goog.object.extend(mod, sampleWrapper);

  return mod;
};
