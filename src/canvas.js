/**
 * @fileoverview
 * @suppress {undefinedVars|missingProperties}
 */
Sk.canvas = {};

// --------------------------------------------------------------
Sk.canvas.show = function(canvas)
{
  if (!window.canvasModal)
  {
    // Create the modal dialog for the first time if needed.
    var outer = $('<div>')
        .addClass('modal hide')
        .attr('id', 'Sk-canvasModal')
        .css('width', 'auto');

    var header = $('<div>')
        .addClass('modal-header')
        .append(
            '<button type="button" class="close" data-dismiss="modal"'
            + ' aria-hidden="true">&times;</button>'
            + '<h3><i class="icon-reorder"></i>&nbsp;Picture</h3>')
        .css('cursor', 'move');

    var body = $('<div>').addClass('modal-body');
    var footer = $('<div>').addClass('modal-footer');

    outer.append(header);
    outer.append(body);
    outer.append(footer);
    $('body').append(outer);

    window.canvasModal = outer;
    outer.modal({ backdrop: false, keyboard: true });
    outer.draggable({ handle: '.modal-header' });
  }

  $('.modal-body', window.canvasModal)
    .empty()
    .append(canvas);

  $('.modal-footer', window.canvasModal)
    .empty()
    .append(
      '<form class="form-inline pull-left">' +
      '<label for="canvas-x">X:</label>' +
      '<input type="number" id="canvas-x" class="input-mini"/>' +
      '<label for="canvas-y">Y:</label>' +
      '<input type="number" id="canvas-y" class="input-mini"/>' +
      '</form>')
    .append(
      '<table class="pull-right"><tbody><tr>' +
      '<td class="canvas-color-label">R:</td><td id="canvas-red"></td>' +
      '<td class="canvas-color-label">G:</td><td id="canvas-green"></td>' +
      '<td class="canvas-color-label">B:</td><td id="canvas-blue"></td>' +
      '<td id="canvas-color-swatch"></td>' +
      '</tr></tbody></table>');

  Sk.canvas._addMouseEvents(canvas, window.canvasModal);

  window.canvasModal.css('marginLeft', '-' + (canvas.width + 30) / 2 + 'px');
  window.canvasModal.modal('show');
};


// --------------------------------------------------------------
Sk.canvas.hide = function()
{
  window.canvasModal.modal('hide');
};


// --------------------------------------------------------------
Sk.canvas._addMouseEvents = function(canvas, modal)
{
  $(canvas).mousemove(function(e) {
    var x = e.offsetX;
    var y = e.offsetY;

    $('#canvas-x', modal).val(x);
    $('#canvas-y', modal).val(y);

    var ctx = canvas.getContext('2d');
    var colordata = ctx.getImageData(x, y, 1, 1).data;
    var r = colordata[0];
    var g = colordata[1];
    var b = colordata[2];

    var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    $('#canvas-red', modal).text(r);
    $('#canvas-green', modal).text(g);
    $('#canvas-blue', modal).text(b);
    $('#canvas-color-swatch', modal).css('background-color', rgb);
  });
};


goog.exportSymbol("Sk.canvas.show", Sk.canvas.show);
goog.exportSymbol("Sk.canvas.hide", Sk.canvas.hide);
