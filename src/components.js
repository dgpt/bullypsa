/* Base Component for Player, NPCs */
Crafty.c('Actor', {
    enabled: true,
    lastX: 0,

    actor: function(sprite, settings) {
        if (!existy(settings) || !_.isObject(settings))
            fail('Actor.actor: settings is undefined or invalid');
        var s = _.defaults(settings, {
            speed: 3,
            animSpeed: 35,          // lower = faster
            animBlinkSpeed: 15,     // lower = faster
            blinkSpeed: 3750,       // in milliseconds
            y: Game.player.y,
            z: 2,
            orientation: Game.player.orientation // left or right
        });

        this.name = sprite.substr(3);
        s.orientation = s.orientation[0].toUpperCase();
        this._settings = s;

        // Positions for sprite map (Arrays [fromX, Y, toX])
        var l = s.left;
        var r = s.right;
        this.addComponent('2D', 'Canvas', sprite + s.orientation, 'SpriteAnimation')
            // Very specific to sprite sheet. Tried to make it as flexible as possible
            // On right and left, stop sprite is pos 0, movement is 1+
            //                    from x        y   to x
            .animate('Left',      l[0] + 1  , l[1], l[2])
            .animate('LeftStop',  l[0]      , l[1], l[0])
            .animate('Right',     r[0] + 1  , r[1], r[2])
            .animate('RightStop', r[0]      , r[1], r[0])
            .attr({ x: s.x, y: s.y, z: s.z });


        // Blink support setup (optional)
        var lb = s.leftBlink;
        var rb = s.rightBlink;
        if (_.isArray(lb) && _.isArray(rb))
            this._blink = this._blinkSetup({lb: lb, rb: rb});

        this.bind('NewDirection', this._setDirection);
        this.bind('EnterFrame', function() {
            if (!this.enabled)
                this.stopMovement();
        });

        return this;
    },

    stopMovement: function() {
        this._speed = 0;
        if (this._movement) {
            Crafty.trigger('NewDirection', {x: 0});
            this.x -= this._movement.x;
        }
    },

    emote: function(type, hold) {
        if (!this.emotion) {
            this.emotion = Crafty.e('Emotion');
            // Adjust emotion y pos if boy
            // (he's really short - looks funny without this)
            if (this.name === 'Boy') {
                this.emotion.attr({yOffset: -35});
            }
            this.emotion.emotion(this, type, hold);
        }
    },

    stopEmote: function() {
        if (this.emotion) {
            this.emotion.hide();
            this.emotion = null;
        }
    },

    _setDirection: function(data) {
        if (!existy(data) || !existy(data.x))
            fail('Actor.config->setDirection: data is not defined');
        var x = data.x;
        if (x !== 0 && (_.isObject(this._idler) && _.has(this._idler, 'stop')))
            this._idler.stop();
        if (x < 0)
            this._anim('Left', x);
        else if (x > 0)
            this._anim('Right', x);
        else {
            if (this.lastX < 0) {
                this._anim('LeftStop', 0);
                this._idler = this._blink && this._blink('Left');
            } else if (this.lastX > 0) {
                this._anim('RightStop', 0);
                this._idler = this._blink && this._blink('Right');
            } else {
                this.lastX = 0;
            }
        }
    },

    _anim: function(reel, lx, speed, count) {
        if (!existy(lx))
            fail('Actor._anim: this.lastX must be specified');
        count = existy(count) && _.isNumber(count) ? count : -1;
        speed = speed || this._settings.animSpeed;
        this.lastX = lx;
        this.stop();
        return this.animate(reel, speed, count);
    },

    _blinkSetup: function(s) {
        if (s.lb && s.rb) {
            this.animate('LeftBlink', s.lb[0], s.lb[1], s.lb[2])
                .animate('RightBlink', s.rb[0], s.rb[1], s.rb[2]);

            var actor = this;
            var blink = _.bind(function(dir) {
                if (!_.isString(dir))
                    fail('Blink bind: dir must be a string.');
                return Crafty.e('Idler').start(function() {
                    actor._anim(dir + 'Blink', 0, actor.settings.animBlinkSpeed, 0);
                }, actor.settings.blinkSpeed);
            }, this);

            return blink;
        }
    }
});

