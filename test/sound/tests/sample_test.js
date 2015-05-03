describe('Sample', function () {
  var mod;

  window.sampleMod = $builtinmodule;

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
});
