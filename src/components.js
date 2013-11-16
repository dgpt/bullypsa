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
        this.settings = _.clone(s);

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
        speed = speed || this.settings.animSpeed;
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
    },

    onHitPortal: function(data) {
        var portal = data[0].obj;
        portal.trigger('PortalOn');
    },

    offHitPortal: function() {
        this.stopEmote();
        Crafty.trigger('PortalOff');
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
            portal: false,
            portalWidth: 90
        });
        s.portalx = s.x - (s.portalWidth/6);
        this._settings = s;

        this.requires('Actor')
            .actor(s.sprite, s);

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
    move: function(to) {

    },

    // Given array of x positions or specific keywords, move to each one
    // 'full': move across entire scene, then go the opposite way after given time
    // 'stop': Stay still, same as passing an empty array
    _patrol: function(path) {

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

/***** NPCs ******/
Crafty.c('Cindy', {
    cindy: function(settings) {
        var s = _.defaults(settings || {}, {
            sprite: 'sprCindy',
            left:  [0, 2, 6],
            right: [0, 3, 6],
            x: 250,
            y: Game.player.y,
            z: 5
        });

        this.requires('NPC').npc(s);
        return this;
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


Crafty.c('', {

});

Crafty.c('', {

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

/*/// Speech System ///
    Handles text, responses, and bubble.
    Triggers CloseSpeech event when speech is destroyed.
    If there was a response in the speech, passes response id to callback.
*/
Crafty.c('Speech', {
    init: function() {
        this.requires('2D, DOM, Text');
    },

    speech: function(entity, text, response, type) {
        var s = {
            // offsets (in relation to entity)
            x: -150,
            y: -150,
            z: entity._z + 11,
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
            fontSize: '14px',
            fontFamily: 'arial sans-serif',
            maxWidth: 350
        };
        this.font = s.fontSize + ' '+ s.fontFamily;

        if (_.isArray(response))
            text += br + this.response(response);

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
        entity.enabled = true;
        // Make sure player resumes walking correctly
        // if movement button held down during message.
        entity.trigger('NewDirection', {x: entity._movement.x});
        Crafty.trigger('CloseSpeech', this.selected);
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
