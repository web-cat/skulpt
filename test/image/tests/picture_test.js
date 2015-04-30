/* Note: The yellow badges next to the tests in the mocha HTML reporter
 * are due to the timeout specified for asynchronous image processing.
 * It does not reflect the actual time taken by the tests so it is not a
 * cause for worry.
 */
describe('Picture', function () {
  var mod, TIMEOUT, canvasCmp, colorMod, styleMod, doAfterSometime;

  window.pictureMod = $builtinmodule;
  //If tests don't work, increase this timeout
  TIMEOUT = 50;
  colorMod = window.colorMod();
  styleMod = window.styleMod();

  beforeEach(function () {
    mod = window.pictureMod();
  });

  doAfterSometime = function (test) { window.setTimeout(test, TIMEOUT); };

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

    it('should throw an error if url is invalid', function (done) {
      new mod.Picture('a');

      doAfterSometime(function () {
        assert.isTrue(spy.calledOnce);
        assert.lengthOf(spy.getCall(0).args, 1);
        assert.instanceOf(spy.getCall(0).args[0], Error);
        assert.strictEqual(spy.getCall(0).args[0].message, 'The picture could not be loaded. Is the URL incorrect?');
        done();
      });
    });

    it('should take a valid url', function (done) {
      new mod.Picture('./imgs/test.jpg');

      doAfterSometime(function () {
        assert.isTrue(spy.calledOnce);
        assert.lengthOf(spy.getCall(0).args, 1);
        assert.isNull(spy.getCall(0).args[0]);
        done();
      });
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

    it('should throw an error if url is invalid', function (done) {
      mod.makePicture('a');

      doAfterSometime(function () {
        assert.isTrue(spy.calledOnce);
        assert.lengthOf(spy.getCall(0).args, 1);
        assert.instanceOf(spy.getCall(0).args[0], Error);
        assert.strictEqual(spy.getCall(0).args[0].message, 'The picture could not be loaded. Is the URL incorrect?');
        done();
      });
    });

    it('should take a valid url', function (done) {
      mod.makePicture('./imgs/test.jpg');

      doAfterSometime(function () {
        assert.isTrue(spy.calledOnce);
        assert.lengthOf(spy.getCall(0).args, 1);
        assert.isNull(spy.getCall(0).args[0]);
        done();
      });
    });
  });

  describe('__str__', function () {
    it('should yield a descriptive string containing the class name, url, width and height', function (done) {
      var picture, str;

      picture = mod.makePicture('./imgs/test.jpg');

      doAfterSometime(function () {
        str = picture.__str__(picture);
        assert.instanceOf(str, Sk.builtin.str);
        assert.strictEqual(str.getValue(), 'Picture, url ./imgs/test.jpg, height 309, width 315');
        done();
      });
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

        doAfterSometime(function () {
          execFunc = function () { mod.show(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });

      it("should call open the pythy picture tool with the current picture's pixel data", function (done) {
        var spy, canvas;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');

        doAfterSometime(function () {
          mod.show(picture);
          assert.isTrue(spy.calledOnce);
          canvas = spy.getCall(0).args[0];
          assert.instanceOf(canvas, window.HTMLCanvasElement);
          assert.strictEqual(canvas.width, 315);
          assert.strictEqual(canvas.height, 309);
          assert.isTrue(canvasCmp(canvas.getContext('2d').getImageData(0, 0, 315, 309), picture._imageData));
          spy.restore();
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture', function (done) {
        var execFunc;

        execFunc = function () { picture.show(); };
        assert.throws(execFunc, Error, 'show() takes 1 positional arguments but 0 were given');

        doAfterSometime(function () {
          execFunc = function () { picture.show(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });

      it("should call open the pythy picture tool with the current picture's pixel data", function (done) {
        var spy, canvas;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');

        doAfterSometime(function () {
          picture.show(picture);
          assert.isTrue(spy.calledOnce);
          canvas = spy.getCall(0).args[0];
          assert.instanceOf(canvas, window.HTMLCanvasElement);
          assert.strictEqual(canvas.width, 315);
          assert.strictEqual(canvas.height, 309);
          assert.isTrue(canvasCmp(canvas.getContext('2d').getImageData(0, 0, 315, 309), picture._imageData));
          spy.restore();
          done();
        });
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

        doAfterSometime(function () {
          execFunc = function () { mod.repaint(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });

      it("should call open the pythy picture tool with the current picture's pixel data", function (done) {
        var spy, canvas;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');

        doAfterSometime(function () {
          mod.repaint(picture);
          assert.isTrue(spy.calledOnce);
          canvas = spy.getCall(0).args[0];
          assert.instanceOf(canvas, window.HTMLCanvasElement);
          assert.strictEqual(canvas.width, 315);
          assert.strictEqual(canvas.height, 309);
          assert.isTrue(canvasCmp(canvas.getContext('2d').getImageData(0, 0, 315, 309), picture._imageData));
          spy.restore();
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture', function (done) {
        var execFunc;

        execFunc = function () { picture.repaint(); };
        assert.throws(execFunc, Error, 'repaint() takes 1 positional arguments but 0 were given');

        doAfterSometime(function () {
          execFunc = function () { picture.repaint(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });

      it("should call open the pythy picture tool with the current picture's pixel data", function (done) {
        var spy, canvas;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');

        doAfterSometime(function () {
          picture.repaint(picture);
          assert.isTrue(spy.calledOnce);
          canvas = spy.getCall(0).args[0];
          assert.instanceOf(canvas, window.HTMLCanvasElement);
          assert.strictEqual(canvas.width, 315);
          assert.strictEqual(canvas.height, 309);
          assert.isTrue(canvasCmp(canvas.getContext('2d').getImageData(0, 0, 315, 309), picture._imageData));
          spy.restore();
          done();
        });
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
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.getWidth(); };
          assert.throws(execFunc, Error, 'getWidth() takes 1 positional arguments but 0 were given');

          execFunc = function () { mod.getWidth(picture); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return the width of the picture', function (done) {
        doAfterSometime(function () {
          var width;

          width = mod.getWidth(picture);
          assert.instanceOf(width, Sk.builtin.int_);
          assert.strictEqual(width.getValue(), 315);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take a picture', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.getWidth(); };
          assert.throws(execFunc, Error, 'getWidth() takes 1 positional arguments but 0 were given');

          execFunc = function () { picture.getWidth(picture); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return the width of the picture', function (done) {
        doAfterSometime(function () {
          var width;

          width = picture.getWidth(picture);
          assert.instanceOf(width, Sk.builtin.int_);
          assert.strictEqual(width.getValue(), 315);
          done();
        });
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
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.getHeight(); };
          assert.throws(execFunc, Error, 'getHeight() takes 1 positional arguments but 0 were given');

          execFunc = function () { mod.getHeight(picture); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return the height of the picture', function (done) {
        doAfterSometime(function () {
          var height;

          height = mod.getHeight(picture);
          assert.instanceOf(height, Sk.builtin.int_);
          assert.strictEqual(height.getValue(), 309);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take a picture', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.getHeight(); };
          assert.throws(execFunc, Error, 'getHeight() takes 1 positional arguments but 0 were given');

          execFunc = function () { picture.getHeight(picture); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return the height of the picture', function (done) {
        doAfterSometime(function () {
          var height;

          height = picture.getHeight(picture);
          assert.instanceOf(height, Sk.builtin.int_);
          assert.strictEqual(height.getValue(), 309);
          done();
        });
      });
    });
  });

  describe('getPixel', function () {
    var picture;

    beforeEach(function () {
      picture = new mod.Picture('./imgs/test.jpg');
    });
      
    describe('procedural', function () {
      it('should take a picture, an x coordinate and a y coordinate', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.getPixel(); };
          assert.throws(execFunc, Error, 'getPixel() takes 3 positional arguments but 0 were given');

          execFunc = function () { mod.getPixel(picture); };
          assert.throws(execFunc, Error, 'getPixel() takes 3 positional arguments but 1 was given');

          execFunc = function () { mod.getPixel(picture, 0); };
          assert.throws(execFunc, Error, 'getPixel() takes 3 positional arguments but 2 were given');

          execFunc = function () { mod.getPixel(picture, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return the pixel at the position', function (done) {
        doAfterSometime(function () {
          var pixel;

          pixel = mod.getPixel(picture, 0, 0);

          assert.strictEqual(pixel.tp$name, 'Pixel');
          assert.strictEqual(pixel.getRed(pixel).getValue(), 255);
          assert.strictEqual(pixel.getGreen(pixel).getValue(), 255);
          assert.strictEqual(pixel.getBlue(pixel).getValue(), 255);
          assert.strictEqual(pixel.getX(pixel).getValue(), 0);
          assert.strictEqual(pixel.getY(pixel).getValue(), 0);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take a picture, an x coordinate and a y coordinate', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.getPixel(); };
          assert.throws(execFunc, Error, 'getPixel() takes 3 positional arguments but 0 were given');

          execFunc = function () { picture.getPixel(picture); };
          assert.throws(execFunc, Error, 'getPixel() takes 3 positional arguments but 1 was given');

          execFunc = function () { picture.getPixel(picture, 0); };
          assert.throws(execFunc, Error, 'getPixel() takes 3 positional arguments but 2 were given');

          execFunc = function () { picture.getPixel(picture, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return the pixel at the position', function (done) {
        doAfterSometime(function () {
          var pixel;

          pixel = picture.getPixel(picture, 0, 0);

          assert.strictEqual(pixel.tp$name, 'Pixel');
          assert.strictEqual(pixel.getRed(pixel).getValue(), 255);
          assert.strictEqual(pixel.getGreen(pixel).getValue(), 255);
          assert.strictEqual(pixel.getBlue(pixel).getValue(), 255);
          assert.strictEqual(pixel.getX(pixel).getValue(), 0);
          assert.strictEqual(pixel.getY(pixel).getValue(), 0);
          done();
        });
      });
    });
  });

  describe('getPixelAt', function () {
    var picture;

    beforeEach(function () {
      picture = new mod.Picture('./imgs/test.jpg');
    });
      
    describe('procedural', function () {
      it('should take a picture, an x coordinate and a y coordinate', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.getPixelAt(); };
          assert.throws(execFunc, Error, 'getPixelAt() takes 3 positional arguments but 0 were given');

          execFunc = function () { mod.getPixelAt(picture); };
          assert.throws(execFunc, Error, 'getPixelAt() takes 3 positional arguments but 1 was given');

          execFunc = function () { mod.getPixelAt(picture, 0); };
          assert.throws(execFunc, Error, 'getPixelAt() takes 3 positional arguments but 2 were given');

          execFunc = function () { mod.getPixelAt(picture, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return the pixel at the position', function (done) {
        doAfterSometime(function () {
          var pixel;

          pixel = mod.getPixelAt(picture, 0, 0);

          assert.strictEqual(pixel.tp$name, 'Pixel');
          assert.strictEqual(pixel.getRed(pixel).getValue(), 255);
          assert.strictEqual(pixel.getGreen(pixel).getValue(), 255);
          assert.strictEqual(pixel.getBlue(pixel).getValue(), 255);
          assert.strictEqual(pixel.getX(pixel).getValue(), 0);
          assert.strictEqual(pixel.getY(pixel).getValue(), 0);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take a picture, an x coordinate and a y coordinate', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.getPixelAt(); };
          assert.throws(execFunc, Error, 'getPixelAt() takes 3 positional arguments but 0 were given');

          execFunc = function () { picture.getPixelAt(picture); };
          assert.throws(execFunc, Error, 'getPixelAt() takes 3 positional arguments but 1 was given');

          execFunc = function () { picture.getPixelAt(picture, 0); };
          assert.throws(execFunc, Error, 'getPixelAt() takes 3 positional arguments but 2 were given');

          execFunc = function () { picture.getPixelAt(picture, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return the pixel at the position', function (done) {
        doAfterSometime(function () {
          var pixel;

          pixel = picture.getPixelAt(picture, 0, 0);

          assert.strictEqual(pixel.tp$name, 'Pixel');
          assert.strictEqual(pixel.getRed(pixel).getValue(), 255);
          assert.strictEqual(pixel.getGreen(pixel).getValue(), 255);
          assert.strictEqual(pixel.getBlue(pixel).getValue(), 255);
          assert.strictEqual(pixel.getX(pixel).getValue(), 0);
          assert.strictEqual(pixel.getY(pixel).getValue(), 0);
          done();
        });
      });
    });
  });

  describe('setAllPixelsToAColor', function () {
    var picture, getFilledCanvas;

    beforeEach(function () {
      picture = new mod.Picture('./imgs/test.jpg');
    });

    getFilledCanvas = function (width, height, color) {
      var canvas, ctx;

      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgb(' + color._red + ',' + color._green + ',' + color._blue + ')';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.ctx = ctx;
      return canvas;
    };
      
    describe('procedural', function () {
      it('takes a picture and a color', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.setAllPixelsToAColor(); };
          assert.throws(execFunc, Error, 'setAllPixelsToAColor() takes 2 positional arguments but 0 were given');

          execFunc = function () { mod.setAllPixelsToAColor(picture); };
          assert.throws(execFunc, Error, 'setAllPixelsToAColor() takes 2 positional arguments but 1 was given');

          execFunc = function () { mod.setAllPixelsToAColor(picture, colorMod.black); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });

      it('sets all pixels of the picture to the given color', function (done) {
        doAfterSometime(function () {
          var blackCanvas;

          mod.setAllPixelsToAColor(picture, colorMod.orange);
          blackCanvas = getFilledCanvas(picture._width, picture._height, colorMod.orange);
          assert.isTrue(canvasCmp(blackCanvas.ctx.getImageData(0, 0, 315, 309), picture._imageData));
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('takes a picture and a color', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.setAllPixelsToAColor(); };
          assert.throws(execFunc, Error, 'setAllPixelsToAColor() takes 2 positional arguments but 0 were given');

          execFunc = function () { picture.setAllPixelsToAColor(picture); };
          assert.throws(execFunc, Error, 'setAllPixelsToAColor() takes 2 positional arguments but 1 was given');

          execFunc = function () { picture.setAllPixelsToAColor(picture, colorMod.black); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });

      it('sets all pixels of the picture to the given color', function (done) {
        doAfterSometime(function () {
          var blackCanvas;

          picture.setAllPixelsToAColor(picture, colorMod.orange);
          blackCanvas = getFilledCanvas(picture._width, picture._height, colorMod.orange);
          assert.isTrue(canvasCmp(blackCanvas.ctx.getImageData(0, 0, 315, 309), picture._imageData));
          done();
        });
      });
    });
  });

  //Note: This test suite will take sometime as getPixels goes through each pixel of the image
  describe('getPixels', function () {
    var picture;

    beforeEach(function () {
      picture = new mod.Picture('./imgs/test.jpg');
    });

    describe('procedural', function () {
      it('should take the picture', function (done) {
        doAfterSometime(function () {
          var execFunc; 

          execFunc = function () { mod.getPixels(); };
          assert.throws(execFunc, Error, 'getPixels() takes 1 positional arguments but 0 were given');

          execFunc = function () { mod.getPixels(picture); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return a list of Pixels', function (done) {
        doAfterSometime(function () {
          var pixels, rows, column;

          pixels = mod.getPixels(picture);
          assert.instanceOf(pixels, Sk.builtin.list);

          rows = pixels.getValue();
          assert.lengthOf(rows, 309);

          assert.instanceOf(rows[0], Sk.builtin.list);
          assert.lengthOf(rows[0].getValue(), 315);

          column = rows[0].getValue()[0];
          assert.strictEqual(column.tp$name, 'Pixel');
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture', function (done) {
        doAfterSometime(function () {
          var execFunc; 

          execFunc = function () { picture.getPixels(); };
          assert.throws(execFunc, Error, 'getPixels() takes 1 positional arguments but 0 were given');

          execFunc = function () { picture.getPixels(picture); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return a list of Pixels', function (done) {
        doAfterSometime(function () {
          var pixels, rows, column;

          pixels = picture.getPixels(picture);
          assert.instanceOf(pixels, Sk.builtin.list);

          rows = pixels.getValue();
          assert.lengthOf(rows, 309);

          assert.instanceOf(rows[0], Sk.builtin.list);
          assert.lengthOf(rows[0].getValue(), 315);

          column = rows[0].getValue()[0];
          assert.strictEqual(column.tp$name, 'Pixel');
          done();
        });
      });
    });
  });

  //Note: This test suite will take sometime as getAllPixels goes through each pixel of the image
  describe('getAllPixels', function () {
    var picture;

    beforeEach(function () {
      picture = new mod.Picture('./imgs/test.jpg');
    });

    describe('procedural', function () {
      it('should take the picture', function (done) {
        doAfterSometime(function () {
          var execFunc; 

          execFunc = function () { mod.getAllPixels(); };
          assert.throws(execFunc, Error, 'getAllPixels() takes 1 positional arguments but 0 were given');

          execFunc = function () { mod.getAllPixels(picture); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return a list of Pixels', function (done) {
        doAfterSometime(function () {
          var pixels, rows, column;

          pixels = mod.getAllPixels(picture);
          assert.instanceOf(pixels, Sk.builtin.list);

          rows = pixels.getValue();
          assert.lengthOf(rows, 309);

          assert.instanceOf(rows[0], Sk.builtin.list);
          assert.lengthOf(rows[0].getValue(), 315);

          column = rows[0].getValue()[0];
          assert.strictEqual(column.tp$name, 'Pixel');
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture', function (done) {
        doAfterSometime(function () {
          var execFunc; 

          execFunc = function () { picture.getAllPixels(); };
          assert.throws(execFunc, Error, 'getAllPixels() takes 1 positional arguments but 0 were given');

          execFunc = function () { picture.getAllPixels(picture); };
          assert.doesNotThrow(execFunc, Error);

          done();
        });
      });

      it('should return a list of Pixels', function (done) {
        doAfterSometime(function () {
          var pixels, rows, column;

          pixels = picture.getAllPixels(picture);
          assert.instanceOf(pixels, Sk.builtin.list);

          rows = pixels.getValue();
          assert.lengthOf(rows, 309);

          assert.instanceOf(rows[0], Sk.builtin.list);
          assert.lengthOf(rows[0].getValue(), 315);

          column = rows[0].getValue()[0];
          assert.strictEqual(column.tp$name, 'Pixel');
          done();
        });
      });
    });
  });

  describe('duplicate/duplicatePicture', function () {
    var picture;

    beforeEach(function () {
      picture = new mod.Picture('./imgs/test.jpg');
    });

    describe('procedural - duplicatePicture', function () {
      it('should take a picture', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.duplicatePicture(); };
          assert.throws(execFunc, Error, 'duplicatePicture() takes 1 positional arguments but 0 were given');

          execFunc = function () { mod.duplicatePicture(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });

      it('should return a new Picture with the same image as the original', function (done) {
        doAfterSometime(function () {
          var newPic;

          newPic = mod.duplicatePicture(picture);
          assert.strictEqual(newPic.tp$name, 'EmptyPicture');
          assert.strictEqual(newPic.getWidth(newPic).getValue(), picture.getWidth(picture).getValue());
          assert.strictEqual(newPic.getHeight(newPic).getValue(), picture.getHeight(picture).getValue());
          assert.isTrue(canvasCmp(newPic._imageData, picture._imageData));
          done();
        });
      });
    });

    describe('object oriented - duplicate', function () {
      it('should take a picture', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.duplicate(); };
          assert.throws(execFunc, Error, 'duplicate() takes 1 positional arguments but 0 were given');

          execFunc = function () { picture.duplicate(picture); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });

      it('should return a new Picture with the same image as the original', function (done) {
        doAfterSometime(function () {
          var newPic;

          newPic = picture.duplicate(picture);
          assert.strictEqual(newPic.tp$name, 'EmptyPicture');
          assert.strictEqual(newPic.getWidth(newPic).getValue(), picture.getWidth(picture).getValue());
          assert.strictEqual(newPic.getHeight(newPic).getValue(), picture.getHeight(picture).getValue());
          assert.isTrue(canvasCmp(newPic._imageData, picture._imageData));
          done();
        });
      });
    });
  });

  /* Not testing if the 'add*' functions actually draw the correct thing on the canvas
   * because that would involve replicating the code for drawing here, which is
   * redundant.
   * So, we just test the input/output(if applicable)
   */
  describe('addArc', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, width, height, startAngle, arcAngle and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addArc(); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 0 were given');

          execFunc = function () { mod.addArc(picture); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 1 was given');

          execFunc = function () { mod.addArc(picture, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 2 were given');

          execFunc = function () { mod.addArc(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 3 were given');

          execFunc = function () { mod.addArc(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 4 were given');

          execFunc = function () { mod.addArc(picture, 0, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 5 were given');

          execFunc = function () { mod.addArc(picture, 0, 0, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 6 were given');

          execFunc = function () { mod.addArc(picture, 0, 0, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addArc(picture, 0, 0, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, width, height, startAngle, arcAngle and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addArc(); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 0 were given');

          execFunc = function () { picture.addArc(picture); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 1 was given');

          execFunc = function () { picture.addArc(picture, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 2 were given');

          execFunc = function () { picture.addArc(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 3 were given');

          execFunc = function () { picture.addArc(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 4 were given');

          execFunc = function () { picture.addArc(picture, 0, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 5 were given');

          execFunc = function () { picture.addArc(picture, 0, 0, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArc() takes between 7 and 8 positional arguments but 6 were given');

          execFunc = function () { picture.addArc(picture, 0, 0, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addArc(picture, 0, 0, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });

  describe('addArcFilled', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, width, height, startAngle, arcAngle and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addArcFilled(); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 0 were given');

          execFunc = function () { mod.addArcFilled(picture); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 1 was given');

          execFunc = function () { mod.addArcFilled(picture, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 2 were given');

          execFunc = function () { mod.addArcFilled(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 3 were given');

          execFunc = function () { mod.addArcFilled(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 4 were given');

          execFunc = function () { mod.addArcFilled(picture, 0, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 5 were given');

          execFunc = function () { mod.addArcFilled(picture, 0, 0, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 6 were given');

          execFunc = function () { mod.addArcFilled(picture, 0, 0, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addArcFilled(picture, 0, 0, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, width, height, startAngle, arcAngle and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addArcFilled(); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 0 were given');

          execFunc = function () { picture.addArcFilled(picture); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 1 was given');

          execFunc = function () { picture.addArcFilled(picture, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 2 were given');

          execFunc = function () { picture.addArcFilled(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 3 were given');

          execFunc = function () { picture.addArcFilled(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 4 were given');

          execFunc = function () { picture.addArcFilled(picture, 0, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 5 were given');

          execFunc = function () { picture.addArcFilled(picture, 0, 0, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addArcFilled() takes between 7 and 8 positional arguments but 6 were given');

          execFunc = function () { picture.addArcFilled(picture, 0, 0, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addArcFilled(picture, 0, 0, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });

  describe('addOval', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, width, height, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addOval(); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { mod.addOval(picture); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { mod.addOval(picture, 0); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { mod.addOval(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { mod.addOval(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { mod.addOval(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addOval(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, width, height, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addOval(); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { picture.addOval(picture); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { picture.addOval(picture, 0); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { picture.addOval(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { picture.addOval(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addOval() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { picture.addOval(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addOval(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });

  describe('addOvalFilled', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, width, height, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addOvalFilled(); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { mod.addOvalFilled(picture); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { mod.addOvalFilled(picture, 0); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { mod.addOvalFilled(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { mod.addOvalFilled(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { mod.addOvalFilled(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addOvalFilled(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, width, height, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addOvalFilled(); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { picture.addOvalFilled(picture); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { picture.addOvalFilled(picture, 0); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { picture.addOvalFilled(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { picture.addOvalFilled(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addOvalFilled() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { picture.addOvalFilled(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addOvalFilled(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });

  describe('addLine', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, endX, endY, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addLine(); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { mod.addLine(picture); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { mod.addLine(picture, 0); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { mod.addLine(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { mod.addLine(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { mod.addLine(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addLine(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, endX, endY, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addLine(); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { picture.addLine(picture); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { picture.addLine(picture, 0); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { picture.addLine(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { picture.addLine(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addLine() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { picture.addLine(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addLine(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });

  describe('addRect', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, width, height, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addRect(); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { mod.addRect(picture); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { mod.addRect(picture, 0); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { mod.addRect(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { mod.addRect(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { mod.addRect(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addRect(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, width, height, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addRect(); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { picture.addRect(picture); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { picture.addRect(picture, 0); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { picture.addRect(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { picture.addRect(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addRect() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { picture.addRect(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addRect(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });

  describe('addRectFilled', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, width, height, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addRectFilled(); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { mod.addRectFilled(picture); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { mod.addRectFilled(picture, 0); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { mod.addRectFilled(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { mod.addRectFilled(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { mod.addRectFilled(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addRectFilled(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, width, height, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addRectFilled(); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { picture.addRectFilled(picture); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { picture.addRectFilled(picture, 0); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { picture.addRectFilled(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { picture.addRectFilled(picture, 0, 0, 0); };
          assert.throws(execFunc, Error, 'addRectFilled() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { picture.addRectFilled(picture, 0, 0, 0, 0); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addRectFilled(picture, 0, 0, 0, 0, colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });

  describe('addText', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, text and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addText(); };
          assert.throws(execFunc, Error, 'addText() takes between 4 and 5 positional arguments but 0 were given');

          execFunc = function () { mod.addText(picture); };
          assert.throws(execFunc, Error, 'addText() takes between 4 and 5 positional arguments but 1 was given');

          execFunc = function () { mod.addText(picture, 0); };
          assert.throws(execFunc, Error, 'addText() takes between 4 and 5 positional arguments but 2 were given');

          execFunc = function () { mod.addText(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addText() takes between 4 and 5 positional arguments but 3 were given');

          execFunc = function () { mod.addText(picture, 0, 0, 'text'); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addText(picture, 0, 0, 'text', colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, text and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addText(); };
          assert.throws(execFunc, Error, 'addText() takes between 4 and 5 positional arguments but 0 were given');

          execFunc = function () { picture.addText(picture); };
          assert.throws(execFunc, Error, 'addText() takes between 4 and 5 positional arguments but 1 was given');

          execFunc = function () { picture.addText(picture, 0); };
          assert.throws(execFunc, Error, 'addText() takes between 4 and 5 positional arguments but 2 were given');

          execFunc = function () { picture.addText(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addText() takes between 4 and 5 positional arguments but 3 were given');

          execFunc = function () { picture.addText(picture, 0, 0, 'text'); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addText(picture, 0, 0, 'text', colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });

  describe('addTextWithStyle', function () {
    var picture;

    beforeEach(function () { picture = mod.makePicture('./imgs/test.jpg'); });

    describe('procedural', function () {
      it('should take the picture, x, y, text, style, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { mod.addTextWithStyle(); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { mod.addTextWithStyle(picture); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { mod.addTextWithStyle(picture, 0); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { mod.addTextWithStyle(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { mod.addTextWithStyle(picture, 0, 0, 'text'); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { mod.addTextWithStyle(picture, 0, 0, 'text', styleMod.makeStyle(styleMod.sansSerif, styleMod.PLAIN, 10)); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { mod.addTextWithStyle(picture, 0, 0, 'text', styleMod.makeStyle(styleMod.sansSerif, styleMod.PLAIN, 10), colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });

    describe('object oriented', function () {
      it('should take the picture, x, y, text, style, and color optionally', function (done) {
        doAfterSometime(function () {
          var execFunc;

          execFunc = function () { picture.addTextWithStyle(); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 0 were given');

          execFunc = function () { picture.addTextWithStyle(picture); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 1 was given');

          execFunc = function () { picture.addTextWithStyle(picture, 0); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 2 were given');

          execFunc = function () { picture.addTextWithStyle(picture, 0, 0); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 3 were given');

          execFunc = function () { picture.addTextWithStyle(picture, 0, 0, 'text'); };
          assert.throws(execFunc, Error, 'addTextWithStyle() takes between 5 and 6 positional arguments but 4 were given');

          execFunc = function () { picture.addTextWithStyle(picture, 0, 0, 'text',
              styleMod.makeStyle(styleMod.sansSerif, styleMod.PLAIN, 10)); };
          assert.doesNotThrow(execFunc, Error);

          execFunc = function () { picture.addTextWithStyle(picture, 0, 0, 'text',
              styleMod.makeStyle(styleMod.sansSerif, styleMod.PLAIN, 10), colorMod.pink); };
          assert.doesNotThrow(execFunc, Error);
          done();
        });
      });
    });
  });
});
