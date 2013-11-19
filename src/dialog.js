/* Layout:
Dialog {
    player { (boy or girl?)
        scene [ (based on game state)
            {
                text [
                response [
                    [ (array of choices)

Dialog.player.scene[0].text[2] - text
Dialog.player.scene[0].response[2][0] - response

Dialog
    Progressions are indicated by matching indices
    For example, the following is a Dialog Progression (conversation)
    between Cindy and Girl
    Dialog.cindy.street[0] = {
        text: [ "Hello" ]
    };
    Dial.girl.street[0] = {
        text: ["* Choose a response *"],
        response: [[
                "Hi",
                "STFU",
                "Meow"
            ]]
    };

Responses !
    Text index must match response index
    For example, to have a few boxes of text before having
    an available response, do this
    var t = Dialog.player.scene[0];
    t.text[0] = 'this is a message. continue.'
    t.text[1] = 'hello again.'
    t.text[2] = 'do you want to eat pie?'
    t.response[2] = ['yes', 'no', 'maybe so']

Lessons ! Important!
    Lesson text will only be displayed from the first index
    of the text array in the dialog object.
    GOOD:
    Dialog.lessons.street[0] = {
        text: [ "put all text here" ]
    };
    BAD:
    Dialog.lessons.street[0] = {
        text: [ "this text will show up",
                "this text will not show up",
                "nope not gonna show" ]
        response: [ "don't even think about it" ]
    };
*/

Dialog = {
    // From which all other Dialog objects are cloned
    template: function() {
        return {
            room: [],
            street: [],
            corridor: [],
            park: [],
            library: [],
            classroom: []
        }
    },

    text: {
        response: '<div style=\"text-align: center; margin-bottom: -15px\">* Choose your response *</div>',
    }
};

/* PCs */
Dialog.girl = Dialog.template(),  Dialog.boy = Dialog.template();
/* NPCs */
Dialog.cindy = Dialog.template(), Dialog.may = Dialog.template(),
Dialog.lady = Dialog.template(),  Dialog.diana = Dialog.template(),
Dialog.mikey = Dialog.template(), Dialog.boy = Dialog.template(),
Dialog.tyler = Dialog.template(), Dialog.rebecca = Dialog.template(),
Dialog.young_man = Dialog.template(), Dialog.dina = Dialog.template();
/* Other */
Dialog.lessons = Dialog.template(), Dialog.scenarios = Dialog.template();

/* Characters with a dialog part:
girl, cindy, may, dina, diana, lady (teacher)
boy, young_man, mikey, tyler
*/
////////////////////////////////////
///////  Girl Scenes  /////////////
//////////////////////////////////
/* Lessons are 0 = good 1 = bad
 * Scenarios are from 0 to 4 */
