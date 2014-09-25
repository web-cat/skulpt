var ImageMod;

if (!ImageMod) {
  ImageMod = {};
  ImageMod.canvasLib = [];
}

var $builtinmodule = function(name) {
  var mod = {};

  var image = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, imageId) {
      var url, res, errorString, origUrl;

      Sk.ffi.checkArgs('__init__', arguments, 2);

      origUrl = Sk.ffi.unwrapo(imageId);

      if(origUrl.indexOf("http://") === 0 || 
         origUrl.indexOf("https://") === 0) {
        res = Sk.future(function (continueWith) {
          url = Sk.transformUrl(origUrl);
          $('<img>').load(function() {
            self._url = origUrl;
            self._image = this;
            self._width = self._image.width;
            self._height = self._image.height;
            self._canvas = document.createElement('canvas');
            self._canvas.width = self._width;
            self._canvas.height = self._height;
            self._ctx = self._canvas.getContext('2d');
            self._ctx.drawImage(self._image, 0, 0);
            continueWith(null);
          }).error(function() {
            errorString = 'The image could not be loaded. Is the URL incorrect?';
            continueWith(new Sk.builtin.ValueError(errorString));
          }).attr('src', url);
        });
        if (res) throw res;
      } else {
        self._image = document.getElementById(origUrl);
        if (self._image == null) {
            throw "There is no image on this page named: " + origUrl;
        }
        self._width = self.image.width;
        self._height = self.image.height;
        self._canvas = document.createElement("canvas");
        self._canvas.height = self._height;
        self._canvas.width = self._width;
        self._ctx = self.canvas.getContext("2d");
        self._ctx.drawImage(self._image,0,0)
      }
    });

    $loc.draw = new Sk.builtin.func(function(self, win, ulx, uly) {
      var can, ctx; 

      win = Sk.builtin.asnum$(win);
      ulx = Sk.builtin.asnum$(ulx);
      uly = Sk.builtin.asnum$(uly);

      if (!ulx) {
          ulx = 0;
          uly = 0;
      }

      can = Sk.misceval.callsim(win.getWin, win);
      ctx = can.getContext("2d");

      ctx.putImageData(self._imageData, ulx, uly);
    });
  
    // ------------------------------------------------------
    // FIXME This function isn't very usable until I can figure out how to
    // optimize function calls... or, until I figure out a way to let pure
    // JS-implemented modules do yielding and preserve their state.
    $loc.toList = new Sk.builtin.func(function(self)
    {
      var row, rows, y, x, pixel;

      Sk.ffi.checkArgs('toList', arguments, 1);

      rows = new Sk.builtin.list([]);

      for (y = 0; y < self.height; y++)
      {
        row = new Sk.builtin.list([]);
        rows.v.push(row);

        for (x = 0; x < self.width; x++)
        {
          pixel = Sk.misceval.callsim(self.getPixel, self, x, y);
          row.v.push(pixel);
        }
      }

      return rows;
    });

    $loc['__str__'] = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return new Sk.builtin.str('Picture'   +
                                ', url '    + self._url +
                                ', height ' + self._height +
                                ', width '  + self._width);
    });

    $loc.show = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('show', arguments, 1);
      Sk.canvas.show(self._canvas);
    });

    $loc.getHeight = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getHeight', arguments, 1);
      return self._height;
    });

    $loc.getWidth = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getWidth', arguments, 1);
      return self._width;
    });

    $loc._getImageData = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('_getImageData', arguments, 1);
      return self._ctx.getImageData(0, 0, self._width, self._height);
    });

    $loc.setColor = new Sk.builtin.func(function (self, x, y, color) {
      var newImageData, newData, oldImageData;

      Sk.ffi.checkArgs('setColor', arguments, 4);

      oldImageData = self._ctx.getImageData(x, y, 1, 1);
      newImageData = self._ctx.createImageData(1, 1);
      newData = newImageData.data;

      newData[0] = Sk.misceval.callsim(color.getRed, color);
      newData[1] = Sk.misceval.callsim(color.getGreen, color);
      newData[2] = Sk.misceval.callsim(color.getBlue, color);
      // Note: We have to set the alpha to 255 because the rgb values are
      // multiplied by the alpha before being set. So if alpha = 0, the rgb
      // values will become 0
      newData[3] = 255;

      self._ctx.putImageData(newImageData, x, y);
    }); 

    $loc.setRed = new Sk.builtin.func(function (self, x, y, red) {
      var newImageData, newData, oldImageData, oldData;

      Sk.ffi.checkArgs('setRed', arguments, 4);

      oldImageData = self._ctx.getImageData(x, y, 1, 1);
      oldData = oldImageData.data;
      newImageData = self._ctx.createImageData(1, 1);
      newData = newImageData.data;

      newData[0] = Sk.ffi.unwrapo(red);
      newData[1] = oldData[1];
      newData[2] = oldData[2];
      // See note about alpha in setColor
      newData[3] = 255;

      self._ctx.putImageData(newImageData, x, y);
    });

    $loc.setGreen = new Sk.builtin.func(function (self, x, y, green) {
      var newImageData, newData, oldImageData, oldData;

      Sk.ffi.checkArgs('setGreen', arguments, 4);

      oldImageData = self._ctx.getImageData(x, y, 1, 1);
      oldData = oldImageData.data;
      newImageData = self._ctx.createImageData(1, 1);
      newData = newImageData.data;

      newData[0] = oldData[0];
      newData[1] = Sk.ffi.unwrapo(green);
      newData[2] = oldData[2];
      // See note about alpha in setColor
      newData[3] = 255;

      self._ctx.putImageData(newImageData, x, y);
    });

    $loc.setBlue = new Sk.builtin.func(function (self, x, y, blue) {
      var newImageData, newData, oldImageData, oldData;

      Sk.ffi.checkArgs('setBlue', arguments, 4);

      oldImageData = self._ctx.getImageData(x, y, 1, 1);
      oldData = oldImageData.data;
      newImageData = self._ctx.createImageData(1, 1);
      newData = newImageData.data;

      newData[0] = oldData[0];
      newData[1] = oldData[1];
      newData[2] = Sk.ffi.unwrapo(blue);
      // See note about alpha in setColor
      newData[3] = 255;

      self._ctx.putImageData(newImageData, x, y);
    });
  }
  mod.Image = Sk.misceval.buildClass(mod, image, 'Image', []);

  var color = function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, red, green, blue, alpha) {
        Sk.ffi.checkArgs('__init__', arguments, 5);

        Sk.misceval.callsim(self.setRed, self, red);
        Sk.misceval.callsim(self.setGreen, self, green);
        Sk.misceval.callsim(self.setBlue, self, blue);
        Sk.misceval.callsim(self.setAlpha, self, alpha);
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

    $loc.setAlpha = new Sk.builtin.func(function(self, alpha) {
      Sk.ffi.checkArgs('setAlpha', arguments, 2);
      self._alpha = Sk.builtin.asnum$(alpha);
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

    $loc.getAlpha = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getAlpha', arguments, 1);
      return self._alpha;
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

  var pixel = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, image, x, y) {
      var index, imageData, data, width;

      Sk.ffi.checkArgs('__init__', arguments, 4);

      width = Sk.misceval.callsim(image.getWidth, image);
      index = (Sk.ffi.unwrapo(y) * 4) * width + (Sk.ffi.unwrapo(x) * 4);
      imageData = Sk.misceval.callsim(image._getImageData, image);
      data = imageData.data;

      self._color = Sk.misceval.callsim(mod.Color,
          data[index], data[index + 1], data[index + 2], data[index + 3]);
      self._x = Sk.builtin.asnum$(x);
      self._y = Sk.builtin.asnum$(y);
      self._image = image;
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var red, green, blue;

      Sk.ffi.checkArgs('__str__', arguments, 1);

      red = Sk.misceval.callsim(self._color.getRed, self._color); 
      green = Sk.misceval.callsim(self._color.getGreen, self._color); 
      blue = Sk.misceval.callsim(self._color.getBlue, self._color);

      return new Sk.builtin.str('Pixel'  + 
                                ', red='   + red +
                                ', green=' + green +
                                ', blue='  + blue);
    });

    $loc.setColor = new Sk.builtin.func(function (self, color) {
      Sk.ffi.checkArgs('setColor', arguments, 2);

      self._color = color;
      Sk.misceval.callsim(self._image.setColor, self._image, self._x, self._y, color);
    });

    $loc.getColor = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getColor', arguments, 1);
      return self._color;
    });

    $loc.getX = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getX', arguments, 1);
      return self._x;
    });

    $loc.getY = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getY', arguments, 1);
      return self._y;
    });

    $loc._getImage = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('_getImage', arguments, 1);
      return self._image;
    });

    $loc.getRed = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getRed', arguments, 1);
      return Sk.misceval.callsim(self._color.getRed, self._color);
    });

    $loc.getGreen = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getGreen', arguments, 1);
      return Sk.misceval.callsim(self._color.getGreen, self._color);
    });

    $loc.getBlue = new Sk.builtin.func(function (self) {
      Sk.ffi.checkArgs('getBlue', arguments, 1);
      return Sk.misceval.callsim(self._color.getBlue, self._color);
    });

    $loc.setRed = new Sk.builtin.func(function (self, red) {
      Sk.ffi.checkArgs('setRed', arguments, 2);

      Sk.misceval.callsim(self._color.setRed, self._color, red);
      Sk.misceval.callsim(self._image.setRed, self._image, self._x, self._y, red);
    });

    $loc.setGreen = new Sk.builtin.func(function (self, green) {
      Sk.ffi.checkArgs('setGreen', arguments, 2);

      Sk.misceval.callsim(self._color.setGreen, self._color, green);
      Sk.misceval.callsim(self._image.setGreen, self._image, self._x, self._y, green);
    });

    $loc.setBlue = new Sk.builtin.func(function (self, blue) {
      Sk.ffi.checkArgs('setBlue', arguments, 2);

      Sk.misceval.callsim(self._color.setBlue, self._color, blue);
      Sk.misceval.callsim(self._image.setBlue, self._image, self._x, self._y, blue);
    });
  }
  mod.Pixel = Sk.misceval.buildClass(mod, pixel, 'Pixel', []);

  var eImage = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, width, height) {
      Sk.ffi.checkArgs('__init__', arguments, 3);

      self._width = Sk.builtin.asnum$(width);
      self._height = Sk.builtin.asnum$(height);
      self._canvas = document.createElement("canvas");
      self._ctx = self.canvas.getContext('2d');
      self._canvas.height = self.height;
      self._canvas.width = self.width;
    });
  }
  mod.EmptyImage = Sk.misceval.buildClass(mod, eImage, 'EmptyImage', [mod.Image]);

  var screen = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, width, height) {
      var currentCanvas = ImageMod.canvasLib[Sk.canvas];

      if (currentCanvas === undefined) {
        self.theScreen = document.getElementById(Sk.canvas);
        if (width !== undefined) {
          self.theScreen.height = height;
          self.theScreen.width = width;
        }
        ImageMod.canvasLib[Sk.canvas] = self.theScreen;
      } else {
        self.theScreen = currentCanvas;
        self.theScreen.height = self.theScreen.height;
      }
      self.theScreen.style.display = "block";
    });

    $loc.getWin = new Sk.builtin.func(function(self) {
      return self.theScreen;
    });

    $loc.exitonclick = new Sk.builtin.func(function(self) {
      var canvas_id = self.theScreen.id;

      self.theScreen.onclick = function() {
        document.getElementById(canvas_id).style.display = 'none';
        document.getElementById(canvas_id).onclick = null;
        delete ImageMod.canvasLib[canvas_id];
      }
    });
  }
  mod.ImageWin = Sk.misceval.buildClass(mod, screen, 'ImageWin', []);

  /* -------------------------- PROCEDURAL STYLE FUNCTIONS ------------------ */

  mod.makePicture = new Sk.builtin.func(function (imageId) {
    Sk.ffi.checkArgs('makePicture', arguments, 1);
    return Sk.misceval.callsim(mod.Image, imageId);
  });

  mod.show = new Sk.builtin.func(function (image) {
    Sk.ffi.checkArgs('show', arguments, 1);
    Sk.misceval.callsim(image.show, image);
  });

  mod.getHeight = new Sk.builtin.func(function (image) {
    Sk.ffi.checkArgs('getHeight', arguments, 1);
    return Sk.misceval.callsim(image.getHeight, image);
  });

  mod.getWidth = new Sk.builtin.func(function (image) {
    Sk.ffi.checkArgs('getWidth', arguments, 1);
    return Sk.misceval.callsim(image.getWidth, image);
  });

  mod.getPixel = new Sk.builtin.func(function (image, x, y) {
    Sk.ffi.checkArgs('getPixel', arguments, 3);
    return Sk.misceval.callsim(mod.Pixel, image, x, y);
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
    return Sk.misceval.callsim(pixel.getX, pixel);
  });

  mod.getY = new Sk.builtin.func(function (pixel) {
    Sk.ffi.checkArgs('getY', arguments, 1);
    return Sk.misceval.callsim(pixel.getY, pixel);
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

  mod.makeColor = new Sk.builtin.func(function (red, green, blue) {
    Sk.ffi.checkArgs('makeColor', arguments, 3);
    return Sk.misceval.callsim(mod.Color, red, green, blue, 255);
  });

  return mod;
}
