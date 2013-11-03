Crafty.scene('Room', function() {
    var player = Game.setupScene('room');

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

    // Right - Street
    Crafty.e('Portal')
        .portal({x: 620})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.player = {
                    x: Game.playerPos.street.left[0],
                    orientation: 'right'
                };
                Crafty.scene('Street');
            };
        }, function() {
            player.action = null;
        });
});

Crafty.scene('Street', function() {
    var player = Game.setupScene('street');

    // Boundaries
    // Left side - To Room
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            if (Game.s().roomAccess) {
                player.emote('Think');
                player.action = function() {
                    Game.player = {
                        x: Game.playerPos.room.right[0],
                        orientation: 'left'
                    };
                    Crafty.scene('Room');
                };
            }
        }, function() {
            player.action = null;
        });

    // Right - To Park
    Crafty.e('Portal')
        .portal({x: Game.width - 45})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.player.x = Game.playerPos.park.left[0];
                Crafty.scene('Park');
            };
        }, function() {
            player.action = null;
        });

    // Stairs - To Corridor
    Crafty.e('Portal')
        .portal({x: 1195, w: 80, boundary: false})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.player.x = Game.playerPos.corridor.left[0];
                Crafty.scene('Corridor');
            };
        }, function() { player.action = null; });
});

Crafty.scene('Corridor', function() {
    var player = Game.setupScene('corridor');

    // Left - To Street
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.player.x = Game.playerPos.street.stairs[0];
                Game.player.orientation = 'right';
                Crafty.scene('Street');
            };
        }, function() { player.action = null; });

    // Upstairs - Classroom
    Crafty.e('Portal')
        .portal({x: 740, w: 60, boundary: false})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.player = {
                    x: Game.playerPos.classroom[0],
                    orientation: 'left'
                };
                Crafty.scene('Classroom');
            };
        }, function() { player.action = null; });

    // Right - bound
    Crafty.e('Boundary')
        .attr({x: Game.width});
});

Crafty.scene('Park', function() {
    var player = Game.setupScene('park');

    // Left - to street
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            player.emote('Think');
            player.action = function() {
                Game.player = {
                    x: Game.playerPos.street.right[0],
                    orientation: 'left'
                };
                Crafty.scene('Street');
            };
        }, function() {
            player.action = null;
        });

    // Right - bound
    Crafty.e('Boundary')
        .attr({x: Game.width});
});


Crafty.scene('Library', function() {
    var player = Game.setupScene('library');
});

Crafty.scene('Classroom', function() {
    var player = Game.setupScene('classroom');
});

Crafty.scene('Load', function() {
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .attr({ x: 0, y: 0});

    var assets = {
        sara: 'assets/char/sara_54x95.png',
        girl: 'assets/char/girl_54x96.png',
        boy:  'assets/char/boy.png',
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
            sprSaraR: [0, 3],
            sprSaraL: [0, 2]
        });
        Crafty.sprite(54, 96, assets.girl, {
            sprGirlR: [0, 1],
            sprGirlL: [0, 0]
        });
        Crafty.sprite(52, 85, assets.boy, {
            sprBoyR: [0, 1],
            sprBoyL: [0, 0]
        });
        Crafty.sprite(48, 48, assets.emotions, {
            sprThink:       [0, 0],
            sprQuestion:    [0, 1],
            sprExclamation: [0, 2],
            sprMusic:       [0, 3],
            sprSigh:        [0, 4],
            sprAnger:       [0, 5]
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
