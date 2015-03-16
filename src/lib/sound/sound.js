// Do not include this module directly as it has dependencies 
var $builtinmodule = function() {
  var soundWrapper, mod, Sample;

  mod = {};

  // Dependency
  Sample = Sk.sysmodules.mp$subscript('sound.sample').$d.Sample;

  soundWrapper = {
    play : new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('play', arguments, 1);
      sound._sound.play();
    }),

    blockingPlay : new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('blockingPlay', arguments, 1);
      Sk.future(function (continueWith) {
        sound._sound.play(continueWith);
      });
    }),

    getDuration : new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('getDuration', arguments, 1);
      return Sk.builtin.float_(sound._sound.getDuration());
    }),

    getNumSamples : new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('getNumSamples', arguments, 1);
      return Sk.builtin.int_(sound._sound.getLength());
    }),

    getLength : new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('getLength', arguments, 1);
      return Sk.builtin.int_(sound._sound.getLength());
    }),

    getSamplingRate : new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('getSamplingRate', arguments, 1);
      return Sk.builtin.int_(sound._sound.getSamplingRate());
    }),

    setSampleValueAt : new Sk.builtin.func(function(sound, index, value) {
      Sk.ffi.checkArgs('setSampleValueAt', arguments, 3);
      sound._sound.setLeftSample(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
    }),

    setLeftSample : new Sk.builtin.func(function(sound, index, value) {
      Sk.ffi.checkArgs('setLeftSample', arguments, 3);
      sound._sound.setLeftSample(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
    }),

    setRightSample : new Sk.builtin.func(function(sound, index, value) {
      Sk.ffi.checkArgs('setRightSample', arguments, 3);
      sound._sound.setRightSample(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
    }),

    getSampleValueAt : new Sk.builtin.func(function(sound, index) {
      Sk.ffi.checkArgs('getSampleValueAt', arguments, 2);
      return Sk.builtin.float_(sound._sound.getLeftSample(Sk.ffi.unwrapo(index)));
    }),

    getLeftSample : new Sk.builtin.func(function(sound, index) {
      Sk.ffi.checkArgs('getLeftSample', arguments, 2);
      return Sk.builtin.float_(sound._sound.getLeftSample(Sk.ffi.unwrapo(index)));
    }),

    getRightSample : new Sk.builtin.func(function(sound, index) {
      Sk.ffi.checkArgs('getRightSample', arguments, 2);
      return Sk.builtin.float_(sound._sound.getRightSample(Sk.ffi.unwrapo(index)));
    }),

    getSampleObjectAt : new Sk.builtin.func(function (sound, index) {
      Sk.ffi.checkArgs('getSampleObjectAt', arguments, 2);
      return Sk.misceval.callsim(Sample, sound, index);
    }),

    getSamples : new Sk.builtin.func(function (sound) {
      var samples, len;
    
      Sk.ffi.checkArgs('getSamples', arguments, 1);

      samples = [];
      len = sound._sound.getLength();

      for(var i = 0; i < len; i++) {
        samples.push(Sk.misceval.callsim(Sample, sound, Sk.builtin.int_(i)));
      }

      return Sk.builtin.list(samples);
    })
  };

  mod.Sound = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    var onError;

    onError = function (continueWith) {
      return function () {
        continueWith(new Sk.builtin.ValueError('The audio could not be loaded. Is the URL incorrect?'));
      }
    };

    $loc.__init__ = new Sk.builtin.func(function (sound) {
      var arg0, res, arg1, arg2;

      Sk.ffi.checkArgs('__init__', arguments, [2, 3]);

      if(arguments.length === 2) {
        arg0 = arguments[1];

        if(arg0.tp$name === 'Sound') { arg0 = arg0._sound.url; } else { arg0 = Sk.ffi.unwrapo(arg0); }

        res = Sk.future(function (continueWith) {
          new window.pythy.Sound(continueWith, onError(continueWith), arg0);
        }); 
      } else if (arguments.length === 3) {
        arg1 = arguments[1];
        arg2 = arguments[2];
        res = Sk.future(function (continueWith) {
          new window.pythy.Sound(continueWith, onError(continueWith), arg1, arg2);
        });
      }

      if(res instanceof window.pythy.Sound) { sound._sound = res; } else { throw res; }
    });

    $loc.__str__ = new Sk.builtin.func(function(sound) {
      var str;

      Sk.ffi.checkArgs('__str__', arguments, 1);

      str = 'Sound, ';

      if(sound._sound.url) {
        str += 'File: ' + sound._sound.url + ', ';
      }

      return Sk.builtins.str(str + 'Number of samples: ' + sound._sound.getLength());
    });

    $loc.__repr__ = new Sk.builtin.func(function(sound) {
      var str;

      Sk.ffi.checkArgs('__repr__', arguments, 1);

      str = 'Sound, ';

      if(sound._sound.url) {
        str += 'File: ' + sound._sound.url + ', ';
      }

      return Sk.builtins.str(str + 'Number of samples: ' + sound._sound.getLength());
    });

    goog.object.extend($loc, soundWrapper);

  }, 'Sound', []);

  goog.object.extend(mod, soundWrapper);

  goog.object.extend(mod, {
    duplicateSound: new Sk.builtin.func(function (sound) {
      Sk.ffi.checkArgs('duplicateSound', arguments, 1);
      return Sk.misceval.callsim(mod.Sound, sound);
    }),

    makeSound: new Sk.builtin.func(function (url) {
      Sk.ffi.checkArgs('makeSound', arguments, 1);
      return Sk.misceval.callsim(mod.Sound, url);
    }),

    makeEmptySound: new Sk.builtin.func(function (numSamples, samplingRate) {
      Sk.ffi.checkArgs('makeEmptySound', arguments, [1, 2]);
      return Sk.misceval.callsim(mod.Sound, Sk.ffi.unwrapo(numSamples), Sk.ffi.unwrapo(samplingRate) || window.pythy.Sound.SAMPLE_RATE);
    }),

    makeEmptySoundBySeconds: new Sk.builtin.func(function (seconds, samplingRate) {
      var numSamples;

      Sk.ffi.checkArgs('makeEmptySoundBySeconds', arguments, [1, 2]);
      samplingRate = Sk.ffi.unwrapo(samplingRate) || window.pythy.Sound.SAMPLE_RATE;
      numSamples = Sk.ffi.unwrapo(seconds) * samplingRate;
      return Sk.misceval.callsim(mod.Sound, numSamples, samplingRate);
    }),

    openSoundTool: new Sk.builtin.func(function (sound) {
      Sk.ffi.checkArgs('openSoundTool', arguments, 1);
      window.pythy.soundTool.start(sound._sound);
    })
  });

  return mod;
};
