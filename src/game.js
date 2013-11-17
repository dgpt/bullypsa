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
            right:   []
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
    fader: Crafty.e('Fader'),

    /* DEBUG STUFF */
    // Changes state to specified, reloads current scene, sets Game.player.x to first listed x pos for scene
    changeState: function(state) {
        Game.currentState = state;
        var scene = Crafty._current;
        // Choose first listed x position
        Game.player.x = _.flatten(Game.playerPos[scene.toLowerCase()])[0];
        Crafty.scene(scene);
    },
    debug: function() {
        $('#cr-stage').after(
/*            // Debug Quick Links Table
            '<table id="debug_right" style="position:absolute;top:10px;left:520px">' +
            '<caption>Debug Quick Links</caption>' +
            '<tr style="text-align:center"><td>Scenes</td><td>Players</td><td>Emotes</td>' +
            '<tr><td><button onclick="Crafty.scene(\'Room\');Crafty(\'Player\').x=250;">Room</button></td>' +
            '<td><button onclick="Game.changeState(0);">Boy</button></td>' +
            '<td><button onclick="Crafty(\'Player\').emote(\'Think\')">Think</button></td>' +

            '<tr><td><button onclick="Crafty.scene(\'Street\')">Street</button></td>' +
            '<td><button onclick="Game.changeState(1);">Girl</button></td>' +
            '<td><button onclick="Crafty(\'Player\').emote(\'Question\')">Question</button></td>' +

            '<tr><td><button onclick="Crafty.scene(\'Corridor\')">Corridor</button></td>' +
            '<td><button onclick="Game.changeState(2);">Sara</button></td>' +
            '<td><button onclick="Crafty(\'Player\').emote(\'Exclamation\')">Exclaim</button></td>' +

            '<tr><td><button onclick="Crafty.scene(\'Park\')">Park</button></td>' +
            '<td></td>' +
            '<td><button onclick="Crafty(\'Player\').emote(\'Music\')">Music</button></td>' +

            '<tr><td><button onclick="Crafty.scene(\'Library\')">Library</button></td>' +
            '<td></td>' +
            '<td><button onclick="Crafty(\'Player\').emote(\'Sigh\')">Sigh</button></td>' +

            '<tr><td><button onclick="Crafty.scene(\'Classroom\')">Classroom</button></td>' +
            '<td></td>' +
            '<td><button onclick="Crafty(\'Player\').emote(\'Anger\')">Anger</button></td>' +
            // Set initial x
            '<tr><td><button onclick="var xxx=+$(\'#xchange\')[0].value; var ddd = 250; Game.player.x = _.isNaN(xxx) ? ddd : (xxx < '+Game.width+' && xxx > 0 ? xxx : ddd)">Change Initial X:</button></td><td><input id="xchange" style="width:70" type="text" /></td>' +
            '</table>' +*/
            // Debug Info Table
            '<table id="debug" style="font-size:14px;table-layout:fixed;width:120px;margin-left:auto;margin-right:auto;position:absolute;top:0px;left:0px">' +
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
        Game.fader.x = -Crafty.viewport.x;
        Game.fader.fade(25, "out", function() {
            var s = _.defaults(settings || {}, {
                orientation: 'right',
                x: 0
            });
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

            Game.fader.x = -Crafty.viewport.x;
            Game.fader.fade(25, "in");
        });
    },

    start: function() {
        Crafty.init(Game.width, Game.height);
        Crafty.background('black');

        Game.debug();
        Game.fader = Crafty.e('Fader').fader();

        Crafty.scene('Load');
    }
};
