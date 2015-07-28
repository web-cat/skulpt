describe('Sample', function () {
  var mod, getSound, initializeSound, context, TIMEOUT, doAfterSometime;

  window.sampleMod = $builtinmodule;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  TIMEOUT = 20;
  doAfterSometime = function (func) { window.setTimeout(func, TIMEOUT); };
  context = new window.AudioContext();

  getSound = function (numChannels, numSamples, sampleRate) {
    var source, buffer, data;

    buffer = context.createBuffer(numChannels, numSamples, sampleRate);
    data = buffer.getChannelData(0);
    source = context.createBufferSource();
    source.buffer = buffer;
    source._sound = {
      getLeftSample : function (index) { return data[index]; },
      setLeftSample : function (index, value) { data[index] = value; }
    }

    return source;
  };

  beforeEach(function () {
    mod = new window.sampleMod();
  });

  describe('__init__', function () {
    it('should take the sound and the index', function () {
      var execFunc;

      execFunc = function () { new mod.Sample(); };
      assert.throws(execFunc, Sk.builtin.TypeError, '__init__() takes 3 positional arguments but 1 was given');

      execFunc = function () { new mod.Sample({}); };
      assert.throws(execFunc, Sk.builtin.TypeError, '__init__() takes 3 positional arguments but 2 were given');

      execFunc = function () { new mod.Sample({}, 0); };
      assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
    });
  });

  describe('__str__', function () {
    var sample, sound;

    beforeEach(function () {
      sound = getSound(1, 100, 3000);
      sound._sound.setLeftSample(20, 0.123);
      sample = new mod.Sample(sound, 20);
    });

    it('should take the sample', function (done) {
      doAfterSometime(function () {
        var execFunc;

        execFunc = function () { sample.__str__(); };
        assert.throws(execFunc, Sk.builtin.TypeError, '__str__() takes 1 positional arguments but 0 were given');

        execFunc = function () { sample.__str__(sample); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
        done();
      });
    });

    it('should yield a descriptive string containing the classname, the index and the value', function (done) {
      doAfterSometime(function () {
        var str;

        str = sample.__str__(sample);

        assert.instanceOf(str, Sk.builtin.str);
        assert.strictEqual(str.getValue(), 'Sample at 20 with value 4030');
        done();
      });
    });
  });

  describe('__repr__', function () {
    var sample;

    beforeEach(function () {
      var sound;
      sound = getSound(1, 100, 3000);
      sound._sound.setLeftSample(20, 0.123);
      sample = new mod.Sample(sound, 20);
    });

    it('should take the sample', function (done) {
      doAfterSometime(function () {
        var execFunc;

        execFunc = function () { sample.__repr__(); };
        assert.throws(execFunc, Sk.builtin.TypeError, '__repr__() takes 1 positional arguments but 0 were given');

        execFunc = function () { sample.__repr__(sample); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
        done();
      });
    });

    it('should yield a descriptive string containing the classname, the index and the value', function (done) {
      doAfterSometime(function () {
        var str;

        str = sample.__repr__(sample);

        assert.instanceOf(str, Sk.builtin.str);
        assert.strictEqual(str.getValue(), 'Sample at 20 with value 4030');
        done();
      });
    });
  });

  describe('getSound', function () {
    var sample, sound;

    beforeEach(function () {
      sound = getSound(1, 100, 3000);
      sound._sound.setLeftSample(20, 123);
      sample = new mod.Sample(sound, 20);
    });

    describe('procedural', function () {
      it('should take the sample', function () {
        var execFunc;

        execFunc = function () { mod.getSound(); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSound() takes 1 positional arguments but 0 were given');

        execFunc = function () { mod.getSound(sample); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
      });

      it('should return the sound', function () {
        var snd;

        snd = mod.getSound(sample);
        assert.strictEqual(snd, sound);
      });
    });

    describe('object oriented', function () {
      it('should take the sample', function () {
        var execFunc;

        execFunc = function () { sample.getSound(); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'getSound() takes 1 positional arguments but 0 were given');

        execFunc = function () { sample.getSound(sample); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
      });

      it('should return the sound', function () {
        var snd;

        snd = sample.getSound(sample);
        assert.strictEqual(snd, sound);
      });
    });
  });

  describe('getSampleValue', function () {
    var sample, sound;

    beforeEach(function () {
      sound = getSound(1, 100, 3000);
      sound._sound.setLeftSample(20, 123);
      sample = new mod.Sample(sound, 20);
    });

    describe('procedural', function () {
      it('should take the sample', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.getSampleValue(); };
          assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleValue() takes 1 positional arguments but 0 were given');

          execFunc = function () { mod.getSampleValue(sample); };
          assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
          done();
        });
      });

      it('should call the correct method of the sound object', function (done) {
        doAfterSometime(function () {
          var stub;

          stub = sinon.stub(sound._sound, 'getLeftSample');

          mod.getSampleValue(sample);

          assert.isTrue(stub.calledOnce);
          assert.lengthOf(stub.getCall(0).args, 1);
          assert.strictEqual(stub.getCall(0).args[0], 20);
          
          stub.restore();
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the sample', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { sample.getSampleValue(); };
          assert.throws(execFunc, Sk.builtin.TypeError, 'getSampleValue() takes 1 positional arguments but 0 were given');

          execFunc = function () { sample.getSampleValue(sample); };
          assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
          done();
        });
      });

      it('should call the correct method of the sound object', function (done) {
        doAfterSometime(function () {
          var stub;

          stub = sinon.stub(sound._sound, 'getLeftSample');

          sample.getSampleValue(sample);

          assert.isTrue(stub.calledOnce);
          assert.lengthOf(stub.getCall(0).args, 1);
          assert.strictEqual(stub.getCall(0).args[0], 20);

          stub.restore();
          done();
        });
      });
    });
  });

  describe('setSampleValue', function () {
    var sample, sound;

    beforeEach(function () {
      sound = getSound(1, 100, 3000);
      sound._sound.setLeftSample(20, 123);
      sample = new mod.Sample(sound, 20);
    });

    describe('procedural', function () {
      it('should take the sample', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.setSampleValue(); };
          assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValue() takes 2 positional arguments but 0 were given');

          execFunc = function () { mod.setSampleValue(sample); };
          assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValue() takes 2 positional arguments but 1 was given');

          execFunc = function () { mod.setSampleValue(sample, new Sk.builtin.int_(10)); };
          assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
          done();
        });
      });

      it('should call the correct method of the sound object', function (done) {
        doAfterSometime(function () {
          var stub;

          stub = sinon.stub(sound._sound, 'setLeftSample');

          mod.setSampleValue(sample, new Sk.builtin.int_(10));

          assert.isTrue(stub.calledOnce);
          assert.lengthOf(stub.getCall(0).args, 2);
          assert.strictEqual(stub.getCall(0).args[0], 20);
          assert.closeTo(stub.getCall(0).args[1], 0.0003, 0.0001);

          stub.restore();
          done();
        });
      });
    });

    describe('procedural', function () {
      it('should take the sample', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { sample.setSampleValue(); };
          assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValue() takes 2 positional arguments but 0 were given');

          execFunc = function () { sample.setSampleValue(sample); };
          assert.throws(execFunc, Sk.builtin.TypeError, 'setSampleValue() takes 2 positional arguments but 1 was given');

          execFunc = function () { sample.setSampleValue(sample, new Sk.builtin.int_(10)); };
          assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
          done();
        });
      });

      it('should call the correct method of the sound object', function (done) {
        doAfterSometime(function () {
          var stub;

          stub = sinon.stub(sound._sound, 'setLeftSample');

          sample.setSampleValue(sample, new Sk.builtin.int_(10));

          assert.isTrue(stub.calledOnce);
          assert.lengthOf(stub.getCall(0).args, 2);
          assert.strictEqual(stub.getCall(0).args[0], 20);
          assert.closeTo(stub.getCall(0).args[1], 0.0003, 0.0001);

          stub.restore();
          done();
        });
      });
    });
  });
});
