/**
 * @fileoverview This is a file where deprecation checks are disabled.
 * @suppress {undefinedVars|missingProperties}
 */
Sk.canvas = {};

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
            + '<h3><i class="icon-reorder"></i> Canvas Window</h3>')
        .css('cursor', 'move');

    var body = $('<div>').addClass('modal-body');

    outer.append(header);
    outer.append(body);
    $('body').append(outer);

    window.canvasModal = outer;
    outer.modal({ backdrop: false, keyboard: true });
    outer.draggable({ handle: '.modal-header' });
  }

  $('.modal-body', window.canvasModal).empty();
  $('.modal-body', window.canvasModal).append(canvas);

  window.canvasModal.css('marginLeft', '-' + (canvas.width + 30) / 2 + 'px');
  window.canvasModal.modal('show');
};

Sk.canvas.hide = function()
{
  window.canvasModal.modal('hide');
};

goog.exportSymbol("Sk.canvas.show", Sk.canvas.show);
goog.exportSymbol("Sk.canvas.hide", Sk.canvas.hide);
