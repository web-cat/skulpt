// Do not include this module directly as has dependencies 
var $builtinmodule = function() {
  var soundWrapper, mod, Snd, SAMPLE_RATE, Sample;

  mod = {};

  SAMPLE_RATE = 22050;

  Sample = Sk.sysmodules.mp$subscript('sound.sample').$d.Sample;

  Snd = function () {
    var type, arg0, arg1;

    this.buffer = null;
    this.channels = [];

    arg0 = Sk.ffi.unwrapo(arguments[0]);
    type = typeof(arg0);

    //TODO more validation on args
    if(type === 'string') {
      this.url = window.mediaffi.customizeMediaURL(arg0);
      this.load();
    } else if(type === 'number') {
      arg1 = Sk.ffi.unwrapo(arguments[1]);
      // NOTE: Pythy supports a maximum of 2 sound channels, so any new empty
      // sound will have 2 channels by default
      this.buffer = __$audioContext$__.createBuffer(2, arg0, arg1 || SAMPLE_RATE);
      for(var i = 0; i < this.buffer.numberOfChannels; i++) {
        this.channels[i] = this.buffer.getChannelData(i);
      }
    } else {
    //TODO: throw exception
    }
  };

  soundWrapper = {
    play : new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('play', arguments, 1);
      sound._sound.play();
    }),

    blockingPlay : new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('blockingPlay', arguments, 1);
      sound._sound.blockingPlay();
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

    setSampleValue : new Sk.builtin.func(function(sound, index, value) {
      Sk.ffi.checkArgs('setSampleValue', arguments, 3);
      sound._sound.setLeftSample(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
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

    getSampleValue : new Sk.builtin.func(function(sound, index) {
      Sk.ffi.checkArgs('getSampleValue', arguments, 2);
      return Sk.builtin.float_(sound._sound.getLeftSample(Sk.ffi.unwrapo(index)));
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
      return Sk.misceval.callsim(mod.Sample, sound, index);
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
    $loc.__init__ = new Sk.builtin.func(function (sound) {
      var arg;

      Sk.ffi.checkArgs('__init__', arguments, [2, 3]);
      if(arguments.length === 2) {
        arg = arguments[1];
        if(arg.tp$name === 'Sound') {
          arg = Sk.builtin.str(arg._sound.url);
        }
        sound._sound = new Snd(arg);
      } else if (arguments.length === 3) {
        sound._sound = new Snd(arguments[1], arguments[2]);
      }
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
      return Sk.misceval.callsim(mod.Sound, numSamples, samplingRate || Sk.builtin.int_(SAMPLE_RATE));
    }),

    makeEmptySoundBySeconds: new Sk.builtin.func(function (seconds, samplingRate) {
      var numSamples;

      Sk.ffi.checkArgs('makeEmptySoundBySeconds', arguments, [1, 2]);
      samplingRate = samplingRate || Sk.builtin.int_(SAMPLE_RATE);
      numSamples = Sk.builtin.int_(Sk.ffi.unwrapo(seconds) * Sk.ffi.unwrapo(samplingRate));
      return Sk.misceval.callsim(mod.Sound, numSamples, samplingRate);
    })
  });

  goog.object.extend(Snd.prototype, {
    load : function (soundUrl) {
      var res;

      res = Sk.future(function (continueWith) {
        var request;

        request = new XMLHttpRequest();

        request.onload = function () {
          __$audioContext$__.decodeAudioData(request.response, continueWith);
        };

        //TODO: Fix this [because server doesn't respond with 404 if not prefixed with http:]
        // Also use jquery ajax instead of xmlhttprequest for now. (it has better error handling)
        request.onerror = request.timeout = function () {
          continueWith(new Sk.builtin.ValueError('The audio could not be ' +
                'loaded. Is the URL incorrect?'));
        };

        request.open('GET', Sk.transformUrl(this.url), true);
        request.responseType = 'arraybuffer';
        request.send();
      }.bind(this));

      if(res instanceof AudioBuffer) {
        this.buffer = res;
        for(var i = 0; i < this.buffer.numberOfChannels; i++) {
          this.channels[i] = this.buffer.getChannelData(i);
        }
      } else {
        throw(res);
      }
    },

    _cloneBuffer : function () {
      var buffer;

      buffer = __$audioContext$__.createBuffer(this.buffer.numberOfChannels, this.buffer.length, this.buffer.sampleRate);
      for(var i = 0; i < this.buffer.numberOfChannels; i++) {
        var toChannel, fromChannel;

        toChannel = buffer.getChannelData(i);
        fromChannel = this.buffer.getChannelData(i);
        for(var j = 0; j < fromChannel.length; j++) {
          toChannel[j] = fromChannel[j];
        }
      }
      return buffer;
    },

    play : function () {
      var source;

      source = __$audioContext$__.createBufferSource();
      //Protects it from being affected by subsequent setSample* modifications
      source.buffer = this._cloneBuffer();
      source.connect(__$audioContext$__.destination);
      source.start(0);
    },

    blockingPlay : function () {
      var source, res;

      source = __$audioContext$__.createBufferSource();
      source.buffer = this.buffer;
      source.connect(__$audioContext$__.destination);

      Sk.future(function(continueWith) {
        source.onended = continueWith;
        source.start(0);
      });

    },

    getDuration : function () {
      return this.buffer.duration;
    },

    getLength : function () {
      return this.buffer.length;
    },

    setLeftSample : function (index, value) {
      this.channels[0][index] = value;
    },

    setRightSample : function (index, value) {
      this.channels[1][index] = value;
    },

    getLeftSample : function (index) {
      return this.channels[0][index]; 
    },

    getRightSample : function (index) {
      return this.channels[1][index]; 
    },

    getSamplingRate: function () {
      return this.buffer.sampleRate;
    }
  });

  return mod;
};