Crafty.c('Player', {
    player: function(settings) {
        var s = _.defaults(settings, {
            speed: 3,
            z: 5,
            x: Game.player.x,
            y: Game.player.y
        });
        this.requires('Actor, Multiway, Collision')
            .actor(s.sprite, s)
            .multiway(s.speed, {
                D: 0,
                RIGHT_ARROW: 0,
                A: 180,
                LEFT_ARROW: 180
            })
            .onHit('Solid', this.stopMovement)
            .onHit('Portal', this.onHitPortal, this.offHitPortal);

        this._setDirection(this._movement); // check for direction on init
        this.bind('KeyDown', function(e) {
            if (e.key == Crafty.keys.SPACE) {
                if (existy(this.action) && _.isFunction(this.action))
                    this.action();
            }
        });
        this.bind('CreateSpeech', function() {
            // stop player because wiggle text
            this.enabled = false;
        });
        this.bind('CloseSpeech', function() {
            // Make sure player resumes walking correctly
            // if movement button held down during message.
            this.trigger('NewDirection', {x: this._movement.x});
            this.enabled = true;
        });
    },

    onHitPortal: function(data) {
        this._portal = data[0].obj;
        this._portal.trigger('PortalOn');
    },

    offHitPortal: function() {
        this.stopEmote();
        this._portal.trigger('PortalOff');
        this._portal = null;
    }
});

Crafty.c('NPC', {
    /*
    TODO:
        Add patrol route
            make possible to walk through area, then walk back after a given time
                people always walking in crowded areas
                (but not just walking back and forth - realism)

        Default positions
            x defaults to full scene route (back and forth patrol)
            y defaults to Game.player.y

        Actions
            spawn portals that trigger player actions

        Automated Speech
            keep player enabled, cycle speech at given interval
    */

    npc: function(settings) {
        var s = _.defaults(settings || {}, {
            x: 0,
            path: 'stop',
            pathInterval: 1500,
            portal: false,
            portalWidth: 90
        });
        s.portalx = s.x - (s.portalWidth/6);
        this._settings = s;

        this.requires('Actor, Tween, Delay')
            .actor(s.sprite, s);

        this._patrol = _.bind(this._patrol, this);
        this._patrol(s.path, s.pathInterval, s.pathLeftEdge, s.pathRightEdge);

        return this;
    },

    // Spawn portal with given actions
    action: function(settings) {
        var s = _.defaults(settings || {}, {
            x: this._settings.portalx,
            w: this._settings.portalWidth,
            onhit: this._settings.onhit,
            offhit: this._settings.offhit
        });

        this._portal = Crafty.e('Portal')
            .portal({x: s.x, w: s.w, boundary: false})
            .action(s.onhit, s.offhit);

        return this;
    },

    // Moves from current x to given x
    moveTo: function(x, callback) {
        var dir = x < this.x ? -1 : 1;
        var dirName = dir === 1 ? 'Right' : 'Left';

        this.animate(dirName, this._settings.animSpeed, -1);
        this.bind("EnterFrame", function(e) {
            if (this.x * dir >= x * dir) {
                this.animate(dirName + "Stop", 0);
                this.unbind("EnterFrame");
                if (callback) callback();
            } else {
                this.x += this._settings.speed * dir;
            }
        });
    },

    // Given array of x positions or specific keywords, move to each one
    // 'full': move across entire scene, then go the opposite way after given time
    // 'stop': Stay still, same as passing an empty array
    _patrol: function(path, interval, leftEdge, rightEdge) {
        if (typeof path === "string") {

            var pleft = _.partial(this._patrol, 'left-edge', interval, leftEdge, rightEdge);
            var pright = _.partial(this._patrol, 'right-edge', interval, leftEdge, rightEdge);
            var mleft = _.partial(this.moveTo, leftEdge || 0, pright);
            var mright = _.partial(this.moveTo, rightEdge || Game.width - this.w - 5, pleft);

            pleft = _.bind(pleft, this);
            pright = _.bind(pright, this);
            mleft = _.bind(mleft, this);
            mright = _.bind(mright, this);

            if (path === "full-right") {
                mright();
            } else if (path === "full-left") {
                mleft();
            } else if (path === "left-edge") {
                _.delay(mleft, interval, 0);
            } else if (path === "right-edge") {
                _.delay(mright, interval, 0);
            }
        } else {
            console.error("path must be string");
        }
    },
});

/***** Players ******/
Crafty.c('Girl', {
    init: function() {
        this.requires('Player')
            .player({
                sprite: 'sprGirl',
                left:  [0, 0, 6],
                right: [0, 1, 6]
            });
    }
});

