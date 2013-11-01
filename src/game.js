Game = {
    // Width based on size of current background image (set with Game.setBG)
    // Height is static
    width: 500,
    height: 330,

    fps: Crafty.e('FPS'),

    fpsMeter: function(attr) {
        var text = Crafty.e('2D, DOM, Text')
            .attr(attr)
            .text('0')
            .textFont({size: '18px', weight: 'bold'});

        var updateText = _.bind(function() {
            this.text(_.last(Game.fps.values));
        }, text);

        text.bind('EnterFrame', updateText);
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
        console.log(asset);
        if (!existy(asset))
            fail('Game.setBG: '+asset+' is not defined.');
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
