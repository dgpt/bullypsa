Crafty.scene('Room', function() {
    Game.setBG('room');

    var player = Crafty.e('Sara')
        .attr({y: Game.playerPos.room[1]});

    Game.setView(player);

    // Overlays for bg image - so player appears to be walking behind these things
    var bgTable = Crafty.e('2D, Canvas, Image')
        .attr({x: 183, y: 266, z: 4})
        .image(Crafty.asset('table'));
    var bgWall = Crafty.e('2D, Canvas, Image')
        .attr({x: 480, y: 145, z: 4})
        .image(Crafty.asset('wall'));

    // Collision bounds
    Crafty.e('Boundary')
        .attr({x: 152});

    Crafty.e('Portal')
        .portal({x: 620})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.playerX = Game.playerPos.street.left[0];
                Crafty.scene('Street');
            };
        }, function() {
            player.action = null;
        });

    player.emote('Sigh');
});

Crafty.scene('Street', function() {
    Game.setBG('street');

    var player = Crafty.e('Sara')
        .attr({y: Game.playerPos.street.left[1]});

    Game.setView(player);

    // Boundaries
    // Left side - To Room
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.playerX = Game.playerPos.room[0];
                Crafty.scene('Room');
            };
        }, function() {
            player.action = null;
        });

    Crafty.e('Portal')
        .portal({x: Game.width - 40})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.playerX = Game.playerPos.park[0];
                Crafty.scene('Park');
            };
        }, function() {
            player.action = null;
        });
});

Crafty.scene('Corridor', function() {
    Game.setBG('corridor');
});

Crafty.scene('Park', function() {
    Game.setBG('park');

    var player = Crafty.e('Sara')
        .attr({y: Game.playerPos.park[1]});

    Game.setView(player);

    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.playerX = Game.playerPos.street.right[0];
                Crafty.scene('Street');
            };
        }, function() {
            player.action = null;
        });

    Crafty.e('Boundary')
        .attr({x: Game.width});
});


Crafty.scene('Library', function() {
    Game.setBG('library');
});

Crafty.scene('Classroom', function() {
    Game.setBG('classroom');
});

Crafty.scene('Load', function() {
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: 0});

    var assets = {
        sara: 'assets/char/sara_54x95.png',
        emotions: 'assets/emotions_48x48.png',

        room: 'assets/bg/room.png',
        table: 'assets/bg/room_table.png',
        wall: 'assets/bg/room_wall.png',

        street: 'assets/bg/street.png',
        park: 'assets/bg/park.png',
        corridor: 'assets/bg/corridor.png',

        library: 'assets/bg/library.png',
        libDeskLeft: 'assets/bg/library_desk_left.png',
        libDeskRight: 'assets/bg/library_desk_right.png',

        classroom: 'assets/bg/class.png',
        classDeskLeft: 'assets/bg/class_desk_left.png',
        classDeskMiddle: 'assets/bg/class_desk_middle.png',
        classDeskRight: 'assets/bg/class_desk_right.png'
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

        // Scenes
        Crafty.asset('room', assets.room);
        Crafty.asset('table', assets.table);
        Crafty.asset('wall', assets.wall);

        Crafty.asset('street', assets.street);
        Crafty.asset('park', assets.park);
        Crafty.asset('corridor', assets.corridor);

        Crafty.asset('library', assets.library);
        Crafty.asset('libDeskLeft', assets.libDeskLeft);
        Crafty.asset('libDeskRight', assets.libDeskRight);

        Crafty.asset('classroom', assets.classroom);
        Crafty.asset('classDeskLeft', assets.classDeskLeft);
        Crafty.asset('classDeskMiddle', assets.classDeskMiddle);
        Crafty.asset('classDeskRight', assets.classDeskRight);

        Crafty.scene(Game.startingScene);
        Game.debug();
    });
});
