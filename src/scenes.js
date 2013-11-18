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
            if (State.config().room.access) {
                player.emote('Think', true);
                player.action = function() {
                   Game.setScene('Street', {x: 'left', orientation: 'right'});
                };
            } else {
                Dialog.show(player, {next: true});
            }
        }, function() {
            player.action = null;
        });

    Dialog.show(player, {next: true, callback: function() {
        Dialog.showInfo('scenario', false, 0);
    }});
}, function() {
    this.unbind('KeyDown');
});

Crafty.scene('Street', function() {
    var player = Game.setupScene('street');

    // Girl Story
    if (State.player === 'Girl') {
        /* NPCs */
        var cindy = Crafty.e('Cindy').cindy({x: 845, orientation: 'left', portal: true})
            .action({onhit: function() {
                // Hacky, yes. No time for beauty!
                if (!cindy._dflag0) {
                    cindy.speechWidth = 220;
                    Dialog.progression([
                        [cindy, {emotes: ['Question']}],
                        [player, {emotes: ['Exclamation']}]
                    ]);
                    cindy._dflag0 = true;
                }
            }});

        Crafty.bind('SpeechResponse', function(e) {
            console.log(e);
            if (e === 0)
                Dialog.showInfo('good');
            else
                Dialog.showInfo('bad');
        });
        var sara = Crafty.e('Sara').sara();
    }

    // Boy Story
    if (State.player === 'Boy') {

    }

    // Boundaries
    // Left side - To Room
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            if (State.config().room.access) {
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
        cindy: 'assets/char/cindy_54x96.png',
        clarence: 'assets/char/clarence_64x96.png',
        curtis: 'assets/char/curtis_57x96.png',
        dina: 'assets/char/dina_54x96.png',
        elise: 'assets/char/elise_56x96.png',
        femaleb: 'assets/char/femaleb_54x96.png',
        girl_small: 'assets/char/girl_small_52x96.png',
        harriet: 'assets/char/harriet_54x96.png',
        lady: 'assets/char/lady_53x96.png',
        girl: 'assets/char/girl_54x96.png',
        marion: 'assets/char/marion_53x96.png',
        may: 'assets/char/may_54x96.png',
        midage_man: 'assets/char/midage_man_63x96.png',
        midage_woman: 'assets/char/midage_woman_53x96.png',
        mikey: 'assets/char/mikey_57x96.png',
        miley: 'assets/char/miley_53x96.png',
        octavia: 'assets/char/octavia_54x96.png',
        rebecca: 'assets/char/rebecca_53x96.png',
        salary_man: 'assets/char/salary_man_57x96.png',
        tyler: 'assets/char/tyler_57x96.png',
        vivian: 'assets/char/vivian_53x96.png',
        young_man: 'assets/char/young_man_57x96.png',
        young_woman: 'assets/char/young_woman_53x96.png',
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
        classDeskRight: 'assets/bg/class_desk_right.png',

        speech: 'assets/speech_640x180.png',
        spSpeech: 'assets/speech.png',
        spSpeechL: 'assets/speechL.png',
        spSpeechR: 'assets/speechR.png',
        spExclaimL: 'assets/exclaimL.png',
        spExclaimR: 'assets/exclaimR.png'
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
        Crafty.sprite(54, 96, assets.cindy, {
            sprCindyR: [0, 1],
            sprCindyL: [0, 0]
        });
        Crafty.sprite(64, 96, assets.clarence, {
            sprClarenceR: [0, 1],
            sprClarenceL: [0, 0]
        });
        Crafty.sprite(57, 96, assets.curtis, {
            sprCurtisR: [0, 1],
            sprCurtisL: [0, 0]
        });
        Crafty.sprite(54, 96, assets.dina, {
            sprDinaR: [0, 1],
            sprDinaL: [0, 0]
        });
        Crafty.sprite(56, 96, assets.elise, {
            sprEliseR: [0, 1],
            sprEliseL: [0, 0]
        });
        Crafty.sprite(54, 96, assets.femaleb, {
            sprFemalebR: [0, 1],
            sprFemalebL: [0, 0]
        });
        Crafty.sprite(52, 96, assets.girl_small, {
            sprGirlSmallR: [0, 1],
            sprGirlSmallL: [0, 0]
        });
        Crafty.sprite(54, 96, assets.harriet, {
            sprHarrietR: [0, 3],
            sprHarrietL: [0, 2]
        });
        Crafty.sprite(53, 94, assets.lady, {
            sprLadyR: [0, 1],
            sprLadyL: [0, 0]
        });
        Crafty.sprite(53, 96, assets.marion, {
            sprMarionR: [0, 1],
            sprMarionL: [0, 0]
        });
        Crafty.sprite(54, 96, assets.may, {
            sprMayR: [0, 1],
            sprMayL: [0, 0]
        });
        Crafty.sprite(63, 96, assets.midage_man, {
            sprMidAgeManR: [0, 1],
            sprMidAgeManL: [0, 0]
        });
        Crafty.sprite(53, 96, assets.midage_woman, {
            sprMidAgeWomanR: [0, 1],
            sprMidAgeWomanL: [0, 0]
        });
        Crafty.sprite(57, 96, assets.mikey, {
            sprMikeyR: [0, 1],
            sprMikeyL: [0, 0]
        });
        Crafty.sprite(53, 96, assets.miley, {
            sprMileySchoolR: [0, 1],
            sprMileySchoolL: [0, 0],
            sprMileyR: [0, 2],
            sprMileyL: [0, 3]
        });
        Crafty.sprite(54, 96, assets.octavia, {
            sprOctaviaR: [0, 2],
            sprOctaviaL: [0, 3]
        });
        Crafty.sprite(53, 96, assets.rebecca, {
            sprRebeccaR: [0, 1],
            sprRebeccaL: [0, 0]
        });
        Crafty.sprite(57, 96, assets.salary_man, {
            sprSalaryManR: [0, 1],
            sprSalaryManL: [0, 0]
        });
        Crafty.sprite(57, 96, assets.tyler, {
            sprTylerR: [0, 1],
            sprTylerL: [0, 0],
            sprTylerSchoolR: [0, 3],
            sprTylerSchoolL: [0, 2]
        });
        Crafty.sprite(53, 96, assets.vivian, {
            sprVivianR: [0, 3],
            sprVivianL: [0, 2]
        });
        Crafty.sprite(57, 96, assets.young_man, {
            sprYoungManR: [0, 1],
            sprYoungManL: [0, 0]
        });
        Crafty.sprite(53, 96, assets.young_woman, {
            sprYoungWomanR: [0, 1],
            sprYoungWomanL: [0, 0]
        });
        Crafty.sprite(48, 48, assets.emotions, {
            sprThink:       [0, 0],
            sprQuestion:    [0, 1],
            sprExclamation: [0, 2],
            sprMusic:       [0, 3],
            sprSigh:        [0, 4],
            sprAnger:       [0, 5]
        });
        Crafty.sprite(640, 180, assets.speech, {
            sprSpeechExclaimL: [0, 0],
            sprSpeechExclaimR: [0, 1],
            sprSpeechL:        [0, 2],
            sprSpeechR:        [0, 3],
            sprSpeech:         [0, 4]
        });

        Crafty.asset('speech', assets.spSpeech);
        Crafty.asset('speechL', assets.spSpeechL);
        Crafty.asset('speechR', assets.spSpeechR);
        Crafty.asset('exclaimL', assets.spExclaimL);
        Crafty.asset('exclaimR', assets.spExclaimR);

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

        Crafty.scene(State.scene);
    });
});
