var $builtinmodule = function(name)
{
  var media = {
      __name__: Sk.builtins.str('media')
  };


  //~ Functions ..............................................................

  // =========================================================================
  /*
   * Colors
   */

  // ------------------------------------------------------------
  media.distance = new Sk.builtin.func(function(color1, color2)
  {
    Sk.ffi.checkArgs('distance', arguments, 2);
    return Sk.misceval.callsim(color1.distance, color1, color2);
  });


  // ------------------------------------------------------------
  media.makeColor = new Sk.builtin.func(function(r, g, b)
  {
    Sk.ffi.checkArgs('makeColor', arguments, 3);
    return Sk.misceval.callsim(media.Color, r, g, b);
  });


  // ------------------------------------------------------------
  media.makeDarker = new Sk.builtin.func(function(color)
  {
    Sk.ffi.checkArgs('makeDarker', arguments, 1);
    return Sk.misceval.callsim(color.makeDarker, color);
  });


  // ------------------------------------------------------------
  media.makeLighter = new Sk.builtin.func(function(color)
  {
    Sk.ffi.checkArgs('makeLighter', arguments, 1);
    return Sk.misceval.callsim(color.makeLighter, color);
  });


  // ------------------------------------------------------------
  media.pickAColor = new Sk.builtin.func(function()
  {
    Sk.ffi.checkArgs('pickAColor', arguments, 0);

    return Sk.future(function(continueWith)
    {
      _showColorPicker(continueWith);
    });
  });


  // ------------------------------------------------------------
  media.pickAFile = new Sk.builtin.func(function()
  {
    Sk.ffi.checkArgs('pickAFile', arguments, 0);

    return Sk.future(function(continueWith)
    {
      _showFilePicker(continueWith);
    });
  });


  // ------------------------------------------------------------
  media.getColorWrapAround = new Sk.builtin.func(function()
  {
    Sk.ffi.checkArgs('getColorWrapAround', arguments, 0);
    // TODO implement
    throw new Sk.builtin.Exception("getColorWrapAround not yet implemented");
  });


  // ------------------------------------------------------------
  media.setColorWrapAround = new Sk.builtin.func(function(flag)
  {
    Sk.ffi.checkArgs('setColorWrapAround', arguments, 1);
    // TODO implement
    throw new Sk.builtin.Exception("setColorWrapAround not yet implemented");
  });


  // =========================================================================
  /*
   * Pixels
   */

  // ------------------------------------------------------------
  media.getColor = new Sk.builtin.func(function(pixel)
  {
    Sk.ffi.checkArgs('getColor', arguments, 1);

    return Sk.misceval.callsim(media.Color,
      Sk.misceval.callsim(pixel.getRed, pixel),
      Sk.misceval.callsim(pixel.getGreen, pixel),
      Sk.misceval.callsim(pixel.getBlue, pixel));
  });


  // ------------------------------------------------------------
  media.setColor = new Sk.builtin.func(function(pixel, color)
  {
    Sk.ffi.checkArgs('setColor', arguments, 2);

    Sk.misceval.callsim(pixel.setRed, pixel, color.red);
    Sk.misceval.callsim(pixel.setGreen, pixel, color.green);
    Sk.misceval.callsim(pixel.setBlue, pixel, color.blue);
  });


  // ------------------------------------------------------------
  media.getRed = new Sk.builtin.func(function(pixel)
  {
    Sk.ffi.checkArgs('getRed', arguments, 1);
    return Sk.misceval.callsim(pixel.getRed, pixel);
  });


  // ------------------------------------------------------------
  media.getGreen = new Sk.builtin.func(function(pixel)
  {
    Sk.ffi.checkArgs('getGreen', arguments, 1);
    return Sk.misceval.callsim(pixel.getGreen, pixel);
  });


  // ------------------------------------------------------------
  media.getBlue = new Sk.builtin.func(function(pixel)
  {
    Sk.ffi.checkArgs('getBlue', arguments, 1);
    return Sk.misceval.callsim(pixel.getBlue, pixel);
  });


  // ------------------------------------------------------------
  media.setRed = new Sk.builtin.func(function(pixel, r)
  {
    Sk.ffi.checkArgs('setRed', arguments, 2);
    Sk.misceval.callsim(pixel.setRed, pixel, r);
  });


  // ------------------------------------------------------------
  media.setGreen = new Sk.builtin.func(function(pixel, g)
  {
    Sk.ffi.checkArgs('setGreen', arguments, 2);
    Sk.misceval.callsim(pixel.setGreen, pixel, g);
  });


  // ------------------------------------------------------------
  media.setBlue = new Sk.builtin.func(function(pixel, b)
  {
    Sk.ffi.checkArgs('setBlue', arguments, 2);
    Sk.misceval.callsim(pixel.setBlue, pixel, b);
  });


  // ------------------------------------------------------------
  media.getX = new Sk.builtin.func(function(pixel)
  {
    Sk.ffi.checkArgs('getX', arguments, 1);
    return pixel.x;
  });


  // ------------------------------------------------------------
  media.getY = new Sk.builtin.func(function(pixel)
  {
    Sk.ffi.checkArgs('getY', arguments, 1);
    return pixel.y;
  });


  // =========================================================================
  /*
   * Pictures
   */

  // ------------------------------------------------------------
  media.addArc = new Sk.builtin.func(
    function(picture, x, y, width, height, start, angle, color)
  {
    Sk.ffi.checkArgs('addArc', arguments, [7, 8]);

    _drawInto(picture, function(ctx) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = _styleFromColor(color || media.black);

      var startRads = -_degToRad(start);
      var angleRads = _degToRad(angle);
      var endRads = startRads - angleRads;
      var reversed = (angleRads >= 0);

      _drawEllipticalArc(ctx, x, y, width, height, startRads, endRads, reversed, false);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.addArcFilled = new Sk.builtin.func(
    function(picture, x, y, width, height, start, angle, color)
  {
    Sk.ffi.checkArgs('addArcFilled', arguments, [7, 8]);

    _drawInto(picture, function(ctx) {
      ctx.lineWidth = 1;
      ctx.fillStyle = _styleFromColor(color || media.black);

      var startRads = -_degToRad(start);
      var angleRads = _degToRad(angle);
      var endRads = startRads - angleRads;
      var reversed = (angleRads >= 0);

      _drawEllipticalArc(ctx, x, y, width, height, startRads, endRads, reversed, true);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.addLine = new Sk.builtin.func(function(picture, x1, y1, x2, y2, color)
  {
    Sk.ffi.checkArgs('addLine', arguments, [5, 6]);

    _drawInto(picture, function(ctx) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = _styleFromColor(color || media.black);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    return null;
  });


  // ------------------------------------------------------------
  media.addOval = new Sk.builtin.func(function(picture, x, y, width, height, color)
  {
    Sk.ffi.checkArgs('addOval', arguments, [5, 6]);

    _drawInto(picture, function(ctx) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = _styleFromColor(color || media.black);
      _drawEllipse(ctx, x, y, width, height, false);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.addOvalFilled = new Sk.builtin.func(function(picture, x, y, width, height, color)
  {
    Sk.ffi.checkArgs('addOvalFilled', arguments, [5, 6]);

    _drawInto(picture, function(ctx) {
      ctx.lineWidth = 1;
      ctx.fillStyle = _styleFromColor(color || media.black);
      _drawEllipse(ctx, x, y, width, height, true);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.addRect = new Sk.builtin.func(function(picture, x, y, width, height, color)
  {
    Sk.ffi.checkArgs('addRect', arguments, [5, 6]);

    _drawInto(picture, function(ctx) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = _styleFromColor(color || media.black);
      ctx.strokeRect(x, y, width, height);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.addRectFilled = new Sk.builtin.func(function(picture, x, y, width, height, color)
  {
    Sk.ffi.checkArgs('addRectFilled', arguments, [5, 6]);

    _drawInto(picture, function(ctx) {
      ctx.lineWidth = 1;
      ctx.fillStyle = _styleFromColor(color || media.black);
      ctx.fillRect(x, y, width, height);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.addText = new Sk.builtin.func(function(picture, x, y, text, color)
  {
    Sk.ffi.checkArgs('addText', arguments, [4, 5]);

    _drawInto(picture, function(ctx) {
      ctx.fillStyle = _styleFromColor(color || media.black);
      var h = _measureText(text.v, ctx.font).height;
      ctx.fillText(text.v, x, y + h);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.addTextWithStyle = new Sk.builtin.func(
    function(picture, x, y, text, style, color)
  {
    Sk.ffi.checkArgs('addTextWithStyle', arguments, [5, 6]);

    _drawInto(picture, function(ctx) {
      ctx.fillStyle = _styleFromColor(color || media.black);
      ctx.font = style.v;
      var h = _measureText(text.v, ctx.font).height;
      ctx.fillText(text.v, x, y + h);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.makeStyle = new Sk.builtin.func(function(font, emphasis, size)
  {
    Sk.ffi.checkArgs('makeStyle', arguments, 3);
    return new Sk.builtin.str(emphasis.v + ' ' + size + 'pt \'' + font.v + '\'');
  });


  // ------------------------------------------------------------
  media.copyInfo = new Sk.builtin.func(function(smallPic, bigPic, x, y)
  {
    Sk.ffi.checkArgs('copyInto', arguments, 4);

    _drawInto(bigPic, function(ctx) {
      ctx.putImageData(smallPic.imageData, x, y);
    });

    return null;
  });


  // ------------------------------------------------------------
  media.duplicatePicture = new Sk.builtin.func(function(picture)
  {
    Sk.ffi.checkArgs('duplicatePicture', arguments, 1);

    // This unnecessarily creates the empty image's imageData before totally
    // replacing it with a new imageData that is a copy of the original
    // image's data. Could probably be optimized.

    var result = Sk.misceval.callsim(media.EmptyPicture,
      picture.width, picture.height);

    _drawInto(result, function(ctx) {
      ctx.putImageData(picture.imageData, 0, 0);
    });

    return result;
  });


  // ------------------------------------------------------------
  media.explore = new Sk.builtin.func(function(picture)
  {
    Sk.ffi.checkArgs('explore', arguments, 1);
    _show(picture);

    return null;
  });


  // ------------------------------------------------------------
  media.getHeight = new Sk.builtin.func(function(picture)
  {
    Sk.ffi.checkArgs('getHeight', arguments, 1);
    return picture.height;
  });


  // ------------------------------------------------------------
  media.getWidth = new Sk.builtin.func(function(picture)
  {
    Sk.ffi.checkArgs('getWidth', arguments, 1);
    return picture.width;
  });


  // ------------------------------------------------------------
  media.getPixelAt = new Sk.builtin.func(function(picture, x, y)
  {
    Sk.ffi.checkArgs('getPixelAt', arguments, 3);
    return _getPixelAt(picture, x, y);
  });


  // ------------------------------------------------------------
  media.getPixel = new Sk.builtin.func(function(picture, x, y)
  {
    Sk.ffi.checkArgs('getPixel', arguments, 3);
    return _getPixelAt(picture, x, y);
  });


  // ------------------------------------------------------------
  media.getPixels = new Sk.builtin.func(function(picture)
  {
    Sk.ffi.checkArgs('getPixels', arguments, 1);

    var width = picture.width;
    var height = picture.height;

    return Sk.builtin.makeGenerator(function() {
      if (this.$x == this.$width)
      {
        this.$y++;
        this.$x = 0;
      }

      if (this.$y == this.$height)
      {
        return undefined;
      }
      else
      {
        return Sk.misceval.callsim(
          media.Pixel, this.$obj, this.$x++, this.$y);
      }
    }, {
      $obj: picture,
      $x: 0,
      $y: 0,
      $width: picture.width,
      $height: picture.height
    });
  });


  // ------------------------------------------------------------
  media.makeEmptyPicture = new Sk.builtin.func(function(width, height, color)
  {
    Sk.ffi.checkArgs('makeEmptyPicture', arguments, [2, 3]);
    return Sk.misceval.callsim(media.EmptyPicture, width, height, color);
  });


  // ------------------------------------------------------------
  media.makePicture = new Sk.builtin.func(function(url)
  {
    Sk.ffi.checkArgs('makePicture', arguments, 1);
    return Sk.misceval.callsim(media.Picture, url);
  });


  // ------------------------------------------------------------
  media.openPictureTool = new Sk.builtin.func(function(picture)
  {
    Sk.ffi.checkArgs('openPictureTool', arguments, 1);
    _show(picture);

    return null;
  });


  // ------------------------------------------------------------
  media.repaint = new Sk.builtin.func(function(picture)
  {
    Sk.ffi.checkArgs('repaint', arguments, 1);
    _show(picture);

    return null;
  });


  // ------------------------------------------------------------
  media.setAllPixelsToAColor = new Sk.builtin.func(function(picture, color)
  {
    Sk.ffi.checkArgs('setAllPixelsToAColor', arguments, 2);
    Sk.misceval.callsim(picture.setAllPixelsToAColor, picture, color);

    return null;
  });


  // ------------------------------------------------------------
  media.show = new Sk.builtin.func(function(picture)
  {
    Sk.ffi.checkArgs('show', arguments, 1);
    _show(picture);

    return null;
  });


  // ------------------------------------------------------------
  media.writePictureTo = new Sk.builtin.func(function(picture, path)
  {
    Sk.ffi.checkArgs('writePictureTo', arguments, 2);

    if (_ffi('writePictureTo'))
    {
      Sk.future(function(continueWith)
      {
        _drawInto(picture, function(ctx, canvas) {
          // Extract the file extension. It looks bizarre at first; source is
          // http://stackoverflow.com/a/12900504/307266.
          path = path.v;

          var type = path.substr((
            Math.max(0, path.lastIndexOf(".")) || Infinity) + 1);
          var dataURL = Canvas2Image.convertToURI(
            canvas, picture.width, picture.height, type);

          _ffi('writePictureTo')(dataURL, path, continueWith);
        });
      });

      return null;
    }
    else
    {
      throw new Sk.builtin.Exception("writePictureTo not yet implemented");
    }
  });


  // =========================================================================
  /*
   * Input/Output
   */

  // ------------------------------------------------------------
  media.printNow = new Sk.builtin.func(function(output)
  {
    Sk.ffi.checkArgs('printNow', arguments, 1);
    Sk.misceval.print_(output);
    Sk.misceval.print_('\n');
  });


  // ------------------------------------------------------------
  media.requestNumber = new Sk.builtin.func(function(message)
  {
    Sk.ffi.checkArgs('requestNumber', arguments, 1);

    return Sk.future(function(continueWith)
    {
      _showRequestNumber(continueWith, message.v);
    });
  });


  // ------------------------------------------------------------
  media.requestInteger = new Sk.builtin.func(function(message)
  {
    Sk.ffi.checkArgs('requestInteger', arguments, 1);

    return Sk.future(function(continueWith)
    {
      _showRequestInteger(continueWith, message.v);
    });
  });


  // ------------------------------------------------------------
  media.requestIntegerInRange = new Sk.builtin.func(function(message, min, max)
  {
    Sk.ffi.checkArgs('requestIntegerInRange', arguments, 3);

    return Sk.future(function(continueWith)
    {
      _showRequestIntegerInRange(continueWith, message.v, min, max);
    });
  });


  // ------------------------------------------------------------
  media.requestString = new Sk.builtin.func(function(message)
  {
    Sk.ffi.checkArgs('requestString', arguments, 1);

    return Sk.future(function(continueWith)
    {
      _showRequestString(continueWith, message.v);
    });
  });


  // ------------------------------------------------------------
  media.showError = new Sk.builtin.func(function(message)
  {
    Sk.ffi.checkArgs('showError', arguments, 1);

    return Sk.future(function(continueWith)
    {
      _showMessageModal(continueWith, message.v, 'error');
    });
  });


  // ------------------------------------------------------------
  media.showInformation = new Sk.builtin.func(function(message)
  {
    Sk.ffi.checkArgs('showInformation', arguments, 1);

    return Sk.future(function(continueWith)
    {
      _showMessageModal(continueWith, message.v, 'info');
    });
  });


  // ------------------------------------------------------------
  media.showWarning = new Sk.builtin.func(function(message)
  {
    Sk.ffi.checkArgs('showWarning', arguments, 1);

    return Sk.future(function(continueWith)
    {
      _showMessageModal(continueWith, message.v, 'warning');
    });
  });


  // =========================================================================
  /*
   * Sound
   */

  // ------------------------------------------------------------
  media.blockingPlay = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('blockingPlay', arguments, 1);
    return Sk.misceval.callsim(sound.blockingPlay, sound);
  });


  // ------------------------------------------------------------
  media.duplicateSound = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('duplicateSound', arguments, 1);

    var copy = Sk.misceval.callsim(media.Sound,
      sound.samples.length, sound.samplingRate);
    for (var i = 0; i < sound.samples.length; i++)
      copy.samples[i] = sound.samples[i];

    return copy;
  });


  // ------------------------------------------------------------
  media.getDuration = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('getDuration', arguments, 1);
    return sound.samples.length / sound.samples.samplingRate;
  });


  // ------------------------------------------------------------
  media.getLength = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('getLength', arguments, 1);
    return sound.samples.length;
  });


  // ------------------------------------------------------------
  media.getNumSamples = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('getNumSamples', arguments, 1);
    return sound.samples.length;
  });


  // ------------------------------------------------------------
  media.getSampleObjectAt = new Sk.builtin.func(function(sound, index)
  {
    Sk.ffi.checkArgs('getSampleObjectAt', arguments, 2);
    return Sk.misceval.callsim(media.Sample, sound, index);
  });


  // ------------------------------------------------------------
  media.getSamples = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('getSamples', arguments, 1);
    // TODO implement
    throw new Sk.builtin.Exception("getSamples not yet implemented");
  });


  // ------------------------------------------------------------
  media.getSampleValue = new Sk.builtin.func(function(sample)
  {
    Sk.ffi.checkArgs('getSampleValue', arguments, 1);
    return self.samples[sample.value];
  });


  // ------------------------------------------------------------
  media.getSampleValueAt = new Sk.builtin.func(function(sound, index)
  {
    Sk.ffi.checkArgs('getSampleValueAt', arguments, 2);
    return sound.samples[index];
  });


  // ------------------------------------------------------------
  media.getSamplingRate = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('getSamplingRate', arguments, 1);
    return sound.samplingRate;
  });


  // ------------------------------------------------------------
  media.getSound = new Sk.builtin.func(function(sample)
  {
    Sk.ffi.checkArgs('getSound', arguments, 1);
    return sample.sound;
  });


  // ------------------------------------------------------------
  media.makeEmptySound = new Sk.builtin.func(
    function(numSamples, samplingRate)
  {
    Sk.ffi.checkArgs('makeEmptySound', arguments, [1, 2]);

    samplingRate = samplingRate || SAMPLE_RATE;
    return Sk.misceval.callsim(media.Sound, numSamples, samplingRate);
  });


  // ------------------------------------------------------------
  media.makeEmptySoundBySeconds = new Sk.builtin.func(
    function(duration, samplingRate)
  {
    Sk.ffi.checkArgs('makeEmptySoundBySeconds', arguments, [1, 2]);

    samplingRate = samplingRate || SAMPLE_RATE;
    var numSamples = Math.floor(duration * samplingRate);
    return Sk.misceval.callsim(media.Sound, numSamples, samplingRate);
  });


  // ------------------------------------------------------------
  media.makeSound = new Sk.builtin.func(function(url)
  {
    Sk.ffi.checkArgs('makeSound', arguments, 1);
    // TODO implement
    throw new Sk.builtin.Exception("makeSound not yet implemented");
  });


  // ------------------------------------------------------------
  media.play = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('play', arguments, 1);
    return Sk.misceval.callsim(sound.play, sound);
  });


  // ------------------------------------------------------------
  media.playNote = new Sk.builtin.func(function(note, duration, intensity)
  {
    Sk.ffi.checkArgs('playNote', arguments, [2, 3]);

    var freq = (440 / 32) * Math.pow(2, (note - 9) / 12);
    if (intensity === undefined) intensity = 64;

    // TODO implement
    throw new Sk.builtin.Exception("playNote not yet implemented");
  });


  // ------------------------------------------------------------
  media.setSampleValue = new Sk.builtin.func(function(sample, value)
  {
    Sk.ffi.checkArgs('setSampleValue', arguments, 2);
    self.samples[sample.index] = value;
  });


  // ------------------------------------------------------------
  media.setSampleValueAt = new Sk.builtin.func(
    function(sound, index, value)
  {
    Sk.ffi.checkArgs('setSampleValueAt', arguments, 3);
    sound.samples[index] = value;
  });


  // ------------------------------------------------------------
  media.stopPlaying = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('stopPlaying', arguments, 1);
    // TODO implement
    throw new Sk.builtin.Exception("stopPlaying not yet implemented");
  });


  // ------------------------------------------------------------
  media.writeSoundTo = new Sk.builtin.func(function(sound, path)
  {
    Sk.ffi.checkArgs('writeSoundTo', arguments, 2);
    // TODO implement
    throw new Sk.builtin.Exception("writeSoundTo not yet implemented");
  });


  // ------------------------------------------------------------
  media.openSoundTool = new Sk.builtin.func(function(sound)
  {
    Sk.ffi.checkArgs('openSoundTool', arguments, 1);
    // TODO implement
    throw new Sk.builtin.Exception("openSoundTool not yet implemented");
  });


  //~ Classes ................................................................

  // These classes exist to give concrete Python types to the objects that
  // the media comp APIs deal with. Most public access will occur through
  // the global functions above, however, not by calling methods on these
  // objects.

  // ====================================================================
  var Picture = function($gbl, $loc)
  {
    // ------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, url)
    {
      Sk.ffi.checkArgs('__init__', arguments, 2);

      var res = Sk.future(function(continueWith)
      {
        url = url.v;
        if (_ffi('customizeMediaURL'))
          url = _ffi('customizeMediaURL')(url);

        url = Sk.transformUrl(url);

        $('<img>').load(function()
        {
          self.image = this;
          self.width = self.image.width;
          self.height = self.image.height;

          var canvas = document.createElement('canvas');
          canvas.width = self.width;
          canvas.height = self.height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(self.image, 0, 0);
          self.imageData = ctx.getImageData(0, 0, self.width, self.height);
          
          continueWith(null);
        }).error(function() {
          continueWith(new Sk.builtin.ValueError(
            'The image could not be loaded. Is the URL incorrect?'));
        }).attr('src', url);
      });

      if (res) throw res;
    });


    // ------------------------------------------------------
    $loc.setAllPixelsToAColor = new Sk.builtin.func(function(self, color)
    {
      var canvas = document.createElement('canvas');
      canvas.width = self.width;
      canvas.height = self.height;
      var ctx = canvas.getContext('2d');

      if (color)
      {
        ctx.fillStyle =
          'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')';
        ctx.fillRect(0, 0, self.width, self.height);
      }

      self.imageData = ctx.getImageData(0, 0, self.width, self.height);
    });
  };

  media.Picture = Sk.misceval.buildClass(media, Picture, 'Picture', []);


  // ====================================================================
  var EmptyPicture = function($gbl, $loc)
  {
    // ------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, width, height, color)
    {
      Sk.ffi.checkArgs('__init__', arguments, [3, 4]);

      self.width = width;
      self.height = height;
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');

      // TODO remove this when we support alpha.
      color = color || media.white;

      ctx.fillStyle =
        'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')';
      ctx.fillRect(0, 0, width, height);

      self.imageData = ctx.getImageData(0, 0, self.width, self.height);
    });
  };

  media.EmptyPicture = Sk.misceval.buildClass(
    media, EmptyPicture, 'EmptyPicture', [media.Picture]);


  // ====================================================================
  var Pixel = function($gbl, $loc)
  {
    // ------------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, picture, x, y)
    {
      Sk.ffi.checkArgs('__init__', arguments, 4);

      self.picture = picture;
      self.x = x;
      self.y = y;
    });


    // ------------------------------------------------------------
    $loc.getX = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getX', arguments, 1);
      return self.x;
    });


    // ------------------------------------------------------------
    $loc.getY = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getY', arguments, 1);
      return self.y;
    });


    // ------------------------------------------------------------
    $loc.getRed = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getRed', arguments, 1);

      var picture = self.picture;
      var index = (self.y * 4) * picture.width + (self.x * 4);
      return picture.imageData.data[index];
    });


    // ------------------------------------------------------------
    $loc.getGreen = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getGreen', arguments, 1);

      var picture = self.picture;
      var index = (self.y * 4) * picture.width + (self.x * 4);
      return picture.imageData.data[index + 1];
    });


    // ------------------------------------------------------------
    $loc.getBlue = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getBlue', arguments, 1);

      var picture = self.picture;
      var index = (self.y * 4) * picture.width + (self.x * 4);
      return picture.imageData.data[index + 2];
    });


    // ------------------------------------------------------------
    $loc.setRed = new Sk.builtin.func(function(self, r)
    {
      Sk.ffi.checkArgs('setRed', arguments, 2);

      var picture = self.picture;
      var index = (self.y * 4) * picture.width + (self.x * 4);
      picture.imageData.data[index] = r;
    });


    // ------------------------------------------------------------
    $loc.setGreen = new Sk.builtin.func(function(self, g)
    {
      Sk.ffi.checkArgs('setGreen', arguments, 2);

      var picture = self.picture;
      var index = (self.y * 4) * picture.width + (self.x * 4);
      picture.imageData.data[index + 1] = g;
    });


    // ------------------------------------------------------------
    $loc.setBlue = new Sk.builtin.func(function(self, b)
    {
      Sk.ffi.checkArgs('setBlue', arguments, 2);

      var picture = self.picture;
      var index = (self.y * 4) * picture.width + (self.x * 4);
      picture.imageData.data[index + 2] = b;
    });


    // ------------------------------------------------------------
    $loc.__str__ = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('__str__', arguments, 1);

      return Sk.builtins.str('Pixel r=' +
        Sk.misceval.callsim(self.getRed, self)
        + ' g=' + Sk.misceval.callsim(self.getGreen, self)
        + ' b=' + Sk.misceval.callsim(self.getBlue, self));
    });
  };

  media.Pixel = Sk.misceval.buildClass(media, Pixel, 'Pixel', []);


  // ====================================================================
  var Color = function($gbl, $loc)
  {
    // ------------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, r, g, b)
    {
      Sk.ffi.checkArgs('__init__', arguments, 4);

      self.red = r;
      self.green = g;
      self.blue = b;
    });


    // ------------------------------------------------------------
    $loc.getRed = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getRed', arguments, 1);
      return self.red;
    });


    // ------------------------------------------------------------
    $loc.getGreen = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getGreen', arguments, 1);
      return self.green;
    });


    // ------------------------------------------------------------
    $loc.getBlue = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getBlue', arguments, 1);
      return self.blue;
    });


    // ------------------------------------------------------------
    $loc.setRGB = new Sk.builtin.func(function(self, r, g, b)
    {
      Sk.ffi.checkArgs('setRGB', arguments, 4);
      self.red = Math.floor(Math.max(0, Math.min(255, r)));
      self.green = Math.floor(Math.max(0, Math.min(255, g)));
      self.blue = Math.floor(Math.max(0, Math.min(255, b)));
    });


    var COLOR_FACTOR = 0.7;

    // ------------------------------------------------------------
    $loc.makeLighter = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('makeLighter', arguments, 1);

      var r = self.red;
      var g = self.green;
      var b = self.blue;

      // This is from java.awt.Color -- presumably JES just uses those
      // functions directly.
      var i = 1.0 / (1.0 - COLOR_FACTOR);
      if (r == 0 && g == 0 && b == 0)
      {
        return new Color(i, i, i);
      }
      
      if (r > 0 && r < i) r = i;
      if (g > 0 && g < i) g = i;
      if (b > 0 && b < i) b = i;
 
      return Sk.misceval.callsim(media.Color,
        r / COLOR_FACTOR, g / COLOR_FACTOR, b / COLOR_FACTOR);
    });


    // ------------------------------------------------------------
    $loc.makeDarker = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('makeDarker', arguments, 1);

      // This is from java.awt.Color -- presumably JES just uses those
      // functions directly.
      return Sk.misceval.callsim(media.Color,
        self.red * COLOR_FACTOR, self.green * COLOR_FACTOR,
        self.blue * COLOR_FACTOR);
    });


    // ------------------------------------------------------------
    $loc.distance = new Sk.builtin.func(function(self, other)
    {
      Sk.ffi.checkArgs('distance', arguments, 2);

      return Math.sqrt(
        Math.pow(self.red - other.red, 2)
        + Math.pow(self.green - other.green, 2)
        + Math.pow(self.blue - other.blue, 2));
    });


    // ------------------------------------------------------------
    $loc.__eq__ = new Sk.builtin.func(function(self, other)
    {
      Sk.ffi.checkArgs('__eq__', arguments, 2);

      return (self.ob$type === other.ob$type)
        && (self.red == other.red)
        && (self.green == other.green)
        && (self.blue == other.blue);
    });


    // ------------------------------------------------------------
    $loc.__ne__ = new Sk.builtin.func(function(self, other)
    {
      Sk.ffi.checkArgs('__ne__', arguments, 2);

      return (self.ob$type !== other.ob$type)
        || (self.red != other.red)
        || (self.green != other.green)
        || (self.blue != other.blue);
    });


    // ------------------------------------------------------------
    $loc.__add__ = new Sk.builtin.func(function(self, other)
    {
      Sk.ffi.checkArgs('__add__', arguments, 2);

      return Sk.misceval.callsim(media.Color,
        self.red + other.red,
        self.green + other.green,
        self.blue + other.blue);
    });


    // ------------------------------------------------------------
    $loc.__sub__ = new Sk.builtin.func(function(self, other)
    {
      Sk.ffi.checkArgs('__sub__', arguments, 2);

      return Sk.misceval.callsim(media.Color,
        self.red - other.red,
        self.green - other.green,
        self.blue - other.blue);
    });


    // ------------------------------------------------------------
    $loc.__str__ = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('__str__', arguments, 1);

      return Sk.builtins.str('color r=' + self.red
        + ' g=' + self.green + ' b=' + self.blue);
    });


    // ------------------------------------------------------------
    $loc.__repr__ = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('__repr__', arguments, 1);

      return Sk.builtins.str('Color(' + self.red
        + ', ' + self.green + ', ' + self.blue + ')');
    });
  };

  media.Color = Sk.misceval.buildClass(media, Color, 'Color', []);


  var SAMPLE_RATE = 22050;
  var _zeroArray = function(length)
  {
    var a = new Array(length);
    for (var i = 0; i < length; i++) a[i] = 0;
    return a;
  };


  // ====================================================================
  var Sound = function($gbl, $loc)
  {
    // ------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, numSamples, samplingRate)
    {
      Sk.ffi.checkArgs('__init__', arguments, 3);

      self.samples = _zeroArray(numSamples);
      self.samplingRate = samplingRate || SAMPLE_RATE;
    });


    // ------------------------------------------------------
    $loc.play = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('play', arguments, 1);

      var wave = new RIFFWAVE();
      wave.header.sampleRate = self.samplingRate;
      wave.header.bitsPerSample = 16;
      wave.header.numChannels = 1;
      wave.Make(self.samples);
      
      var audio = new Audio();
      audio.src = wave.dataURI;
      audio.play();
    });


    // ------------------------------------------------------
    $loc.blockingPlay = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('blockingPlay', arguments, 1);

      Sk.future(function(continueWith) {
        var wave = new RIFFWAVE();
        wave.header.sampleRate = self.samplingRate;
        wave.header.bitsPerSample = 16;
        wave.header.numChannels = 1;
        wave.Make(self.samples);
        
        var audio = new Audio();
        audio.addEventListener('ended', function(e) {
          continueWith(null);
        });

        audio.src = wave.dataURI;
        audio.play();
      });
    });


    // ------------------------------------------------------
    $loc.__len__ = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('__len__', arguments, 1);
      return self.samples.length;
    });
  };

  media.Sound = Sk.misceval.buildClass(media, Sound, 'Sound', []);


  // ====================================================================
  var Sample = function($gbl, $loc)
  {
    // ------------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, sound, index)
    {
      Sk.ffi.checkArgs('__init__', arguments, 3);

      self.sound = sound;
      self.index = index;
    });


    // ------------------------------------------------------------
    $loc.getSound = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getSound', arguments, 1);
      return self.sound;
    });


    // ------------------------------------------------------------
    $loc.getIndex = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getIndex', arguments, 1);
      return self.index;
    });


    // ------------------------------------------------------------
    $loc.getValue = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('getValue', arguments, 1);
      return self.sound.samples[self.index];
    });


    // ------------------------------------------------------------
    $loc.setValue = new Sk.builtin.func(function(self, value)
    {
      Sk.ffi.checkArgs('setValue', arguments, 2);
      self.sound.samples[self.index] = value;
      return null;
    });


    // ------------------------------------------------------------
    $loc.__str__ = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('__str__', arguments, 1);

      return Sk.builtins.str('Sample at ' + self.index + ' with value '
        + Sk.misceval.callsim(self.getValue, self));
    });
  };

  media.Sample = Sk.misceval.buildClass(media, Sample, 'Sample', []);


  //~ Constants ..............................................................

  media.black = Sk.misceval.callsim(media.Color, 0, 0, 0);
  media.white = Sk.misceval.callsim(media.Color, 255, 255, 255);
  media.blue = Sk.misceval.callsim(media.Color, 0, 0, 255);
  media.red = Sk.misceval.callsim(media.Color, 255, 0, 0);
  media.green = Sk.misceval.callsim(media.Color, 0, 255, 0);
  media.gray = Sk.misceval.callsim(media.Color, 128, 128, 128);
  media.darkGray = Sk.misceval.callsim(media.Color, 64, 64, 64);
  media.lightGray = Sk.misceval.callsim(media.Color, 192, 192, 192);
  media.yellow = Sk.misceval.callsim(media.Color, 255, 255, 0);
  media.orange = Sk.misceval.callsim(media.Color, 255, 200, 0);
  media.pink = Sk.misceval.callsim(media.Color, 255, 175, 175);
  media.magenta = Sk.misceval.callsim(media.Color, 255, 0, 255);
  media.cyan = Sk.misceval.callsim(media.Color, 0, 255, 255);


  // =========================================================================
  /*
   * Helpers
   */

  // ------------------------------------------------------------
  /**
   * Look for an external function in the window.mediaffi namespace and
   * return it if found, otherwise return undefined.
   *
   * These FFI functions are used so that the media module can interface
   * with the external environment without tying itself down specifically to
   * a particular one (such as Pythy). (TODO This isn't quite true: a lot of
   * functions in this module are pretty Pythy specific, but this interface
   * exists so that one day they can all be factored out.)
   *
   * @param name
   */
  var _ffi = function(name)
  {
    if (window.mediaffi && window.mediaffi[name])
    {
      return window.mediaffi[name];
    }
    else
    {
      return undefined;
    }
  };


  // ------------------------------------------------------------
  /**
   * Converts an angle from degrees to radians.
   *
   * @param degrees
   */
  var _degToRad = function(degrees)
  {
    return degrees * Math.PI / 180;
  };


  // ------------------------------------------------------------
  /**
   * Creates a canvas, copies the specified picture onto it, then invokes the
   * callback so that additional drawing can be performed on the context. Once
   * the callback is complete, the canvas contents are copied back into the
   * original picture.
   *
   * @param picture
   * @param callback
   */
  var _drawInto = function(picture, callback)
  {
    var canvas = document.createElement('canvas');
    canvas.width = picture.width;
    canvas.height = picture.height;
    var ctx = canvas.getContext('2d');
    ctx.putImageData(picture.imageData, 0, 0);
    
    callback(ctx, canvas);

    picture.imageData = ctx.getImageData(0, 0, picture.width, picture.height);
  };


  // ------------------------------------------------------------
  /**
   * Returns a CSS rgb(...) style for the specified Color object.
   *
   * @param color
   */
  var _styleFromColor = function(color)
  {
    return 'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')';
  };


  // ------------------------------------------------------------
  /**
   * Draws an ellipse in the specified bounding box, since HTML5 canvas
   * doesn't provide a method for doing so (yet, at least, in some modern
   * browsers).
   *
   * @param ctx
   * @param x
   * @param y
   * @param w
   * @param h
   * @param fill
   */
  var _drawEllipse = function(ctx, x, y, w, h, fill)
  {
    var ratio = h / w;
    var xr = w / 2;
    var yr = h / 2;

    ctx.save();
    ctx.scale(1, h / w);
    ctx.beginPath();
    ctx.arc(x + xr, (y + yr) / ratio, xr, 0, 2 * Math.PI);
    ctx.restore();

    if (fill)
      ctx.fill();
    else
      ctx.stroke();
  };


  // ------------------------------------------------------------
  /**
   * Draws an elliptical arc in the specified bounding box, since HTML5 canvas
   * doesn't provide a method for doing so (yet, at least, in some modern
   * browsers).
   *
   * @param ctx
   * @param x
   * @param y
   * @param w
   * @param h
   * @param startAngle
   * @param endAngle
   * @param fill
   */
  var _drawEllipticalArc =
    function(ctx, x, y, w, h, startAngle, endAngle, reversed, fill)
  {
    var ratio = h / w;
    var xr = x + w / 2;
    var cx = x + xr;
    var cy = (y + h / 2) / ratio;

    ctx.save();
    ctx.scale(1, h / w);
    ctx.beginPath();
    if (fill) ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, xr, startAngle, endAngle, reversed);
    if (fill) ctx.moveTo(cx, cy);
    ctx.restore();

    if (fill)
      ctx.fill();
    else
      ctx.stroke();
  };


  // ------------------------------------------------------------
  /**
   * Returns an object with width and height properties that describe the
   * pixel dimensions of a string of text.
   *
   * @param text the string to measure
   * @param font the CSS 'font' style for the text
   */
  var _measureText = function(text, font)
  {
    var div = $('<div>').text(text).css({
      position: 'absolute',
      top: '-1000px',
      left: '-1000px',
      font: font
    });
    $('body').append(div);
    
    var size = { width: div.width(), height: div.height() };

    div.remove();

    return size;
  };


  // ------------------------------------------------------------
  /**
   * Small helper function to consolidate the Python code that creates a
   * new pixel at a certain location.
   *
   * @param picture
   * @param x
   * @param y
   */
  var _getPixelAt = function(picture, x, y)
  {
    return Sk.misceval.callsim(media.Pixel, picture, x, y);
  };


  // ------------------------------------------------------------
  /**
   * Shows a picture in the popup canvas window.
   *
   * @param picture
   */
  var _show = function(picture)
  {
    var canvas = document.createElement('canvas');
    canvas.width = picture.width;
    canvas.height = picture.height;
    var ctx = canvas.getContext('2d');
    ctx.putImageData(picture.imageData, 0, 0);

    Sk.canvas.show(canvas);
  };


  // ------------------------------------------------------------
  /**
   * Binds a callback to a form field when any immediate change occurs, rather
   * than when the field goes out of focus.
   *
   * @param selector
   * @param callback
   */
  var _immediateChange = function(selector, callback)
  {
    selector.each(function() {
      var $this = $(this);
      $this.data('oldVal', $this);
      
      $this.bind('propertychange keyup input cut paste', function(e) {
        var val = $this.val();
        if ($this.data('oldVal') != val)
        {
          $this.data('oldVal', val);
          callback(val);
        }
      });
    });
  };


  // ------------------------------------------------------------
  var _createRequestBody = function(message, errorMessage)
  {
    return $('<div>')
      .append($('<p>').text(message))
      .append($('<input type="text"/>').addClass('input-large')
          .attr('id', 'mediacomp-request-field'))
      .append($('<p>')
        .attr('id', 'mediacomp-request-error')
        .text(errorMessage).addClass('text-error hide'));
  };


  // ------------------------------------------------------------
  var _showRequestNumber = function(continuance, message)
  {
    var body = _createRequestBody(message, 'The value must be a number.');

    _showModal({
      id: 'mediacomp-requestNumber',
      body: body,

      onShown: function() {
        _immediateChange($('#mediacomp-request-field'), function(val) {
          // Verify that the text entered was numeric.
          if (!isNaN(parseFloat(val)) && isFinite(val))
          {
            $('#mediacomp-modal-ok').removeAttr('disabled');
            $('#mediacomp-request-error').addClass('hide');
          }
          else
          {
            $('#mediacomp-modal-ok').attr('disabled', 'disabled');
            $('#mediacomp-request-error').removeClass('hide');
          }
        });
        
        $('#mediacomp-modal-ok').attr('disabled', 'disabled');
        $('#mediacomp-request-field').focus();
      },

      onOK: function() {
        continuance(Sk.ffi.remapToPy(parseFloat(
          $('#mediacomp-request-field').val())));
      },

      onCancel: function() {
        continuance(null);
      }
    });
  };


  // ------------------------------------------------------------
  var _showRequestInteger = function(continuance, message)
  {
    var body = _createRequestBody(message, 'The value must be an integer.');

    _showModal({
      id: 'mediacomp-requestInteger',
      body: body,

      onShown: function() {
        _immediateChange($('#mediacomp-request-field'), function(val) {
          // Verify that the text entered was numeric.
          if (/^-?\d+$/.test(val))
          {
            $('#mediacomp-modal-ok').removeAttr('disabled');
            $('#mediacomp-request-error').addClass('hide');
          }
          else
          {
            $('#mediacomp-modal-ok').attr('disabled', 'disabled');
            $('#mediacomp-request-error').removeClass('hide');
          }
        });
        
        $('#mediacomp-modal-ok').attr('disabled', 'disabled');
        $('#mediacomp-request-field').focus();
      },

      onOK: function() {
        continuance(Sk.ffi.remapToPy(parseInt(
          $('#mediacomp-request-field').val(), 10)));
      },

      onCancel: function() {
        continuance(null);
      }
    });
  };


  // ------------------------------------------------------------
  var _showRequestIntegerInRange = function(continuance, message, min, max)
  {
    var body = _createRequestBody(message,
      'The value must be an integer between ' + min + ' and ' + max + '.');

    _showModal({
      id: 'mediacomp-requestInteger',
      body: body,

      onShown: function() {
        _immediateChange($('#mediacomp-request-field'), function(val) {
          // Verify that the text entered was numeric.
          if (/^-?\d+$/.test(val)
            && min <= parseInt(val, 10) && parseInt(val, 10) <= max)
          {
            $('#mediacomp-modal-ok').removeAttr('disabled');
            $('#mediacomp-request-error').addClass('hide');
          }
          else
          {
            $('#mediacomp-modal-ok').attr('disabled', 'disabled');
            $('#mediacomp-request-error').removeClass('hide');
          }
        });
        
        $('#mediacomp-modal-ok').attr('disabled', 'disabled');
        $('#mediacomp-request-field').focus();
      },

      onOK: function() {
        continuance(Sk.ffi.remapToPy(parseInt(
          $('#mediacomp-request-field').val(), 10)));
      },

      onCancel: function() {
        continuance(null);
      }
    });
  };


  // ------------------------------------------------------------
  var _showRequestString = function(continuance, message)
  {
    var body = _createRequestBody(message);

    _showModal({
      id: 'mediacomp-requestString',
      body: body,

      onShown: function() {
        $('#mediacomp-request-field').focus();
      },

      onOK: function() {
        continuance(Sk.ffi.remapToPy($('#mediacomp-request-field').val()));
      },

      onCancel: function() {
        continuance(null);
      }
    });
  };


  // ------------------------------------------------------------
  var _showMessageModal = function(continuance, message, type)
  {
    var types = {
      'error': 'icon-exclamation-sign',
      'warning': 'icon-warning-sign',
      'info': 'icon-comment-alt'
    };

    var createIcon = function(klass) {
      return $('<i>')
        .addClass('pull-left ' + klass + ' text-' + type)
        .css({
          'font-size': '64px',
          'margin': '0px 30px'
        });
    };

    var body = $('<div>').addClass('clearfix')
      .append(createIcon(types[type]))
      .append($('<div>').text(message).addClass('pull-left'));

    _showModal({
      id: 'mediacomp-messageModal',
      body: body,
      hasCancel: false,

      onOK: function() { continuance(null); },
      onCancel: function() { continuance(null); }
    });
  };


  // ------------------------------------------------------------
  var _hsl2rgb = function(h, s, l)
  {
    var r, g, b;

    if (s == 0)
    {
        r = g = b = l; // achromatic
    }
    else
    {
        var hue2rgb = function(p, q, t)
        {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        var hp = h / 360;
        r = hue2rgb(p, q, hp + 1 / 3);
        g = hue2rgb(p, q, hp);
        b = hue2rgb(p, q, hp - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  };


  // ------------------------------------------------------------
  var _createColorPickerCanvas = function()
  {
    var width = 360;
    var height = 360;

    // Interesting behavior -- if I create the canvas with $('<canvas>')
    // instead of document.createElement and set its size using .css(...),
    // the image data I get back from the context has the wrong dimensions.
    // Huh?
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, width, height);

    for (var y = 0; y < height; y++)
    {
      for (var x = 0; x < width; x++)
      {
        var h = x;
        var s = 1;
        var l = y / height;
        var rgb = _hsl2rgb(h, s, l);

        var idx = y * width * 4 + x * 4;
        imageData.data[idx]     = rgb[0];
        imageData.data[idx + 1] = rgb[1];
        imageData.data[idx + 2] = rgb[2];
        imageData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return $('<div class="pull-left" style="margin-right: 10px">').append(canvas);
  };


  // ------------------------------------------------------------
  var _showColorPicker = function(continuance)
  {
    var _createFieldRow = function(name, label) {
      return '<tr><td><label for="mediacomp-color-' + name + '">' + label + '</label>'
        + '</td><td><input type="number" class="mediacomp-color-field input-mini" id="mediacomp-color-'
        + name + '" min="0" max="255"/></td></tr>';
    };

    var canvas = _createColorPickerCanvas();

    var _updateColor = function(r, g, b) {
      $('#mediacomp-color-red').val(r);
      $('#mediacomp-color-green').val(g);
      $('#mediacomp-color-blue').val(b);
      $('#mediacomp-color-swatch').css('background-color',
        'rgb(' + r + ',' + g + ',' + b + ')');
    };

    var _handleDrag = function(e) {
      var hue = e.offsetX;
      var lit = e.offsetY / canvas.height();
      var rgb = _hsl2rgb(hue, 1, lit);
      var r = Math.floor(rgb[0]);
      var g = Math.floor(rgb[1]);
      var b = Math.floor(rgb[2]);
      _updateColor(r, g, b);
    };

    canvas.on('mousedown', function(e) {
      canvas.on('mousemove', _handleDrag);
      _handleDrag(e);
    });
    canvas.on('mouseup', function(e) {
      canvas.off('mousemove');
    });

    var table = $(
      '<div class="pull-left"><table><tbody>'
      + _createFieldRow('red', 'Red:')
      + _createFieldRow('green', 'Green:')
      + _createFieldRow('blue', 'Blue:')
      + '<tr><td></td><td>'
      + '<div style="border: 1px solid black; width: 64px; height: 64px;" id="mediacomp-color-swatch"></div>'
      + '</td></tr>'
      + '</tbody></table></div>')

    _showModal({
      id: 'mediacomp-colorpicker',
      title: 'Color Picker',
      body: $('<div class="clearfix">').append(canvas).append(table),

      onShown: function() {
        _immediateChange($('.mediacomp-color-field'), function() {
          var r = parseInt($('#mediacomp-color-red').val(), 10);
          var g = parseInt($('#mediacomp-color-green').val(), 10);
          var b = parseInt($('#mediacomp-color-blue').val(), 10);
          _updateColor(r, g, b);
        });
      },

      onOK: function() {
        var r = parseInt($('#mediacomp-color-red').val(), 10);
        var g = parseInt($('#mediacomp-color-green').val(), 10);
        var b = parseInt($('#mediacomp-color-blue').val(), 10);
        continuance(Sk.misceval.callsim(media.Color, r, g, b));
      },
      onCancel: function() { continuance(null); }
    });
  };


  // ------------------------------------------------------------
  var _showFilePicker = function(continuance)
  {
    window.pythy.showMediaModal({
      mediaLinkClicked: function(link) {
        $('#media_library_modal').modal('hide');

        var url = $(link).attr('href');
        var clientHost = window.location.protocol + '//' + window.location.host

        if (url[0] == '/')
          url = clientHost + url;

        continuance(Sk.ffi.remapToPy(url));
      },
      canceled: function() { continuance(null); }
    });
  };


  // ------------------------------------------------------------
  var _showModal = function(options)
  {
      var outer = $('<div>')
          .addClass('modal hide fade')
          .attr('id', options.id);

      var header = $('<div>')
          .addClass('modal-header')
          .append(
              '<a href="#" class="close" data-dismiss="modal"'
              + ' aria-hidden="true">&times;</a>'
              + '<h3>' + (options.title || '') + '</h3>')
          .css('cursor', 'move');

      var form = $('<form>').addClass('modal-form');
      
      var body = $('<div>').addClass('modal-body').append(options.body);

      var footer = $('<div>')
          .addClass('modal-footer');

      if (options.hasCancel !== false)
      {
        footer.append('<a href="#" id="mediacomp-modal-cancel" class="btn"'
                + ' data-dismiss="modal" aria-hidden="true">Cancel</a>');
      }

      footer.append('<input type="submit" id="mediacomp-modal-ok"'
              + ' class="btn btn-primary" value="OK" aria-hidden="true"/>');

      outer.append(header).append(
        form.append(body).append(footer)
      );

      $('body').append(outer);

      outer.modal();

      if (options.onShown) outer.on('shown', options.onShown);

      form.on('submit', function(e) {
        if ($('#mediacomp-modal-ok').attr('disabled') !== 'disabled')
        {
          form.data('submitted', true);
          outer.modal('hide');
        }
        e.preventDefault();
      });

      outer.on('hide', function() {
        if (form.data('submitted'))
          options.onOK();
        else
          options.onCancel();
      });

      outer.on('hidden', function() { outer.remove(); });
      outer.modal('show');
  };


  // =========================================================================
  // The RIFFWave library is used for sound processing. Credit for the
  // original goes to Pedro Ladaria.

  /* 
   * RIFFWAVE.js v0.02 - Audio encoder for HTML5 <audio> elements.
   * Copyright (C) 2011 Pedro Ladaria <pedro.ladaria at Gmail dot com>
   *
   * This program is free software; you can redistribute it and/or
   * modify it under the terms of the GNU General Public License
   * version 2 as published by the Free Software Foundation.
   * The full license is available at http://www.gnu.org/licenses/gpl.html
   *
   * This program is distributed in the hope that it will be useful,
   * but WITHOUT ANY WARRANTY; without even the implied warranty of
   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
   * GNU General Public License for more details.
   *
   *
   * Changelog:
   *
   * 0.01 - First release
   * 0.02 - New faster base64 encoding
   * 0.03 - Support for different sample sizes (allevato)
   *
   */

  var FastBase64 = {

    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: [],

    Init: function() {
      for (var i=0; i<4096; i++) {
        this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
      }
    },

    Encode: function(src) {
      var len = src.length;
      var dst = '';
      var i = 0;
      while (len > 2) {
        n = (src[i] << 16) | (src[i+1]<<8) | src[i+2];
        dst+= this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
        len-= 3;
        i+= 3;
      }
      if (len > 0) {
        var n1= (src[i] & 0xFC) >> 2;
        var n2= (src[i] & 0x03) << 4;
        if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
        dst+= this.chars[n1];
        dst+= this.chars[n2];
        if (len == 2) {
          var n3= (src[i++] & 0x0F) << 2;
          n3 |= (src[i] & 0xC0) >> 6;
          dst+= this.chars[n3];
        }
        if (len == 1) dst+= '=';
        dst+= '=';
      }
      return dst;
    } // end Encode

  }

  FastBase64.Init();

  var RIFFWAVE = function(data) {

    this.data = [];        // Byte array containing audio samples
    this.wav = [];         // Array containing the generated wave file
    this.dataURI = '';     // http://en.wikipedia.org/wiki/Data_URI_scheme

    this.header = {                         // OFFS SIZE NOTES
      chunkId      : [0x52,0x49,0x46,0x46], // 0    4    "RIFF" = 0x52494646
      chunkSize    : 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
      format       : [0x57,0x41,0x56,0x45], // 8    4    "WAVE" = 0x57415645
      subChunk1Id  : [0x66,0x6d,0x74,0x20], // 12   4    "fmt " = 0x666d7420
      subChunk1Size: 16,                    // 16   4    16 for PCM
      audioFormat  : 1,                     // 20   2    PCM = 1
      numChannels  : 1,                     // 22   2    Mono = 1, Stereo = 2, etc.
      sampleRate   : 8000,                  // 24   4    8000, 44100, etc
      byteRate     : 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
      blockAlign   : 0,                     // 32   2    NumChannels*BitsPerSample/8
      bitsPerSample: 8,                     // 34   2    8 bits = 8, 16 bits = 16, etc...
      subChunk2Id  : [0x64,0x61,0x74,0x61], // 36   4    "data" = 0x64617461
      subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
    };

    function u32ToArray(i) { return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF]; }
    function u16ToArray(i) { return [i&0xFF, (i>>8)&0xFF]; }

    function append8BitSamplesToArray(a, dest) {
      var off = dest.length;
      for (var i = 0; i < a.length; i++) {
        var v = a[i] + 128;
        dest[off++] = v&0xFF;
      };
    }
    function append16BitSamplesToArray(a, dest) {
      var off = dest.length;
      for (var i = 0; i < a.length; i++) {
        var v = a[i];
        if (v < 0) v = (1 << 16) + v;
        dest[off++] = v&0xFF;
        dest[off++] = (v>>8)&0xFF;
      };
    }

    this.Make = function(data) {
      if (data instanceof Array) this.data = data;
      this.header.byteRate = (this.header.sampleRate * this.header.numChannels * this.header.bitsPerSample) >> 3;
      this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> 3;
      this.header.subChunk2Size = (this.data.length * this.header.bitsPerSample) >> 3;
      this.header.chunkSize = 36 + this.header.subChunk2Size;
      
      this.wav = this.header.chunkId.concat(
        u32ToArray(this.header.chunkSize),
        this.header.format,
        this.header.subChunk1Id,
        u32ToArray(this.header.subChunk1Size),
        u16ToArray(this.header.audioFormat),
        u16ToArray(this.header.numChannels),
        u32ToArray(this.header.sampleRate),
        u32ToArray(this.header.byteRate),
        u16ToArray(this.header.blockAlign),
        u16ToArray(this.header.bitsPerSample),    
        this.header.subChunk2Id,
        u32ToArray(this.header.subChunk2Size)
      );

      if (this.header.bitsPerSample == 16)
        append16BitSamplesToArray(this.data, this.wav);
      else
        append8BitSamplesToArray(this.data, this.wav);

      this.dataURI = 'data:audio/wav;base64,'+FastBase64.Encode(this.wav);
    };

    if (data instanceof Array) this.Make(data);

  }; // end RIFFWAVE


  // =========================================================================
  // The Canvas2Image library is used to convert a canvas into an image that
  // can be saved to the media library. Credit for the original goes to
  // https://github.com/hongru/canvas2image.

  var Canvas2Image = function () {

    // check if support sth.
    var $support = function () {
      var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

      return {
        canvas: !!ctx,
        imageData: !!ctx.getImageData,
        dataURL: !!canvas.toDataURL,
        btoa: !!window.btoa
      };
    }();

    var downloadMime = 'image/octet-stream';

    function scaleCanvas (canvas, width, height) {
      var w = canvas.width,
        h = canvas.height;
      if (width == undefined) {
        width = w;
      }
      if (height == undefined) {
        height = h;
      }

      var retCanvas = document.createElement('canvas');
      var retCtx = retCanvas.getContext('2d');
      retCanvas.width = width;
      retCanvas.height = height;
      retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
      return retCanvas;
    }

    function getDataURL (canvas, type, width, height) {
      canvas = scaleCanvas(canvas, width, height);
      return canvas.toDataURL(type);
    }

    function saveFile (strData) {
      document.location.href = strData;
    }

    function genImage(strData) {
      var img = document.createElement('img');
      img.src = strData;
      return img;
    }
    function fixType (type) {
      type = type.toLowerCase().replace(/jpg/i, 'jpeg');
      var r = type.match(/png|jpeg|bmp|gif/)[0];
      return 'image/' + r;
    }
    function encodeData (data) {
      if (!window.btoa) { throw 'btoa undefined' }
      var str = '';
      if (typeof data == 'string') {
        str = data;
      } else {
        for (var i = 0; i < data.length; i ++) {
          str += String.fromCharCode(data[i]);
        }
      }

      return btoa(str);
    }
    function getImageData (canvas) {
      var w = canvas.width,
        h = canvas.height;
      return canvas.getContext('2d').getImageData(0, 0, w, h);
    }
    function makeURI (strData, type) {
      return 'data:' + type + ';base64,' + strData;
    }


    /**
     * create bitmap image
     */
    var genBitmapImage = function (data) {
      var imgHeader = [],
        imgInfoHeader = [];

      var width = data.width,
        height = data.height;

      imgHeader.push(0x42); // 66 -> B
      imgHeader.push(0x4d); // 77 -> M

      var fsize = width * height * 3 + 54; // header size:54 bytes
      imgHeader.push(fsize % 256); // r
      fsize = Math.floor(fsize / 256);
      imgHeader.push(fsize % 256); // g
      fsize = Math.floor(fsize / 256);
      imgHeader.push(fsize % 256); // b
      fsize = Math.floor(fsize / 256);
      imgHeader.push(fsize % 256); // a

      imgHeader.push(0);
      imgHeader.push(0);
      imgHeader.push(0);
      imgHeader.push(0);

      imgHeader.push(54); // offset -> 6
      imgHeader.push(0);
      imgHeader.push(0);
      imgHeader.push(0);

      // info header
      imgInfoHeader.push(40); // info header size
      imgInfoHeader.push(0);
      imgInfoHeader.push(0);
      imgInfoHeader.push(0);

      // width info
      var _width = width;
      imgInfoHeader.push(_width % 256);
      _width = Math.floor(_width / 256);
      imgInfoHeader.push(_width % 256);
      _width = Math.floor(_width / 256);
      imgInfoHeader.push(_width % 256);
      _width = Math.floor(_width / 256);
      imgInfoHeader.push(_width % 256);

      // height info
      var _height = height;
      imgInfoHeader.push(_height % 256);
      _height = Math.floor(_height / 256);
      imgInfoHeader.push(_height % 256);
      _height = Math.floor(_height / 256);
      imgInfoHeader.push(_height % 256);
      _height = Math.floor(_height / 256);
      imgInfoHeader.push(_height % 256);

      imgInfoHeader.push(1);
      imgInfoHeader.push(0);
      imgInfoHeader.push(24); // 24-bit bitmap
      imgInfoHeader.push(0);

      // no compression
      imgInfoHeader.push(0);
      imgInfoHeader.push(0);
      imgInfoHeader.push(0);
      imgInfoHeader.push(0);

      // pixel data
      var dataSize = width * height * 3;
      imgInfoHeader.push(dataSize % 256);
      dataSize = Math.floor(dataSize / 256);
      imgInfoHeader.push(dataSize % 256);
      dataSize = Math.floor(dataSize / 256);
      imgInfoHeader.push(dataSize % 256);
      dataSize = Math.floor(dataSize / 256);
      imgInfoHeader.push(dataSize % 256);

      // blank space
      for (var i = 0; i < 16; i ++) {
        imgInfoHeader.push(0);
      }

      var padding = (4 - ((width * 3) % 4)) % 4;
      var imgData = data.data;
      var strPixelData = '';
      var y = height;
      do {
        var offsetY = width * (y - 1) * 4;
        var strPixelRow = '';
        for (var x = 0; x < width; x ++) {
          var offsetX = 4 * x;
          strPixelRow += String.fromCharCode(imgData[offsetY + offsetX + 2]);
          strPixelRow += String.fromCharCode(imgData[offsetY + offsetX + 1]);
          strPixelRow += String.fromCharCode(imgData[offsetY + offsetX]);
        }
        for (var n = 0; n < padding; n ++) {
          strPixelRow += String.fromCharCode(0);
        }

        strPixelData += strPixelRow;
      } while(-- y);

      return (encodeData(imgHeader.concat(imgInfoHeader)) + encodeData(strPixelData));

    };

    /**
     * saveAsImage
     * @param canvasElement
     * @param {String} image type
     * @param {Number} [optional] png width
     * @param {Number} [optional] png height
     */
    var saveAsImage = function (canvas, width, height, type) {
      if ($support.canvas && $support.dataURL) {
        if (type == undefined) { type = 'png'; }
        type = fixType(type);
        if (/bmp/.test(type)) {
          var data = getImageData(scaleCanvas(canvas, width, height));
          var strData = genBitmapImage(data);
          saveFile(makeURI(strData, downloadMime));
        } else {
          var strData = getDataURL(canvas, type, width, height);
          saveFile(strData.replace(type, downloadMime));
        }

      }
    }

    var convertToImage = function (canvas, width, height, type) {
      if ($support.canvas && $support.dataURL) {
        if (type == undefined) { type = 'png'; }
        type = fixType(type);

        if (/bmp/.test(type)) {
          var data = getImageData(scaleCanvas(canvas, width, height));
          var strData = genBitmapImage(data);
          return genImage(makeURI(strData, 'image/bmp'));
        } else {
          var strData = getDataURL(canvas, type, width, height);
          return genImage(strData);
        }
      }
    }

    var convertToURI = function (canvas, width, height, type) {
      if ($support.canvas && $support.dataURL) {
        if (type == undefined) { type = 'png'; }
        type = fixType(type);

        if (/bmp/.test(type)) {
          var data = getImageData(scaleCanvas(canvas, width, height));
          var strData = genBitmapImage(data);
          return makeURI(strData, 'image/bmp');
        } else {
          var strData = getDataURL(canvas, type, width, height);
          return strData;
        }
      }
    }


    return {
      saveAsImage: saveAsImage,
      saveAsPNG: function (canvas, width, height) {
        return saveAsImage(canvas, width, height, 'png');
      },
      saveAsJPEG: function (canvas, width, height) {
        return saveAsImage(canvas, width, height, 'jpeg');      
      },
      saveAsGIF: function (canvas, width, height) {
        return saveAsImage(canvas, width, height, 'gif')       
      },
      saveAsBMP: function (canvas, width, height) {
        return saveAsImage(canvas, width, height, 'bmp');      
      },

      convertToURI: convertToURI,

      convertToImage: convertToImage,
      convertToPNG: function (canvas, width, height) {
        return convertToImage(canvas, width, height, 'png');
      },
      convertToJPEG: function (canvas, width, height) {
        return convertToImage(canvas, width, height, 'jpeg');        
      },
      convertToGIF: function (canvas, width, height) {
        return convertToImage(canvas, width, height, 'gif');        
      },
      convertToBMP: function (canvas, width, height) {
        return convertToImage(canvas, width, height, 'bmp');        
      }
    };

  }();  


  return media;
};
