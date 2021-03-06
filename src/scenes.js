Crafty.scene.genNPCSettings = function(front) {
    var r = Crafty.math.randomNumber;

    var s = {
        path: Math.random() <= 0.5 ? 'full-right' : 'full-left',
        pathLeftEdge: r(0, 500),
        pathRightEdge: r(Game.width - 500, Game.width - 66),
        pathInterval: r(3000, 30000),
        x: r(0, Game.width-64),
        speed: 1,
        animSpeed: 60
    };
    s.y = front ? Game.player.y + r(2, 7) : Game.player.y - r(2, 20);
    var dif = Math.round(Game.player.y - s.y);
    var d = dif / Math.abs(dif);
    s.z = d < 0 ? (-d * 60) + dif : 40 - dif;
    return s;
}

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
                   Game.setScene('Street', {fade: true, x: 'left', orientation: 'right'});
                };
            } else {
                Dialog.show(player, {next: true});
            }
        }, function() {
            player.action = null;
        });

    Dialog.show(player, {next: true, callback: function() {
        Dialog.showInfo('scenario', 0, 'Room');
    }});
}, function() {
    this.unbind('KeyDown');
});

Crafty.scene('Street', function() {
    var player = Game.setupScene('street');

    var clarenceSettings = Crafty.scene.genNPCSettings();
    clarenceSettings.x = 250;
    clarenceSettings.pathLeftEdge = 200;
    clarenceSettings.pathRightEdge = 500;
    Crafty.e('Clarence').clarence(clarenceSettings);

    Crafty.e('Curtis').curtis(Crafty.scene.genNPCSettings());
    Crafty.e('Elise').elise(Crafty.scene.genNPCSettings());
    Crafty.e('Femaleb').femaleb(Crafty.scene.genNPCSettings());
    Crafty.e('Sara').sara(Crafty.scene.genNPCSettings());

    Crafty.e('SalaryMan').salaryMan(Crafty.scene.genNPCSettings(true));
    Crafty.e('Rebecca').rebecca(Crafty.scene.genNPCSettings(true));
    Crafty.e('Harriet').harriet(Crafty.scene.genNPCSettings(true));

    // Girl Story
    if (State.player === 'Girl') {
        /* NPCs */
        if (State.getIndex() < 1) {
            var cindy = Crafty.e('Cindy').cindy({x: 845, orientation: 'left', portal: true})
                .action({onhit: function() {
                    // Hacky, yes. No time for beauty!
                    if (!cindy._dflag0) {
                        cindy.speechWidth = 220;
                        Dialog.progression([
                            [cindy, {emotes: ['Question']}],
                            [player, {emotes: ['Exclamation'], next: true}]
                        ]);
                        cindy._dflag0 = true;
                    }
                }});
            girlModeTransition(player, _.partial(Game.setScene, 'Corridor',
                                                 {showInfo: ['scenarios'], x: 'left', orientation: 'right'}));
        }
    }

    // Boy Story
    if (State.player === 'Boy') {
        if (State.getIndex() < 1) {
            var mikey = Crafty.e('Mikey').mikey({x: 1282, orientation: 'right', portal: true})
                .action({onhit: function() {
                    if (!mikey._dflag) {
                        Dialog.progression([
                            [mikey, {index: 0, emotes: ['Exclamation']}],
                            [player, {index: 0, emotes: ['Anger'], next: true}],
                        ]);
                        mikey._dflag = true;
                    }
                }});
            boyModeTransition(player, _.partial(Game.setScene, 'Corridor', {showInfo: ['scenarios', 5], x: 'left', orientation: 'right'}));
        }
    }

    // Boundaries
    // Left side - To Room
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            if (State.config().room.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Room', {fade: true, x: 'right', orientation: 'left'});
                };
            }
        }, function() {
            player.action = null;
        });

    // Right - To Park
    Crafty.e('Portal')
        .portal({x: Game.width - 45})
        .action(function() {
            if (State.config().park.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Park', {fade: true, x: 'left', orientation: 'right'});
                };
            }
        }, function() {
            player.action = null;
        });

    // Stairs - To Corridor
    Crafty.e('Portal')
        .portal({x: 1195, w: 80, boundary: false})
        .action(function() {
            if (State.config().corridor.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Corridor', {fade: true, x: 'left', orientation: 'right'});
                };
            }
        }, function() { player.action = null; });
}, function() {
    Crafty.unbind('KeyDown');
    Crafty.unbind('SpeechResponse');
});

