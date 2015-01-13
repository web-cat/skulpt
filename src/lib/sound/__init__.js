var $builtinmodule = function() {
  var mod, sound, loadSound, initialize, Snd;

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

  Snd = function (url) {
    this.buffer = null;
    this.channels = [];
    this.url = window.mediaffi.customizeMediaURL(Sk.ffi.unwrapo(url));
    this.load();
  };

  Snd.prototype.load = function (soundUrl) {
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
  };

  Snd.prototype._cloneBuffer = function () {
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
  };

  Snd.prototype.play = function () {
    var source;

    source = __$audioContext$__.createBufferSource();
    //Protects it from being affected by subsequent setSample* modifications
    source.buffer = this._cloneBuffer();
    source.connect(__$audioContext$__.destination);
    source.start(0);
  };

  Snd.prototype.blockingPlay = function () {
    var source, res;

    source = __$audioContext$__.createBufferSource();
    source.buffer = this.buffer;
    source.connect(__$audioContext$__.destination);

    Sk.future(function(continueWith) {
      source.onended = continueWith;
      source.start(0);
    });

  };

  Snd.prototype.getDuration = function () {
    return this.buffer.duration;
  };

  Snd.prototype.getNumSample = Snd.prototype.getLength = function () {
    return this.buffer.length;
  };

  Snd.prototype.setSampleValueAt = Snd.prototype.setSampleValue = function (index, value) {
    //FIXME for other channels
    this.channels[0][index] = value;
  };

  Snd.prototype.getSampleValueAt = Snd.prototype.getSampleValue = function (index) {
    //FIXME for other channels
    return this.channels[0][index]; 
  };

  sound = function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, url) {
      Sk.ffi.checkArgs('__init__', arguments, 2);
      self._sound = new Snd(url);
    });

    $loc.play = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__init__', arguments, 1);
      self._sound.play();
    });

    $loc.blockingPlay = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__init__', arguments, 1);
      self._sound.blockingPlay();
    });

    $loc.getDuration = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__init__', arguments, 1);
      return Sk.builtin.int_(self._sound.getDuration());
    });

    $loc.getNumSample = $loc.getLength = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__init__', arguments, 1);
      return Sk.builtin.int_(self._sound.getNumSample());
    });

    $loc.__str__ = $loc.__repr__ = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return Sk.builtins.str('Sound file: ' + self._sound.url + ', Number of samples: ' + self._sound.getLength());
    });

    $loc.setSampleValue = $loc.setSampleValueAt = new Sk.builtin.func(function(self, index, value) {
      Sk.ffi.checkArgs('__str__', arguments, 3);
      self._sound.setSampleValueAt(Sk.ffi.unwrapo(index), Sk.ffi.unwrapo(value));
    });

    $loc.getSampleValue = $loc.getSampleValueAt = new Sk.builtin.func(function(self, index) {
      Sk.ffi.checkArgs('__str__', arguments, 2);
      return Sk.builtin.float_(self._sound.getSampleValueAt(Sk.ffi.unwrapo(index)));
    });
  };

  initialize();

  mod.Sound = Sk.misceval.buildClass(mod, sound, 'Sound', []);

  return mod;
};
