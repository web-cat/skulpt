var ImageMod; // the single identifier needed in the global scope

if (!ImageMod)
{
    ImageMod = { };
    ImageMod.canvasLib = [];

    window.ImageMod = window.ImageMod || {};

    ImageMod.showImage = function(image)
    {
        if (!window.ImageMod.imageModal)
        {
            // Create the modal dialog for the first time if needed.
            var outer = $('<div>')
                .addClass('modal hide')
                .attr('id', 'ImageMod-modal')
                .css('width', 'auto');

            var header = $('<div>')
                .addClass('modal-header')
                .append(
                    '<button type="button" class="close" data-dismiss="modal"'
                    + ' aria-hidden="true">&times;</button>'
                    + '<h3>Image</h3>');

            var body = $('<div>').addClass('modal-body');
            window.ImageMod.imageCanvas = $('<canvas>');
            body.append(window.ImageMod.imageCanvas);

            outer.append(header);
            outer.append(body);
            $('body').append(outer);

            window.ImageMod.imageModal = outer;
            $(outer).modal({ backdrop: false, keyboard: true });
        }

        var canvas = window.ImageMod.imageCanvas[0];
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.putImageData(image.imageData, 0, 0);

        window.ImageMod.imageModal.css('marginLeft', '-' + (image.width + 30) / 2 + 'px');
        window.ImageMod.imageModal.modal('show');
    };
}

//  todo create an empty image by reading image data from a blank canvas of the appropriate size

var $builtinmodule = function(name) {
    var mod = {};

    var image = function($gbl, $loc)
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
            return Sk.misceval.callsim(mod.Pixel, r, g, b);
        });


        // ------------------------------------------------------
        $loc.setPixel = new Sk.builtin.func(function(self, x, y, pix)
        {
            var index = (y * 4) * self.width + (x * 4);
            
            // allevato: We get a somewhat substantial speedup by accessing
            // the components directly instead of going through the function
            // call machinery.
            var r = pix.red;   //Sk.misceval.callsim(pix.getRed, pix);
            var g = pix.green; //Sk.misceval.callsim(pix.getGreen, pix);
            var b = pix.blue;  //Sk.misceval.callsim(pix.getBlue, pix);
            var id = self.imageData.data;
            id[index] = r;
            id[index + 1] = g;
            id[index + 2] = b;
            id[index + 3] = 255;
        });


        // ------------------------------------------------------
        $loc.show = new Sk.builtin.func(function(self)
        {
            ImageMod.showImage(self);
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
    }

    mod.Image = Sk.misceval.buildClass(mod, image, 'Image', []);


    // ====================================================================
    var eImage = function($gbl, $loc)
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

    }

    mod.EmptyImage = Sk.misceval.buildClass(mod, eImage, 'EmptyImage', [mod.Image]);


    // ====================================================================    
    var pixel = function($gbl, $loc)
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
        $loc.__getitem__ = new Sk.builtin.func(function(self, k)
        {
            if (k == 0)
            {
                return self.red;
            }
            else if (k == 1)
            {
                return self.green;
            }
            else if (k == 2)
            {
                return self.blue;
            }
            else
            {
                throw new Sk.builtin.ValueError('Index ' + k
                    + ' out of range (must be 0-2)');
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
            var arr = [self.red, self.green, self.blue];
            return new Sk.builtin.tuple(arr);

        });
    }
    mod.Pixel = Sk.misceval.buildClass(mod, pixel, 'Pixel', []);



    var screen = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self,width,height) {
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

        // exitonclick
        $loc.exitonclick = new Sk.builtin.func(function(self) {
            var canvas_id = self.theScreen.id;
            self.theScreen.onclick = function() {
                document.getElementById(canvas_id).style.display = 'none';
                document.getElementById(canvas_id).onclick = null;
                delete ImageMod.canvasLib[canvas_id];
            }

        });
        //getMouse
    }

    mod.ImageWin = Sk.misceval.buildClass(mod, screen, 'ImageWin', []);

    return mod
}