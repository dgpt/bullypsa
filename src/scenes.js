Crafty.scene('Room', function() {
    Game.setBG('room');
    Game.fpsMeter({
        x: 0,
        y: 0
    });
    // Overlays for bg image - so player appears to be walking behind these things
    var bgTable = Crafty.e('2D, Canvas, Image')
        .attr({x: 183, y: 266, z: 4})
        .image(Crafty.asset('table'));
    var bgWall = Crafty.e('2D, Canvas, Image')
        .attr({x: 480, y: 145, z: 4})
        .image(Crafty.asset('wall'));

    var leftBound = Crafty.e('Boundary')
        .attr({x: 0, y: 0, w: 152, h: Game.height});

    var door = Crafty.e('Portal')
        .portal({x: 620, y: 0, w: 40, h: Game.height})
        .action(function() {
            sara.emote('Think');
        });

    var sara = Crafty.e('Sara')
        .attr({x: 250, y: Game.height - 143, z: 3});

    Game.setView(sara);
});

Crafty.scene('Load', function() {
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: 0})
        .css({'color': 'white'});

    var assets = {
        sara: 'assets/char/sara_54x95.png',
        room: 'assets/bg/room.png',
        table: 'assets/bg/room_table.png',
        wall: 'assets/bg/room_wall.png',
        emotions: 'assets/emotions_48x48.png'
    };
    Crafty.load(_.values(assets), function() {
        Crafty.sprite(54, 95, assets.sara, {
            sprSara: [0, 3]
        });
        Crafty.sprite(48, 48, assets.emotions, {
            sprThink: [0, 0],
            sprQuestion: [0, 1],
            sprExclamation: [0, 2],
            sprMusic: [0, 3],
            sprSigh: [0, 4],
            sprAnger: [0, 5]
        });

        Crafty.asset('room', assets.room);
        Crafty.asset('table', assets.table);
        Crafty.asset('wall', assets.wall);

        Crafty.scene('Room');
    });
});
