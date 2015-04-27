(function () {
  var colorMod, init, mod, testConstants, assert;

  init = function () {
    colorMod = $builtinmodule;
    assert = chai.assert;
    testConstants();
  };

  beforeEach = function () {
    mod = colorMod();
  };

  testConstants = function () {
    beforeEach();

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
  }

  init();
}());
