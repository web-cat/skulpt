describe('Pixel', function () {
  var mod, getPicture, setPixelColor, resetPicture, picture;

  window.pixelMod = $builtinmodule;

  getPicture = function (width, height) {
    var picture;
    picture = document.createElement('canvas');
    picture.ctx = picture.getContext('2d');
    picture.width = picture._width = width;
    picture.height = picture._height = height;
    picture._imageData = picture.ctx.getImageData(0, 0, picture.width, picture.height);
    return picture;
  };

  setPixelColor = function (picture, r, g, b, x, y) {
    var id;

    id = picture.ctx.createImageData(1, 1);
    id.data[0] = r;
    id.data[1] = g;
    id.data[2] = b;
    id.data[3] = 255;

    picture.ctx.putImageData(id, x, y);
    picture._imageData = picture.ctx.getImageData(0, 0, picture.width, picture.height);
  };

  resetPicture = function (picture) {
    picture.ctx.putImageData(picture._imageData, 0, 0);
  };

  beforeEach(function() {
    mod = window.pixelMod();
    picture = getPicture(100, 200);
  });

  describe('__init__', function () {
    it('should take a picture, an x coordinate and a y coordinate', function () {
      var execFunc;

      execFunc = function () { new mod.Pixel() };
      assert.throws(execFunc, Error, '__init__() takes 4 positional arguments but 1 was given');

      execFunc = function () { new mod.Pixel({}) };
      assert.throws(execFunc, Error, '__init__() takes 4 positional arguments but 2 were given');

      execFunc = function () { new mod.Pixel({}, 32) };
      assert.throws(execFunc, Error, '__init__() takes 4 positional arguments but 3 were given');

      execFunc = function () { new mod.Pixel({}, 32, 45) };
      assert.doesNotThrow(execFunc, Error);
    }); 
  });

  describe('__str__', function () {
    it('should yield a descriptive string containing the class name, family, emphasis and font size', function () {
      var pixel;

      setPixelColor(picture, 32, 100, 250, 43, 123);
      pixel = new mod.Pixel(picture, 43, 123);
      assert.strictEqual(pixel.__str__(pixel).getValue(), 'Pixel, red=32, green=100, blue=250');
    });
  });

  describe('setColor', function () {
    describe('procedural', function () {
      it('should take a pixel and a color', function () {
        var execFunc, pixel, color;

        pixel = new mod.Pixel(picture, 50, 70);
        color = { _red: 100, _green: 101, _blue: 102 };

        execFunc = function () { mod.setColor() };
        assert.throws(execFunc, Error, 'setColor() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.setColor(pixel) };
        assert.throws(execFunc, Error, 'setColor() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.setColor(pixel, color) };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should change the color of the pixel in the picture', function () {
        var pixel, color, id;

        pixel = new mod.Pixel(picture, 50, 70);
        color = { _red: 100, _green: 101, _blue: 102 };

        mod.setColor(pixel, color);
        resetPicture(picture);

        id = picture.ctx.getImageData(50, 70, 1, 1);
        assert.strictEqual(id.data[0], 100);
        assert.strictEqual(id.data[1], 101);
        assert.strictEqual(id.data[2], 102);
        assert.strictEqual(id.data[3], 255);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel and a color', function () {
        var execFunc, pixel, color;

        pixel = new mod.Pixel(picture, 50, 70);
        color = { _red: 100, _green: 101, _blue: 102 };

        execFunc = function () { pixel.setColor() };
        assert.throws(execFunc, Error, 'setColor() takes 2 positional arguments but 0 were given');

        execFunc = function () { pixel.setColor(pixel) };
        assert.throws(execFunc, Error, 'setColor() takes 2 positional arguments but 1 was given');

        execFunc = function () { pixel.setColor(pixel, color) };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should change the color of the pixel in the picture', function () {
        var pixel, color, id;

        pixel = new mod.Pixel(picture, 50, 70);
        color = { _red: 100, _green: 101, _blue: 102 };

        pixel.setColor(pixel, color);
        resetPicture(picture);

        id = picture.ctx.getImageData(50, 70, 1, 1);
        assert.strictEqual(id.data[0], 100);
        assert.strictEqual(id.data[1], 101);
        assert.strictEqual(id.data[2], 102);
        assert.strictEqual(id.data[3], 255);
      });
    });
  });

  describe('getColor', function () {
    var pixel;

    beforeEach(function () {
      pixel = new mod.Pixel(picture, 68, 70);
    });

    describe('procedural', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { mod.getColor(); };
        assert.throws(execFunc, Error, 'getColor() takes 1 positional arguments but 0 were given');

        execFunc = function () { mod.getColor(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the color of the pixel', function () {
        var color;

        setPixelColor(picture, 32, 100, 26, 68, 70);
        color = mod.getColor(pixel);

        assert.strictEqual(color.tp$name, 'Color');
        assert.strictEqual(color._red, 32);
        assert.strictEqual(color._green, 100);
        assert.strictEqual(color._blue, 26);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { pixel.getColor(); };
        assert.throws(execFunc, Error, 'getColor() takes 1 positional arguments but 0 were given');

        execFunc = function () { pixel.getColor(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the color of the pixel', function () {
        var color;

        setPixelColor(picture, 32, 100, 26, 68, 70);
        color = pixel.getColor(pixel);

        assert.strictEqual(color.tp$name, 'Color');
        assert.strictEqual(color._red, 32);
        assert.strictEqual(color._green, 100);
        assert.strictEqual(color._blue, 26);
      });
    });
  });

  describe('getX', function () {
    var pixel;

    beforeEach(function () {
      pixel = new mod.Pixel(picture, 68, 70);
    });

    describe('procedural', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { mod.getX(); };
        assert.throws(execFunc, Error, 'getX() takes 1 positional arguments but 0 were given');

        execFunc = function () { mod.getX(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the x coordinate of the pixel', function () {
        var x;

        x = mod.getX(pixel);

        assert.instanceOf(x, Sk.builtin.int_);
        assert.strictEqual(x.getValue(), 68);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { pixel.getX(); };
        assert.throws(execFunc, Error, 'getX() takes 1 positional arguments but 0 were given');

        execFunc = function () { pixel.getX(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the x coordinate of the pixel', function () {
        var x;

        x = pixel.getX(pixel);

        assert.instanceOf(x, Sk.builtin.int_);
        assert.strictEqual(x.getValue(), 68);
      });
    });
  });

  describe('getY', function () {
    var pixel;

    beforeEach(function () {
      pixel = new mod.Pixel(picture, 68, 70);
    });

    describe('procedural', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { mod.getY(); };
        assert.throws(execFunc, Error, 'getY() takes 1 positional arguments but 0 were given');

        execFunc = function () { mod.getY(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the y coordinate of the pixel', function () {
        var y;

        y = mod.getY(pixel);

        assert.instanceOf(y, Sk.builtin.int_);
        assert.strictEqual(y.getValue(), 70);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { pixel.getY(); };
        assert.throws(execFunc, Error, 'getY() takes 1 positional arguments but 0 were given');

        execFunc = function () { pixel.getY(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the y coordinate of the pixel', function () {
        var y;

        y = pixel.getY(pixel);

        assert.instanceOf(y, Sk.builtin.int_);
        assert.strictEqual(y.getValue(), 70);
      });
    });
  });

  describe('getRed', function () {
    var pixel;

    beforeEach(function () {
      setPixelColor(picture, 37, 94, 26, 55, 103);
      pixel = new mod.Pixel(picture, 55, 103);
    });

    describe('procedural', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { mod.getRed(); };
        assert.throws(execFunc, Error, 'getRed() takes 1 positional arguments but 0 were given');

        execFunc = function () { mod.getRed(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the color of the pixel', function () {
        var red;

        red = mod.getRed(pixel);

        assert.instanceOf(red, Sk.builtin.int_);
        assert.strictEqual(red.getValue(), 37);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { pixel.getRed(); };
        assert.throws(execFunc, Error, 'getRed() takes 1 positional arguments but 0 were given');

        execFunc = function () { pixel.getRed(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the color of the pixel', function () {
        var red;

        red = pixel.getRed(pixel);

        assert.instanceOf(red, Sk.builtin.int_);
        assert.strictEqual(red.getValue(), 37);
      });
    });
  });

  describe('getGreen', function () {
    var pixel;

    beforeEach(function () {
      setPixelColor(picture, 37, 94, 26, 55, 103);
      pixel = new mod.Pixel(picture, 55, 103);
    });

    describe('procedural', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { mod.getGreen(); };
        assert.throws(execFunc, Error, 'getGreen() takes 1 positional arguments but 0 were given');

        execFunc = function () { mod.getGreen(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the color of the pixel', function () {
        var green;

        green = mod.getGreen(pixel);

        assert.instanceOf(green, Sk.builtin.int_);
        assert.strictEqual(green.getValue(), 94);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { pixel.getGreen(); };
        assert.throws(execFunc, Error, 'getGreen() takes 1 positional arguments but 0 were given');

        execFunc = function () { pixel.getGreen(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the color of the pixel', function () {
        var green;

        green = pixel.getGreen(pixel);

        assert.instanceOf(green, Sk.builtin.int_);
        assert.strictEqual(green.getValue(), 94);
      });
    });
  });

  describe('getBlue', function () {
    var pixel;

    beforeEach(function () {
      setPixelColor(picture, 37, 94, 26, 55, 103);
      pixel = new mod.Pixel(picture, 55, 103);
    });

    describe('procedural', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { mod.getBlue(); };
        assert.throws(execFunc, Error, 'getBlue() takes 1 positional arguments but 0 were given');

        execFunc = function () { mod.getBlue(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the color of the pixel', function () {
        var blue;

        blue = mod.getBlue(pixel);

        assert.instanceOf(blue, Sk.builtin.int_);
        assert.strictEqual(blue.getValue(), 26);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel', function () {
        var execFunc;

        execFunc = function () { pixel.getBlue(); };
        assert.throws(execFunc, Error, 'getBlue() takes 1 positional arguments but 0 were given');

        execFunc = function () { pixel.getBlue(pixel); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should return the color of the pixel', function () {
        var blue;

        blue = pixel.getBlue(pixel);

        assert.instanceOf(blue, Sk.builtin.int_);
        assert.strictEqual(blue.getValue(), 26);
      });
    });
  });

  describe('setRed', function () {
    var pixel;

    beforeEach(function () {
      pixel = new mod.Pixel(picture, 99, 55);
    });

    describe('procedural', function () {
      it('should take a pixel and a red value', function () {
        var execFunc;

        execFunc = function () { mod.setRed(); };
        assert.throws(execFunc, Error, 'setRed() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.setRed(pixel); };
        assert.throws(execFunc, Error, 'setRed() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.setRed(pixel, 0); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should set the red value of the pixel', function () {
        var id;

        mod.setRed(pixel, 10);
        resetPicture(picture);
        id = picture.ctx.getImageData(99, 55, 1, 1);

        assert.strictEqual(id.data[0], 10);
        assert.strictEqual(id.data[1], 0);
        assert.strictEqual(id.data[2], 0);
        assert.strictEqual(id.data[3], 255);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel and a red value', function () {
        var execFunc;

        execFunc = function () { pixel.setRed(); };
        assert.throws(execFunc, Error, 'setRed() takes 2 positional arguments but 0 were given');

        execFunc = function () { pixel.setRed(pixel); };
        assert.throws(execFunc, Error, 'setRed() takes 2 positional arguments but 1 was given');

        execFunc = function () { pixel.setRed(pixel, 0); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should set the red value of the pixel', function () {
        var id;

        pixel.setRed(pixel, 10);
        resetPicture(picture);
        id = picture.ctx.getImageData(99, 55, 1, 1);

        assert.strictEqual(id.data[0], 10);
        assert.strictEqual(id.data[1], 0);
        assert.strictEqual(id.data[2], 0);
        assert.strictEqual(id.data[3], 255);
      });
    });
  });

  describe('setGreen', function () {
    var pixel;

    beforeEach(function () {
      pixel = new mod.Pixel(picture, 99, 55);
    });

    describe('procedural', function () {
      it('should take a pixel and a green value', function () {
        var execFunc;

        execFunc = function () { mod.setGreen(); };
        assert.throws(execFunc, Error, 'setGreen() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.setGreen(pixel); };
        assert.throws(execFunc, Error, 'setGreen() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.setGreen(pixel, 0); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should set the green value of the pixel', function () {
        var id;

        mod.setGreen(pixel, 10);
        resetPicture(picture);
        id = picture.ctx.getImageData(99, 55, 1, 1);

        assert.strictEqual(id.data[0], 0);
        assert.strictEqual(id.data[1], 10);
        assert.strictEqual(id.data[2], 0);
        assert.strictEqual(id.data[3], 255);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel and a green value', function () {
        var execFunc;

        execFunc = function () { pixel.setGreen(); };
        assert.throws(execFunc, Error, 'setGreen() takes 2 positional arguments but 0 were given');

        execFunc = function () { pixel.setGreen(pixel); };
        assert.throws(execFunc, Error, 'setGreen() takes 2 positional arguments but 1 was given');

        execFunc = function () { pixel.setGreen(pixel, 0); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should set the green value of the pixel', function () {
        var id;

        pixel.setGreen(pixel, 10);
        resetPicture(picture);
        id = picture.ctx.getImageData(99, 55, 1, 1);

        assert.strictEqual(id.data[0], 0);
        assert.strictEqual(id.data[1], 10);
        assert.strictEqual(id.data[2], 0);
        assert.strictEqual(id.data[3], 255);
      });
    });
  });

  describe('setBlue', function () {
    var pixel;

    beforeEach(function () {
      pixel = new mod.Pixel(picture, 99, 55);
    });

    describe('procedural', function () {
      it('should take a pixel and a blue value', function () {
        var execFunc;

        execFunc = function () { mod.setBlue(); };
        assert.throws(execFunc, Error, 'setBlue() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.setBlue(pixel); };
        assert.throws(execFunc, Error, 'setBlue() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.setBlue(pixel, 0); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should set the blue value of the pixel', function () {
        var id;

        mod.setBlue(pixel, 10);
        resetPicture(picture);
        id = picture.ctx.getImageData(99, 55, 1, 1);

        assert.strictEqual(id.data[0], 0);
        assert.strictEqual(id.data[1], 0);
        assert.strictEqual(id.data[2], 10);
        assert.strictEqual(id.data[3], 255);
      });
    });

    describe('object oriented', function () {
      it('should take a pixel and a blue value', function () {
        var execFunc;

        execFunc = function () { pixel.setBlue(); };
        assert.throws(execFunc, Error, 'setBlue() takes 2 positional arguments but 0 were given');

        execFunc = function () { pixel.setBlue(pixel); };
        assert.throws(execFunc, Error, 'setBlue() takes 2 positional arguments but 1 was given');

        execFunc = function () { pixel.setBlue(pixel, 0); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should set the blue value of the pixel', function () {
        var id;

        pixel.setBlue(pixel, 10);
        resetPicture(picture);
        id = picture.ctx.getImageData(99, 55, 1, 1);

        assert.strictEqual(id.data[0], 0);
        assert.strictEqual(id.data[1], 0);
        assert.strictEqual(id.data[2], 10);
        assert.strictEqual(id.data[3], 255);
      });
    });
  });
});
