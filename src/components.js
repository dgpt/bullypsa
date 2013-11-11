Crafty.c('Player', {
    enabled: true,

    init: function() {
        this.requires('2D, Canvas');
        this.bind('KeyDown', function(e) {
            if (e.key == Crafty.keys.SPACE) {
                if (existy(this.action) && _.isFunction(this.action))
                    this.action();
            }
        });
        this.bind('EnterFrame', function() {
            if (!this.enabled)
                this.stopMovement();
        });
    },

    player: function(settings) {
        if (!existy(settings) || !_.isObject(settings))
            fail('Player.player: settings is undefined or invalid');
        var s = _.defaults(settings, {
            speed: 3,
            animSpeed: 35,          // lower = faster
            animBlinkSpeed: 15,     // lower = faster
            blinkSpeed: 3750,       // in milliseconds
            x: Game.player.x,
            y: Game.player.y,
            z: 3,
            orientation: Game.player.orientation // left or right
        });

        s.orientation = s.orientation[0].toUpperCase();
        var spr = settings.sprite;
        this.currentCharacter = spr.substr(3);
        // Positions for sprite map (Arrays [fromX, Y, toX])
        var l = settings.left;
        var lb = settings.leftBlink;
        var r = settings.right;
        var rb = settings.rightBlink;
        var blinkSupport = true;

        var lastX = 0;
        var idler;

        if (!_.isString(spr))
            fail('Player.player: spr is not a string.');
        if (!(_.isArray(l) && _.isArray(r)))
            fail('Player.player: Animation reels are not defined.');
        if (!(_.isArray(lb) && _.isArray(rb)))
            blinkSupport = false;

        this.addComponent('Multiway', spr + s.orientation, 'SpriteAnimation', 'Collision')
            // Very specific to sprite sheet. Tried to make it as flexible as possible
            // On right and left, stop sprite is pos 0, movement is 1+
            //                    from x        y   to x
            .animate('Left',      l[0] + 1  , l[1], l[2])
            .animate('LeftStop',  l[0]      , l[1], l[0])
            .animate('Right',     r[0] + 1  , r[1], r[2])
            .animate('RightStop', r[0]      , r[1], r[0])
            .multiway(s.speed, {
                D: 0,
                RIGHT_ARROW: 0,
                A: 180,
                LEFT_ARROW: 180
            })
            .attr({ x: s.x, y: s.y, z: s.z })
            .onHit('Solid', this.stopMovement)
            .onHit('Portal', this.onHitPortal, this.offHitPortal);

        if (blinkSupport) {
            this.animate('LeftBlink', lb[0], lb[1], lb[2])
                .animate('RightBlink',rb[0], rb[1], rb[2]);
        }

        var anim = _.bind(function(reel, lx, speed, count) {
            if (!existy(lx))
                fail('Player.init->anim: lastX must be specified');
            count = existy(count) && _.isNumber(count) ? count : -1;
            speed = speed || s.animSpeed;
            lastX = lx;
            this.stop();
            return this.animate(reel, speed, count);
        }, this);

        var blink = _.bind(function(dir) {
            if (blinkSupport) {
                if (!_.isString(dir))
                    fail('Blink bind: dir must be a string.');
                return Crafty.e('Idler').start(function() {
                    anim(dir + 'Blink', 0, s.animBlinkSpeed, 0);
                }, s.blinkSpeed);
            }
        }, this);

        var setDirection = function(data) {
            if (!existy(data) || !existy(data.x))
                fail('Player.config->setDirection: data is not defined');
            var x = data.x;
            if (x !== 0 && (_.isObject(idler) && _.has(idler, 'stop')))
                idler.stop();
            if (x < 0)
                anim('Left', x);
            else if (x > 0)
                anim('Right', x);
            else {
                if (lastX < 0) {
                    anim('LeftStop', 0);
                    idler = blink('Left');
                } else if (lastX > 0) {
                    anim('RightStop', 0);
                    idler = blink('Right');
                } else {
                    lastX = 0;
                }
            }
        };
        this.bind('NewDirection', setDirection);
    },

    stopMovement: function() {
        this._speed = 0;
        if (this._movement) {
            Crafty.trigger('NewDirection', {x: 0});
            this.x -= this._movement.x;
        }
    },

    onHitPortal: function(data) {
        var portal = data[0].obj;
        portal.trigger('PortalOn');
    },

    offHitPortal: function() {
        this.stopEmote();
        Crafty.trigger('PortalOff');
    },

    emote: function(type, hold) {
        if (!this.emotion) {
            this.emotion = Crafty.e('Emotion');
            // Adjust emotion y pos if boy
            // (he's really short - looks funny without this)
            if (this.currentCharacter === 'Boy') {
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
    }
});

Crafty.c('Emotion', {
    animSpeed: 10,
    hideTime: 1600,
    fadeTime: 60,
    // Offset from player pos
    xOffset: 5,
    yOffset: -50,

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

Crafty.c('Sara', {
    init: function() {
        this.requires('Player')
            .player({
                sprite: 'sprSara',
                //           x1 y  x2
                left:       [0, 2, 6],
                leftBlink:  [0, 0, 4],
                right:      [0, 3, 6],
                rightBlink: [0, 1, 4],
                //x: Game.player.x         // Necessary for tracking x between rooms
            });
    }
});

Crafty.c('Girl', {
    name: 'girl',
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

Crafty.c('Speech', {
    init: function() {
        this.requires('2D, DOM, Text');
    },

    speech: function(entity, text, response, type) {
        var s = {
            // offsets (in relation to entity)
            x: -150,
            y: -150,
            z: entity._z + 4,
            // Get constrained X or Y positions
            get: function(xory) {
                // pass either x or y
                var val = s[xory] + entity[xory];
                if (xory == 'x') {
                    var w = s.w + 70;
                    var left = 75;
                    if (val + w >= Game.width) val = Game.width - w;
                    if (val < left) val = left;
                }
                return val;
            },
            fontSize: '12px',
            fontFamily: 'arial sans-serif',
            maxWidth: 350
        };
        this.font = s.fontSize + ' '+ s.fontFamily;
        var dim = text.dimensions(this.font, s.maxWidth);
        s.w = dim[0] + 1;  // +1 for stupid word wrap bug
        s.h = dim[1];
        this.text(text)
            .textFont({size: s.fontSize, family: s.fontFamily})
            // Bounding box around text - use to make sure text sizes are correct
            //.css({'border': '2px black solid'})
            .attr({x: s.get('x'), y: s.get('y'), w: s.w, h: s.h, z: s.z})
            .unselectable();
        this.bubble = this.createBubble(type);

        // stop player because wiggle text
        entity.enabled = false;

        this.bind('KeyDown', function(e) {
            if (e.key == Crafty.keys.SPACE)
                this.die(entity);
        });
    },

    createBubble: function(type) {
        type = type || "Speech";
        // offsets
        var s = {
            x: this._x - 12,
            y: this._y - 12,
            w: this._w + 10,
            h: this._h + 10,
            z: this._z - 1
        };
        var image = NineSlice(Crafty.assets[Crafty.asset(type.lowerFirst())]);
        image.setDimensions({x: 13, y: 14, width: 474, height: 85});
        return Crafty.e('2D, DOM, Image')
            .attr({x: s.x, y: s.y, w: s.w, h: s.h, z: s.z})
            .image(image.renderCache(s.x, s.y, s.w, s.h));
    },

    die: function(entity) {
        entity.enabled = true;
        // Make sure player resumes walking correctly
        // if movement button held down during message.
        entity.trigger('NewDirection', {x: entity._movement.x});
        this.bubble.destroy();
        this.destroy();
        Crafty.trigger('CloseSpeech');
    }
});

Crafty.c('Response', {
    response: function(entity, textArray) {
        if (!_.isArray(textArray))
            fail('Response.response: textArray is not an array');

        var s = {
            x: entity.x,
            y: entity.y,
            w: entity.w,
            h: entity.h,
            z: entity.z
        };

        var text = textArray.join('<br>');
        this.requires('2D, DOM, Text')
            .text(text)
            .unselectable()
            .attr({x: s.x, y: s.y, w: s.w, h: s.h, z: s.z});
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
    portal: function(attr) {
        attr = _.defaults(attr || {}, {
            x: 0,
            y: 0,
            w: 40,
            h: Game.height,
            orientation: 'right',
            boundary: true
        });
        var bx;
        if (attr.orientation === 'left')
            bx = attr.x;
        else
            bx = attr.x + attr.w;

        this.requires('2D')
            .attr(attr);
        if (attr.boundary) {
            Crafty.e('Boundary')
                .attr({x: bx, y: attr.y});
        }

        return this;
    },

    hitCheck: function(callback) {
        if (this.intersect(Crafty('Player').mbr())) {
            callback();
        }
    },

    action: function(onHit, offHit) {
        //var hc = _.bind(this.hitCheck, this);
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
            z: 4
        });
        this.attr(pos)
            .image(Crafty.asset(asset));
    }
});