///* Room *///
    Dialog.scenarios.room[0] = {
        text: [
            "This window shows important story-line information."
        ]
    };
    Dialog.girl.room[0] = {
        text: [
            "In this game, you'll be entering different scenarios to help you become aware of common bullying situations that you might find yourself in. You will have (2) choices to choose from; one right and one wrong."+br+br+"(Press space to continue)",
            "Being bullied and then choosing to be able to stand up to the things that are the hardest for you is difficult sometimes. It is also important to know how you can help others who are being bullied. Practicing making the right choices will help you know just what to do next time you find yourself in a similar situation.",
            "Stand up and believe in yourself, make the right choices, you can do it! What happens next depends on your answer."+br+br+
            "(Press the left arrow key or A to move left.)"+br+
            "(Press the right arrow key or D to move right.)"
        ]
    };
    Dialog.girl.room[1] = {
        text: [
            "When you see this emote appear over the player,"+br+
            "press space to move to the next area."
        ]
    };

    ///* Street *///
    Dialog.scenarios.street[0] = {
        text: [
            "Lindsay is on the way to school wearing some of last year's fashions."
        ]
    };
    Dialog.cindy.street[0] = {
        text: [
            "Hey Lindsay, where'd you get that shirt? The DI? Ha Ha, can't your parents afford to buy you clothes at a real store?"
        ]
    };
    Dialog.girl.street[0] = {
        text: [
            Dialog.text.response,
        ],
        response: [
            [
                "I love this shirt."+br+"It doesn't matter where I got it."+br+
                "*Walk away to avoid further confrontation*",
                "Leave me alone! I hate you!"+br+"I don't shop at the DI you do!!!"+br+
                "*Push Cindy*"
            ]
        ]
    };
    // LESSONS
    // Good
    Dialog.lessons.street[0] = {
        text: [
            "Lindsay is happy with the shirt she has and it does not make a difference to her where she got it. She believes in her choice and is not afraid to tell the others but also does not want to make a big deal out of it, so she walks away to avoid any confrontation. By not reacting to their insults, Lindsay did not let the bullies have what they were after, a reaction."
        ]
    };
    // Bad
    Dialog.lessons.street[1] = {
        text: [
            "Lindsay reacts to what the bullies are saying about her shirt and where she got it. She gets mad, yells back and starts pushing, starting a confrontation. Uh oh, the bullies got the reaction they were looking for. She should try to ignore what the bullies are saying about her. Lindsay should also learn to manage her temper by not yelling or starting a fight. By reacting this way, Lindsay set herself up for more trouble in the future. Now the bully knows just what to pick on to get a reaction out of Lindsay."
        ]
    };

///* Corridor *///
    Dialog.scenarios.corridor[0] = {
        text: [
            "Kids are on their way to class and are showing each other their phones, which apparently have a picture of Lindsay on it. They are whispering to each other, pointing at her and laughing."
        ]
    };

    Dialog.may.corridor[0] = {
        text: [
            "Ha Ha, I saw you on Facebook. You are such a spaz!!!"
        ]
    };

    Dialog.girl.corridor[0] = {
        text: [
            "Leave me alone! I’m going to tell!!"
        ]
    };

    Dialog.may.corridor[1] = {
        text: [
            "What are you a baby? Can't you solve your own problems?"
        ]
    };

    Dialog.girl.corridor[1] = {
        text: [
            Dialog.text.response,
        ],
        resonse: [[
            "Of course I can, but you are making fun of me. How would you feel if a picture like that was posted on Facebook?"+br+
            "*Tell your teacher about May's behavior*",
            "I’m not a baby! You’re a baby!!!"+br+
            "*Push the bully and start a fight*"
        ]]
    };

    Dialog.scenarios.corridor[1] = {
        text: [
            "Head to the classroom to tell your teacher, Mrs. Barton."
        ]
    };
    // Lessons
    // Good
    Dialog.lessons.corridor[0] = {
        text: [
            "Lindsay knows she is not a baby. She ignores the name-calling but also tries to get the bullies to think about how they would feel. She also knows that she should go and tell her teacher because cyber bullying can get very serious! You should never be afraid to tell an adult when you are being bullied."
        ]
    };
    // Bad
    Dialog.lessons.corridor[1] = {
        text: [
            "Lindsay does not like the bullies calling her a baby. She reacts by losing her temper, yelling at them and then begins to push. Instead, she should walk away and inform her teacher of what just happened. Sometimes, when things are serious, it is necessary to get an adult involved who can help. Bullies count on your silence to get away with their bad behavior. So speaking up can stop them in their tracks!"
        ]
    };