Crafty.scene('Corridor', function() {
    var player = Game.setupScene('corridor');

    //Background NPCs
    Crafty.e('Curtis').curtis(Crafty.scene.genNPCSettings());
    Crafty.e('Femaleb').femaleb(Crafty.scene.genNPCSettings());
    Crafty.e('Octavia').octavia(Crafty.scene.genNPCSettings());
    Crafty.e('Vivian').vivian(Crafty.scene.genNPCSettings());

    if (State.player === 'Girl') {
        if (State.getIndex() < 1) {
            // Add more girls to the group
            var diana = Crafty.e('Diana').diana({x: 590, y: 191, z: 20, orientation: 'left'});
            var elise = Crafty.e('Elise').elise({x: 639, y: 204, orientation: 'left'});
            var may = Crafty.e('May').may({x: 555, orientation: 'left', portal: true})
                .action({onhit: function() {
                    if (!may._dflag) {
                        Dialog.progression([
                            [may, {emotes: ['Exclamation']}],
                            [player, {emotes: ['Anger'], next: true}],
                            [may, {emotes: ['Question']}],
                            [player, {emotes: ['Question']}]
                        ]);
                        may._dflag = true;
                    }
                }});
            girlModeTransition(player, _.partial(Game.setScene, 'Classroom', {showInfo: ['scenarios'], orientation: 'left'}));
        }
    }

    if (State.player === 'Boy') {
        if (State.getIndex() < 1) {
            var tyler = Crafty.e('Tyler').tyler({x: 500, orientation: 'left', portal: true})
                .action({onhit: function() {
                    if (!tyler._dflag) {
                        Dialog.progression([
                            [tyler, {emotes: ['Exclamation']}],
                            [player, {emotes: ['Anger'], next: true}],
                            [tyler],
                            [player, {emotes: ['Question'], next: true}],
                        ]);
                        tyler._dflag = true;
                    }
                }});
            boyModeTransition(player, _.partial(Game.setScene, 'Library', {orientation: 'left'}));
        }
    }

    // Left - To Street
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            if (State.config().street.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Street', {fade: true, x: 'stairs', orientation: 'right'});
                };
            }
        }, function() { player.action = null; });

    // Upstairs - Classroom
    Crafty.e('Portal')
        .portal({x: 740, w: 60, boundary: false})
        .action(function() {
            if (State.config().classroom.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Classroom', {fade: true, orientation: 'left'});
                };
            }
        }, function() { player.action = null; });

    // Downstairs - Library
    Crafty.e('Portal')
        .portal({x: 870, w: 60, boundary: false})
        .action(function() {
            if (State.config().library.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Library', {fade: true, orientation: 'left'});
                };
            }
        }, function() { player.action = null; });

    // Right - bound
    Crafty.e('Boundary')
        .attr({x: Game.width});
});

Crafty.scene('Park', function() {
    var player = Game.setupScene('park');

    if (State.player === "Boy") {
        if (State.getIndex() < 1) {
            var young_man = Crafty.e('Young_man').young_man({x: 385, orientation: 'right', portal: true})
                .action({onhit: function() {
                    if (!young_man._dflag) {
                        Dialog.progression([
                            [young_man, {emotes: ['Exclamation']}],
                            [player, {emotes: ['Anger'], next: true}],
                            [young_man],
                            [player, {next: true}],
                        ]);
                        young_man._dflag = true;
                    }
                }});
            boyModeTransition(player, _.partial(Game.setScene, 'Street', {showInfo: ['scenarios', 5], x: 'right', orientation: 'left'}));
        }
    }

    if (State.getIndex() >= 10) {
        var girl = Crafty.e('GirlLame').girlLame({x: 577, orientation: 'left'});
        player.disableControl();
        player.x = 469;
        Crafty.viewport.x -= 50;
        Dialog.progression([
            [player, {emote: ['Exclamation']}],
            [girl, {emote: ['Music'], next: true, callback: function() {
                girl.speechXOffset = -100;
                girl.speechYOffset = 35;
            }}],
            [girl, {callback: fadeToEnd}]
        ]);
    } else {
        Crafty.e('Roland').roland(Crafty.scene.genNPCSettings());
        Crafty.e('Elise').elise(Crafty.scene.genNPCSettings());
        Crafty.e('Sara').sara(Crafty.scene.genNPCSettings());
        Crafty.e('Marion').marion(Crafty.scene.genNPCSettings());
        Crafty.e('GirlSmall').girlSmall(Crafty.scene.genNPCSettings());
        Crafty.e('MidAgeWoman').midAgeWoman(Crafty.scene.genNPCSettings());
    }

    // Left - to street
    Crafty.e('Portal')
        .portal({orientation: 'left'})
        .action(function() {
            if (State.config().street.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Street', {fade: true, x: 'right', orientation: 'left'});
                };
            }
        }, function() {
            player.action = null;
        });

    // Right - bound
    Crafty.e('Boundary')
        .attr({x: Game.width});
});

