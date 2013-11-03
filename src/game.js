Game = {
    // Width based on size of current background image (set with Game.setBG)
    // Height is static
    width: 500,
    height: 330,

    // Use to place player in a more logical position between scenes
    player: {
        // Initially set to Game.playerPos.start
        // These are all default values and will be changed
        x: 250,
        y: 187,
        orientation: 'right'
    },

    // Pre-Set player positions for each room (since they're figured out by hand)
    playerPos: {
        start:       [250 , 187],
        room:        [600 , 187],
        street: {
            left:    [0   , 230],
            stairs:  [1200, 230],
            right:   [1430, 230]
        },
        park:        [30  , 230],
        corridor: {
            left:    [0   , 190],
            up:      [],
            down:    []
        },
        library:     [],
        classroom:   []
    },

    // Keep track of game state
    currentState: 2,
    state: [{
        player: 'Boy'
    }, {
        player: 'Girl'
    }, {
        player: 'Sara'
    }],

    // Scene to load when finished loading
    startingScene: 'Street',

    fps: Crafty.e('FPS'),

    changeState: function(state) {
        Game.currentState = state;
        Crafty.scene(Crafty._current);
    },
    debug: function() {
        $('#cr-stage').after(
            '<table id="debug_right" style="position:absolute;top:10px;left:520px">' +
            '<tr><td><button onclick="Crafty.scene(\'Room\');Crafty(\'Player\').x=250;">Room</button></td>' +
            '<td><button onclick="Game.changeState(0);">Boy</button></td>' +
            '<tr><td><button onclick="Crafty.scene(\'Street\')">Street</button></td>' +
            '<td><button onclick="Game.changeState(1);">Girl</button></td>' +
            '<tr><td><button onclick="Crafty.scene(\'Corridor\')">Corridor</button></td>' +
            '<td><button onclick="Game.changeState(2);">Sara</button></td>' +
            '<tr><td><button onclick="Crafty.scene(\'Park\')">Park</button></td>' +
            '<tr><td><button onclick="Crafty.scene(\'Library\')">Library</button></td>' +
            '<tr><td><button onclick="Crafty.scene(\'Classroom\')">Classroom</button></td>' +
            '</table>' +
            '<table id="debug">' +
            '<caption>Debug Information</caption>' +
            '<tr><td>FPS: <span id="fps"></span></td>' +
            '<tr><td>Player Position:</td><td><span id="pos"></span></td>' +
            '</div>')
            .add('span').css('font-size', '14px');

        var lastFPS = 0;
        var lastX = 0;
        Crafty.bind('EnterFrame', function() {
            var curFPS = _.last(Game.fps.values);
            if (curFPS != lastFPS) {
                $('#fps').text(curFPS);
                lastFPS = curFPS;
            }
            var curX = Math.round(Crafty('Player')._x);
            var curY = Crafty('Player')._y;
            if (lastX != curX) {
                $('#pos').text('x: ' + curX + ' y: ' + curY);
                lastX = curX;
            }
        });
    },

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
        var width = 500;
        var height = Game.height;
        Crafty.viewport.init(width, height);
        Crafty.viewport.follow(follow);
    },

    // Sets background, creates a player based on current state,
    // and sets a view on that player
    // returns player
    setupScene: function(scene) {
        Game.setBG(scene);
        var player = Crafty.e(Game.state[Game.currentState].player);
        Game.setView(player);
        return player;
    },

    start: function() {
        Crafty.init(Game.width, Game.height);
        Crafty.background('black');

        Crafty.scene('Load');
    }
};