///* Classroom *///
    Dialog.scenarios.classroom[0] = {
        text: [
            "Lindsay has told Ms. Barton about the pictures on Facebook. Ms. Barton goes out to the corridor and sends the bullies to the principal’s office. Lindsay goes back out in the hallway and the girls keep teasing her."
        ]
    };

    Dialog.dina.classroom[0] = {
        text: [
            "You're such a teacher's pet."
        ]
    };

    Dialog.cindy.classroom[0] = {
        text: [
            "It was just a joke. What a baby!"
        ]
    };

    Dialog.girl.classroom[0] = {
        text: [
            Dialog.text.response
        ],
        response:[[
            "*Go back to the classroom and wait until next class*",
            "*Push Cindy and start a fight*"
        ]]
    };
    // Lessons
    // Good
    Dialog.lessons.classroom[0] = {
        text: [
            "Lindsay decided that it would be a better choice to go into the classroom and wait it out so the bullies would not have anyone to attack or call names. This was a great choice! She prevented them from continuing their bullying by removing herself from the situation. If it continues, she will want to make sure to get an adult involved."
        ]
    };
    // Bad
    Dialog.lessons.classroom[1] = {
        text: [
            "Lindsay should not get physical and start to push. It would be better to walk away into another room with an adult or with other kids and wait for them to leave. Fighting is never a good idea. If you fight back, the bullying could become worse and adults might see you as part of the problem."
        ]
    };

///* Library *///
    Dialog.scenarios.library[0] = {
        text: [
            "Lindsay walks into the library and a group of girls are standing together whispering. As she gets closer, she hears what they are talking about."
        ]
    };

    Dialog.cindy.library[0] = {
        text: [
            "I heard she liked Joe."
        ]
    };

    Dialog.diana.library[0] = {
        text: [
            "As if she has a chance with any guy!"
        ]
    };

    Dialog.cindy.library[1] = {
        text: [
            "Seriously! She is so ugly!"
        ]
    };

    Dialog.may.library[1] = {
        text: [
            "Right?! I mean look at her, she doesn’t even try to look like she’s cool. She could at least color her hair like everyone else. I mean, who even looks like that anymore."
        ]
    };

    // When Lindsay approaches group

    // Spoken together
        Dialog.may.library[2] = {
            text: [
                "Cow."
            ]
        };

        Dialog.cindy.library[2] = {
            text: [
                "Ha ha ha"
            ]
        };

        Dialog.diana.library[2] = {
            text: [
                "Tee hee hee"
            ]
        };

    Dialog.diana.library[3] = {
        text: [
            "Guys will never like you!"
        ]
    };

    Dialog.cindy.library[3] = {
        text: [
            "Yeah, you're so ugly. What a beast!"
        ]
    };

    Dialog.girl.library[3] = {
        text: [
            Dialog.text.response
        ],
        response: [[
            "Whatever! You are all a bunch of ugly peacocks!",
            "I like who I am and what I look like."+br+
            "*Walk away*"
        ]]
    };
    // Lessons
    // Good
    Dialog.lessons.library[0] = {
        text: [
            "It is hard to ignore people when they are calling you names. Just keep moving to where you were going. Showing them that you are not concerned about what they have to say takes away their power while name-calling will only make things worse!"
        ]
    };
    // Bad
    Dialog.lessons.library[1] = {
        text: [
            "Lindsay believes in herself and tells Cyndi, Diana, and May that she likes who she is and what she looks like. Then she walks away leaving them to ponder what she just said. By stating her position without any emotion, the bullies did not get the response they were looking for. This is the best way to gain control of a situation and not let a bully cut you down!"
        ]
    };


////////////////////////////////////
///////  Boy Scenes   /////////////
//////////////////////////////////
/* Lessons are 2 = good 3 = bad
 * Scenarios are from 5 to 9   */