Crafty.c('Boy', {
    name: 'boy',
    init: function() {
        this.requires('Player')
            .player({
                sprite: 'sprBoy',
                left:  [0, 0, 6],
                right: [0, 1, 6]
            });
    }
});

///***** NPCs ******///
Crafty.c('GenericNPC', {
    gnpc: function(name, settings) {
        var s = _.defaults(settings || {}, {
            sprite: 'spr' + name.upperFirst(),
            left:  [0, 0, 6],
            right: [0, 1, 6],
            x: 0,
            y: Game.player.y,
            z: 5
        });
        this.requires('NPC').npc(s);
        return this;
    }
});
///* Main NPCs *///
    Crafty.c('Cindy', {
        cindy: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('cindy', settings);
        }
    });

    Crafty.c('May', {
        may: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('may', settings);
        }
    });

    Crafty.c('Dina', {
        dina: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('dina', settings);
        }
    });

    Crafty.c('Diana', {
        diana: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('diana', settings);
        }
    });

    Crafty.c('Lady', {
        lady: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('lady', settings);
        }
    });

    Crafty.c('Young_man', {
        young_man: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('young_man', settings);
        }
    });

    Crafty.c('Mikey', {
        mikey: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('mikey', settings);
        }
    });

    Crafty.c('Tyler', {
        tyler: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('tyler', settings);
        }
    });

///* Background NPCs *///
    Crafty.c('Clarence', {
        clarence: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('clarence', settings);
        }
    });

    Crafty.c('Curtis', {
        curtis: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('curtis', settings);
        }
    });

    Crafty.c('Elise', {
        elise: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('elise', settings);
        }
    });

    Crafty.c('Femaleb', {
        femaleb: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('femaleb', settings);
        }
    });

    Crafty.c('GirlSmall', {
        girlSmall: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('girlSmall', settings);
        }
    });

    Crafty.c('Harriet', {
        harriet: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('harriet', _.defaults(settings || {}, {
                    sprite: 'sprHarriet',
                    //           x1 y  x2
                    left:       [0, 2, 6],
                    leftBlink:  [0, 0, 4],
                    right:      [0, 3, 6],
                    rightBlink: [0, 1, 4],
                    z: 7
                 }));
        }
    });

    Crafty.c('Marion', {
        marion: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('marion', settings);
        }
    });

    Crafty.c('MidAgeMan', {
        midAgeMan: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('midAgeMan', settings);
        }
    });

    Crafty.c('MidAgeWoman', {
        midAgeWoman: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('midAgeWoman', settings);
        }
    });

    //Tileset needs adjustment.
    Crafty.c('Miley', {
        miley: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('miley', _.defaults(settings || {}, {
                    sprite: 'sprMiley',
                    //           x1 y  x2
                    left:       [0, 2, 6],
                    right:      [0, 3, 6],
                    z: 7
                 }));
        }
    });

    Crafty.c('Octavia', {
        octavia: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('octavia', _.defaults(settings || {}, {
                    sprite: 'sprOctavia',
                    //           x1 y  x2
                    left:       [0, 2, 6],
                    leftBlink:  [0, 0, 4],
                    right:      [0, 3, 6],
                    rightBlink: [0, 1, 4],
                    z: 7
                 }));
        }
    });

    Crafty.c('Rebecca', {
        rebecca: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('rebecca', settings);
        }
    });

    Crafty.c('Roland', {
        roland: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('roland', settings);
        }
    });

    Crafty.c('SalaryMan', {
        salaryMan: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('salaryMan', settings);
        }
    });

    Crafty.c('Sara', {
        sara: function(settings) {
            var s = _.defaults(settings || {}, {
                sprite: 'sprSara',
                //           x1 y  x2
                left:       [0, 2, 6],
                leftBlink:  [0, 0, 4],
                right:      [0, 3, 6],
                rightBlink: [0, 1, 4],
                x: 150,
                z: 7
            });
            this.requires('NPC').npc(s);
            return this;
        }
    });

    Crafty.c('Vivian', {
        vivian: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('vivian', _.defaults(settings || {}, {
                    sprite: 'sprVivian',
                    //           x1 y  x2
                    left:       [0, 2, 6],
                    leftBlink:  [0, 0, 4],
                    right:      [0, 3, 6],
                    rightBlink: [0, 1, 4],
                    z: 7
                 }));
        }
    });

    Crafty.c('YoungWoman', {
        youngWoman: function(settings) {
            return this.requires('GenericNPC')
                .gnpc('youngWoman', settings);
        }
    });


