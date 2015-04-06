var $builtinmodule = function(name) {
  var mod, colorWrapper, COLOR_FACTOR;

  mod = {};

  COLOR_FACTOR = 0.85;

  colorWrapper = {
    makeDarker : new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('makeDarker', arguments, 1);

      // This is from java.awt.Color
      return Sk.misceval.callsim(mod.Color, self._red * COLOR_FACTOR,
          self._green * COLOR_FACTOR, self._blue * COLOR_FACTOR);
    }),

    makeLighter : new Sk.builtin.func(function(self) {
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

      if(r > 0 && r < factor) { r = factor; }
      if(g > 0 && g < factor) { g = factor; }
      if(b > 0 && b < factor) { b = factor; }

      return Sk.misceval.callsim(mod.Color, r / COLOR_FACTOR, g / COLOR_FACTOR, b / COLOR_FACTOR);
    }),

    distance : new Sk.builtin.func(function(self, other) {
      Sk.ffi.checkArgs('distance', arguments, 2);

      return Math.sqrt(
        Math.pow(self._red - other._red, 2) +
        Math.pow(self._green - other._green, 2) +
        Math.pow(self._blue - other._blue, 2));
    })
  };

  mod.Color = Sk.misceval.buildClass(mod, function ($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, red, green, blue) {
        Sk.ffi.checkArgs('__init__', arguments, 4);

        self._red = Sk.builtin.asnum$(red);
        self._green = Sk.builtin.asnum$(green);
        self._blue = Sk.builtin.asnum$(blue);
    });

    $loc.__str__ = new Sk.builtin.func(function(self) {
      Sk.ffi.checkArgs('__str__', arguments, 1);
      return new Sk.builtin.str('Color' + 
                                ', r='  + self._red +
                                ', g='  + self._green +
                                ', b='  + self._blue);
    });

    goog.object.extend($loc, colorWrapper);
  }, 'Color', []); 

  goog.object.extend(mod, colorWrapper);

  goog.object.extend(mod, {
    makeColor : new Sk.builtin.func(function(red, green, blue) {
      Sk.ffi.checkArgs('makeColor', arguments, 3);
      return Sk.misceval.callsim(mod.Color, red, green, blue);
    }),

    pickAColor : new Sk.builtin.func(function() {
      Sk.ffi.checkArgs('pickAColor', arguments, 0);
      
      return Sk.future(function(continueWith) {
        window.pythy.colorPicker.show(function (r, g, b) {
          continueWith(Sk.misceval.callsim(mod.Color, r, g, b));
        });
      });
    }),

    black     : Sk.misceval.callsim(mod.Color, 0, 0, 0),
    blue      : Sk.misceval.callsim(mod.Color, 0, 0, 255),
    cyan      : Sk.misceval.callsim(mod.Color, 0, 255, 255),
    darkGray  : Sk.misceval.callsim(mod.Color, 64, 64, 64),
    gray      : Sk.misceval.callsim(mod.Color, 128, 128, 128),
    green     : Sk.misceval.callsim(mod.Color, 0, 255, 0),
    lightGray : Sk.misceval.callsim(mod.Color, 192, 192, 192),
    magenta   : Sk.misceval.callsim(mod.Color, 255, 0, 255),
    orange    : Sk.misceval.callsim(mod.Color, 255, 200, 0),
    pink      : Sk.misceval.callsim(mod.Color, 255, 175, 175),
    red       : Sk.misceval.callsim(mod.Color, 255, 0, 0),
    white     : Sk.misceval.callsim(mod.Color, 255, 255, 255),
    yellow    : Sk.misceval.callsim(mod.Color, 255, 255, 0)
  });

  return mod;
};