///* Park *///
    Dialog.scenarios.park[5] = {
        text: [
            "The kids are playing football in the park. Joe missed the ball when it passed to him."
        ]
    };

    Dialog.young_man.park[0] = {
        text: [
            "How could you miss that ball? It was coming straight for you. Even a two year old could have caught it!"
        ]
    };

    Dialog.boy.park[0] = {
        text: [
            "The sun was in my eyes. I couldn't see it..."
        ]
    };

    Dialog.young_man.park[1] = {
        text: [
            "Whatever! You are just a baby who can’t catch a ball. I’m not going to let you play on my team again!"
        ]
    };

    Dialog.boy.park[1] = {
        text: [
            Dialog.text.response
        ],
        response: [[
            "Fine, I'm going to take your ball!"+br+
            "*Start a fight with the bullies*",
            "I don't like being talked to like that. I am not going to play with you if you treat me that way. Everyone makes mistakes sometimes."
        ]]
    };
    // Lessons
    // Good
    Dialog.lessons.park[2] = {
        text: [
            "Joe decides to stand up for himself, he tells them he does not like what they are saying and everybody makes a mistake sometime. He does the right thing by walking away to avoid a confrontation. Speaking up without starting a fight takes away the power a bully has."
        ]
    };
    // Bad
    Dialog.lessons.park[3] = {
        text: [
            "Joe decides to give them a taste of their own medicine, saying he would take their ball. Then in anger, he starts a fight with them. A better choice would be to walk away. Fighting lets them know that what they said was a good way to get a reaction out of you and things will probably get worse in the future!"
        ]
    };

///* Street *//
    Dialog.scenarios.street[5] = {
        text: [
            "Joe is walking to school after his trouble at the park."
            // Mikey walks up to him
        ]
    };

    Dialog.mikey.street[0] = {
        text: [
            "Hey wimp, give me your lunch money."
        ]
    };

    Dialog.boy.street[0] = {
        text: [
            Dialog.text.response
        ],
        response: [[
            "*Run away and tell an adult*",
            "*Give Mikey your lunch money*"
        ]]
    };
    // Lessons
    // Good
    Dialog.lessons.street[2] = {
        text: [
            "Joe is tired of giving in to the bully and giving him his lunch money. He decides to go tell an adult. If you are being bullied you should tell an adult. It is not tattling. You need someone you can trust to be on your side. Being silent and giving in to bullies only makes them more powerful."
        ]
    };
    // bad
    Dialog.lessons.street[3] = {
        text: [
            "Joe gives them his lunch money. He does not want to take the chance of getting beat-up. He really should just run to an adult and get them to help him because in this situation the bullying will continue if someone does not stop him. The best way to handle this is to get a trusted adult involved."
        ]
    };

///* Corridor *///
    Dialog.scenarios.street[5] = {
        text: [
            "On the way to class..."
        ]
    };

    Dialog.tyler.corridor[0] = {
        text: [
            "Hey shorty, aren't you a little young to be in junior high?"
        ]
    };

    Dialog.boy.corridor[0] = {
        text: [
            "I'm plenty old enough!"
        ]
    };

    Dialog.tyler.corridor[1] = {
        text: [
            "You're way too short. There's no way you're old enough, short stack!"
        ]
    };

    Dialog.boy.corridor[1] = {
        text: [
            Dialog.text.response
        ],
        response: [[
            "I'll show you who's short!"+br+
            "*Kick Tyler in the shin*",
            "*Ignore Tyler and walk away*"
        ]]
    };
    // Lessons
    // Good
    Dialog.lessons.corridor[2] = {
        text: [
            "Joe made the right choice by leaving the situation and not reacting to the name-calling. Showing emotion to their insults would have been the wrong choice. By walking away, Joe sent a message to the bullies that he wasn't going to let their name-calling bother him."
        ]
    };
    // Bad
    Dialog.lessons.corridor[3] = {
        text: [
            "Joe should leave it alone and go to another area to avoid any confrontation. Fighting is never the right choice and usually will let bullies know what your weak spots are so that they know how to pick on you again in the future."
        ]
    };

