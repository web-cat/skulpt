var $builtinmodule = function() {
  //Skulpt related
  var mod, SAMPLE_RATE;
  //Internal Classes
  var Snd;
  //Internal functions
  var initialize, extendPrototype, extend;

  SAMPLE_RATE = 22050;

  initialize = function () { 
    mod = {};
    /* NOTE: The maximum number of audio contexts is 6 and it looks like everytime a program is 
     * run it executes this file again, so, we need this check to protect against repeated
     * context creation.
     */
    if(!window.__$audioContext$__) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      window.__$audioContext$__ = new AudioContext();
    }
  };

  extendPrototype = function (methods, classFn) {
    for(var name in methods) {
      classFn.prototype[name] = methods[name];
    }
  };

  extend = function (originalObject, newObject) {
    for(key in newObject) {
      originalObject[key] = newObject[key];
    }
  };

  Snd = function () {
    var type;

    this.buffer = null;
    this.channels = [];

    type = typeof(arguments[0]);

    if(type === 'string') {
      this.url = window.mediaffi.customizeMediaURL(Sk.ffi.unwrapo(arguments[0]));
      this.load();
    } else if(type === 'object') {
      this.url = arguments[0]._sound.url;
      this.load();
    } else if(type === 'number') {
      //FIXME how many channels should it have?
      this.buffer = __$audioContext$__.createBuffer(1, arguments[0], arguments[1] || SAMPLE_RATE);
      for(var i = 0; i < this.buffer.numberOfChannels; i++) {
        this.channels[i] = this.buffer.getChannelData(i);
      }
    } else {
      //TODO: throw exception
    }
  };

  extendPrototype({
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

    setSampleValue : function (index, value) {
      //FIXME for other channels
      this.channels[0][index] = value;
    },

    getSampleValue : function (index) {
      //FIXME for other channels
      return this.channels[0][index]; 
    }
  }, Snd);

  initialize();

  mod.Sample = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, sound, index) {
      Sk.ffi.checkArgs('__init__', arguments, 3);
      self._sound = sound;
      self._internalSound = sound._sound;
      self._index = Sk.ffi.unwrapo(index);
    });

    $loc.getSound = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getSound', arguments, 1);
      return self._sound;
    });

    $loc.getValue = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getValue', arguments, 1);
      return Sk.builtin.float_(self._internalSound.getSampleValue(self._index));
    });

    $loc.setValue = new Sk.builtin.func(function (self, value) {
      Sk.ffi.checkArgs('setValue', arguments, 2);
      self._internalSound.setSampleValue(self._index, Sk.ffi.unwrapo(value));
    });

    $loc.__str__ = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return Sk.builtin.str('Sample at ' + self._index + ' with value ' +
                            self._internalSound.getSampleValue(self._index));
    });

    $loc.__repr__ = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('__repr__', arguments, 1);
      return Sk.builtin.str('Sample at ' + self._index + ' with value ' +
                            self._internalSound.getSampleValue(self._index));
    });
  }, 'Sample', []);

  mod.Sound = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('__init__', arguments, [1, 2]);
      if(arguments.length === 2) {
        self._sound = new Snd(arguments[1]);
      } else if (arguments.length === 3) {
        self._sound = new Snd(arguments[1], arguments[2]);
      }
    });

    $loc.play = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('play', arguments, 1);
      self._sound.play();
    });

    $loc.blockingPlay = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('blockingPlay', arguments, 1);
      self._sound.blockingPlay();
    });

    $loc.getDuration = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getDuration', arguments, 1);
      return Sk.builtin.int_(self._sound.getDuration());
    });

    $loc.getNumSample = $loc.getLength = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getNumSample', arguments, 1);
      return Sk.builtin.int_(self._sound.getLength());
    });

    $loc.__str__ = $loc.__repr__ = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return Sk.builtins.str('Sound file: ' + self._sound.url + ', Number of samples: ' + self._sound.getLength());
    });

    $loc.setSampleValue = new Sk.builtin.func(function(self, index, value) {
      Sk.ffi.checkArgs('setSampleValue', arguments, 3);
      self._sound.setSampleValue(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
    });

    $loc.setSampleValueAt = new Sk.builtin.func(function(self, index, value) {
      Sk.ffi.checkArgs('setSampleValueAt', arguments, 3);
      self._sound.setSampleValue(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
    });

    $loc.getSampleValue = new Sk.builtin.func(function(self, index) {
      Sk.ffi.checkArgs('getSampleValue', arguments, 2);
      return Sk.builtin.float_(self._sound.getSampleValue(Sk.ffi.unwrapo(index)));
    });

    $loc.getSampleValueAt = new Sk.builtin.func(function(self, index) {
      Sk.ffi.checkArgs('getSampleValueAt', arguments, 2);
      return Sk.builtin.float_(self._sound.getSampleValue(Sk.ffi.unwrapo(index)));
    });

    $loc.getSampleObjectAt = new Sk.builtin.func(function (self, index) {
      Sk.ffi.checkArgs('getSampleObjectAt', arguments, 2);
      return Sk.misceval.callsim(mod.Sample, self, index);
    });

    $loc.getSamples = new Sk.builtin.func(function (self) {
      var samples, len;
    
      Sk.ffi.checkArgs('getSamples', arguments, 1);

      samples = [];
      len = self._sound.getLength();

      for(var i = 0; i < len; i++) {
        samples.push(Sk.misceval.callsim(mod.Sample, self, Sk.builtin.int_(i)));
      }

      return Sk.builtin.list(samples);
    });
  }, 'Sound', []);

  extend(mod, {
    play: new Sk.builtin.func(function (sound) {
      Sk.ffi.checkArgs('play', arguments, 1);
      sound._sound.play();
    }),

    blockingPlay: new Sk.builtin.func(function (sound) {
      Sk.ffi.checkArgs('blockingPlay', arguments, 1);
      sound._sound.blockingPlay();
    }),

    getDuration: new Sk.builtin.func(function (sound) {
      Sk.ffi.checkArgs('getDuration', arguments, 1);
      return Sk.builtin.int_(self._sound.getDuration());
    }),

    getNumSample: new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('getNumSample', arguments, 1);
      return Sk.builtin.int_(sound._sound.getLength());
    }),

    getLength: new Sk.builtin.func(function(sound) {
      Sk.ffi.checkArgs('getLength', arguments, 1);
      return Sk.builtin.int_(sound._sound.getLength());
    }),

    setSampleValue: new Sk.builtin.func(function(sound, index, value) {
      Sk.ffi.checkArgs('setSampleValue', arguments, 3);
      sound._sound.setSampleValue(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
    }),

    setSampleValueAt: new Sk.builtin.func(function(sound, index, value) {
      Sk.ffi.checkArgs('setSampleValueAt', arguments, 3);
      sound._sound.setSampleValue(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
    }),

    getSampleValue : new Sk.builtin.func(function(sound, index) {
      Sk.ffi.checkArgs('getSampleValue', arguments, 2);
      return Sk.builtin.float_(sound._sound.getSampleValue(Sk.ffi.unwrapo(index)));
    }),

    getSampleValueAt : new Sk.builtin.func(function(sound, index) {
      Sk.ffi.checkArgs('getSampleValueAt', arguments, 2);
      return Sk.builtin.float_(sound._sound.getSampleValue(Sk.ffi.unwrapo(index)));
    }),

    getSampleObjectAt : new Sk.builtin.func(function (sound, index) {
      Sk.ffi.checkArgs('getSampleObjectAt', arguments, 2);
      return Sk.misceval.callsim(mod.Sample, sound, index);
    }),

    getSamples = new Sk.builtin.func(function (sound) {
      Sk.ffi.checkArgs('getSamples', arguments, 1);
      var samples, len;
    
      samples = [];
      len = sound._sound.getLength();

      for(var i = 0; i < len; i++) {
        samples.push(Sk.misceval.callsim(mod.Sample, sound, Sk.builtin.int_(i)));
      }

      return Sk.builtin.list(samples);
    }),

    getSound : new Sk.builtin.func(function (sample) {
      Sk.ffi.checkArgs('getSound', arguments, 1);
      return sample._sound;
    }),

    getValue : new Sk.builtin.func(function (sample) {
      Sk.ffi.checkArgs('getValue', arguments, 1);
      return Sk.builtin.float_(sample._internalSound.getSampleValue(sample._index));
    }),

    setValue : new Sk.builtin.func(function (sample, value) {
      Sk.ffi.checkArgs('setValue', arguments, 2);
      sample._internalSound.setSampleValue(sample._index, Sk.ffi.unwrapo(value));
    }),

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
      samplingRate = samplingRate || SAMPLE_RATE;
      return Sk.misceval.callsim(mod.Sound, numSamples, samplingRate);
    }),

    makeEmptySoundBySeconds: new Sk.builtin.func(function (seconds, samplingRate) {
      Sk.ffi.checkArgs('makeEmptySoundBySeconds', arguments, [1, 2]);
      samplingRate = samplingRate || SAMPLE_RATE;
      return Sk.misceval.callsim(mod.Sound, seconds * samplingRate, samplingRate);
    }),
  });

  return mod;
};
