

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


Crafty.c('Player', {
    action: null,

    init: function() {
        this.requires('2D, Canvas');
        this.bind('KeyDown', function(e) {
            if (e.key == Crafty.keys.W || e.key == Crafty.keys.UP_ARROW) {
                if (existy(this.action) && _.isFunction(this.action))
                    this.action();
            }
        });
    },

    player: function(settings) {
        var speed = settings.speed || 1.7;
        var animSpeed = settings.animSpeed || 35;
        var animBlinkSpeed = settings.animBlinkSpeed || 15;
        var blinkSpeed = settings.blinkSpeed || 3750;  // in milliseconds
        var spr = settings.sprite;
        // Positions for sprite map (Arrays [fromX, Y, toX])
        var l = settings.left;
        var lb = settings.leftBlink;
        var r = settings.right;
        var rb = settings.rightBlink;
        var lastX = 0;
        var idler;
        if (!_.isString(spr))
            fail('Player.config: spr is not a string.');
        if (!(_.isArray(l) && _.isArray(lb) &&
              _.isArray(r) && _.isArray(rb)))
            fail('Player.config: l, r, lb, or rb are not arrays/defined');

        this.addComponent('Multiway', spr, 'SpriteAnimation', 'Collision')
            // Very specific to sprite sheet. Tried to make it as flexible as possible
            // On right and left, stop sprite is pos 0, movement is 1+
            .animate('Left',      l[0] + 1, l[1], l[2])
            .animate('LeftStop',  l[0], l[1], l[0])
            .animate('LeftBlink', lb[0], lb[1], lb[2])
            .animate('Right',     r[0] + 1, r[1], r[2])
            .animate('RightStop', r[0], r[1], r[0])
            .animate('RightBlink',rb[0], rb[1], rb[2])
            .multiway(speed, {
                D: 0,
                RIGHT_ARROW: 0,
                A: 180,
                LEFT_ARROW: 180
            })
            .onHit('Solid', this.stopMovement)
            .onHit('Portal', function() { Crafty.trigger('PortalOn'); },
                             function() { Crafty.trigger('PortalOff'); });

        var anim = _.bind(function(reel, lx, speed, count) {
            if (!existy(lx))
                fail('Player.init->anim: lastX must be specified');
            count = existy(count) && _.isNumber(count) ? count : -1;
            speed = speed || animSpeed;
            lastX = lx;
            this.stop();
            return this.animate(reel, speed, count);
        }, this);

        var blink = _.bind(function(dir) {
            if (!_.isString(dir))
                fail('Blink bind: dir must be a string.');
            return Crafty.e('Idler').start(function() {
                anim(dir + 'Blink', 0, animBlinkSpeed, 0);
            }, blinkSpeed);
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

    emote: function(type) {
        if (Crafty('spr' + type).length === 0) {
            Crafty.e('Emotion').emotion(this, type);
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
                rightBlink: [0, 1, 4]
            });
    }
});

Crafty.c('Boundary', {
    init: function() {
        this.requires('2D, Solid');
    }
});

// Portal is a boundary that has an action (like doorways, etc)
// portalWidth indicates the non-solid portion of the portal that still registers collisions
Crafty.c('Portal', {
    portal: function(attr) {
        this.requires('2D')
            .attr(attr);
        var bound = Crafty.e('Boundary')
            .attr({x: attr.x + attr.w, y: attr.y,
                   w: 30, h: attr.h});

        return this;
    },

    action: function(onHit, offHit) {
        this.bind('PortalOn', onHit);
        if (existy(offHit) && _.isFunction(offHit))
            this.bind('PortalOff', offHit);
        return this;
    }
});

Crafty.c('Emotion', {
    animSpeed: 10,
    hideTime: 1800,
    fadeTime: 110,

    emotion: function(player, type) {
        if (!_.isString(type))
            fail('Emotion.emotion: type must be string.');

        var xOffset = 5;
        var yOffset = -50;
        var frames = this.getFrames(type);

        this.requires('2D, DOM, Delay, Tween, spr'+type+', SpriteAnimation')
            .attr({
                alpha: 1,
                x: player.x + xOffset,
                y: player.y + yOffset,
                z: player.z
            })
            .animate(type, frames[0], frames[1], frames[2])
            .animate(type, this.animSpeed, 0);

        // Follow player
        var updateX = _.bind(function() {
            this.x = player.x + xOffset;
        }, this);
        this.bind('EnterFrame', updateX);

        // Start the emotion
        this.delay(this.hide, this.hideTime, 0);
        return this;
    },

    hide: function() {
        this.tween({alpha: -0.5}, this.fadeTime);
        this.bind('TweenEnd', this.die);
    },

    die: function() {
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