Crafty.scene('Library', function() {
    var player = Game.setupScene('library');

    // Girl Story
    if (State.player === 'Girl') {
        if (State.getIndex() < 1) {
            player.x = 750;

            var cindy = Crafty.e('Cindy').cindy({x: 100, y: 173, orientation: 'right'});
            var diana = Crafty.e('Diana').diana({x: cindy.x + 100, y: cindy.y, orientation: 'right'});
            var may = Crafty.e('May').may({x: cindy.x + 50, y: cindy.y + 19, z: cindy.z + 12, orientation: 'right'});
            may.bind('CloseSpeech', function() { player.enabled = true; may.unbind('CloseSpeech');});
            diana.speechWidth = 250;
            var xoff = 400;
            var cOldXOff = cindy.speechXOffset;
            var dOldXOff = diana.speechXOffset;
            var mOldXOff = may.speechXOffset;
            cindy.speechXOffset =  xoff - 100;
            diana.speechXOffset = xoff - 180;
            may.speechXOffset = xoff - 240;
            Crafty.e('Portal')
                .portal({x: cindy.x + xoff, boundary: false})
                .action(function() {
                    if (!cindy._dflag) {
                        Dialog.progression([
                            [cindy, {emotes: ['Exclamation'], callback: function() { player.enabled = true; }}],
                        ]);
                        cindy._dflag = true;
                    }
                });

            Crafty.e('Portal')
                .portal({x: cindy.x + xoff - 60, boundary: false})
                .action(function() {
                    if (!diana._dflag) {
                        Dialog.progression([
                            [diana, {emotes: ['Exclamation'], next: true, callback: function() { player.enabled = true; }}],
                        ]);
                        diana_dflag = true;
                    }
                });

            Crafty.e('Portal')
                .portal({x: cindy.x + xoff - 120, boundary: false})
                .action(function() {
                    if (!cindy._dflag0) {
                        Dialog.progression([
                            [cindy, {}],
                            [may, {emotes: ['Exclamation'], next: true}]
                        ]);
                        cindy._dflag0 = true;
                    }
                });
            diana.action({onhit: function() {
                if (!diana._dflag0) {
                    cindy.speechXOffset = cOldXOff;
                    diana.speechXOffset = dOldXOff;
                    may.speechXOffset = mOldXOff;
                    Dialog.progression([
                        [may],
                        [cindy],
                        [diana, {next: true}],
                        [cindy,],
                        [player, {emotes: ['Exclamation']}],
                    ]);
                    diana._dflag0 = true;
                }
            }});

            girlModeTransition(player, function() {
                State.player = 'Boy';
                for (var scn in State.index) {
                    State.index[scn] = 0;
                }
                Game.setScene('Park', {showInfo: ['scenarios', 5], x: 'right', orientation: 'left'});
            });
        }
    }

    if (State.player === 'Boy') {
        if (State.getIndex() < 1) {
            player.x = 777;
            var tyler = Crafty.e('Tyler').tyler({x: 100, y: 178, z: 30, orientation: 'right', portal: true})
            var mikey = Crafty.e('Mikey').mikey({x: 140, orientation: 'right', portal: true})
                .action({onhit: function() {
                    if (!mikey._dflag) {
                        player.speechYOffset = -38;
                        Dialog.progression([
                            [mikey, {emotes: ['Exclamation']}],
                            [tyler, {emotes: ['Exclamation'], next: true}],
                            [mikey],
                            [player, {emotes: ['Question'], next: true}],
                        ]);
                        mikey._dflag = true;
                    }
                }});

            var ending = function() {
                if (Game.points.total / Game.points.current >= 0.5)
                    return ['Park', 'left'];
                else
                    return ['Classroom'];
            };
            boyModeTransition(player, function() {
                State.index['Park'] = 10;
                State.index['Classroom'] = 10;
                var end = ending();
                Game.setScene(end[0], {x: end[1], orientation: 'right'});
            });
        }
    }

    // Overlays
    Crafty.e('Overlay')
        .overlay({x: 96, y: 265}, 'libDeskLeft');
    Crafty.e('Overlay')
        .overlay({x: 361, y: 267}, 'libDeskRight');

    Crafty.e('GirlSmall').girlSmall(Crafty.scene.genNPCSettings());
    Crafty.e('Harriet').harriet(Crafty.scene.genNPCSettings());
    Crafty.e('MidAgeMan').midAgeMan(Crafty.scene.genNPCSettings());

    // Right - To corridor
    Crafty.e('Portal')
        .portal({x: Game.width - 55})
        .action(function() {
            if (State.config().corridor.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Corridor', {fade: true, x: 'down', orientation: 'left'});
                };
            }
        }, function() {
            player.action = null;
        });

    // Left - bound
    Crafty.e('Boundary');
});

