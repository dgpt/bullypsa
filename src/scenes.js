Crafty.scene('Room', function() {
    var player = Game.setupScene('room');

    // Overlays for bg image - so player appears to be walking behind these things
    var bgTable = Crafty.e('Overlay')
        .overlay({x: 183, y: 266}, 'table');
    var bgWall = Crafty.e('Overlay')
        .overlay({x: 480, y: 145}, 'wall');

    // Collision bounds
    Crafty.e('Boundary')
        .attr({x: 152});

    // Right - Street
    Crafty.e('Portal')
        .portal({x: 620})
        .action(function() {
            player.emote('Think', true);
            player.action = function() {
               Game.setScene('Street', {x: 'left', orientation: 'right'});
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
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Room', {x: 'right', orientation: 'left'});
                };
            }
        }, function() {
            player.action = null;
        });

    // Right - To Park
    Crafty.e('Portal')
        .portal({x: Game.width - 45})
        .action(function() {
            player.emote('Think', true);
            player.action = function() {
                Game.setScene('Park', {x: 'left', orientation: 'right'});
            };
        }, function() {
            player.action = null;
        });

    // Stairs - To Corridor
    Crafty.e('Portal')
        .portal({x: 1195, w: 80, boundary: false})
        .action(function() {
            player.emote('Think', true);
            player.action = function() {
                Game.setScene('Corridor', {x: 'left', orientation: 'right'});
            };
        }, function() { player.action = null; });
});

Crafty.scene('Corridor', function() {
    var player = Game.setupScene('corridor');

    // Left - To Street
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            player.emote('Think', true);
            player.action = function() {
                Game.setScene('Street', {x: 'stairs', orientation: 'right'});
            };
        }, function() { player.action = null; });

    // Upstairs - Classroom
    Crafty.e('Portal')
        .portal({x: 740, w: 60, boundary: false})
        .action(function() {
            player.emote('Think', true);
            player.action = function() {
                Game.setScene('Classroom', {orientation: 'left'});
            };
        }, function() { player.action = null; });

    // Downstairs - Library
    Crafty.e('Portal')
        .portal({x: 870, w: 60, boundary: false})
        .action(function() {
            player.emote('Think', true);
            player.action = function() {
                Game.setScene('Library', {orientation: 'left'});
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
            player.emote('Think', true);
            player.action = function() {
                Game.setScene('Street', {x: 'right', orientation: 'left'});
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

    // Overlays
    Crafty.e('Overlay')
        .overlay({x: 96, y: 265}, 'libDeskLeft');
    Crafty.e('Overlay')
        .overlay({x: 361, y: 267}, 'libDeskRight');

    // Right - To corridor
    Crafty.e('Portal')
        .portal({x: Game.width - 55})
        .action(function() {
            player.emote('Think', true);
            player.action = function() {
                Game.setScene('Corridor', {x: 'down', orientation: 'left'});
            };
        }, function() {
            player.action = null;
        });

    // Left - bound
    Crafty.e('Boundary');
});

Crafty.scene('Classroom', function() {
    var player = Game.setupScene('classroom');

    // Overlays
    Crafty.e('Overlay')
        .overlay({x: 96, y: 217}, 'classDeskLeft');
    Crafty.e('Overlay')
        .overlay({x: 310, y: 218}, 'classDeskMiddle');
    Crafty.e('Overlay')
        .overlay({x: 501, y: 217}, 'classDeskRight');

    // Left - bound
    Crafty.e('Boundary')
        .attr({x: 138});
    // Right - Corridor
    Crafty.e('Portal')
        .portal({x: Game.width - 175})
        .action(function() {
            player.emote('Think', true);
            player.action = function() {
                Game.setScene('Corridor', {x: 'up', orientation: 'left'});
            };
        }, function() { player.action = null; });
});

Crafty.scene('Load', function() {
    Crafty.e('2D, DOM, Text')
        .text('Loading...')
        .textColor('#FFFFFF', .7)
        .textFont({size: '40px', weight: 'bold'})
        .attr({ x: 150, y: 150 });

    var assets = {
        sara: 'assets/char/sara_54x95.png',
        girl: 'assets/char/girl_54x96.png',
        boy:  'assets/char/boy_52x96.png',
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
        Crafty.sprite(52, 96, assets.boy, {
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
    });
});