///* Library *///
    Dialog.mikey.library[0] = {
        text: [
            "What a wimp! Did you see him this morning trying to act like he was tough at the park for that girl?"
        ]
    };

    Dialog.tyler.library[0] = {
        text: [
            "They're perfect for each other. She's so ugly nobody else wants her and he's such a weakling. Girls are never going to like such a sissy."
        ]
    };
    // As Joe approaches the group...
    Dialog.mikey.library[1] = {
        text: [
            "Wuss."
        ]
    };

    Dialog.boy.library[1] = {
        text: [
            Dialog.text.response
        ],
        response: [[
            "I heard what you said about Lindsay and me. You're gonna pay for that!"+br+
            "*Punch Mikey*",
            "Why do you have to act like such a bully? So not cool."+br+
            "*Walk Away*"
        ]]
    };
    // Lessons
    // Good
    Dialog.lessons.library[2] = {
        text: [
            "Joe decides to at least let them know how he feels, being proud of himself because he did not resort to a physical or verbal means of retaliating back. By speaking up, without starting a fight, Joe took away their power."
        ]
    };
    // Bad
    Dialog.lessons.library[3] = {
        text: [
            "Joe lets their comments get the best of him and he tries to defend Lindsay. He threatens the bullies and then starts to fight. Joe should have just not said anything and walked away. Do not forget that engaging in a fight can make things worse."
        ]
    };



// USES GLOBALS: State.scene, State.index
// returns dialog array for given entity, scene and index
// if scene or index is not provided, defaults to current scene and index
// entity can either be a string or an instance of Actor
// based on global state variables
// return value {text: [], response: [[]]}
Dialog.get = function(entity, scene, index) {
    scene = (scene || State.scene).lowerFirst();
    index = existy(index) ? index : State.index[scene.upperFirst()];
    // Entity can be a string (warning: does not do extensive checking)
    // or and instance of the Actor component
    entity = _.isObject(entity) && entity.__c.Actor ? entity.name.toLowerCase() : entity;
    var dEnt = Dialog[entity];
    if (!existy(dEnt)) {
        warn('Dialog.get: Dialog['+entity+'] does not exist.');
        return;
    }
    var dSce = dEnt[scene];
    if (!existy(dSce)) {
        warn('Dialog.get: Dialog['+entity+']['+scene+'] does not exist.');
        return;
    }
    var d = dSce[index];
    if (!existy(d)) {
        warn('Dialog.get: Dialog['+entity+']['+scene+']['+index+'] does not exist.');
        return;
    }
    return d;
};

// Shows dialog. Defaults to current State and Scene.
// entity: required; actor to spawn dialog above.
// settings: contains the following optional settings
// emotes: array; Emotes to use when dialog appears. null for no emotes
// \ emotes displayed in order they are in array. Corresponds to current dialog array
// \\ (see Dialog.show->speech())
// next: boolean; increment the state index? default: false
// scene: str; scene to use dialog from. default: current scene
// index: int; scene index to use dialog from. default: current scene index
// callback: func; callback to call after text has been shown.
// \ Passed the selected response
Dialog.show = function(entity, settings) {
    var s = _.defaults(settings || {}, {
        scene: State.scene,
        index: State.getIndex(),
        next: false,
        emotes: null,
        callback: null
    });
    var dialog = Dialog.get(entity, s.scene, s.index);
    if (!existy(dialog))
        return;
    var text = dialog.text;
    var response = dialog.response;

    // If entity is a string, default speech entity to player
    // Mildly hacky. Could be handled better.
    if (_.isString(entity))
        entity = Crafty('Player');

    var i = 0;
    // Cycles through text array, spawning a speech bubble for each entry
    var speech = function(selected) {
        if (i < text.length) {
            if (_.isArray(s.emotes) && _.isString(s.emotes[i]))
                entity.emote(s.emotes[i].upperFirst());
            Crafty.e('Speech').speech(entity, text[i], _.isArray(response) && response[i]);
            i += 1;
        } else {
            // May not be necessary. Leaving commented just in case.
            // Dialog.progression->unbindAll should take care of it.
            //entity.unbind('CloseSpeech');
            if (_.isFunction(s.callback))
                s.callback(selected);
            entity.trigger('SpeechFinish');
        }
        // Trigger response if response id (selected) is passed
        if (existy(selected)) {
            Crafty.trigger('SpeechResponse', selected);
        }
    };
    speech();
    entity.bind('CloseSpeech', speech);
    if (s.next) State.next(s.scene);
    console.log('Dialog.show--->Index: ' + State.getIndex(s.scene));
};

