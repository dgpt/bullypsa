function existy(x) { return x != null; }
function truthy(x) { return (x !== false) && existy(x); }
function fail(error) {
    throw new Error(error);
}

String.prototype.width = function(font) {
  var f = font || '12px arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;
};

// Same as above, but returns height based on a fixed width
String.prototype.height = function(font, width) {
  var f = font,
      o = $('<div>' + this + '</div>')
            .css({'word-wrap': 'break-word', 'width': width, 'visibility': 'hidden', 'font': f, 'border': '2px black solid', 'min-width': width})
            .appendTo($('body')),
      h = o.height();

  o.remove();

  return h;
};

String.prototype.lowerFirst = function() {
    return this[0].toLowerCase() + this.substr(1);
};
