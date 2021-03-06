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
        callback(e);
        Crafty.unbind('SpeechResponse');
    });
}

function storyFadeOut(callback) {
    if (!_.isFunction(callback))
        fail('storyFadeOut: callback is not a function');

    var fader = Crafty.e('Fader');
    fader.fade('out', function() {
        Crafty.bind('FadeEnd', function(cb) {
            cb();
            fader.fade('in');
        });
        callback();
    }, true);
}

function storyShowLesson(e) {
    var res = e;
    if (State.player === 'Boy')
        res += 2;

    Game.points.total++;
    if (e === 0) {
        Game.points.current++;
        Dialog.showInfo('good', res);
    } else if (e === 1) {
        Game.points.current--;
        Dialog.showInfo('bad', res);
    }
}

function onSpaceKey(callback) {
    var check = function(k) {
        if (k.key === Crafty.keys.SPACE) {
            $('#lesson-instruct').remove();
            Crafty.trigger('FadeEnd', _.isFunction(callback) ? callback : null);
            Crafty.unbind('KeyDown', check);
        }
    };
    Crafty.bind('KeyDown', check);
}

function storyModeTransition(showLesson, player, setScene) {
    speechResponse(function(e) {
        var fadeCallback = function() {
            showLesson(e);
            onSpaceKey(setScene);
        };
        player.enabled = false;
        storyFadeOut(fadeCallback);
    });
};

var girlModeTransition = _.partial(storyModeTransition, storyShowLesson);
var boyModeTransition = _.partial(storyModeTransition, storyShowLesson);

function fadeToEnd() {
    Crafty.e('Fader').attr({fadeTime: 100})
        .fade('out', function() {
            Crafty.scene('End');
    });
};
