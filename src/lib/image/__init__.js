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

      if(imageId.indexOf("http://") == 0) {
        res = Sk.future(function (continueWith) {
          url = Sk.transformUrl(imageId);
          $('<img>').load(function()
          {
            self.image = this;
            self.width = self.image.width;
            self.height = self.image.height;
            self.canvas = document.createElement('canvas');
            self.canvas.width = self.width;
            self.canvas.height = self.height;
            self.ctx = canvas.getContext('2d');
            self.ctx.drawImage(self.image, 0, 0);
            self.imageData = ctx.getImageData(0, 0, self.width, self.height);
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
        self.imagedata = self.ctx.getImageData(0,0,self.width,self.height);
      }
    });

    $loc.getPixel = new Sk.builtin.func(function (self, x, y) {
      var index, red, blue, green, id;

      Sk.ffi.checkArgs('getPixel', arguments, 3);

      x = Sk.builtin.asnum$(x);
      y = Sk.builtin.asnum$(y);

      index = (y * 4) * self.width + (x * 4);
      id = self.imageData.data;
      red   = id[index];
      green = id[index + 1];
      blue  = id[index + 2];

      return Sk.misceval.callsim(mod.Pixel, red, green, blue);
    });

    $loc.setPixel = new Sk.builtin.func(function(self, x, y, pix) {
      var index, id;

      Sk.ffi.checkArgs('setPixel', arguments, 4);

      x = Sk.builtin.asnum$(x);
      y = Sk.builtin.asnum$(y);

      index = (y * 4) * self.width + (x * 4);
      id = self.imageData.data;

      id[index] = Sk.misceval.callsim(pix.getRed,pix);
      id[index+1] = Sk.misceval.callsim(pix.getGreen,pix);
      id[index+2] = Sk.misceval.callsim(pix.getBlue,pix);
      id[index+3] = 255;
    });

    $loc.getHeight = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getHeight', arguments, 1);
      return self.height;
    });

    $loc.getWidth = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getWidth', arguments, 1);
      return self.width;
    });

    $loc.draw = new Sk.builtin.func(function(self, win, ulx, uly) {
      var can, ctx; 

      win = Sk.builtin.asnum$(win);
      ulx = Sk.builtin.asnum$(ulx);
      uly = Sk.builtin.asnum$(uly);

      if(!win) {
        // New window
        win =  
      }
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
  }
  mod.Image = Sk.misceval.buildClass(mod, image, 'Image', []);

  var eImage = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function (self, width, height) {
      Sk.ffi.checkArgs('__init__', arguments, 3);

      self.width = Sk.builtin.asnum$(width);
      self.height = Sk.builtin.asnum$(height);
      self.canvas = document.createElement("canvas");
      self.ctx = self.canvas.getContext('2d');
      self.canvas.height = self.height;
      self.canvas.width = self.width;
      self.imagedata = self.ctx.getImageData(0, 0, self.width, self.height);
    });
  }
  mod.EmptyImage = Sk.misceval.buildClass(mod, eImage, 'EmptyImage', [mod.Image]);

  var pixel = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, r, g, b) {
        Sk.ffi.checkArgs('__init__', arguments, 4);

        self.red = Sk.builtin.asnum$(r);
        self.green = Sk.builtin.asnum$(g);
        self.blue = Sk.builtin.asnum$(b);
    });

    $loc.getRed = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getRed', arguments, 1);
      return self.red;
    });

    $loc.getGreen = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getGreen', arguments, 1);
      return self.green;
    });

    $loc.getBlue = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getBlue', arguments, 1);
      return self.blue;
    });

    $loc.setRed = new Sk.builtin.func(function(self,r) {
      Sk.ffi.checkArgs('setRed', arguments, 2);
      self.red = Sk.builtin.asnum$(r);
    });

    $loc.setGreen = new Sk.builtin.func(function(self,g) {
      Sk.ffi.checkArgs('setGreen', arguments, 2);
      self.green = Sk.builtin.asnum$(g);
    });

    $loc.setBlue = new Sk.builtin.func(function(self,b) {
      Sk.ffi.checkArgs('setBlue', arguments, 2);
      self.blue = Sk.builtin.asnum$(b);
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
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return Sk.builtins.str(Sk.misceval.callsim(self.getColorTuple, self));
    });
    
    $loc.__repr__ = new Sk.builtin.func(function(self)
    {
      Sk.ffi.checkArgs('__repr__', arguments, 1);
      return Sk.builtins.str(Sk.misceval.callsim(self.getColorTuple, self));
    });
    $loc.getColorTuple = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('getColorTuple', arguments, 1);
      return new Sk.builtin.tuple([self.red, self.green, self.blue]);
    });

    //setRange -- change from 0..255 to 0.0 .. 1.0
    $loc.setRange = new Sk.builtin.func(function(self, mx) {
      Sk.ffi.checkArgs('setRange', arguments, 2);
      self.max = Sk.builtin.asnum$(mx);
    });
  }
  mod.Pixel = Sk.misceval.buildClass(mod, pixel, 'Pixel', []);

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

  return mod;
}
