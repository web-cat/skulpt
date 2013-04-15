var $builtinmodule = function(name) {
    var mod = {};

    var canvas = function($gbl, $loc)
    {
        // ------------------------------------------------------
        $loc.__init__ = new Sk.builtin.func(function(self, width, height)
        {
            self.width = width;
            self.height = height;

            self.canvas = document.createElement('canvas');
            self.canvas.width = self.width;
            self.canvas.height = self.height;
            self.ctx = self.canvas.getContext('2d');
        });


        // ------------------------------------------------------
        $loc.setStrokeStyle = new Sk.builtin.func(function(self, style)
        {
            self.ctx.strokeStyle = style.v;
        });


        // ------------------------------------------------------
        $loc.setFillStyle = new Sk.builtin.func(function(self, style)
        {
            self.ctx.fillStyle = style.v;
        });


        // ------------------------------------------------------
        $loc.setShadow = new Sk.builtin.func(function(self, dx, dy, blur, color)
        {
            self.ctx.shadowOffsetX = dx || 0;
            self.ctx.shadowOffsetY = dx || 0;
            self.ctx.shadowBlur = blur || 0;
            self.ctx.shadowColor = color && color.v || 'transparent';
        });


        // ------------------------------------------------------
        $loc.fillRect = new Sk.builtin.func(function(self, x, y, width, height)
        {
            self.ctx.fillRect(x, y, width, height);
        });


        // ------------------------------------------------------
        $loc.strokeRect = new Sk.builtin.func(function(self, x, y, width, height)
        {
            self.ctx.strokeRect(x, y, width, height);
        });


        // ------------------------------------------------------
        $loc.clearRect = new Sk.builtin.func(function(self, x, y, width, height)
        {
            self.ctx.clearRect(x, y, width, height);
        });


        // ------------------------------------------------------
        $loc.moveTo = new Sk.builtin.func(function(self, x, y)
        {
            self.ctx.moveTo(x, y);
        });


        // ------------------------------------------------------
        $loc.lineTo = new Sk.builtin.func(function(self, x, y)
        {
            self.ctx.lineTo(x, y);
        });


        // ------------------------------------------------------
        $loc.drawImage = new Sk.builtin.func(function(/* ... */)
        {
            // var args = Array.prototype.slice.call(arguments);
            // var self = args.shift();

            // var imageData = args[0].imageData;
            // var canvas = document.createElement('canvas');

            // args[0] = canvas;
            // console.log(args);
            // self.ctx.drawImage.call(args);
        });


        // ------------------------------------------------------
        $loc.setFont = new Sk.builtin.func(function(self, font)
        {
            self.ctx.font = font.v;
        });


        // ------------------------------------------------------
        $loc.fillText = new Sk.builtin.func(function(self, text, x, y)
        {
            self.ctx.fillText(text.v, x, y);
        });


        // ------------------------------------------------------
        $loc.strokeText = new Sk.builtin.func(function(self, text, x, y)
        {
            self.ctx.strokeText(text.v, x, y);
        });


        // ------------------------------------------------------
        $loc.show = new Sk.builtin.func(function(self)
        {
            Sk.canvas.show(self.canvas);
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
    }

    mod.Canvas = Sk.misceval.buildClass(mod, canvas, 'Canvas', []);

    return mod;
}