// Handles back-and-forth conversations
// Chains dialogs together.
// argsList: 2D array; Array of arrays containing args to pass to Dialog.show
Dialog.progression = function(argsList) {
    var i = 0;
    var speech = function() {
        var args = argsList[i];
        if (!existy(args)) {
            unbindAll();
            return;
        }
        args[0].bind('SpeechFinish', speech);
        Dialog.show.apply(null, args);
        i++;
    };
    // Make sure all events are unbind-ed when finished to avoid weirdness
    var unbindAll = function() {
        for (var j = 0; j < argsList.length; j++) {
            var entity = argsList[j][0];
            entity.unbind('SpeechFinish');
            entity.unbind('CloseSpeech');
        }
    };
    speech();
};

// Shows lessons or scenarios to the right of the game.
// See documentation at the top for more info on how the
// \ lesson text is laid out in the Dialog objects.
// type: str; 'good', 'bad', or 'scenario' (or anything that's not 'good' or 'bad')
// \ 'good' has a green background - used for good decisions
// \\ 'bad' has a red background - used for bad decisions
// \\\ 'scenario' has a grey background - used for intro text to scenarios
// persist: opt; bool; whether info box should persit between scenes
// index: opt; int; typically 0 or 1 - 0 = good, 1 = bad.
// \ corresponds to index of text.
// \\ default: type == 'good': 0; type == 'bad': 1; type == 'scenario': 0;
// scene: opt; str; scene name to pull lesson text from. default: current
Dialog.showInfo = function(type, persist, index, scene) {
    Crafty.unbind('SceneChange', setupInfoBox);
    var bgcolor;
    var dialogType = 'lessons';
    if (type === 'good') {
        bgcolor = '#2BFF3D';  // Green
    } else if (type === 'bad') {
        bgcolor = '#E0191C';  // Red
    } else {
        bgcolor = '#6B6B6B';  // Grey
        dialogType = 'scenarios';
    }
    var text = Dialog.get(dialogType, scene, index).text[0];

    var width = 180;
    var padding = 20;

    var setupInfoBox = function() {
        var totalWidth = Crafty.viewport.width + width + padding * 2;
        var html = '<div id="lesson-container" style="padding: '+padding+'px; box-shadow: inset 0 0 20px '+bgcolor+'; background-color: '+'#FFFFFF'+'; width: '+width+'; height: '+(Game.height-40)+'; z-index: 1000">'+text+'</div>';
        $('#cr-stage')
            .css('width', totalWidth)
            .append(html);
    };
    setupInfoBox();
    if (persist)
        Crafty.bind('SceneChange', setupInfoBox);
    else
        Crafty.bind('SceneChange', function() {
            Dialog.hideInfo();
            Crafty.unbind('SceneChange', setupInfoBox);
        });
};

Dialog.hideInfo = function() {
    $('#lesson-container').detach();
    $('#cr-stage').css('width', Crafty.viewport.width);
};

State = {
    scene: 'Street',
    player: 'Girl',
    index: {
        'Room': 0,
        'Street': 0,
        'Corridor': 0,
        'Park': 0,
        'Library': 0,
        'Classroom': 0
    },
    getIndex: function(scene) {
        return State.index[(scene || State.scene)];
    },
    // scene is optional
    next: function(scene) {
        State.index[(scene || State.scene)]++;
    },
    config: function() {
        var c = State['_'+State.player.lowerFirst()];
        if (!existy(c))
            fail('State.config: config method not found for ' + State.player.lowerFirst());
        return c();
    },

    // These handle game progression.
    _girl: function() {
        var s = _.clone(State._default);

        if (State.getIndex('Room') >= 2) {
            s.room.access = true;
            s.room.complete = true;
        }

        return s;
    },

    _boy: function() {
        var s = _.clone(State._default);

        return s;
    },

    _default: {
        room: {
            complete: false,
            access: false
        }
    }
};