Crafty.c('Emotion', {
    animSpeed: 10,
    hideTime: 1600,
    fadeTime: 60,
    // Offset from player pos
    xOffset: 5,
    yOffset: -45,

    emotion: function(player, type, hold) {
        if (!_.isString(type))
            fail('Emotion.emotion: type must be string.');

        var frames = this.getFrames(type);

        this.requires('2D, DOM, Delay, Tween, spr'+type+', SpriteAnimation')
            .attr({
                alpha: 1,
                x: player.x + this.xOffset,
                y: player.y + this.yOffset,
                z: player.z
            })
            .animate(type, frames[0], frames[1], frames[2])
            .animate(type, this.animSpeed, 0);

        // Follow player
        var updateX = _.bind(function() {
            this.x = player.x + this.xOffset;
        }, this);
        this.bind('EnterFrame', updateX);

        // Start the emotion
        if (!hold)
            this.delay(_.partial(this.hide, player), this.hideTime, 0);
        return this;
    },

    hide: function(player) {
        this.tween({alpha: -2.5}, this.fadeTime);
        this.bind('TweenEnd', _.partial(this.die, player));
    },

    die: function(player) {
        if (player && player.emotion)
            player.emotion = null;
        this.destroy();
    },

    getFrames: function(type) {
        switch (type) {
            case 'Think':
                return [0, 0, 10];
                break;

            case 'Question':
                return [0, 1, 11];
                break;

            case 'Exclamation':
                return [0, 2, 8];
                break;

            case 'Music':
                return [0, 3, 17];
                break;

            case 'Sigh':
                return [0, 4, 10];
                break;

            case 'Anger':
                return [0, 5, 5];
                break;
        }
    }
});

/*/// Speech System ///
    Handles text, responses, and bubble.
    Triggers CloseSpeech event when speech is destroyed.
    If there was a response in the speech, passes response id to callback.
*/
Crafty.c('Speech', {
    speech: function(entity, text, response, type) {
        var s = {
            // offsets (in relation to entity)
            x: existy(entity.speechXOffset) ? entity.speechXOffset : 0,
            // Distance from head to bottom of box
            y: -50,
            z: entity._z + 11,
            // Get constrained X or Y positions
            getX: function() {
                var x = (entity.x - (s.w / 3)) + s.x;
                var right = s.w + 70;
                var left = 75;
                if (x + right >= Game.width) x = Game.width - right;
                if (x < left) x = left;
                return x;
            },
            getY: function() {
                return (s.y + entity.y) - s.h;
            },
            fontSize: '14px',
            fontFamily: 'arial sans-serif',
            maxWidth: entity.speechWidth || 350
        };
        this.font = s.fontSize + ' '+ s.fontFamily;

        if (_.isArray(response))
            text += br + this.response(response);

        var dim = text.dimensions(this.font, s.maxWidth);
        s.w = dim[0] + 1;  // +1 for stupid word wrap bug
        s.h = dim[1];

        this.requires('2D, DOM, Text')
            .text(text)
            .textFont({size: s.fontSize, family: s.fontFamily})
            // Bounding box around text - use to make sure text sizes are correct
            //.css({'border': '2px black solid'})
            .attr({x: s.getX(), y: s.getY(), w: s.w, h: s.h, z: s.z})
            .unselectable();
        this.bubble = this.createBubble(type);

        Crafty.trigger('CreateSpeech');

        this.bind('KeyDown', function(e) {
            if (e.key == Crafty.keys.SPACE)
                this.die(entity);
        });
    },

    response: function(textArray) {
        if (!_.isArray(textArray))
            fail('Response.response: textArray is not an array');

        var text = _.map(textArray, function(val, i) { return '<div id="option'+i+'" '+
                         'class="'+(i===0 ? 'optionOn' : 'optionOff')+' option">'+
                            val+'</div>'; }).join(br);
        var i = 0;
        var last_i = 0;
        this.selected = 0;
        var select = _.bind(function() {
            if (i >= textArray.length) i = 0;
            if (i < 0) i = textArray.length - 1;
            $('#option'+i).removeClass('optionOff').addClass('optionOn');
            $('#option'+last_i).removeClass('optionOn').addClass('optionOff');
            this.selected = i;
            last_i = i;
        }, this);

        this.bind('KeyDown', function(e) {
            if (e.key == Crafty.keys.W || e.key == Crafty.keys.UP_ARROW)
                i -= 1;
            if (e.key == Crafty.keys.S || e.key == Crafty.keys.DOWN_ARROW)
                i += 1;
            if (last_i != i) select();
        });
        return br + text;
    },

    createBubble: function(type) {
        type = type || "Speech";
        // offsets
        var s = {
            x: this._x - 14,
            y: this._y - 14,
            w: this._w + 12,
            h: this._h + 12,
            z: this._z - 1
        };
        var image = NineSlice(Crafty.assets[Crafty.asset(type.lowerFirst())]);
        image.setDimensions({x: 17, y: 17, width: 474, height: 85});
        return Crafty.e('2D, DOM, Image')
            .attr({x: s.x, y: s.y, w: s.w, h: s.h, z: s.z})
            .image(image.renderCache(s.x, s.y, s.w, s.h));
    },

    die: function(entity) {
        entity.trigger('CloseSpeech', this.selected);
        this.bubble.destroy();
        this.destroy();
    }
});

