describe('Sound', function () {
  var mod, TIMEOUT, doAfterSometime, asyncIt;

  TIMEOUT = 20;
  doAfterSometime = function (func) { window.setTimeout(func, TIMEOUT); };
  window.soundMod = $builtinmodule;

  beforeEach(function () {
    mod = new window.soundMod();
  });

  asyncIt = function (testDescription, func) {
    it(testDescription, function (done) {
      doAfterSometime(function () {
        func();
        done();
      });
    });
  };

  describe('__init__', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(Sk.future, 'continueWith');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should take a url', function (done) {
      doAfterSometime(function () {
        var execFunc;

        execFunc = function () { new mod.Sound(); };
        assert.throws(execFunc, '__init__() takes between 2 and 3 positional arguments but 1 was given');

        execFunc = function () { new mod.Sound(new Sk.builtin.str('./sounds/test_stereo.wav')); }
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

        doAfterSometime(function () {
          var args;

          assert.isTrue(spy.calledOnce);
          args = spy.getCall(0).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], window.pythy.Sound);
          assert.strictEqual(args[0].getLength(), 88471);
          done();
        });
      });
    });

    it('should take number of samples and sampling rate optionally', function (done) {
      doAfterSometime(function () {
        var execFunc;

        execFunc = function () { new mod.Sound(); };
        assert.throws(execFunc, '__init__() takes between 2 and 3 positional arguments but 1 was given');

        execFunc = function () { new mod.Sound(23); }
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

        execFunc = function () { new mod.Sound(430, 3000); }
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

        doAfterSometime(function () {
          var args;

          assert.isTrue(spy.calledTwice); //Once for the error and twice for success
          args = spy.getCall(0).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], window.pythy.Sound);
          assert.strictEqual(args[0].getLength(), 23);
          assert.strictEqual(args[0].getSamplingRate(), 44100);
          args = spy.getCall(1).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], window.pythy.Sound);
          assert.strictEqual(args[0].getLength(), 430);
          assert.strictEqual(args[0].getSamplingRate(), 3000);
          done();
        });
      });
    });

    it('should take another sound', function (done) {
      doAfterSometime(function () {
        var sound1, stub;

        spy.restore();
        spy = sinon.stub(Sk.future, 'continueWith', function (snd) { sound1._sound = snd; });
        sound1 = new mod.Sound('./sounds/test_mono.wav');

        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { new mod.Sound(sound1); };
          assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
          done();
        });
      });
    });

    asyncIt('should not allow creation of sounds longer than 600s', function () {
      var execFunc;

      execFunc = function () { new mod.Sound(26504100); };
      assert.throws(execFunc, Sk.builtin.ValueError, 'Duration can not be greater than 600 seconds');
    });

    asyncIt('should not allow negative sample length', function () {
      var execFunc;

      execFunc = function () { new mod.Sound(-10); };
      assert.throws(execFunc, Sk.builtin.ValueError, 'Number of samples can not be negative');
    });

    asyncIt('should not allow negative sampling rate', function () {
      var execFunc;

      execFunc = function () { new mod.Sound(10, -10); };
      assert.throws(execFunc, Sk.builtin.ValueError, 'Sampling rate can not be negative');
    });

    it('should indicate an error when something goes wrong', function (done) {
      doAfterSometime(function () {
        var args;

        new mod.Sound('a');

        doAfterSometime(function () {
          assert.isTrue(spy.calledOnce);
          args = spy.getCall(0).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], Sk.builtin.ValueError);
          assert.strictEqual(args[0].message, 'File not found. Is the URL incorrect?');
          spy.restore();
          done();
        });
      });
    });
  });

  describe('__str__', function () {
    it('should take a sound', function (done) {
      doAfterSometime(function () {
        var sound;

        sound = new mod.Sound(23);

        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { sound.__str__(); };
          assert.throws(execFunc, Sk.builtin.TypeError, '__str__() takes 1 positional arguments but 0 were given');

          execFunc = function () { sound.__str__(sound); };
          assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
          done();
        });
      });
    });

    it('should yield a descriptive string with the classname and number of samples', function (done) {
      doAfterSometime(function () {
        var sound;

        sound = new mod.Sound(23);

        doAfterSometime(function () {
          var str;

          str = sound.__str__(sound);
          assert.instanceOf(str, Sk.builtin.str);
          assert.strictEqual(str.getValue(), 'Sound, Number of samples: 23');
          done();
        });
      });
    });

    it('should yield a descriptive string with the classname, the url, and number of samples', function (done) {
      doAfterSometime(function () {
        var sound, stub;

        stub = sinon.stub(Sk.future, 'continueWith', function (snd) {
          sound._sound = snd;
        });
        sound = new mod.Sound('./sounds/test_mono.wav');

        doAfterSometime(function () {
          var str;

          str = sound.__str__(sound);
          assert.instanceOf(str, Sk.builtin.str);
          assert.strictEqual(str.getValue(), 'Sound, File: ./sounds/test_mono.wav, Number of samples: 25682');
          stub.restore();
          done();
        });
      });
    });
  });

  describe('__repr__', function () {
    it('should take a sound', function (done) {
      doAfterSometime(function () {
        var sound;

        sound = new mod.Sound(23);

        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { sound.__repr__(); };
          assert.throws(execFunc, Sk.builtin.TypeError, '__repr__() takes 1 positional arguments but 0 were given');

          execFunc = function () { sound.__repr__(sound); };
          assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
          done();
        });
      });
    });

    it('should yield a descriptive string with the classname and number of samples', function (done) {
      doAfterSometime(function () {
        var sound;

        sound = new mod.Sound(23);

        doAfterSometime(function () {
          var str;

          str = sound.__repr__(sound);
          assert.instanceOf(str, Sk.builtin.str);
          assert.strictEqual(str.getValue(), 'Sound, Number of samples: 23');
          done();
        });
      });
    });

    it('should yield a descriptive string with the classname, the url, and number of samples', function (done) {
      doAfterSometime(function () {
        var sound, stub;

        stub = sinon.stub(Sk.future, 'continueWith', function (snd) {
          sound._sound = snd;
        });
        sound = new mod.Sound('./sounds/test_mono.wav');

        doAfterSometime(function () {
          var str;

          str = sound.__repr__(sound);
          assert.instanceOf(str, Sk.builtin.str);
          assert.strictEqual(str.getValue(), 'Sound, File: ./sounds/test_mono.wav, Number of samples: 25682');
          stub.restore();
          done();
        });
      });
    });
  });

  describe('writeSoundTo', function () {
    it('should take a sound and a path', function (done) {
      doAfterSometime(function () {
        var sound, stub1, stub2;

        stub1 = sinon.stub(Sk.future, 'continueWith', function (snd) {
          sound._sound = snd;
        });

        stub2 = sinon.stub(window.pythy.Sound.prototype, 'save');

        sound = new mod.Sound('./sounds/test_mono.wav');

        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.writeSoundTo() };
          assert.throws(execFunc, Sk.builtin.TypeError, 'writeSoundTo() takes 2 positional arguments but 0 were given');

          execFunc = function () { mod.writeSoundTo(sound) };
          assert.throws(execFunc, Sk.builtin.TypeError, 'writeSoundTo() takes 2 positional arguments but 1 was given');

          execFunc = function () { mod.writeSoundTo(sound, 'name') };
          assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

          stub1.restore();
          stub2.restore();
          done();
        });
      });
    });

    it('should call save on the sound', function (done) {
      doAfterSometime(function () {
        var sound, stub1, stub2;

        stub1 = sinon.stub(Sk.future, 'continueWith', function (snd) {
          sound._sound = snd;
        });

        stub2 = sinon.stub(window.pythy.Sound.prototype, 'save');

        sound = new mod.Sound('./sounds/test_mono.wav');

        doAfterSometime(function () {
          var args;

          mod.writeSoundTo(sound, 'name'); 

          assert.isTrue(stub2.calledOnce);
          args = stub2.getCall(0).args;
          assert.lengthOf(args, 2);
          assert.strictEqual(args[0], 'name');
          stub1.restore();
          stub2.restore();
          done();
        });
      });
    });
  });

  describe('stopPlaying', function () {

    describe('procedural', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.stopPlaying(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'stopPlaying() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.stopPlaying(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the stop method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'stop');

            mod.stopPlaying(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });
    });

    describe('object oriented', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.stopPlaying(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'stopPlaying() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.stopPlaying(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the stop method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'stop');

            sound.stopPlaying(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });
    });
  });

  describe('play', function () {
    describe('procedural', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.play(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'play() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.play(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the play method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'play');

            mod.play(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });
    });

    describe('object oriented', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.play(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'play() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.play(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the play method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'play');

            sound.play(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });
    });
  });

  describe('blockingPlay', function () {
    describe('procedural', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.blockingPlay(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'blockingPlay() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.blockingPlay(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the play method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'play');

            mod.blockingPlay(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      it('should not allow any other song to play at the same time', function (done) {
        doAfterSometime(function () {
          var sound, spy;
          sound = new mod.Sound(2000); 

          spy = sinon.spy(Sk.future, 'continueWith');
          mod.blockingPlay(sound);

          window.setTimeout(function () {
            var args;

            assert.isTrue(spy.calledOnce);
            args = spy.getCall(0).args;
            assert.lengthOf(args, 1);
            assert.instanceOf(args[0], Event);
            assert.strictEqual(args[0].type, 'ended');
            spy.restore();
            done();
          }, sound.getDuration(sound).getValue() * 1000 + TIMEOUT);
        });
      });
    });

    describe('object oriented', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.blockingPlay(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'blockingPlay() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.blockingPlay(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the play method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'play');

            sound.blockingPlay(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      it('should not allow any other song to play at the same time', function (done) {
        doAfterSometime(function () {
          var sound, spy;
          sound = new mod.Sound(2000); 

          spy = sinon.spy(Sk.future, 'continueWith');
          sound.blockingPlay(sound);

          window.setTimeout(function () {
            var args;

            assert.isTrue(spy.calledOnce);
            args = spy.getCall(0).args;
            assert.lengthOf(args, 1);
            assert.instanceOf(args[0], Event);
            assert.strictEqual(args[0].type, 'ended');
            spy.restore();
            done();
          }, sound.getDuration(sound).getValue() * 1000 + TIMEOUT);
        });
      });
    });
  });

  describe('getDuration', function () {
    describe('procedural', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.getDuration(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getDuration() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.getDuration(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the getDuration method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'getDuration');

            mod.getDuration(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      asyncIt('should return the duration of the sound', function () {
        var sound, duration;

        sound = new mod.Sound(2000); 
        duration = mod.getDuration(sound);

        assert.instanceOf(duration, Sk.builtin.float_);
        assert.closeTo(duration.getValue(), 0.04535, 0.0001);
      });
    });

    describe('object oriented', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.getDuration(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getDuration() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.getDuration(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the getDuration method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'getDuration');

            sound.getDuration(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      asyncIt('should return the duration of the sound', function () {
        var sound, duration;

        sound = new mod.Sound(2000); 
        duration = sound.getDuration(sound);

        assert.instanceOf(duration, Sk.builtin.float_);
        assert.closeTo(duration.getValue(), 0.04535, 0.0001);
      });
    });
  });

  describe('getNumSamples', function () {
    describe('procedural', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.getNumSamples(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getNumSamples() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.getNumSamples(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the getLength method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'getLength');

            mod.getNumSamples(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      asyncIt('should return the number of samples of the sound', function () {
        var sound, numSamples;

        sound = new mod.Sound(2000); 
        numSamples = mod.getNumSamples(sound);

        assert.instanceOf(numSamples, Sk.builtin.int_);
        assert.strictEqual(numSamples.getValue(), 2000);
      });
    });

    describe('object oriented', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.getNumSamples(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getNumSamples() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.getNumSamples(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the getLength method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'getLength');

            sound.getNumSamples(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      asyncIt('should return the number of samples of the sound', function () {
        var sound, numSamples;

        sound = new mod.Sound(2000); 
        numSamples = sound.getNumSamples(sound);

        assert.instanceOf(numSamples, Sk.builtin.int_);
        assert.strictEqual(numSamples.getValue(), 2000);
      });
    });
  });

  describe('getLength', function () {
    describe('procedural', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.getLength(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getLength() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.getLength(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the getLength method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'getLength');

            mod.getLength(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      asyncIt('should return the number of samples of the sound', function () {
        var sound, length;

        sound = new mod.Sound(2000); 
        length = mod.getLength(sound);

        assert.instanceOf(length, Sk.builtin.int_);
        assert.strictEqual(length.getValue(), 2000);
      });
    });

    describe('object oriented', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.getLength(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getLength() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.getLength(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the getLength method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'getLength');

            sound.getLength(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      asyncIt('should return the number of samples of the sound', function () {
        var sound, length;

        sound = new mod.Sound(2000); 
        length = sound.getLength(sound);

        assert.instanceOf(length, Sk.builtin.int_);
        assert.strictEqual(length.getValue(), 2000);
      });
    });
  });

  describe('getSamplingRate', function () {
    describe('procedural', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.getSamplingRate(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getSamplingRate() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.getSamplingRate(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the getSamplingRate method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'getSamplingRate');

            mod.getSamplingRate(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      asyncIt('should return the sampling rate of the sound', function () {
        var sound, length;

        sound = new mod.Sound(2000, 3050); 
        length = mod.getSamplingRate(sound);

        assert.instanceOf(length, Sk.builtin.int_);
        assert.strictEqual(length.getValue(), 3050);

        sound = new mod.Sound(2000); 
        length = mod.getSamplingRate(sound);

        assert.instanceOf(length, Sk.builtin.int_);
        assert.strictEqual(length.getValue(), 44100);
      });
    });

    describe('object oriented', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.getSamplingRate(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getSamplingRate() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.getSamplingRate(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
            done();
          });
        });
      });

      it('should call the getSamplingRate method of the underlying sound', function (done) {
        doAfterSometime(function () {
          var sound;
          sound = new mod.Sound(20); 

          doAfterSometime(function () {
            var execFunc, stub;

            stub = sinon.stub(window.pythy.Sound.prototype, 'getSamplingRate');

            sound.getSamplingRate(sound);

            assert.isTrue(stub.calledOnce);

            stub.restore();
            done();
          });
        });
      });

      asyncIt('should return the sampling rate of the sound', function () {
        var sound, length;

        sound = new mod.Sound(2000, 3050); 
        length = sound.getSamplingRate(sound);

        assert.instanceOf(length, Sk.builtin.int_);
        assert.strictEqual(length.getValue(), 3050);

        sound = new mod.Sound(2000); 
        length = sound.getSamplingRate(sound);

        assert.instanceOf(length, Sk.builtin.int_);
        assert.strictEqual(length.getValue(), 44100);
      });
    });
  });

  describe('getSampleValueAt', function () {
    describe('procedural', function () {
      asyncIt('should take the sound and the index', function () {
        var execFunc;

        sound = new mod.Sound(200);

        execFunc = function () { mod.getSampleValueAt(); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleValueAt() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.getSampleValueAt(sound); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleValueAt() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.getSampleValueAt(sound, 12); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
      });

      it('should only take indices within the range', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd; });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.getSampleValueAt(sound, -1) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and ' + mod.getLength(sound).getValue());

            execFunc = function () { mod.getSampleValueAt(sound, 99999999) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            execFunc = function () { mod.getSampleValueAt(sound, 25682) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            stub.restore();
            done();
          });
        });
      });

      it('should return the sample value', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd; });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var sampleValue;

            sampleValue = mod.getSampleValueAt(sound, 1000);
            assert.instanceOf(sampleValue, Sk.builtin.int_);
            assert.strictEqual(sampleValue.getValue(), 10864);
            stub.restore();
            done();
          });
        });
      });
    });

    describe('object oriented', function () {
      asyncIt('should take the sound and the index', function () {
        var execFunc;

        sound = new mod.Sound(200);

        execFunc = function () { sound.getSampleValueAt(); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleValueAt() takes 2 positional arguments but 0 were given');

        execFunc = function () { sound.getSampleValueAt(sound); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleValueAt() takes 2 positional arguments but 1 was given');

        execFunc = function () { sound.getSampleValueAt(sound, 12); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
      });

      it('should only take indices within the range', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd; });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.getSampleValueAt(sound, -1) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            execFunc = function () { sound.getSampleValueAt(sound, 99999999) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            execFunc = function () { sound.getSampleValueAt(sound, 25682) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            stub.restore();
            done();
          });
        });
      });

      it('should return the sample value', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd; });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var sampleValue;

            sampleValue = sound.getSampleValueAt(sound, 1000);
            assert.instanceOf(sampleValue, Sk.builtin.int_);
            assert.strictEqual(sampleValue.getValue(), 10864);
            stub.restore();
            done();
          });
        });
      });
    });
  });

  describe('getSampleObjectAt', function () {
    describe('procedural', function () {
      asyncIt('should take the sound and the index', function () {
        var execFunc;

        sound = new mod.Sound(200);

        execFunc = function () { mod.getSampleObjectAt(); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleObjectAt() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.getSampleObjectAt(sound); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleObjectAt() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.getSampleObjectAt(sound, 12); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
      });

      it('should only take indices within the range', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd; });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.getSampleObjectAt(sound, -1) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and ' + mod.getLength(sound).getValue());

            execFunc = function () { mod.getSampleObjectAt(sound, 99999999) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            execFunc = function () { mod.getSampleObjectAt(sound, 25682) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            stub.restore();
            done();
          });
        });
      });

      it('should return the sample object', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd; });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var sampleValue;

            sampleValue = mod.getSampleObjectAt(sound, 1000);
            assert.strictEqual(sampleValue.tp$name, 'Sample');
            stub.restore();
            done();
          });
        });
      });
    });

    describe('object oriented', function () {
      asyncIt('should take the sound and the index', function () {
        var execFunc;

        sound = new mod.Sound(200);

        execFunc = function () { sound.getSampleObjectAt(); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleObjectAt() takes 2 positional arguments but 0 were given');

        execFunc = function () { sound.getSampleObjectAt(sound); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleObjectAt() takes 2 positional arguments but 1 was given');

        execFunc = function () { sound.getSampleObjectAt(sound, 12); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
      });

      it('should only take indices within the range', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd; });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.getSampleObjectAt(sound, -1) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            execFunc = function () { sound.getSampleObjectAt(sound, 99999999) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            execFunc = function () { sound.getSampleObjectAt(sound, 25682) };
            assert.throws(execFunc, Sk.builtin.ValueError, 'Index must have a value between 0 and 25682');

            stub.restore();
            done();
          });
        });
      });

      it('should return the sample object', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd; });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var sampleValue;

            sampleValue = sound.getSampleObjectAt(sound, 1000);
            assert.strictEqual(sampleValue.tp$name, 'Sample');
            stub.restore();
            done();
          });
        });
      });
    });
  });

  describe('setSampleValueAt', function () {
    describe('procedural', function () {
      it('should take the sound, the index and the value', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.setSampleValueAt(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValueAt() takes 3 positional arguments but 0 were given');

            execFunc = function () { mod.setSampleValueAt(sound); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValueAt() takes 3 positional arguments but 1 was given');

            execFunc = function () { mod.setSampleValueAt(sound, 10); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValueAt() takes 3 positional arguments but 2 were given');

            execFunc = function () { mod.setSampleValueAt(sound, 10, new Sk.builtin.int_(90)); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

            stub.restore();
            done();
          });
        });
      });

      it('should cap values outside the range -32768 to 32767', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.setSampleValueAt(sound, 10, 0); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'Value must be an integer');

            mod.setSampleValueAt(sound, 10, new Sk.builtin.int_(-40000));
            assert.strictEqual(mod.getSampleValueAt(sound, 10).getValue(), -32768);

            mod.setSampleValueAt(sound, 10, new Sk.builtin.int_(40000));
            assert.strictEqual(mod.getSampleValueAt(sound, 10).getValue(), 32767);

            stub.restore();
            done();
          });
        });
      });

      it('should set the sample at the given index to the given value', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            assert.strictEqual(mod.getSampleValueAt(sound, 1008).getValue(), 9081);
            mod.setSampleValueAt(sound, 1008, new Sk.builtin.int_(-100));
            assert.strictEqual(mod.getSampleValueAt(sound, 1008).getValue(), -100);
            stub.restore();
            done();
          });
        });
      });
    });

    describe('object oriented', function () {
      it('should take the sound, the index and the value', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.setSampleValueAt(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValueAt() takes 3 positional arguments but 0 were given');

            execFunc = function () { sound.setSampleValueAt(sound); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValueAt() takes 3 positional arguments but 1 was given');

            execFunc = function () { sound.setSampleValueAt(sound, 10); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValueAt() takes 3 positional arguments but 2 were given');

            execFunc = function () { sound.setSampleValueAt(sound, 10, new Sk.builtin.int_(90)); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

            stub.restore();
            done();
          });
        });
      });

      it('should cap values outside the range -32768 to 32767', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.setSampleValueAt(sound, 10, 0); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'Value must be an integer');

            sound.setSampleValueAt(sound, 10, new Sk.builtin.int_(-40000));
            assert.strictEqual(mod.getSampleValueAt(sound, 10).getValue(), -32768);

            sound.setSampleValueAt(sound, 10, new Sk.builtin.int_(40000));
            assert.strictEqual(mod.getSampleValueAt(sound, 10).getValue(), 32767);

            stub.restore();
            done();
          });
        });
      });

      it('should set the sample at the given index to the given value', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            assert.strictEqual(sound.getSampleValueAt(sound, 1008).getValue(), 9081);
            sound.setSampleValueAt(sound, 1008, new Sk.builtin.int_(-100));
            assert.strictEqual(sound.getSampleValueAt(sound, 1008).getValue(), -100);
            stub.restore();
            done();
          });
        });
      });
    });
  });

  describe('getSamples', function () {
    describe('procedural', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.getSamples(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getSamples() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.getSamples(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

            stub.restore();
            done();
          });
        });
      });

      it('should return an array of samples', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var samples, array; 

            samples = mod.getSamples(sound);
            assert.instanceOf(samples, Sk.builtin.list);
            array = samples.getValue();
            assert.lengthOf(array, mod.getLength(sound).getValue());
            assert.strictEqual(array[0].tp$name, 'Sample');
            stub.restore();
            done();
          });
        });
      });
    });

    describe('object oriented', function () {
      it('should take the sound', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.getSamples(); };
            assert.throws(execFunc, Sk.builtin.TypeError, 'getSamples() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.getSamples(sound); };
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

            stub.restore();
            done();
          });
        });
      });

      it('should return an array of samples', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var samples, array; 

            samples = sound.getSamples(sound);
            assert.instanceOf(samples, Sk.builtin.list);
            array = samples.getValue();
            assert.lengthOf(array, sound.getLength(sound).getValue());
            assert.strictEqual(array[0].tp$name, 'Sample');
            stub.restore();
            done();
          });
        });
      });
    });
  });

  describe('duplicateSound/duplicate', function () {
    describe('procedural', function () {
      it('should take a sound', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { mod.duplicateSound(); }
            assert.throws(execFunc, Sk.builtin.TypeError, 'duplicateSound() takes 1 positional arguments but 0 were given');

            execFunc = function () { mod.duplicateSound(sound); }
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

            stub.restore();
            done();
          });
        });
      });

      it('should produce a duplicate sound', function (done) {
        doAfterSometime(function () {
          var sound1, stub, soundCmp;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound1._sound = snd });
          sound1 = new mod.Sound('./sounds/test_mono.wav');
          soundCmp = function (s1, s2) {
            for(var i = 0; i < s1.getLength(s1); i++) {
              if(s1.getLeftSample(s1, i) !== s2.getLeftSample(s2, i) || s1.getRightSample(s1, i) !== s2.getRightSample(s2, i)) {
                return false;
              };
            } 
            return true;
          };

          doAfterSometime(function () {
            var sound2, _sound2;

            stub.restore();
            stub = sinon.stub(Sk.future, 'continueWith', function (snd) { _sound2 = snd });
            sound2 = mod.duplicateSound(sound1); 

            doAfterSometime(function () {
              sound2._sound = _sound2;
              assert.notStrictEqual(sound1, sound2);
              assert.strictEqual(sound2.tp$name, 'Sound');
              assert.strictEqual(sound1.getLength(sound1).getValue(), sound2.getLength(sound2).getValue());
              assert.isTrue(soundCmp(sound1, sound2));
              stub.restore();
              done();
            });
          });
        });
      });
    });

    describe('object oriented', function () {
      it('should take a sound', function (done) {
        doAfterSometime(function () {
          var sound, stub;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound._sound = snd });
          sound = new mod.Sound('./sounds/test_mono.wav');

          doAfterSometime(function () {
            var execFunc;

            execFunc = function () { sound.duplicate(); }
            assert.throws(execFunc, Sk.builtin.TypeError, 'duplicate() takes 1 positional arguments but 0 were given');

            execFunc = function () { sound.duplicate(sound); }
            assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

            stub.restore();
            done();
          });
        });
      });

      it('should produce a duplicate sound', function (done) {
        doAfterSometime(function () {
          var sound1, stub, soundCmp;

          stub = sinon.stub(Sk.future, 'continueWith', function (snd) { sound1._sound = snd });
          sound1 = new mod.Sound('./sounds/test_mono.wav');
          soundCmp = function (s1, s2) {
            for(var i = 0; i < s1.getLength(s1); i++) {
              if(s1.getLeftSample(s1, i) !== s2.getLeftSample(s2, i) || s1.getRightSample(s1, i) !== s2.getRightSample(s2, i)) {
                return false;
              };
            } 
            return true;
          };

          doAfterSometime(function () {
            var sound2, _sound2;

            stub.restore();
            stub = sinon.stub(Sk.future, 'continueWith', function (snd) { _sound2 = snd });
            sound2 = sound.duplicate(sound1); 

            doAfterSometime(function () {
              sound2._sound = _sound2;
              assert.notStrictEqual(sound1, sound2);
              assert.strictEqual(sound2.tp$name, 'Sound');
              assert.strictEqual(sound1.getLength(sound1).getValue(), sound2.getLength(sound2).getValue());
              assert.isTrue(soundCmp(sound1, sound2));
              stub.restore();
              done();
            });
          });
        });
      });
    });
  });

  describe('makeSound', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(Sk.future, 'continueWith');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should take a url', function (done) {
      doAfterSometime(function () {
        var execFunc;

        execFunc = function () { mod.makeSound(); };
        assert.throws(execFunc, 'makeSound() takes 1 positional arguments but 0 were given');

        execFunc = function () { mod.makeSound(new Sk.builtin.str('./sounds/test_stereo.wav')); }
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

        doAfterSometime(function () {
          var args;

          assert.isTrue(spy.calledOnce);
          args = spy.getCall(0).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], window.pythy.Sound);
          assert.strictEqual(args[0].getLength(), 88471);
          done();
        });
      });
    });

    it('should indicate an error when something goes wrong', function (done) {
      doAfterSometime(function () {
        var args;

        new mod.Sound('a');

        doAfterSometime(function () {
          assert.isTrue(spy.calledOnce);
          args = spy.getCall(0).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], Sk.builtin.ValueError);
          assert.strictEqual(args[0].message, 'File not found. Is the URL incorrect?');
          spy.restore();
          done();
        });
      });
    });
  });

  describe('makeEmptySound', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(Sk.future, 'continueWith');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should take number of samples and sampling rate optionally', function (done) {
      doAfterSometime(function () {
        var execFunc;

        execFunc = function () { mod.makeEmptySound(); };
        assert.throws(execFunc, 'makeEmptySound() takes between 1 and 2 positional arguments but 0 were given');

        execFunc = function () { mod.makeEmptySound(23); }
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

        execFunc = function () { mod.makeEmptySound(430, 3000); }
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

        doAfterSometime(function () {
          var args;

          assert.isTrue(spy.calledTwice); //Once for the error and twice for success
          args = spy.getCall(0).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], window.pythy.Sound);
          assert.strictEqual(args[0].getLength(), 23);
          assert.strictEqual(args[0].getSamplingRate(), 44100);
          args = spy.getCall(1).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], window.pythy.Sound);
          assert.strictEqual(args[0].getLength(), 430);
          assert.strictEqual(args[0].getSamplingRate(), 3000);
          done();
        });
      });
    });

    asyncIt('should not allow creation of sounds longer than 600s', function () {
      var execFunc;

      execFunc = function () { mod.makeEmptySound(26504100); };
      assert.throws(execFunc, Sk.builtin.ValueError, 'Duration can not be greater than 600 seconds');
    });

    asyncIt('should not allow negative sample length', function () {
      var execFunc;

      execFunc = function () { mod.makeEmptySound(-10); };
      assert.throws(execFunc, Sk.builtin.ValueError, 'Number of samples can not be negative');
    });

    asyncIt('should not allow negative sampling rate', function () {
      var execFunc;

      execFunc = function () { mod.makeEmptySound(10, -10); };
      assert.throws(execFunc, Sk.builtin.ValueError, 'Sampling rate can not be negative');
    });
  });

  describe('makeEmptySoundBySeconds', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(Sk.future, 'continueWith');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should take duration and sampling rate optionally', function (done) {
      doAfterSometime(function () {
        var execFunc;

        execFunc = function () { mod.makeEmptySoundBySeconds(); };
        assert.throws(execFunc, 'makeEmptySoundBySeconds() takes between 1 and 2 positional arguments but 0 were given');

        execFunc = function () { mod.makeEmptySoundBySeconds(23); }
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

        execFunc = function () { mod.makeEmptySoundBySeconds(430, 3000); }
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);

        doAfterSometime(function () {
          var args;

          assert.isTrue(spy.calledTwice); //Once for the error and twice for success
          args = spy.getCall(0).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], window.pythy.Sound);
          assert.strictEqual(args[0].getLength(), 1014300);
          assert.strictEqual(args[0].getSamplingRate(), 44100);
          args = spy.getCall(1).args;
          assert.lengthOf(args, 1);
          assert.instanceOf(args[0], window.pythy.Sound);
          assert.strictEqual(args[0].getLength(), 1290000);
          assert.strictEqual(args[0].getSamplingRate(), 3000);
          done();
        });
      });
    });

    asyncIt('should not allow creation of sounds longer than 600s', function () {
      var execFunc;

      execFunc = function () { mod.makeEmptySoundBySeconds(601); };
      assert.throws(execFunc, Sk.builtin.ValueError, 'Duration can not be greater than 600 seconds');
    });

    asyncIt('should not allow negative duration', function () {
      var execFunc;

      execFunc = function () { mod.makeEmptySoundBySeconds(-10); };
      assert.throws(execFunc, Sk.builtin.ValueError, 'Duration can not be negative');
    });
  });

  describe('openSoundTool', function () {
    asyncIt('should take a sound', function () {
      var execFunc, sound;
      sound = new mod.Sound('./sounds/test_mono.wav'); 

      execFunc = function () { mod.openSoundTool(); }
      assert.throws(execFunc, Sk.builtin.TypeError, 'openSoundTool() takes 1 positional arguments but 0 were given');

      execFunc = function () { mod.openSoundTool(sound); }
      assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
    });

    asyncIt('should open the sound tool', function () {
      doAfterSometime(function () {
        var spy, sound;

        sound = new mod.Sound('./sounds/test_mono.wav'); 
        spy = sinon.spy(window.pythy.SoundTool.prototype, 'start');

        mod.openSoundTool(sound);

        assert.isTrue(spy.calledOnce);
        spy.restore();
      });
    });
  });
});
