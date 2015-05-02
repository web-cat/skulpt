describe('__init__', function () {
  var initMod, mod, pictureMod;

  initMod = $builtinmodule;
  pictureMod = window.pictureMod();

  beforeEach(function () {
    mod = initMod();
  });

  describe('pickAFile', function () {
    var stub, spy, modal;

    beforeEach(function () {
      stub = sinon.stub(window.pythy, 'showMediaModal', function (opts) {
        var link, body;

        link = document.createElement('a');
        link.href = './imgs/test.jpg';
        modal = document.createElement('div');
        modal.id = 'media_library_modal';
        body = document.getElementsByTagName('body')[0];
        body.appendChild(modal);
        $.fn.extend({ modal: function () {} });
        opts.mediaLinkClicked(link);
      });
      spy = sinon.spy(Sk.future, 'continueWith');
    });

    afterEach(function () {
      stub.restore();
      spy.restore();
      modal.remove();
      delete $.fn.modal;
    });

    it('should not take any arguments', function () {
      var execFunc;

      execFunc = function () { mod.pickAFile(); };
      assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
    });

    it('should open the pythy media modal', function () {
      mod.pickAFile();
      assert.isTrue(stub.calledOnce);
    });
  });

  describe('setMediaPath', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(Sk.misceval, 'print_');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should take a path', function () {
      var execFunc;

      execFunc = function () { mod.setMediaPath(); };
      assert.throws(execFunc, Sk.builtin.TypeError, 'setMediaPath() takes 1 positional arguments but 0 were given');
    });

    it('should indicate that it is not supported', function () {
      var ex;

      mod.setMediaPath('mypath');
      assert.isTrue(spy.calledTwice);
      assert.lengthOf(spy.getCall(0).args, 1);
      ex = spy.getCall(0).args[0];
      assert.instanceOf(ex, Error);
      assert.strictEqual(ex.message, 'Pythy does not support setting the media path.');
    });
  });

  describe('getMediaPath', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(Sk.misceval, 'print_');
    });

    afterEach(function () {
      spy.restore();
    });

    it('should not take any input', function () {
      var execFunc;

      execFunc = function () { mod.getMediaPath(); };
      assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
    });

    it('should indicate that it is not supported', function () {
      var ex;

      mod.getMediaPath();
      assert.isTrue(spy.calledTwice);
      assert.lengthOf(spy.getCall(0).args, 1);
      ex = spy.getCall(0).args[0];
      assert.instanceOf(ex, Error);
      assert.strictEqual(ex.message, 'Pythy does not support getting the media path.');
    });
  });
});