Crafty.c('Boundary', {
    init: function() {
        this.requires('2D, Solid')
            .attr({x: 0, y: 0, w: 0, h: Game.height});
    }
});

// Portal is a boundary that has an action (like doorways, etc)
// portalWidth indicates the non-solid portion of the portal that still registers collisions
Crafty.c('Portal', {
    portal: function(settings) {
        var s = _.defaults(settings || {}, {
            x: 0,
            y: 0,
            w: 40,
            h: Game.height,
            orientation: 'right',
            boundary: true
        });

        this.requires('2D')
            .attr(s);

        if (s.boundary) {
            var bx;
            if (s.orientation === 'left')
                bx = s.x;
            else
                bx = s.x + s.w;

            Crafty.e('Boundary')
                .attr({x: bx, y: s.y});
        }

        return this;
    },

    action: function(onHit, offHit) {
        this.bind('PortalOn', onHit);
        if (existy(offHit) && _.isFunction(offHit))
            this.bind('PortalOff', offHit);
        return this;
    }
});

// Wrapper for Delay.
// Start starts the delay interval indefinitely
// Stop destroys the entity, stopping the delay
Crafty.c('Idler', {
    init: function() {
        this.requires('Delay');
    },

    start: function(callback, delay) {
        this.delay(callback, delay, -1);
        return this;
    },

    stop: function() {
        this.destroy();
    }
});

Crafty.c('Overlay', {
    init: function() {
        this.requires('2D, Canvas, Image');
    },

    overlay: function(pos, asset) {
        if (!(_.isString(asset) && Crafty.asset(asset)))
            fail('Overlay.overlay: asset is invalid.');
        pos = _.defaults(pos || {}, {
            x: 0,
            y: 0,
            z: 10
        });
        this.attr(pos)
            .image(Crafty.asset(asset));
    }
});

Crafty.c('Fader', {
    active: false,
    width: 0,
    fadeTime: 70,

    init: function() {
        var canvas = document.createElement('canvas');
        var gc = canvas.getContext('2d');
        canvas.width = Game.width * 3;
        console.log('canvas width: ' + canvas.width);
        canvas.height = Game.height;

        this.width = canvas.width;

        gc.fillStyle = "#000000";
        gc.fillRect(0, 0, canvas.width, canvas.height);

        this.image = canvas.toDataURL();

        return this;
    },

    // Fades in or out
    // if inOrOut is 'in' or 'out' it will fade in or out respectively
    fade: function(fadeTime, inOrOut, callback, hold) {
        var fadesIn = inOrOut == 'in' ? true : false;
        var imageEnt = Crafty.e('2D, DOM, Image, Tween').image(this.image);

        imageEnt.active = true;

        imageEnt.alpha = fadesIn ? 1.0 : 0.0;
        imageEnt.attr({x: -Crafty.viewport.x - imageEnt.w / 2, y: this.y, z: 100})
            .tween({alpha: fadesIn ? 0.0 : 1.0}, fadeTime)
            .bind("TweenEnd", function() {
                this.active = false;
                if (callback) {
                    callback();
                }
                if (!hold)
                    this.destroy();
                else {
                    Crafty.bind('FadeEnd', _.bind(function() {
                        Crafty.unbind('FadeEnd');
                        this.destroy();
                    }, this));
                }
            });
    }
});
