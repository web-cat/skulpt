var $builtinmodule = function(name) {
  var mod, picture, pixel, color, emptyPicture, COLOR_FACTOR, _drawInto,
  _measureText, _styleFromColor, _drawEllipse, _degToRad, _drawEllipticalArc,
  _showColorPicker, _createColorPickerCanvas, _hsl2rgb, _showModal,
  _immediateChange, Canvas2Image;

  mod = {};

  var Canvas2Image;

  // =========================================================================
  // The Canvas2Image library is used to convert a canvas into an image that
  // can be saved to the media library. Credit for the original goes to
  // https://github.com/hongru/canvas2image.

  Canvas2Image = {
    $support : function () {
      var canvas, ctx;

      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');

      return {
        canvas: !!ctx,
        imageData: !!ctx.getImageData,
        dataURL: !!canvas.toDataURL,
        btoa: !!window.btoa
      };
    }(),

    _scaleCanvas : (canvas, width, height) {
      var w, h, retCanvas, retCtx;

      w = canvas.width;
      h = canvas.height;

      if (!width) { width = w; }
      if (!height) { height = h; }

      retCanvas = document.createElement('canvas');
      retCanvas.width = width;
      retCanvas.height = height;

      retCtx = retCanvas.getContext('2d');
      retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);

      return retCanvas;
    },

    _getDataURL : (canvas, type, width, height) {
      return this._scaleCanvas(canvas, width, height).toDataURL(type);
    },

    _fixType : function (type) {
      var r;

      type = type.toLowerCase().replace(/jpg/i, 'jpeg');
      r = type.match(/png|jpeg|bmp|gif/)[0];

      return 'image/' + r;
    },

    _encodeData : function (data) {
      var str;

      if (!window.btoa) { throw 'btoa undefined' }

      str = '';

      if (typeof(data) === 'string') {
        str = data;
      } else {
        for (var i = 0; i < data.length; i++) {
          str += String.fromCharCode(data[i]);
        }
      }

      return btoa(str);
    },

    _getImageData : function (canvas) {
      return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    },

    _makeURI : function (strData, type) {
      return 'data:' + type + ';base64,' + strData;
    },

    _genBitmapImage : function (data) {
      var imgHeader, imgInfoHeader, width, height, fsize, _width, _height;
      var dataSize, padding, imgData, strPixelData, y, offsetX, offsetY, strPixelRow;

      imgHeader = [];
      imgInfoHeader = [];

      width = data.width;
      height = data.height;
      fsize = width * height * 3 + 54; // header size:54 bytes

      imgHeader.push(0x42); // 66 -> B
      imgHeader.push(0x4d); // 77 -> M
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
      _width = width;

      imgInfoHeader.push(_width % 256);
      _width = Math.floor(_width / 256);

      imgInfoHeader.push(_width % 256);
      _width = Math.floor(_width / 256);

      imgInfoHeader.push(_width % 256);
      _width = Math.floor(_width / 256);

      imgInfoHeader.push(_width % 256);

      // height info
      _height = height;

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
      dataSize = width * height * 3;

      imgInfoHeader.push(dataSize % 256);
      dataSize = Math.floor(dataSize / 256);

      imgInfoHeader.push(dataSize % 256);
      dataSize = Math.floor(dataSize / 256);

      imgInfoHeader.push(dataSize % 256);
      dataSize = Math.floor(dataSize / 256);

      imgInfoHeader.push(dataSize % 256);

      // blank space
      for (var i = 0; i < 16; i ++) { imgInfoHeader.push(0); }

      padding = (4 - ((width * 3) % 4)) % 4;
      imgData = data.data;
      strPixelData = '';
      y = height;

      do {
        offsetY = width * (y - 1) * 4;
        strPixelRow = '';
        for (var x = 0; x < width; x ++) {
          offsetX = 4 * x;
          strPixelRow += String.fromCharCode(imgData[offsetY + offsetX + 2]);
          strPixelRow += String.fromCharCode(imgData[offsetY + offsetX + 1]);
          strPixelRow += String.fromCharCode(imgData[offsetY + offsetX]);
        }
        for (var n = 0; n < padding; n ++) {
          strPixelRow += String.fromCharCode(0);
        }

        strPixelData += strPixelRow;
      } while(-- y);

      return (this._encodeData(imgHeader.concat(imgInfoHeader)) + this._encodeData(strPixelData));
    },

    convertToURI : function (canvas, width, height, type) {
      var data, strData;

      if (this.$support.canvas && this.$support.dataURL) {
        if (!type) { type = 'png'; }
        type = this._fixType(type);

        if (/bmp/.test(type)) {
          data = this._getImageData(this._scaleCanvas(canvas, width, height));
          strData = this._genBitmapImage(data);
          return _makeURI(strData, 'image/bmp');
        } else {
          strData = this._getDataURL(canvas, type, width, height);
          return strData;
        }
      } else {
        //TODO throw error
      }
    }
  };

  _hsl2rgb = function(h, s, l) {
    var r, g, b, q, p, hp, hue2rgb;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
      hue2rgb = function(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) { return p + (q - p) * 6 * t; }
        if (t < 1 / 2) { return q; }
        if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
        return p;
      };

      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      p = 2 * l - q;
      hp = h / 360;
      r = hue2rgb(p, q, hp + 1 / 3);
      g = hue2rgb(p, q, hp);
      b = hue2rgb(p, q, hp - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  };

  _createColorPickerCanvas = function() {
    var width, height, canvas, ctx, imageData, h, s, l, rgb, idx;

    width = height = 360;

    // Allevato - Interesting behavior -- if I create the canvas with $('<canvas>')
    // instead of document.createElement and set its size using .css(...),
    // the image data I get back from the context has the wrong dimensions.
    // Huh?
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext('2d');
    imageData = ctx.getImageData(0, 0, width, height);

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        h = x;
        s = 1;
        l = y / height;
        rgb = _hsl2rgb(h, s, l);
        idx = y * width * 4 + x * 4;

        imageData.data[idx]     = rgb[0];
        imageData.data[idx + 1] = rgb[1];
        imageData.data[idx + 2] = rgb[2];
        imageData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return $('<div class="pull-left" style="margin-right: 10px">').append(canvas);
  };

  _showModal = function(options) {
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

      if (options.hasCancel !== false) {
        footer.append('<a href="#" id="mediacomp-modal-cancel" class="btn"'
                + ' data-dismiss="modal" aria-hidden="true">Cancel</a>');
      }

      footer.append('<input type="submit" id="mediacomp-modal-ok"'
              + ' class="btn btn-primary" value="OK" aria-hidden="true"/>');

      outer.append(header).append(form.append(body).append(footer));

      $('body').append(outer);

      outer.modal();

      if (options.onShown) outer.on('shown', options.onShown);

      form.on('submit', function(e) {
        if ($('#mediacomp-modal-ok').attr('disabled') !== 'disabled') {
          form.data('submitted', true);
          outer.modal('hide');
        }
        e.preventDefault();
      });

      outer.on('hide', function() {
        if (form.data('submitted')) {
          options.onOK();
        } else {
          options.onCancel();
        }
      });

      outer.on('hidden', function() { outer.remove(); });
      outer.modal('show');
  };

  /**
   * Binds a callback to a form field when any immediate change occurs, rather
   * than when the field goes out of focus.
   *
   * @param selector
   * @param callback
   */
  _immediateChange = function(selector, callback) {
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

  _showColorPicker = function(continuance) {
    var _createFieldRow, canvas, _updateColor, _handleDrag, table;

    _createFieldRow = function(name, label) {
      return '<tr><td><label for="mediacomp-color-' + name + '">' + label + '</label>'
        + '</td><td><input type="number" class="mediacomp-color-field input-mini" id="mediacomp-color-'
        + name + '" min="0" max="255"/></td></tr>';
    };

    canvas = _createColorPickerCanvas();

    _updateColor = function(r, g, b) {
      $('#mediacomp-color-red').val(r);
      $('#mediacomp-color-green').val(g);
      $('#mediacomp-color-blue').val(b);
      $('#mediacomp-color-swatch').css('background-color',
        'rgb(' + r + ',' + g + ',' + b + ')');
    };

    _handleDrag = function(e) {
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

    table = $(
      '<div class="pull-left"><table><tbody>'
      + _createFieldRow('red', 'Red:')
      + _createFieldRow('green', 'Green:')
      + _createFieldRow('blue', 'Blue:')
      + '<tr><td></td><td>'
      + '<div style="border: 1px solid black; width: 64px; height: 64px;" id="mediacomp-color-swatch"></div>'
      + '</td></tr>'
      + '</tbody></table></div>');

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
        continuance(Sk.misceval.callsim(mod.Color, r, g, b));
      },
      onCancel: function() { continuance(mod.black); }
    });
  };

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
  _drawEllipticalArc = function(ctx, x, y, w, h, startAngle, endAngle,
      reversed, fill) {
    var ratio, xr, cx, cy;

    ratio = h / w;
    xr = w / 2;
    cx = x + xr;
    cy = (y + h / 2) / ratio;

    ctx.save();
    ctx.scale(1, h / w);
    ctx.beginPath();
    if (fill) { ctx.moveTo(cx, cy); }
    ctx.arc(cx, cy, xr, startAngle, endAngle, reversed);
    if (fill) { ctx.moveTo(cx, cy); }
    ctx.restore();

    if (fill){ ctx.fill(); } else { ctx.stroke(); }
  };
  /**
   * Converts an angle from degrees to radians.
   *
   * @param degrees
   */
  _degToRad = function(degrees) {
    return degrees * Math.PI / 180;
  };
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
  _drawEllipse = function(ctx, x, y, w, h, fill) {
    var ratio = h / w;
    var xr = w / 2;
    var yr = h / 2;

    ctx.save();
    ctx.scale(1, h / w);
    ctx.beginPath();
    ctx.arc(x + xr, (y + yr) / ratio, xr, 0, 2 * Math.PI);
    ctx.restore();

    if (fill) { ctx.fill(); } else { ctx.stroke(); }
  };
  /**
   * Returns a CSS rgb(...) style for the specified Color object.
   *
   * @param color
   */
  _styleFromColor = function(color) {
    return 'rgb(' + color._red + ',' + color._green + ',' + color._blue + ')';
  };

  /**
   * Creates a canvas, copies the specified picture onto it, then invokes the
   * callback so that additional drawing can be performed on the context. Once
   * the callback is complete, the canvas contents are copied back into the
   * original picture.
   *
   * @param picture
   * @param callback
   */
  var _drawInto = function(picture, callback) {
    var canvas, ctx;

    canvas = document.createElement('canvas');
    canvas.width = picture._width;
    canvas.height = picture._height;
    ctx = canvas.getContext('2d');
    ctx.putImageData(picture._imageData, 0, 0);
    
    callback(ctx, canvas);

    picture._imageData = ctx.getImageData(0, 0, picture._width, picture._height);
  };

  /**
   * Returns an object with width and height properties that describe the
   * pixel dimensions of a string of text.
   *
   * @param text the string to measure
   * @param font the CSS 'font' style for the text
   */
  var _measureText = function(text, font) {
    var div, size;

    div = $('<div>').text(text).css({
      position: 'absolute',
      'top': '-1000px',
      left: '-1000px',
      font: font
    });

    $('body').append(div);
    
    var size = { width: div.width(), height: div.height() };

    div.remove();

    return size;
  };

  COLOR_FACTOR = 0.85;

  picture = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, imageUrl) {
      var url, res, origUrl;

      Sk.ffi.checkArgs('__init__', arguments, 2);

      origUrl = window.mediaffi.customizeMediaURL(Sk.ffi.unwrapo(imageUrl));

      url = Sk.transformUrl(origUrl);

      res = Sk.future(function (continueWith) {
        $('<img>').load(function() {
          var canvas, ctx;

          self._url = origUrl;
          self._width = this.width;
          self._height = this.height;

          canvas = document.createElement('canvas');
          canvas.width = self._width;
          canvas.height = self._height;
          ctx = canvas.getContext('2d');
          ctx.drawImage(this, 0, 0);

          self._imageData = ctx.getImageData(0, 0, self._width, self._height);

          continueWith(null);
        }).error(function() {
          continueWith(new Sk.builtin.ValueError('The picture could not be ' +
                'loaded. Is the URL incorrect?'));
        }).attr('src', url);
      });
      if (res) throw res;
    });

    $loc['__str__'] = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return new Sk.builtin.str('Picture'   +
                                ', url '    + self._url +
                                ', height ' + self._height +
                                ', width '  + self._width);
    });

    $loc.show = new Sk.builtin.func(function (self) {
      var canvas, ctx;

      Sk.ffi.checkArgs('show', arguments, 1);

      canvas = document.createElement('canvas');
      canvas.width = self._width;
      canvas.height = self._height;

      ctx = canvas.getContext('2d');
      ctx.putImageData(self._imageData, 0, 0);

      Sk.canvas.show(canvas);
    });

    $loc.getHeight = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getHeight', arguments, 1);
      return self._height;
    });

    $loc.getWidth = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getWidth', arguments, 1);
      return self._width;
    });

    $loc.setColor = new Sk.builtin.func(function (self, x, y, color) {
      var data, index;

      Sk.ffi.checkArgs('setColor', arguments, 4);

      data = self._imageData.data;

      index = y * 4 * self._width  + x * 4;

      data[index] = color._red;
      data[index+1] = color._green;
      data[index+2] = color._blue; 
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      data[index+3] = 255;
    }); 

    $loc.setRed = new Sk.builtin.func(function (self, x, y, red) {
      var index;

      Sk.ffi.checkArgs('setRed', arguments, 4);

      index = y * 4 * self._width  + x * 4;

      self._imageData.data[index] = Sk.ffi.unwrapo(red);
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      self._imageData.data[index+3] = 255;
    });

    $loc.setGreen = new Sk.builtin.func(function (self, x, y, green) {
      var index;

      Sk.ffi.checkArgs('setGreen', arguments, 4);

      index = y * 4 * self._width  + x * 4;

      self._imageData.data[index + 1] = Sk.ffi.unwrapo(green);
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      self._imageData.data[index+3] = 255;
    });

    $loc.setBlue = new Sk.builtin.func(function (self, x, y, blue) {
      var index;

      Sk.ffi.checkArgs('setBlue', arguments, 4);

      index = y * 4 * self._width  + x * 4;

      self._imageData.data[index + 2] = Sk.ffi.unwrapo(blue);
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      self._imageData.data[index+3] = 255;
    });

    $loc.addText = new Sk.builtin.func(function(self, x, y, string, color) {
      Sk.ffi.checkArgs('addText', arguments, [4, 5]);

      _drawInto(self, function(ctx) {
        var height, text;

        text = Sk.ffi.unwrapo(string);
        ctx.fillStyle = _styleFromColor(color || mod.black);
        height = _measureText(text, ctx.font).height;
        ctx.fillText(text, Sk.ffi.unwrapo(x), Sk.ffi.unwrapo(y) + height);
      });
    });

    $loc.addTextWithStyle = new Sk.builtin.func(
      function(self, x, y, text, style, color) {
      Sk.ffi.checkArgs('addTextWithStyle', arguments, [5, 6]);

      _drawInto(self, function(ctx) {
        var height;

        text = Sk.ffi.unwrapo(text);
        ctx.fillStyle = _styleFromColor(color || mod.black);
        ctx.font = Sk.misceval.callsim(style._toJSString, style);
        height = _measureText(text, ctx.font).height;
        ctx.fillText(text, Sk.ffi.unwrapo(x), Sk.ffi.unwrapo(y) + height);
      });
    });

    $loc.addLine = new Sk.builtin.func(function(self, x1, y1, x2, y2, color) {
      Sk.ffi.checkArgs('addLine', arguments, [5, 6]);

      _drawInto(self, function(ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = _styleFromColor(color || mod.black);

        ctx.beginPath();
        ctx.moveTo(Sk.ffi.unwrapo(x1), Sk.ffi.unwrapo(y1));
        ctx.lineTo(Sk.ffi.unwrapo(x2), Sk.ffi.unwrapo(y2));
        ctx.stroke();
      });
    });

    $loc.addRect = new Sk.builtin.func(function(self, x, y, width, height, color) {
      Sk.ffi.checkArgs('addRect', arguments, [5, 6]);

      _drawInto(self, function(ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = _styleFromColor(color || mod.black);
        ctx.strokeRect(Sk.ffi.unwrapo(x), Sk.ffi.unwrapo(y),
            Sk.ffi.unwrapo(width), Sk.ffi.unwrapo(height));
      });
    });

    $loc.addRectFilled = new Sk.builtin.func(function(self, x, y, width, height, color) {
      Sk.ffi.checkArgs('addRectFilled', arguments, [5, 6]);

      _drawInto(self, function(ctx) {
        ctx.lineWidth = 1;
        ctx.fillStyle = _styleFromColor(color || mod.black);
        ctx.fillRect(Sk.ffi.unwrapo(x), Sk.ffi.unwrapo(y),
            Sk.ffi.unwrapo(width), Sk.ffi.unwrapo(height));
      });
    });

    $loc.addOval = new Sk.builtin.func(function(self, x, y, width, height, color) {
      Sk.ffi.checkArgs('addOval', arguments, [5, 6]);

      _drawInto(self, function(ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = _styleFromColor(color || mod.black);
        _drawEllipse(ctx, Sk.ffi.unwrapo(x), Sk.ffi.unwrapo(y),
            Sk.ffi.unwrapo(width), Sk.ffi.unwrapo(height), false);
      });
    });

    $loc.addOvalFilled = new Sk.builtin.func(function(self, x, y, width, height, color) {
      Sk.ffi.checkArgs('addOvalFilled', arguments, [5, 6]);

      _drawInto(self, function(ctx) {
        ctx.lineWidth = 1;
        ctx.fillStyle = _styleFromColor(color || mod.black);
        _drawEllipse(ctx, Sk.ffi.unwrapo(x), Sk.ffi.unwrapo(y),
            Sk.ffi.unwrapo(width), Sk.ffi.unwrapo(height), true);
      });
    });

    $loc.addArc = new Sk.builtin.func(function(self, x, y, width, height,
          startAngle, arcAngle, color) {
      Sk.ffi.checkArgs('addArc', arguments, [7, 8]);

      _drawInto(self, function(ctx) {
        var startRads, angleRads, endRads, reversed;

        ctx.lineWidth = 1;
        ctx.strokeStyle = _styleFromColor(color || mod.black);

        startRads = -_degToRad(Sk.ffi.unwrapo(startAngle));
        angleRads = _degToRad(Sk.ffi.unwrapo(arcAngle));
        endRads = startRads - angleRads;
        reversed = (angleRads >= 0);

        _drawEllipticalArc(ctx, Sk.ffi.unwrapo(x), Sk.ffi.unwrapo(y),
            Sk.ffi.unwrapo(width), Sk.ffi.unwrapo(height), startRads, endRads,
            reversed, false);
      });
    });

    $loc.addArcFilled = new Sk.builtin.func(function(self, x, y, width, height,
          startAngle, arcAngle, color) {
      Sk.ffi.checkArgs('addArcFilled', arguments, [7, 8]);

      _drawInto(self, function(ctx) {
        var startRads, angleRads, endRads, reversed;

        ctx.lineWidth = 1;
        ctx.fillStyle = _styleFromColor(color || mod.black);

        startRads = -_degToRad(Sk.ffi.unwrapo(startAngle));
        angleRads = _degToRad(Sk.ffi.unwrapo(arcAngle));
        endRads = startRads - angleRads;
        reversed = (angleRads >= 0);

        _drawEllipticalArc(ctx, Sk.ffi.unwrapo(x), Sk.ffi.unwrapo(y),
            Sk.ffi.unwrapo(width), Sk.ffi.unwrapo(height), startRads, endRads,
            reversed, true);
      });
    });
  };
  mod.Picture = Sk.misceval.buildClass(mod, picture, 'Picture', []);

  color = function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, red, green, blue) {
        Sk.ffi.checkArgs('__init__', arguments, 4);

        self._red = Sk.builtin.asnum$(red);
        self._green = Sk.builtin.asnum$(green);
        self._blue = Sk.builtin.asnum$(blue);
    });

    $loc.setRed = new Sk.builtin.func(function(self, red) {
      Sk.ffi.checkArgs('setRed', arguments, 2);
      self._red = Sk.builtin.asnum$(red);
    });

    $loc.setGreen = new Sk.builtin.func(function(self, green) {
      Sk.ffi.checkArgs('setGreen', arguments, 2);
      self._green = Sk.builtin.asnum$(green);
    });

    $loc.setBlue = new Sk.builtin.func(function(self, blue) {
      Sk.ffi.checkArgs('setBlue', arguments, 2);
      self._blue = Sk.builtin.asnum$(blue);
    });

    $loc.getRed = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getRed', arguments, 1);
      return self._red;
    });

    $loc.getGreen = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getGreen', arguments, 1);
      return self._green;
    });

    $loc.getBlue = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getBlue', arguments, 1);
      return self._blue;
    });

    $loc.makeDarker = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('makeDarker', arguments, 1);

      // This is from java.awt.Color
      return Sk.misceval.callsim(mod.Color, self._red * COLOR_FACTOR,
          self._green * COLOR_FACTOR, self._blue * COLOR_FACTOR);
    });

    $loc.makeLighter = new Sk.builtin.func(function(self) {
      var r, g, b, factor;
      
      Sk.ffi.checkArgs('makeLighter', arguments, 1);

      r = self._red;
      g = self._green;
      b = self._blue;
      factor = 1.0 / (1.0 - COLOR_FACTOR);

      // This is from java.awt.Color
      if(r === 0 && b === 0 && g === 0) {
        return Sk.misceval.callsim(mod.Color, factor, factor, factor);
      }

      if(r > 0 && r < factor) {
        r = factor;
      }
      if(g > 0 && g < factor) {
        g = factor;
      }
      if(b > 0 && b < factor) {
        b = factor;
      }

      return Sk.misceval.callsim(mod.Color, 
          r / COLOR_FACTOR, g / COLOR_FACTOR, b / COLOR_FACTOR);

    });

    $loc.distance = new Sk.builtin.func(function(self, other) {
      Sk.ffi.checkArgs('distance', arguments, 2);

      return Math.sqrt(
        Math.pow(self._red - other._red, 2) +
        Math.pow(self._green - other._green, 2) +
        Math.pow(self._blue - other._blue, 2));
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return new Sk.builtin.str('Color' + 
                                ', r='  + self._red +
                                ', g='  + self._green +
                                ', b='  + self._blue);
    });
  }; 
  mod.Color = Sk.misceval.buildClass(mod, color, 'Color', []);

  pixel = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, picture, x, y) {
      Sk.ffi.checkArgs('__init__', arguments, 4);

      self._x = Sk.builtin.asnum$(x);
      self._y = Sk.builtin.asnum$(y);
      self._picture = picture;
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var red, green, blue;

      Sk.ffi.checkArgs('__str__', arguments, 1);

      red = Sk.misceval.callsim(self.getRed, self); 
      green = Sk.misceval.callsim(self.getGreen, self); 
      blue = Sk.misceval.callsim(self.getBlue, self);

      return new Sk.builtin.str('Pixel'  + 
                                ', red='   + red +
                                ', green=' + green +
                                ', blue='  + blue);
    });

    $loc.setColor = new Sk.builtin.func(function (self, color) {
      var data, index;

      Sk.ffi.checkArgs('setColor', arguments, 2);

      data = self._picture._imageData.data;

      index = self._y * 4 * self._picture._width  + self._x * 4;

      data[index] = color._red;
      data[index+1] = color._green;
      data[index+2] = color._blue; 
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      data[index+3] = 255; 
    });

    $loc.getColor = new Sk.builtin.func(function (self) {
      var red, green, blue;

      Sk.ffi.checkArgs('getColor', arguments, 1);

      red = Sk.misceval.callsim(self.getRed, self); 
      green = Sk.misceval.callsim(self.getGreen, self); 
      blue = Sk.misceval.callsim(self.getBlue, self);

      return Sk.misceval.callsim(mod.Color, red, green, blue);
    });

    $loc.getX = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getX', arguments, 1);
      return self._x;
    });

    $loc.getY = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getY', arguments, 1);
      return self._y;
    });

    $loc.getRed = new Sk.builtin.func(function (self) {
      var index;

      index = (self._y * 4) * self._picture._width + (self._x * 4);

      Sk.ffi.checkArgs('getRed', arguments, 1);

      return self._picture._imageData.data[index];
    });

    $loc.getGreen = new Sk.builtin.func(function (self) {
      var index;

      index = (self._y * 4) * self._picture._width + (self._x * 4);

      Sk.ffi.checkArgs('getGreen', arguments, 1);

      return self._picture._imageData.data[index + 1];
    });

    $loc.getBlue = new Sk.builtin.func(function (self) {
      var index;

      index = (self._y * 4) * self._picture._width + (self._x * 4);

      Sk.ffi.checkArgs('getBlue', arguments, 1);

      return self._picture._imageData.data[index + 2];
    });

    $loc.setRed = new Sk.builtin.func(function (self, red) {
      var index;

      Sk.ffi.checkArgs('setRed', arguments, 2);

      index = self._y * 4 * self._picture._width  + self._x * 4;

      self._picture._imageData.data[index] = Sk.ffi.unwrapo(red);
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      self._picture._imageData.data[index + 3] = 255;
    });

    $loc.setGreen = new Sk.builtin.func(function (self, green) {
      var index;

      Sk.ffi.checkArgs('setGreen', arguments, 2);

      index = self._y * 4 * self._picture._width  + self._x * 4;

      self._picture._imageData.data[index + 1] = Sk.ffi.unwrapo(green);
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      self._picture._imageData.data[index + 3] = 255;
    });

    $loc.setBlue = new Sk.builtin.func(function (self, blue) {
      var index;

      Sk.ffi.checkArgs('setBlue', arguments, 2);

      index = self._y * 4 * self._picture._width  + self._x * 4;

      self._picture._imageData.data[index + 2] = Sk.ffi.unwrapo(blue);
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      self._picture._imageData.data[index + 3] = 255;
    });
  }
  mod.Pixel = Sk.misceval.buildClass(mod, pixel, 'Pixel', []);

  emptyPicture = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, width, height) {
      var canvas, ctx;

      Sk.ffi.checkArgs('__init__', arguments, 3);

      self._width = Sk.builtin.asnum$(width);
      self._height = Sk.builtin.asnum$(height);
      canvas = document.createElement("canvas");
      ctx = canvas.getContext('2d');
      canvas.height = self.height;
      canvas.width = self.width;
      self._imageData = ctx.getImageData(0, 0, self._width, self._height);
    });

    $loc['__str__'] = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return new Sk.builtin.str('Picture'   +
                                ', height ' + self._height +
                                ', width '  + self._width);
    });
  };
  mod.EmptyPicture = Sk.misceval.buildClass(
      mod, emptyPicture, 'EmptyPicture', [mod.Picture]);

  style = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, family, emph, size) {
      Sk.ffi.checkArgs('__init__', arguments, 4);
      self._family = family;
      self._emph = emph;
      self._size = Sk.ffi.unwrapo(size);
    }); 

    $loc.__str__ = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return new Sk.builtin.str('Style'   +
                                ', family ' + self._family +
                                ', emph '   + self._emph +
                                ', size '   + self._size);
    });

    $loc._toJSString = new Sk.builtin.func(function(self) {
      var styleString;

      switch(self._emph) {
        case 1:
          styleString = 'bold';
          break;
        case 2:
          styleString = 'italic';
          break;
        case 3:
          styleString = 'bold italic';
          break;
        default:
          styleString = '';
      }

      styleString += ' ' + self._size + 'pt';
      styleString += ' ' + self._family;

      return styleString;
    });
  };
  mod.Style = Sk.misceval.buildClass(mod, style, 'Style', []);

  /* -------------------------- PROCEDURAL STYLE FUNCTIONS ------------------ */

  mod.pickAFile = new Sk.builtin.func(function () {
    Sk.ffi.checkArgs('pickAFile', arguments, 0);

    return Sk.future(function (continueWith) {
      window.pythy.showMediaModal({
        mediaLinkClicked: function (link) {
          var clientHost, url;

          clientHost = window.location.protocol + '//' + window.location.host;
          url = $(link).attr('href');
          if(url[0] === '/') { url = clientHost + url; }

          $('#media_library_modal').modal('hide');

          continueWith(Sk.builtin.str(url));
        },
        cancelled: function () {
          continueWith(null);
        }
      });
    });
  });

  mod.makePicture = new Sk.builtin.func(function (imageUrl) {
    Sk.ffi.checkArgs('makePicture', arguments, 1);
    return Sk.misceval.callsim(mod.Picture, imageUrl);
  });

  mod.repaint = new Sk.builtin.func(function (picture) {
    Sk.ffi.checkArgs('repaint', arguments, 1);
    Sk.misceval.callsim(picture.tp$getattr('show'));
  });

  mod.show = new Sk.builtin.func(function (picture) {
    Sk.ffi.checkArgs('show', arguments, 1);
    Sk.misceval.callsim(picture.tp$getattr('show'));
  });

  mod.getHeight = new Sk.builtin.func(function (picture) {
    Sk.ffi.checkArgs('getHeight', arguments, 1);
    return picture._height;
  });

  mod.getWidth = new Sk.builtin.func(function (picture) {
    Sk.ffi.checkArgs('getWidth', arguments, 1);
    return picture._width;
  });

  mod.getPixel = new Sk.builtin.func(function (picture, x, y) {
    Sk.ffi.checkArgs('getPixel', arguments, 3);
    return Sk.misceval.callsim(mod.Pixel, picture, x, y);
  });

  mod.getPixels = new Sk.builtin.func(function (picture) {
    var pixels;

    Sk.ffi.checkArgs('getPixels', arguments, 1);

    pixels = [];
    for(var r = 0; r < picture._height; r++) {
      pixels[r] = [];
      for(var c = 0; c < picture._width; c++) {
        pixels[r][c] = Sk.misceval.callsim(mod.Pixel, picture, c, r);
      }
      pixels[r] = new Sk.builtin.list(pixels[r]);
    }

    return Sk.builtin.list(pixels);
  });

  mod.setColor = new Sk.builtin.func(function(pixel, color) {
    Sk.ffi.checkArgs('setColor', arguments, 2);
    Sk.misceval.callsim(pixel.setColor, pixel, color);
  });

  mod.getColor = new Sk.builtin.func(function (pixel) {
    Sk.ffi.checkArgs('getColor', arguments, 1);
    return Sk.misceval.callsim(pixel.getColor, pixel);
  });

  mod.getX = new Sk.builtin.func(function (pixel) {
    Sk.ffi.checkArgs('getX', arguments, 1);
    return pixel._x;
  });

  mod.getY = new Sk.builtin.func(function (pixel) {
    Sk.ffi.checkArgs('getY', arguments, 1);
    return pixel._y;
  });

  mod.getRed = new Sk.builtin.func(function(pixel) {
    Sk.ffi.checkArgs('getRed', arguments, 1);
    return Sk.misceval.callsim(pixel.getRed, pixel);
  });

  mod.getGreen = new Sk.builtin.func(function(pixel) {
    Sk.ffi.checkArgs('getGreen', arguments, 1);
    return Sk.misceval.callsim(pixel.getGreen, pixel);
  });

  mod.getBlue = new Sk.builtin.func(function(pixel) {
    Sk.ffi.checkArgs('getBlue', arguments, 1);
    return Sk.misceval.callsim(pixel.getBlue, pixel);
  });

  mod.setRed = new Sk.builtin.func(function(pixel, red) {
    Sk.ffi.checkArgs('setRed', arguments, 2);
    Sk.misceval.callsim(pixel.setRed, pixel, red);
  });

  mod.setGreen = new Sk.builtin.func(function(pixel, green) {
    Sk.ffi.checkArgs('setGreen', arguments, 2);
    Sk.misceval.callsim(pixel.setGreen, pixel, green);
  });

  mod.setBlue = new Sk.builtin.func(function(pixel, blue) {
    Sk.ffi.checkArgs('setBlue', arguments, 2);
    Sk.misceval.callsim(pixel.setBlue, pixel, blue);
  });

  mod.makeColor = new Sk.builtin.func(function(red, green, blue) {
    Sk.ffi.checkArgs('makeColor', arguments, 3);
    return Sk.misceval.callsim(mod.Color, red, green, blue);
  });

  mod.makeEmptyPicture = new Sk.builtin.func(function(width, height) {
    Sk.ffi.checkArgs('makeEmptyPicture', arguments, 2);
    return Sk.misceval.callsim(mod.EmptyPicture, width, height);
  });

  mod.pickAColor = new Sk.builtin.func(function() {
    Sk.ffi.checkArgs('pickAColor', arguments, 0);
    
    return Sk.future(function(continueWith) {
      _showColorPicker(continueWith);
    });
  });

  mod.setMediaPath = new Sk.builtin.func(function (path) {
    Sk.ffi.checkArgs('setMediaPath', arguments, 1);
    Sk.misceval.print_(new Sk.builtin.NotImplementedError(
        'Pythy does not support setting the media path.'));
    Sk.misceval.print_('\n');
  });

  mod.getMediaPath = new Sk.builtin.func(function () {
    Sk.ffi.checkArgs('getMediaPath', arguments, 0);
    Sk.misceval.print_(new Sk.builtin.NotImplementedError(
        'Pythy does not support getting the media path.'));
    Sk.misceval.print_('\n');
  });

  mod.distance = new Sk.builtin.func(function(color1, color2)
  {
    Sk.ffi.checkArgs('distance', arguments, 2);
    return Sk.misceval.callsim(color1.distance, color1, color2);
  });

  mod.writePictureTo = new Sk.builtin.func(function(picture, path) {
    var type;

    Sk.ffi.checkArgs('writePictureTo', arguments, 2);

    // Extract the file extension. It looks bizarre at first; source is
    // http://stackoverflow.com/a/12900504/307266.
    path = Sk.ffi.unwrapo(path);
    type = path.substr((Math.max(0, path.lastIndexOf(".")) || Infinity) + 1);

    Sk.future(function(continueWith) {
      _drawInto(picture, function(ctx, canvas) {
        var dataUrl;

        dataUrl = Canvas2Image.convertToURI(
            canvas, picture.width, picture.height, type);

        window.mediaffi.writePictureTo(dataUrl, path, continueWith);
      });
    });
  });

  mod.makeStyle = new Sk.builtin.func(function(family, emph, size) {
    Sk.ffi.checkArgs('makeStyle', arguments, 3);
    return Sk.misceval.callsim(mod.Style, family, emph, size);
  });

  mod.PLAIN     = 0
  mod.BOLD      = 1
  mod.ITALIC    = 2
  mod.sansSerif = 'Sans Serif'
  mod.serif     = 'Serif'
  mod.mono      = 'Monospaced'
  mod.comicSans = 'Comic Sans MS'
  mod.black     = Sk.misceval.callsim(mod.Color, 0, 0, 0);
  mod.blue      = Sk.misceval.callsim(mod.Color, 0, 0, 255);
  mod.cyan      = Sk.misceval.callsim(mod.Color, 0, 255, 255);
  mod.darkGray  = Sk.misceval.callsim(mod.Color, 64, 64, 64);
  mod.gray      = Sk.misceval.callsim(mod.Color, 128, 128, 128);
  mod.green     = Sk.misceval.callsim(mod.Color, 0, 255, 0);
  mod.lightGray = Sk.misceval.callsim(mod.Color, 192, 192, 192);
  mod.magenta   = Sk.misceval.callsim(mod.Color, 255, 0, 255);
  mod.orange    = Sk.misceval.callsim(mod.Color, 255, 200, 0);
  mod.pink      = Sk.misceval.callsim(mod.Color, 255, 175, 175);
  mod.red       = Sk.misceval.callsim(mod.Color, 255, 0, 0);
  mod.white     = Sk.misceval.callsim(mod.Color, 255, 255, 255);
  mod.yellow    = Sk.misceval.callsim(mod.Color, 255, 255, 0);

  return mod;
}
