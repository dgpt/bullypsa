Game = {
    // Width based on size of current background image (set with Game.setBG)
    // Height is static
    width: 500,
    height: 330,

    fps: Crafty.e('FPS'),

    debug: function() {
        $('#cr-stage').after('<div id="debug">Debug Information<br />FPS: <span id="fps"></span></div>');

        var lastFPS = 0;
        Crafty.bind('EnterFrame', function() {
            var curFPS = _.last(Game.fps.values);
            if (curFPS != lastFPS) {
                $('#fps').text(curFPS);
                lastFPS = curFPS;
            }
        });
    },

    setView: function(follow) {
        var width = 500;
        var height = Game.height;
        Crafty.viewport.init(width, height);
        Crafty.viewport.follow(follow);
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

    start: function() {
        Crafty.init(Game.width, Game.height);
        Crafty.background('black');

        Crafty.scene('Load');
    }
};
