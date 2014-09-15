var ImageMod;

if (!ImageMod) {
  ImageMod = {};
  ImageMod.canvasLib = [];
}

var $builtinmodule = function(name) {
  var mod = {};

  var image = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, imageId) {
      var url, res, errorString;

      Sk.ffi.checkArgs('__init__', arguments, 2);

      if(imageId.v.indexOf("http://") === 0 || 
         imageId.v.indexOf("https://") === 0) {
        res = Sk.future(function (continueWith) {
          url = Sk.transformUrl(imageId.v);
          $('<img>').load(function() {
            self.url = imageId.v;
            self.image = this;
            self.width = self.image.width;
            self.height = self.image.height;
            self.canvas = document.createElement('canvas');
            self.canvas.width = self.width;
            self.canvas.height = self.height;
            self.ctx = self.canvas.getContext('2d');
            self.ctx.drawImage(self.image, 0, 0);
            self.imageData = self.ctx.getImageData(0, 0, self.width, self.height);
            continueWith(null);
          }).error(function() {
            errorString = 'The image could not be loaded. Is the URL incorrect?';
            continueWith(new Sk.builtin.ValueError(errorString));
          }).attr('src', url);
        });
        if (res) throw res;
      } else {
        self.image = document.getElementById(imageId.v);
        if (self.image == null) {
            throw "There is no image on this page named: " + imageId.v;
        }
        self.width = self.image.width;
        self.height = self.image.height;
        self.canvas = document.createElement("canvas");
        self.canvas.height = self.height;
        self.canvas.width = self.width;
        self.ctx = self.canvas.getContext("2d");
        self.ctx.drawImage(self.image,0,0)
        self.imagedata = self.ctx.getImageData(0, 0, self.width, self.height);
      }
    });

    $loc.draw = new Sk.builtin.func(function(self, win, ulx, uly) {
      var can, ctx; 

      win = Sk.builtin.asnum$(win);
      ulx = Sk.builtin.asnum$(ulx);
      uly = Sk.builtin.asnum$(uly);

      if (! ulx) {
          ulx = 0;
          uly = 0;
      }

      can = Sk.misceval.callsim(win.getWin, win);
      ctx = can.getContext("2d");

      ctx.putImageData(self.imagedata, ulx, uly);
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
                                ', url '    + self.url +
                                ', height ' + self.height +
                                ', width '  + self.width);
    });
  }
  mod.Image = Sk.misceval.buildClass(mod, image, 'Image', []);

  var pixel = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, r, g, b, x, y, image) {
      Sk.ffi.checkArgs('__init__', arguments, 7);

      self.color = Sk.misceval.callsim(mod.Color, r, g, b);
      self.x = Sk.builtin.asnum$(x);
      self.y = Sk.builtin.asnum$(y);
      self.image = image;
    });

    $loc.__getitem__ = new Sk.builtin.func(function (self, index) {
      Sk.ffi.checkArgs('__getitem__', arguments, 2);

      index = Sk.builtin.asnum$(index);

      if(index == 0) {
        return self.red;
      } else if (index == 1) {
         return self.green;
      } else if (index == 2) {
         return self.blue;
      } else {
        throw new Sk.builtin.ValueError('Index ' + index +
                                        ' out of range (must be 0-2)');
      }
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      var r, g, b;

      Sk.ffi.checkArgs('__str__', arguments, 1);

      r = Sk.misceval.callsim(mod.getRed, self); 
      g = Sk.misceval.callsim(mod.getGreen, self); 
      b = Sk.misceval.callsim(mod.getBlue, self);

      return new Sk.builtin.str('Pixel'  + 
                                ', red='   + r +
                                ', green=' + g +
                                ', blue='  + b);
    });
    
    //setRange -- change from 0..255 to 0.0 .. 1.0
    $loc.setRange = new Sk.builtin.func(function(self, mx) {
      Sk.ffi.checkArgs('setRange', arguments, 2);
      self.max = Sk.builtin.asnum$(mx);
    });
  }
  mod.Pixel = Sk.misceval.buildClass(mod, pixel, 'Pixel', []);

  var eImage = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, width, height) {
      Sk.ffi.checkArgs('__init__', arguments, 3);

      self.width = Sk.builtin.asnum$(width);
      self.height = Sk.builtin.asnum$(height);
      self.canvas = document.createElement("canvas");
      self.ctx = self.canvas.getContext('2d');
      self.canvas.height = self.height;
      self.canvas.width = self.width;
      self.imageData = self.ctx.getImageData(0, 0, self.width, self.height);
    });
  }
  mod.EmptyImage = Sk.misceval.buildClass(mod, eImage, 'EmptyImage', [mod.Image]);

  var color = function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, r, g, b) {
        Sk.ffi.checkArgs('__init__', arguments, 4);

        self.red = Sk.builtin.asnum$(r);
        self.green = Sk.builtin.asnum$(g);
        self.blue = Sk.builtin.asnum$(b);
    });

    $loc.getRed = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return self.red;
    });

    $loc.getBlue = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return self.blue;
    });

    $loc.getGreen = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return self.green;
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return new Sk.builtin.str('Color' + 
                                ', r='  + self.red +
                                ', g='  + self.green +
                                ', b='  + self.blue);
    });
  }; 
  mod.Color = Sk.misceval.buildClass(mod, color, 'Color', []);

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

  mod.makePicture = new Sk.builtin.func(function (imageId) {
    Sk.ffi.checkArgs('makePicture', arguments, 1);
    return Sk.misceval.callsim(mod.Image, imageId);
  });

  mod.show = new Sk.builtin.func(function (image) {
    Sk.ffi.checkArgs('show', arguments, 1);
    Sk.canvas.show(image.canvas);
  });

  mod.getHeight = new Sk.builtin.func(function(image) {
    Sk.ffi.checkArgs('getHeight', arguments, 1);
    return image.height;
  });

  mod.getWidth = new Sk.builtin.func(function(image) {
    Sk.ffi.checkArgs('getWidth', arguments, 1);
    return image.width;
  });

  mod.getPixel = new Sk.builtin.func(function (image, x, y) {
    var index, red, blue, green, id;

    Sk.ffi.checkArgs('getPixel', arguments, 3);

    x = Sk.builtin.asnum$(x);
    y = Sk.builtin.asnum$(y);

    index = (y * 4) * image.width + (x * 4);
    id = image.imageData.data;
    red   = id[index];
    green = id[index + 1];
    blue  = id[index + 2];

    return Sk.misceval.callsim(mod.Pixel, red, green, blue, x, y, image);
  });

  mod.setColor = new Sk.builtin.func(function(pixel, color) {
    var index, imageData;

    Sk.ffi.checkArgs('setPixel', arguments, 2);

    // Each pixel is represented by 4 array elements [red, green, blue, alpha]
    // in row major order, see http://beej.us/blog/data/html5s-canvas-2-pixel
    index = (pixel.y * 4) * pixel.image.width + (pixel.x * 4);
    imageData = pixel.image.imageData.data;
    pixel.color = color;

    imageData[index]   = Sk.misceval.callsim(mod.getRed, pixel);
    imageData[index+1] = Sk.misceval.callsim(mod.getGreen, pixel);
    imageData[index+2] = Sk.misceval.callsim(mod.getBlue, pixel);
    imageData[index+3] = 255;

    pixel.image.ctx.putImageData(pixel.image.imageData, 0, 0);
  });

  mod.getColor = new Sk.builtin.func(function (pixel) {
    Sk.ffi.checkArgs('getColor', arguments, 1);
    return pixel.color;
  });

  mod.getX = new Sk.builtin.func(function (pixel) {
    Sk.ffi.checkArgs('getX', arguments, 1);
    return pixel.x;
  });

  mod.getY = new Sk.builtin.func(function (pixel) {
    Sk.ffi.checkArgs('getY', arguments, 1);
    return pixel.y;
  });

  mod.getRed = new Sk.builtin.func(function(pixel) {
    debugger;
    Sk.ffi.checkArgs('getRed', arguments, 1);
    return Sk.misceval.callsim(pixel.color.getRed, pixel.color);
  });

  mod.getGreen = new Sk.builtin.func(function(pixel) {
    Sk.ffi.checkArgs('getGreen', arguments, 1);
    return Sk.misceval.callsim(pixel.color.getGreen, pixel.color);
  });

  mod.getBlue = new Sk.builtin.func(function(pixel) {
    Sk.ffi.checkArgs('getBlue', arguments, 1);
    return Sk.misceval.callsim(pixel.color.getBlue, pixel.color);
  });

  mod.setRed = new Sk.builtin.func(function(pixel, r) {
    Sk.ffi.checkArgs('setRed', arguments, 2);
    return Sk.misceval.callsim(pixel.color.setRed, pixel.color, r);
  });

  mod.setGreen = new Sk.builtin.func(function(pixel, g) {
    Sk.ffi.checkArgs('setGreen', arguments, 2);
    return Sk.misceval.callsim(pixel.color.setGreen, pixel.color, g);
  });

  mod.setBlue = new Sk.builtin.func(function(pixel, b) {
    Sk.ffi.checkArgs('setBlue', arguments, 2);
    return Sk.misceval.callsim(pixel.color.setBlue, pixel.color, b);
  });

  mod.makeColor = new Sk.builtin.func(function (r, g, b) {
    Sk.ffi.checkArgs('makeColor', arguments, 3);
    return Sk.misceval.callsim(mod.Color, r, g, b);
  });

  return mod;
}
