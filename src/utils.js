function existy(x) { return x != null; }
function truthy(x) { return (x !== false) && existy(x); }
function fail(error) {
    throw new Error(error);
}
function warn(text) {
    console.warn('Warning: ' + text);
}

var br = '<br />';

String.prototype.dimensions = function(font, maxWidth) {
  var f = font,
      o = $('<div>' + this + '</div>')
            .css({'max-width': maxWidth +'px', 'position': 'absolute', 'visibility': 'hidden', 'font': f, 'border': '2px solid black'})
            .appendTo($('body')),
      w = o.width()
      h = o.height();

  o.remove();

  return [w,h];
};

String.prototype.lowerFirst = function() {
    return this[0].toLowerCase() + this.substr(1);
};

String.prototype.upperFirst = function() {
    return this[0].toUpperCase() + this.substr(1);
};
