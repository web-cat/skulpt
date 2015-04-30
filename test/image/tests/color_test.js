describe('Color', function () {
  var mod;

  window.colorMod = $builtinmodule;

  beforeEach(function () {
    mod = window.colorMod();
  });

  it('should have all the required constants', function () {
    assert.isDefined(mod.black);
    assert.isDefined(mod.blue);
    assert.isDefined(mod.cyan);
    assert.isDefined(mod.darkGray);
    assert.isDefined(mod.gray);
    assert.isDefined(mod.green);
    assert.isDefined(mod.lightGray);
    assert.isDefined(mod.magenta);
    assert.isDefined(mod.orange);
    assert.isDefined(mod.pink);
    assert.isDefined(mod.red);
    assert.isDefined(mod.white);
    assert.isDefined(mod.yellow);
  });

  describe('makeColor', function () {
    it('should take the red value and use it as gray if green and blue values are not provided', function () {
      var execFunc, color;

      execFunc = function () { mod.makeColor(); };
      assert.throws(execFunc, Error, 'makeColor() takes between 1 and 3 positional arguments but 0 were given');

      execFunc = function () { mod.makeColor(20); };
      assert.doesNotThrow(execFunc, Error);

      color = mod.makeColor(123);
      assert.strictEqual(color._red, 123);
      assert.strictEqual(color._green, 123);
      assert.strictEqual(color._blue, 123);
    });

    it('should optionally take the green value', function () {
      var execFunc, color;

      execFunc = function () { mod.makeColor(20, 55); };
      assert.doesNotThrow(execFunc, Error);
  
      color = mod.makeColor(20, 55);
      assert.strictEqual(color._red, 20);
      assert.strictEqual(color._green, 55);
      assert.strictEqual(color._blue, 20);
    });

    it('should optionally take the blue value', function () {
      var execFunc, color;

      execFunc = function () { mod.makeColor(20, 55, 75); };
      assert.doesNotThrow(execFunc, Error);

      color = mod.makeColor(20, 55, 75);
      assert.strictEqual(color._red, 20);
      assert.strictEqual(color._green, 55);
      assert.strictEqual(color._blue, 75);
    });

    it('should take a color and return a new color with the same rgb values', function () {
      var color;

      color = mod.makeColor(20, 14, 106);
      newColor = mod.makeColor(color);
      assert.notStrictEqual(color, newColor);
      assert.strictEqual(newColor._red, 20);
      assert.strictEqual(newColor._green, 14);
      assert.strictEqual(newColor._blue, 106);
    });
  });

  describe('__init__', function () {
    it('should take the red value and use it as gray if green and blue values are not provided', function () {
      var execFunc, color;

      execFunc = function () { new mod.Color(); };
      assert.throws(execFunc, Error, '__init__() takes between 2 and 4 positional arguments but 1 was given');

      execFunc = function () { new mod.Color(20); };
      assert.doesNotThrow(execFunc, Error);

      color = new mod.Color(123);
      assert.strictEqual(color._red, 123);
      assert.strictEqual(color._green, 123);
      assert.strictEqual(color._blue, 123);
    });

    it('should optionally take the green value', function () {
      var execFunc, color;

      execFunc = function () { new mod.Color(20, 55); };
      assert.doesNotThrow(execFunc, Error);
  
      color = new mod.Color(20, 55);
      assert.strictEqual(color._red, 20);
      assert.strictEqual(color._green, 55);
      assert.strictEqual(color._blue, 20);

      color = new mod.Color(20, 0);
      assert.strictEqual(color._green, 0);
    });

    it('should optionally take the blue value', function () {
      var execFunc, color;

      execFunc = function () { new mod.Color(20, 55, 75); };
      assert.doesNotThrow(execFunc, Error);

      color = new mod.Color(20, 55, 75);
      assert.strictEqual(color._red, 20);
      assert.strictEqual(color._green, 55);
      assert.strictEqual(color._blue, 75);

      color = new mod.Color(20, 55, 0);
      assert.strictEqual(color._blue, 0);
    });

    it('should take a color and return a new color with the same rgb values', function () {
      var color;

      color = new mod.Color(20, 14, 106);
      newColor = new mod.Color(color);
      assert.notStrictEqual(color, newColor);
      assert.strictEqual(newColor._red, 20);
      assert.strictEqual(newColor._green, 14);
      assert.strictEqual(newColor._blue, 106);
    });
  });

  describe('__str__', function () {
    it('should yield a descriptive string containing the class name and rgb values', function () {
      var color, newColor;

      color = new mod.Color(42, 133, 56);
      assert.strictEqual(color.__str__(color).getValue(), 'Color, r=42, g=133, b=56');
      assert.instanceOf(color.__str__(color), Sk.builtin.str);

      newColor = new mod.Color(color);
      assert.strictEqual(newColor.__str__(newColor).getValue(), 'Color, r=42, g=133, b=56');
      assert.instanceOf(newColor.__str__(newColor), Sk.builtin.str);
    });
  });

  describe('pickAColor', function () {
    it('should open the pythy color picker and return a color', function () {
      var stub, color;

      stub = sinon.stub(window.pythy.ColorPicker.prototype, 'show', function (callback) {
        callback(25, 63, 199);
      });

      color = mod.pickAColor();

      assert.isTrue(stub.calledOnce);
      assert.strictEqual(color.tp$name, 'Color');
      assert.strictEqual(color._red, 25);
      assert.strictEqual(color._green, 63);
      assert.strictEqual(color._blue, 199);

      stub.restore();
    });
  });

  describe('makeDarker', function () {
    var color;

    beforeEach(function () {
      color = new mod.Color(204, 153, 255);
    });

    describe('procedural', function () {
      it('should take a color', function () {
        var execFunc;

        execFunc = function () { mod.makeDarker(); } 

        assert.throws(execFunc, Error, 'makeDarker() takes 1 positional arguments but 0 were given');
      });

      it('should return a color darker by 15%', function () {
        var darker;

        darker = mod.makeDarker(color);
        assert.strictEqual(darker._red, 173);
        assert.strictEqual(darker._green, 130);
        assert.strictEqual(darker._blue, 216);
      });
    });

    describe('object oriented', function () {
      it('should take a color', function () {
        var execFunc;

        execFunc = function () { color.makeDarker(); } 

        assert.throws(execFunc, Error, 'makeDarker() takes 1 positional arguments but 0 were given');
      });

      it('should return a color darker by 15%', function () {
        var darker;

        darker = color.makeDarker(color);
        assert.strictEqual(darker._red, 173);
        assert.strictEqual(darker._green, 130);
        assert.strictEqual(darker._blue, 216);
      });
    });
  });

  describe('makeLighter', function () {
    var color;

    beforeEach(function () {
      color = new mod.Color(173, 130, 216);
    });

    describe('procedural', function () {
      it('should take a color', function () {
        var execFunc;

        execFunc = function () { mod.makeLighter(); } 

        assert.throws(execFunc, Error, 'makeLighter() takes 1 positional arguments but 0 were given');
      });

      it('should return a color lighter by 15%', function () {
        var lighter;

        lighter = mod.makeLighter(color);
        assert.strictEqual(lighter._red, 203);
        assert.strictEqual(lighter._green, 152);
        assert.strictEqual(lighter._blue, 254);
      });

      it('should handle black properly', function () {
        var gray;

        gray = mod.makeLighter(mod.black);
        assert.strictEqual(gray._red, 6);
        assert.strictEqual(gray._green, 6);
        assert.strictEqual(gray._blue, 6);
      });
    });

    describe('object oriented', function () {
      it('should take a color', function () {
        var execFunc;

        execFunc = function () { color.makeLighter(); } 

        assert.throws(execFunc, Error, 'makeLighter() takes 1 positional arguments but 0 were given');
      });

      it('should return a color lighter by 15%', function () {
        var lighter;

        lighter = color.makeLighter(color);
        assert.strictEqual(lighter._red, 203);
        assert.strictEqual(lighter._green, 152);
        assert.strictEqual(lighter._blue, 254);
      });

      it('should handle black properly', function () {
        var gray;

        gray = mod.black.makeLighter(mod.black);
        assert.strictEqual(gray._red, 6);
        assert.strictEqual(gray._green, 6);
        assert.strictEqual(gray._blue, 6);
      });
    });
  });

  describe('makeBrighter', function () {
    var color;

    beforeEach(function () {
      color = new mod.Color(173, 130, 216);
    });

    describe('procedural', function () {
      it('should take a color', function () {
        var execFunc;

        execFunc = function () { mod.makeBrighter(); } 

        assert.throws(execFunc, Error, 'makeBrighter() takes 1 positional arguments but 0 were given');
      });

      it('should return a color brighter by 15%', function () {
        var brighter;

        brighter = mod.makeBrighter(color);
        assert.strictEqual(brighter._red, 203);
        assert.strictEqual(brighter._green, 152);
        assert.strictEqual(brighter._blue, 254);
      });

      it('should handle black properly', function () {
        var gray;

        gray = mod.makeBrighter(mod.black);
        assert.strictEqual(gray._red, 6);
        assert.strictEqual(gray._green, 6);
        assert.strictEqual(gray._blue, 6);
      });
    });

    describe('object oriented', function () {
      it('should take a color', function () {
        var execFunc;

        execFunc = function () { color.makeBrighter(); } 

        assert.throws(execFunc, Error, 'makeBrighter() takes 1 positional arguments but 0 were given');
      });

      it('should return a color brighter by 15%', function () {
        var brighter;

        brighter = color.makeBrighter(color);
        assert.strictEqual(brighter._red, 203);
        assert.strictEqual(brighter._green, 152);
        assert.strictEqual(brighter._blue, 254);
      });

      it('should handle black properly', function () {
        var gray;

        gray = mod.black.makeBrighter(mod.black);
        assert.strictEqual(gray._red, 6);
        assert.strictEqual(gray._green, 6);
        assert.strictEqual(gray._blue, 6);
      });
    });
  });

  describe('distance', function () {
    describe('procedural', function () {
      it('should take two colors', function () {
        var execFunc;

        execFunc = function () { mod.distance(); };
        assert.throws(execFunc, Error, 'distance() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.distance(mod.magenta); };
        assert.throws(execFunc, Error, 'distance() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.distance(mod.magenta, mod.pink); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should report the correct distance', function () {
        var distance;

        distance = mod.distance(mod.orange, mod.pink);
        assert.instanceOf(distance, Sk.builtin.float_);
        assert.closeTo(distance.getValue(), 176.78, 0.01);
      });
    });

    describe('object oriented', function () {
      it('should take two colors', function () {
        var execFunc;

        execFunc = function () { mod.magenta.distance(); };
        assert.throws(execFunc, Error, 'distance() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.magenta.distance(mod.magenta); };
        assert.throws(execFunc, Error, 'distance() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.magenta.distance(mod.magenta, mod.pink); };
        assert.doesNotThrow(execFunc, Error);
      });

      it('should report the correct distance', function () {
        var distance;

        distance = mod.orange.distance(mod.orange, mod.pink);
        assert.instanceOf(distance, Sk.builtin.float_);
        assert.closeTo(distance.getValue(), 176.78, 0.01);
      });
    });
  });
});