Crafty.scene('Classroom', function() {
    var player = Game.setupScene('classroom');

    // Girl Story
    if (State.player === 'Girl') {
        if (State.getIndex() < 1) {
            var dina = Crafty.e('Dina').dina({x: 200, orientation: 'right'});
            var miley = Crafty.e('Miley').miley({x: 250, orientation: 'right'});
            var cindy = Crafty.e('Cindy').cindy({x: 300, orientation: 'right', portal: true})
                .action({onhit: function() {
                    if (!cindy._dflag) {
                        cindy.speechWidth = 250;
                        player.speechYOffset = -20;
                        Dialog.progression([
                            [dina, {emotes: ['Exclamation']}],
                            [cindy, {emotes: ['Anger']}],
                            [player, {next: true}]
                        ]);
                        cindy._dflag = true;
                    }
                }});
            girlModeTransition(player, _.partial(Game.setScene, 'Library',
                                                 {orientation: 'left'}));
        }
    }

    // End Game -- Bad
    if (State.getIndex() >= 10) {
        player.x = 340;
        player.disableControl();
        var girl = Crafty.e('GirlLame').girlLame({x: 440, orientation: 'left'})
        var rebecca = Crafty.e('Rebecca').rebecca({x: 385, orientation: 'right'})
        girl.speechXOffset = -140;
        girl.speechYOffset = 110;
        rebecca.speechYOffset = -20;
        girl.bind('CloseSpeech', fadeToEnd);
        Dialog.progression([
            [rebecca, {emotes: ['Anger']}],
            [girl, {index: 11, scene: 'park'}]
        ]);
    }

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
            if (State.config().corridor.access) {
                player.emote('Think', true);
                player.action = function() {
                    Game.setScene('Corridor', {fade: true, x: 'up', orientation: 'left'});
                };
            }
        }, function() { player.action = null; });
});

Crafty.scene('End', function() {
    Crafty.viewport.x = 0;
    Crafty.viewport.y = 0;
    Crafty.bind('SceneChange', function() {
        Dialog.showInfo('scenarios', 10, 'Park');
    });
    var canw = Crafty.canvas._canvas.width;
    var canh = Crafty.canvas._canvas.height;
    var endText = Crafty.e('2D, DOM, Text')
        .text('The End')
        .textColor('#FFFFFF', .8)
        .textFont({size: '60px', weight: 'bold'})
        .attr({x: canw / 4, y: canh / 3, w: canw, h: canh});

    _.delay(function() {
        Crafty.e('2D, DOM, Text')
            .text('<a id="play-again" href="'+window.location.href+'">Play Again?</a>')
            .textColor('#FFFFFF', .8)
            .textFont({size: '30px'})
            .attr({x: endText._x + 50, y: endText._y + 100, w: 550, h: 250});
    }, 3750);
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
        roland: 'assets/char/roland_85x96.png',
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
            sprMayR: [0, 3],
            sprMayL: [0, 2]
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
        Crafty.sprite(85, 96, assets.roland, {
            sprRolandR: [0, 1],
            sprRolandL: [0, 0]
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
            sprYoung_manR: [0, 1],
            sprYoung_manL: [0, 0]
        });
        Crafty.sprite(53, 96, assets.young_woman, {
            sprDianaR: [0, 1],
            sprDianaL: [0, 0]
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
