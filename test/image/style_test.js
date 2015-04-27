describe('Style', function () {
  var mod, styleMod;

  styleMod = $builtinmodule;

  beforeEach(function () {
    mod = styleMod();
  });

  it('should have all the required constants', function () {
    assert.isDefined(mod.PLAIN);
    assert.isDefined(mod.BOLD);
    assert.isDefined(mod.ITALIC);
    assert.isDefined(mod.sansSerif);
    assert.isDefined(mod.serif);
    assert.isDefined(mod.mono);
    assert.isDefined(mod.comicSans);
  });

  describe('makeStyle', function () {
    it('should take a font family, the emphasis and the font size', function () {
      var execFunc, family, emph, size;

      execFunc = function () { mod.makeStyle(); };
      assert.throws(execFunc, Error, 'makeStyle() takes 3 positional arguments but 0 were given');

      execFunc = function () { mod.makeStyle(mod.sansSerif); };
      assert.throws(execFunc, Error, 'makeStyle() takes 3 positional arguments but 1 was given');

      execFunc = function () { mod.makeStyle(mod.sansSerif, mod.PLAIN); };
      assert.throws(execFunc, Error, 'makeStyle() takes 3 positional arguments but 2 were given');

      execFunc = function () { mod.makeStyle(mod.sansSerif, mod.PLAIN, 10); };
      assert.doesNotThrow(execFunc, Error);
    });
  });

  describe('__init__', function () {
    it('should take a font family, the emphasis and the font size', function () {
      var execFunc, family, emph, size;

      execFunc = function () { new mod.Style(); };
      assert.throws(execFunc, Error, '__init__() takes 4 positional arguments but 1 was given');

      execFunc = function () { new mod.Style(mod.sansSerif); };
      assert.throws(execFunc, Error, '__init__() takes 4 positional arguments but 2 were given');

      execFunc = function () { new mod.Style(mod.sansSerif, mod.PLAIN); };
      assert.throws(execFunc, Error, '__init__() takes 4 positional arguments but 3 were given');

      execFunc = function () { new mod.Style(mod.sansSerif, mod.PLAIN, 10); };
      assert.doesNotThrow(execFunc, Error);
    });
  });

  describe('__str__', function () {
    it('should yield a descriptive string containing the class name, family, emphasis and font size', function () {
      var style;

      style = mod.makeStyle(mod.sansSerif, mod.PLAIN, 10);
      assert.strictEqual(style.__str__(style).getValue(), 'Style, family Sans Serif, emph 0, size 10');
      assert.instanceOf(style.__str__(style), Sk.builtin.str);

      style = mod.makeStyle(mod.serif, mod.BOLD + mod.ITALIC, 16);
      assert.strictEqual(style.__str__(style).getValue(), 'Style, family Serif, emph 3, size 16');
    });
  });

  describe('_toJSString', function () {
    it('should produce a valid string that can be used as input to the JS canvas context', function () {
      var style;
      
      style = mod.makeStyle(mod.sansSerif, mod.PLAIN, 10);
      assert.strictEqual(style._toJSString(style).trim(), '10pt Sans Serif');

      style = mod.makeStyle(mod.serif, mod.ITALIC + mod.BOLD, 16);
      assert.strictEqual(style._toJSString(style).trim(), 'bold italic 16pt Serif');
    });
  });
});
