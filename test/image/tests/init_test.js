describe('__init__', function () {
  var initMod, mod, pictureMod, doAfterSometime, TIMEOUT;

  initMod = $builtinmodule;
  pictureMod = window.pictureMod();
  TIMEOUT = 50;
  doAfterSometime = function (test) { window.setTimeout(test, TIMEOUT); };

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

  describe('writePictureTo', function () {
    var picture;

    beforeEach(function () {
      picture = new pictureMod.Picture('./imgs/test.jpg');
    });

    it('should take the picture and the filename', function (done) {
      doAfterSometime(function () {
        var execFunc;

        execFunc = function () { mod.writePictureTo(); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'writePictureTo() takes 2 positional arguments but 0 were given');

        execFunc = function () { mod.writePictureTo(picture); };
        assert.throws(execFunc, Sk.builtin.TypeError, 'writePictureTo() takes 2 positional arguments but 1 was given');

        execFunc = function () { mod.writePictureTo(picture, 'newImg.jpg'); };
        assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
        done();
      });
    });

    it('should produce a base64 encoded image url', function (done) {
      doAfterSometime(function () {
        var stub, args;

        stub = sinon.stub(window.mediaffi, 'writePictureTo');

        mod.writePictureTo(picture, 'newImg.jpg');
        assert.isTrue(stub.calledOnce);
        args = stub.getCall(0).args;
        assert.lengthOf(args, 3);
        // Using lengthOf instead of match because match gives an error
        // 're.exec is not a function'
        assert.lengthOf(args[0].match(/^data\:image\/jpeg\;base64/), 1);
        assert.strictEqual(args[1], 'newImg.jpg');
        done();
      });
    });
  });

  describe('openPictureTool', function () {
    var picture;

    beforeEach(function () {
      picture = new pictureMod.Picture('./imgs/test.jpg'); 
    });

    it('should take a picture', function () {
      var execFunc;

      execFunc = function () { mod.openPictureTool(); }
      assert.throws(execFunc, Sk.builtin.TypeError, 'openPictureTool() takes 1 positional arguments but 0 were given');

      execFunc = function () { mod.openPictureTool(picture); }
      assert.doesNotThrow(execFunc, Sk.builtin.TypeError);
    });

    it('should open the picture tool', function (done) {
      doAfterSometime(function () {
        var spy;

        spy = sinon.spy(window.pythy.PictureTool.prototype, 'show');
        mod.openPictureTool(picture);

        assert.isTrue(spy.calledOnce);
        done();
      });
    });
  });
});
