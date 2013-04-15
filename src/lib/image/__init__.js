var $builtinmodule = function(name)
{
  var image = {};

  var Image = function($gbl, $loc)
  {
    // ------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, url)
    {
      Sk.future(function(continueWith)
      {
        url = Sk.transformUrl(url.v);
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
        }).attr('src', url);
      });
    });


    // ------------------------------------------------------
    $loc.getPixel = new Sk.builtin.func(function(self, x, y)
    {
      var index = (y * 4) * self.width + (x * 4);
      var id = self.imageData.data;
      var r = id[index];
      var g = id[index + 1];
      var b = id[index + 2];
      return Sk.misceval.callsim(image.Pixel, r, g, b);
    });


    // ------------------------------------------------------
    $loc.setPixel = new Sk.builtin.func(function(self, x, y, pix)
    {
      var index = (y * 4) * self.width + (x * 4);
      var id = self.imageData.data;
      
      // allevato: We get a somewhat substantial speedup by accessing
      // the components directly instead of going through the function
      // call machinery. Of course, this wouldn't let users provide
      // "duck" pixels that implement the same methods, but that's not
      // likely to be a use case that anyone is ever interested in.
      id[index] = pix.red;
      id[index + 1] = pix.green;
      id[index + 2] = pix.blue;
      id[index + 3] = 255;
    });


    // ------------------------------------------------------
    $loc.getWidth = new Sk.builtin.func(function(self)
    {
      return self.width;
    });


    // ------------------------------------------------------
    $loc.getHeight = new Sk.builtin.func(function(self)
    {
      return self.height;
    });


    // ------------------------------------------------------
    // FIXME This function isn't very usable until I can figure out how to
    // optimize function calls... or, until I figure out a way to let pure
    // JS-implemented modules do yielding and preserve their state.
    $loc.toList = new Sk.builtin.func(function(self)
    {
      var rows = new Sk.builtin.list([]);

      for (var y = 0; y < self.height; y++)
      {
        var row = new Sk.builtin.list([]);
        rows.v.push(row);

        for (var x = 0; x < self.width; x++)
        {
          var pixel = Sk.misceval.callsim(self.getPixel, self, x, y);
          row.v.push(pixel);
        }
      }

      return rows;
    });


    // ------------------------------------------------------
    $loc.show = new Sk.builtin.func(function(self)
    {
      var canvas = document.createElement('canvas');
      canvas.width = self.width;
      canvas.height = self.height;
      var ctx = canvas.getContext('2d');
      ctx.putImageData(self.imageData, 0, 0);

      Sk.canvas.show(canvas);
    });
  };

  image.Image = Sk.misceval.buildClass(image, Image, 'Image', []);


  // ====================================================================
  var EmptyImage = function($gbl, $loc)
  {
    // ------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, width, height)
    {
      self.width = width;
      self.height = height;
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      self.imageData = ctx.getImageData(0, 0, self.width, self.height);
    });
  };

  image.EmptyImage = Sk.misceval.buildClass(
    image, EmptyImage, 'EmptyImage', [image.Image]);


  // ====================================================================    
  var Pixel = function($gbl, $loc)
  {
    // ------------------------------------------------------
    $loc.__init__ = new Sk.builtin.func(function(self, r, g, b)
    {
      self.red = r;
      self.green = g;
      self.blue = b;
    });


    // ------------------------------------------------------
    $loc.getRed = new Sk.builtin.func(function(self)
    {
      return self.red;
    });


    // ------------------------------------------------------
    $loc.getGreen = new Sk.builtin.func(function(self)
    {
      return self.green;
    });


    // ------------------------------------------------------
    $loc.getBlue = new Sk.builtin.func(function(self)
    {
      return self.blue;
    });


    // ------------------------------------------------------
    $loc.setRed = new Sk.builtin.func(function(self, r)
    {
      self.red = r;
    });


    // ------------------------------------------------------
    $loc.setGreen = new Sk.builtin.func(function(self, g)
    {
      self.green = g;
    });


    // ------------------------------------------------------
    $loc.setBlue = new Sk.builtin.func(function(self, b)
    {
      self.blue = b;
    });


    // ------------------------------------------------------
    $loc.__getitem__ = new Sk.builtin.func(function(self, index)
    {
      if (index == 0)
      {
        return self.red;
      }
      else if (index == 1)
      {
        return self.green;
      }
      else if (index == 2)
      {
        return self.blue;
      }
      else
      {
        throw new Sk.builtin.ValueError('Index '
          + index + ' out of range (must be 0-2)');
      }
    });


    // ------------------------------------------------------
    $loc.__str__ = new Sk.builtin.func(function(self)
    {
      return Sk.builtins.str(Sk.misceval.callsim(self.getColorTuple, self));
    });
    

    // ------------------------------------------------------
    $loc.__repr__ = new Sk.builtin.func(function(self)
    {
      return Sk.builtins.str(Sk.misceval.callsim(self.getColorTuple, self));
    });
    

    // ------------------------------------------------------
    $loc.getColorTuple = new Sk.builtin.func(function(self)
    {
      return new Sk.builtin.tuple([self.red, self.green, self.blue]);
    });
  };

  image.Pixel = Sk.misceval.buildClass(image, Pixel, 'Pixel', []);

  return image;
};
