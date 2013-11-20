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
    //$('#text-measurer').remove();
    var f = font,
      o = $('<div id="text-measurer">' + this + '</div>')
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


/* Convenience Functional-Style Functions
 *    for use in Story Mode
 */
function speechResponse(callback) {
    if (!_.isFunction(callback))
        fail('speechResponse: callback is not a function');

    Crafty.bind('SpeechResponse', function(e) {
        console.log('SpeechResponse: triggered ' + e);
        callback(e);
        Crafty.unbind('SpeechResponse');
    });
}

function storyFadeOut(callback) {
    if (!_.isFunction(callback))
        fail('storyFadeOut: callback is not a function');

    Crafty.e('Fader').fade('out', callback, true);
}

function storyShowLesson(gender, e) {
    if (gender === 'Boy')
        e += 2;
    if (e === 0)
        Dialog.showInfo('good', e);
    else if (e === 1)
        Dialog.showInfo('bad', e);
}


function onSpaceKey(callback) {
    var check = function(k) {
        if (k.key === Crafty.keys.SPACE) {
            console.log('storyFadeOut--# Triggering FadeEnd');
            Crafty.trigger('FadeEnd');
            _.isFunction(callback) ? callback() : 0;
            Crafty.unbind('KeyDown', check);
        }
    };
    Crafty.bind('KeyDown', check);
}

function storyModeTransition(gender, player, setScene) {
    speechResponse(function(e) {
        var fadeCallback = function() {
            storyShowLesson(gender, e);
            onSpaceKey(setScene);
        };
        player.enabled = false;
        storyFadeOut(fadeCallback);
    });
};

var girlModeTransition = _.partial(storyModeTransition, 'Girl');
var boyModeTransition = _.partial(storyModeTransition, 'Boy');
