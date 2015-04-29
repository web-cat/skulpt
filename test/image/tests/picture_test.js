describe('Picture', function () {
  var mod, TIMEOUT, canvasCmp;

  window.pictureMod = $builtinmodule;
  TIMEOUT = 50;

  beforeEach(function () {
    mod = window.pictureMod();
  });

  canvasCmp = function (id1, id2) {
    var data1, data2;

    data1 = id1.data;
    data2 = id2.data;

    for(i = 0; i < data1.length; i++) {
      if(data1[i] !== data2[i]) { return false; }
    }

    return true;
  };

  describe('__init__', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(Sk.future, 'continueWith');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should take a url', function () {
      var execFunc;

      execFunc = function () { new mod.Picture(); };
      assert.throws(execFunc, Error, '__init__() takes 2 positional arguments but 1 was given');

      execFunc = function () { new mod.Picture('./imgs/test.jpg'); };
      assert.doesNotThrow(execFunc, Error);
    });

    // If this test doesn't work, then increase the timeout
    it('should throw an error if url is invalid', function (done) {
      new mod.Picture('a');

      window.setTimeout(function () {
        assert.isTrue(spy.calledOnce);
        assert.lengthOf(spy.getCall(0).args, 1);
        assert.instanceOf(spy.getCall(0).args[0], Error);
        assert.strictEqual(spy.getCall(0).args[0].message, 'The picture could not be loaded. Is the URL incorrect?');
        done();
      }, TIMEOUT);
    });

    // If this test doesn't work, then increase the timeout
    it('should take a valid url', function (done) {
      new mod.Picture('./imgs/test.jpg');

      window.setTimeout(function () {
        assert.isTrue(spy.calledOnce);
        assert.lengthOf(spy.getCall(0).args, 1);
        assert.isNull(spy.getCall(0).args[0]);
        done();
      }, TIMEOUT);
    });
  });

  describe('makePicture', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(Sk.future, 'continueWith');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should take a url', function () {
      var execFunc;

      execFunc = function () { mod.makePicture(); };
      assert.throws(execFunc, Error, 'makePicture() takes 1 positional arguments but 0 were given');

      execFunc = function () { mod.makePicture('./imgs/test.jpg'); };
      assert.doesNotThrow(execFunc, Error);
    });

    // If this test doesn't work, then increase the timeout
    it('should throw an error if url is invalid', function (done) {
      mod.makePicture('a');

      window.setTimeout(function () {
        assert.isTrue(spy.calledOnce);
        assert.lengthOf(spy.getCall(0).args, 1);
        assert.instanceOf(spy.getCall(0).args[0], Error);
        assert.strictEqual(spy.getCall(0).args[0].message, 'The picture could not be loaded. Is the URL incorrect?');
        done();
      }, TIMEOUT);
    });

    // If this test doesn't work, then increase the timeout
    it('should take a valid url', function (done) {
      mod.makePicture('./imgs/test.jpg');

      window.setTimeout(function () {
        assert.isTrue(spy.calledOnce);
        assert.lengthOf(spy.getCall(0).args, 1);
        assert.isNull(spy.getCall(0).args[0]);
        done();
      }, TIMEOUT);
    });
  });

  describe('__str__', function () {
    it('should yield a descriptive string containing the class name, url, width and height', function (done) {
      var picture, str;

      picture = mod.makePicture('./imgs/test.jpg');

      window.setTimeout(function () {
        str = picture.__str__(picture);
        assert.instanceOf(str, Sk.builtin.str);
        assert.strictEqual(str.getValue(), 'Picture, url ./imgs/test.jpg, height 309, width 315');
        done();
      }, TIMEOUT);
    });
  });

  describe('show', function () {
    var picture;

    beforeEach(function () {
      picture = mod.makePicture('./imgs/test.jpg');
    });

    describe('procedural', function () {
      it('should take the picture', function (done) {
        var execFunc;

        execFunc = function () { mod.show(); };
        assert.throws(execFunc, Error, 'show() takes 1 positional arguments but 0 were given');

        window.setTimeout(function () {
          execFunc = function () { mod.show(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        }, TIMEOUT);
      });

      it("should call open the pythy picture tool with the current picture's pixel data", function (done) {
        var spy, canvas;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');

        window.setTimeout(function () {
          mod.show(picture);
          assert.isTrue(spy.calledOnce);
          canvas = spy.getCall(0).args[0];
          assert.instanceOf(canvas, window.HTMLCanvasElement);
          assert.strictEqual(canvas.width, 315);
          assert.strictEqual(canvas.height, 309);
          assert.isTrue(canvasCmp(canvas.getContext('2d').getImageData(0, 0, 315, 309), picture._imageData));
          spy.restore();
          done();
        }, TIMEOUT);
      });
    });

    describe('object oriented', function () {
      it('should take the picture', function (done) {
        var execFunc;

        execFunc = function () { picture.show(); };
        assert.throws(execFunc, Error, 'show() takes 1 positional arguments but 0 were given');

        window.setTimeout(function () {
          execFunc = function () { picture.show(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        }, TIMEOUT);
      });

      it("should call open the pythy picture tool with the current picture's pixel data", function (done) {
        var spy, canvas;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');

        window.setTimeout(function () {
          picture.show(picture);
          assert.isTrue(spy.calledOnce);
          canvas = spy.getCall(0).args[0];
          assert.instanceOf(canvas, window.HTMLCanvasElement);
          assert.strictEqual(canvas.width, 315);
          assert.strictEqual(canvas.height, 309);
          assert.isTrue(canvasCmp(canvas.getContext('2d').getImageData(0, 0, 315, 309), picture._imageData));
          spy.restore();
          done();
        }, TIMEOUT);
      });
    });
  });

  describe('repaint', function () {
    var picture;

    beforeEach(function () {
      picture = mod.makePicture('./imgs/test.jpg');
    });

    describe('procedural', function () {
      it('should take the picture', function (done) {
        var execFunc;

        execFunc = function () { mod.repaint(); };
        assert.throws(execFunc, Error, 'repaint() takes 1 positional arguments but 0 were given');

        window.setTimeout(function () {
          execFunc = function () { mod.repaint(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        }, TIMEOUT);
      });

      it("should call open the pythy picture tool with the current picture's pixel data", function (done) {
        var spy, canvas;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');

        window.setTimeout(function () {
          mod.repaint(picture);
          assert.isTrue(spy.calledOnce);
          canvas = spy.getCall(0).args[0];
          assert.instanceOf(canvas, window.HTMLCanvasElement);
          assert.strictEqual(canvas.width, 315);
          assert.strictEqual(canvas.height, 309);
          assert.isTrue(canvasCmp(canvas.getContext('2d').getImageData(0, 0, 315, 309), picture._imageData));
          spy.restore();
          done();
        }, TIMEOUT);
      });
    });

    describe('object oriented', function () {
      it('should take the picture', function (done) {
        var execFunc;

        execFunc = function () { picture.repaint(); };
        assert.throws(execFunc, Error, 'repaint() takes 1 positional arguments but 0 were given');

        window.setTimeout(function () {
          execFunc = function () { picture.repaint(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        }, TIMEOUT);
      });

      it("should call open the pythy picture tool with the current picture's pixel data", function (done) {
        var spy, canvas;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');

        window.setTimeout(function () {
          picture.repaint(picture);
          assert.isTrue(spy.calledOnce);
          canvas = spy.getCall(0).args[0];
          assert.instanceOf(canvas, window.HTMLCanvasElement);
          assert.strictEqual(canvas.width, 315);
          assert.strictEqual(canvas.height, 309);
          assert.isTrue(canvasCmp(canvas.getContext('2d').getImageData(0, 0, 315, 309), picture._imageData));
          spy.restore();
          done();
        }, TIMEOUT);
      });
    });
  });

  describe('getWidth', function () {
    var picture;

    beforeEach(function () {
      picture = new mod.Picture('./imgs/test.jpg');
    });
      
    describe('procedural', function () {
      it('should take a picture', function (done) {
        window.setTimeout(function () {
          var execFunc;

          execFunc = function () { mod.getWidth(); };
          assert.throws(execFunc, Error, 'getWidth() takes 1 positional arguments but 0 were given');

          execFunc = function () { mod.getWidth(picture); };
          assert.doesNotThrow(execFunc);

          done();
        }, TIMEOUT);
      });

      it('should return the width of the picture', function (done) {
        window.setTimeout(function () {
          var width;

          width = mod.getWidth(picture);
          assert.instanceOf(width, Sk.builtin.int_);
          assert.strictEqual(width.getValue(), 315);
          done();
        }, TIMEOUT);
      });
    });

    describe('object oriented', function () {
      it('should take a picture', function (done) {
        window.setTimeout(function () {
          var execFunc;

          execFunc = function () { picture.getWidth(); };
          assert.throws(execFunc, Error, 'getWidth() takes 1 positional arguments but 0 were given');

          execFunc = function () { picture.getWidth(picture); };
          assert.doesNotThrow(execFunc);

          done();
        }, TIMEOUT);
      });

      it('should return the width of the picture', function (done) {
        window.setTimeout(function () {
          var width;

          width = picture.getWidth(picture);
          assert.instanceOf(width, Sk.builtin.int_);
          assert.strictEqual(width.getValue(), 315);
          done();
        }, TIMEOUT);
      });
    });
  });

  describe('getHeight', function () {
    var picture;

    beforeEach(function () {
      picture = new mod.Picture('./imgs/test.jpg');
    });
      
    describe('procedural', function () {
      it('should take a picture', function (done) {
        window.setTimeout(function () {
          var execFunc;

          execFunc = function () { mod.getHeight(); };
          assert.throws(execFunc, Error, 'getHeight() takes 1 positional arguments but 0 were given');

          execFunc = function () { mod.getHeight(picture); };
          assert.doesNotThrow(execFunc);

          done();
        }, TIMEOUT);
      });

      it('should return the height of the picture', function (done) {
        window.setTimeout(function () {
          var height;

          height = mod.getHeight(picture);
          assert.instanceOf(height, Sk.builtin.int_);
          assert.strictEqual(height.getValue(), 309);
          done();
        }, TIMEOUT);
      });
    });

    describe('object oriented', function () {
      it('should take a picture', function (done) {
        window.setTimeout(function () {
          var execFunc;

          execFunc = function () { picture.getHeight(); };
          assert.throws(execFunc, Error, 'getHeight() takes 1 positional arguments but 0 were given');

          execFunc = function () { picture.getHeight(picture); };
          assert.doesNotThrow(execFunc);

          done();
        }, TIMEOUT);
      });

      it('should return the height of the picture', function (done) {
        window.setTimeout(function () {
          var height;

          height = picture.getHeight(picture);
          assert.instanceOf(height, Sk.builtin.int_);
          assert.strictEqual(height.getValue(), 309);
          done();
        }, TIMEOUT);
      });
    });
  });
});
