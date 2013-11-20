Game = {
    // Width based on size of current background image (set with Game.setBG)
    // Height is static
    width: 600,
    height: 330,

    // Use to place player in a more logical position between scenes
    player: {
        // These are all default values and will be changed
        x: 250,
        y: 187,
        orientation: 'right'
    },

    // Pre-Set player positions for each room (since they're figured out by hand)
    // only the first listed Y position per object is used. listing the rest of the Y positions is unnecessary
    playerPos: {
        room: {
            left:    [250 , 187],
            right:   [600 , 187]
        },
        street: {
            left:    [0   , 230],
            stairs:  [1200, 230],
            right:   [1430, 230]
        },
        park: {
            left:    [30  , 230],
            right:   [1225, 230]
        },
        corridor: {
            left:    [0   , 200],
            up:      [745 , 220],
            down:    [870 , 220]
        },
        library:     [930 , 190],
        classroom:   [550 , 127]
    },

    // Returns current global state object
    s: function(player) {
        fail('Deprecated - Game.s()');
        return State.config;
    },

    fps: Crafty.e('FPS'),

    /* DEBUG STUFF */
    debug: function() {
        $('#cr-stage').after(
            // Debug Info Table
            '<table id="debug" style="font-size:14px;table-layout:fixed;width:120px;margin-left:auto;margin-right:auto;position:absolute;top:350px;">' +
            '<caption>Debug Info</caption>' +
            '<tr><td>FPS:</td><td id="fps"></td>' +
            '<tr><td id="posx"></td><td id="posy"></td>' +
            '<tr><td>Emote? <td id="emoting"></td>' +
            '</div>')
            .add('span').css('font-size', '14px');

        var lastFPS = 0;
        var lastX = 0;
        var lastEmote = false;
        Crafty.bind('EnterFrame', function() {
            var curFPS = _.last(Game.fps.values);
            if (curFPS != lastFPS) {
                $('#fps').text(curFPS);
                lastFPS = curFPS;
            }
            var curX = Math.round(Crafty('Player')._x);
            var curY = Crafty('Player')._y;
            if (lastX != curX) {
                $('#posx').text('X: ' + curX);
                $('#posy').text('Y: ' + curY);
                lastX = curX;
            }
            var emoting = !!Crafty('Player').emotion;
            if (lastEmote !== emoting) {
                $('#emoting').text(emoting);
                lastEmote = emoting;
            }
        });
    },
    /* END DEBUG */

    // Set background image, set Game.width to width of the image.
    setBG: function(asset) {
        asset = Crafty.asset(asset);
        if (!existy(asset))
            fail('Game.setBG: background image is not defined.');
        var bg = Crafty.e('2D, Canvas, Image')
            .attr({z: 1})
            .image(asset);
        Game.width = bg.w;
    },

    // Create view - change view width here!
    // follow = entity to follow
    setView: function(follow) {
        var width = 600;
        var height = Game.height;
        Crafty.viewport.init(width, height);
        Crafty.viewport.follow(follow);
    },

    // Sets background, creates a player based on current state,
    // and sets a view on that player
    // returns player
    setupScene: function(scene) {
        Game.setBG(scene);
        var player = Crafty.e(State.player);
        if (_.isObject(Game.playerPos[scene])) {
            // Y for scene is always 1st position in array when flattened
            var pos = _.flatten(_.values(Game.playerPos[scene]));
            Game.player.y = pos[1];
            player.attr({y: Game.player.y});
        }
        Game.setView(player);
        return player;
    },

    // Change Scene, set up player position for next scene
    // Uses Game.playerPos to determine position, pass settings.x to match the key entry from Game.playerPos.scene (typically left, right)
    // If Game.playerPos.scene is not an object, do not pass anything for settings.x
    setScene: function(scene, settings) {
        var s = _.defaults(settings || {}, {
            orientation: 'right',
            x: 0,
            fade: false,
            showInfo: false
        });
        var set = function() {
            if (!_.isString(scene) || !(scene in Crafty._scenes))
                fail('Game.setScene: scene is invalid');
            if (s.orientation !== 'left' && s.orientation !== 'right')
                fail('Game.setScene: orientation is invalid');

            var x = Game.playerPos[scene.toLowerCase()][s.x];
            if (_.isArray(x))
                x = x[0];
            if (!_.isNumber(x))
                fail('Game.setScene: invalid playerX position');

            Game.player = {
                x: x,
                orientation: s.orientation
            };

            State.scene = scene;
            Crafty.scene(scene);
        };
        var fader = Crafty.e('Fader').attr({fadeTime: 25});
        var fadeIn = function(time, callback) {
            time = _.isNumber(time) ? time : 75;
            set();
            fader.fade('in', callback);
        };
        var infoBoxFix = function() {
            if (_.isArray(s.showInfo)) {
                Dialog.showInfo.apply(null, s.showInfo);
            } else {
                Dialog.hideInfo();
            }
        };
        if (s.fade) {
            fader.fade('out', _.partial(fadeIn, 25, infoBoxFix));
        } else {
            set();
            infoBoxFix();
        }
    },

    start: function() {
        Crafty.init(Game.width, Game.height);
        Crafty.background('black');
        //Game.debug();

        Crafty.scene('Load');

        Game.addHelpLink();
     }
};

Game.addHelpLink = function() {
   //Add a hyperlink for help.
    var helpLink = $('<div id="help-button" class="help-button-up-closed"></div>')
        .mousedown(Game.onHelpDown).mouseup(Game.onHelpUp);
    $(document.body).append(helpLink);
};

//When you click on the help hyperlink.
Game.onHelpDown = function() {
    var $help = $('#help-button');
    var uclosed = 'help-button-up-closed';
    var dclosed = 'help-button-down-closed';
    var uopen = 'help-button-up-open';
    var dopen = 'help-button-down-open';
    if ($help.hasClass(uclosed)) {
        $help.removeClass(uclosed).addClass(dclosed);
    } else if ($help.hasClass(uopen)) {
        $help.removeClass(uopen).addClass(dopen);
    }
};

Game.onHelpUp = function() {
    var $help = $('#help-button');
    var uclosed = 'help-button-up-closed';
    var dclosed = 'help-button-down-closed';
    var uopen = 'help-button-up-open';
    var dopen = 'help-button-down-open';
    var helpText = $('<div id="helpText" style="width: '+ Game.width +'px;">'+
    'Help:<br>Sometimes the game will be a little too small. Hold the CTRL button and use your mouse\'s scroll wheel to increase or decrease the zoom.'+
    '<br><br>Is the game not working? We highly recommend using a current version of <a href="http://windows.microsoft.com/en-us/internet-explorer/download-ie">Internet Explorer 11</a>, <a href="https://www.google.com/intl/en/chrome/browser/">Google Chrome</a>, or <a href="http://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a> as your browser to play this game. The game will <em>not</em> work with any version of Internet Explorer previous to 11.'+
    '<br><br>Controls:<br>'+
    'Remember you will only use the arrow keys and the space bar in this game.<ul>'+
    '<li>Use the arrow keys to move left and right.'+
    '<li>When a choice is available use the up and down arrows keys to select your choice and press space to confirm.'+
    '<li>Use the space bar to travel to new areas when an emote pops up.<li>Use the space bar to continue through dialog.</ul></div>');

    if ($help.hasClass(dclosed)) {
        $(document.body).append(helpText);
        $help.removeClass(dclosed).addClass(uopen);
    } else if ($help.hasClass(dopen)) {
        $('#helpText').remove();
        $help.removeClass(dopen).addClass(uclosed);
    }
};
