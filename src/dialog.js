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
    _template: {
        room: [],
        street: [],
        corridor: [],
        park: [],
        library: [],
        classroom: []
    },

    // Going to use JSON.parse/stringify to save some time
    // if have time, make custom cloning method for optimization
    clone: function() {
        return JSON.parse(JSON.stringify(Dialog._template));
    },

    text: {
        response: '<div style=\"text-align: center; margin-bottom: -15px\">* Choose your response *</div>',
    }
};

/* PCs */
Dialog.girl = Dialog.clone(),  Dialog.boy = Dialog.clone();
/* NPCs */
Dialog.cindy = Dialog.clone(), Dialog.clarence = Dialog.clone(),
Dialog.may = Dialog.clone(),   Dialog.miley = Dialog.clone(),
Dialog.lady = Dialog.clone(),  Dialog.diana = Dialog.clone(),
Dialog.mikey = Dialog.clone(), Dialog.boy = Dialog.clone(),
Dialog.tyler = Dialog.clone(), Dialog.rebecca = Dialog.clone(),
Dialog.young_man = Dialog.clone();
/* Other */
Dialog.lessons = Dialog.clone(), Dialog.scenarios = Dialog.clone();

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
            "I’m not a Baby! You’re A Baby!!!"+br+
            "*Push the bully*"//and a fight breaks out.
        ]]
    };

    Dialog.scenarios.corridor[1] = {
        text: [
            "Head to the classroom to tell your teacher, Mrs. Barton."
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
    index = index || State.index[scene.upperFirst()];
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
// emote: opt; array; Emotes to use when dialog appears. null for no emotes
// \ emotes displayed in order they are in array. Corresponds to current dialog array
// \\ (see Dialog.show->speech())
// next: opt; boolean; increment the state index? default: false
// scene: opt; str; scene to use dialog from. default: current scene
// index: opt; int; scene index to use dialog from. default: current scene index
Dialog.show = function(entity, emotes, next, scene, index) {
    var dialog = Dialog.get(entity, scene, index);
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
            if (_.isArray(emotes) && _.isString(emotes[i]))
                entity.emote(emotes[i].upperFirst());
            Crafty.e('Speech').speech(entity, text[i], _.isArray(response) && response[i]);
            i += 1;
        } else {
            // May not be necessary. Leaving commented just in case.
            // Dialog.progression->unbindAll should take care of it.
            //entity.unbind('CloseSpeech');
            entity.trigger('SpeechFinish');
        }
        // Trigger response if response id (selected) is passed
        if (existy(selected)) {
            Crafty.trigger('SpeechResponse', selected);
        }
    };
    speech();
    entity.bind('CloseSpeech', speech);
    if (next) State.next(scene);
    console.log('Dialog.show--->Index: ' + State.getIndex(scene));
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
// index: opt; int; typically 0 or 1 - 0 = good, 1 = bad.
// \ corresponds to index of text.
// \\ default: type == 'good': 0; type == 'bad': 1; type == 'scenario': 0;
// scene: opt; str; scene name to pull lesson text from. default: current
Dialog.showInfo = function(type, index, scene) {
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
    var totalWidth = Crafty.viewport.width + width + padding * 2;

    var html = '<div id="lesson-container" style="padding: '+padding+'px; background-color: '+bgcolor+'; width: '+width+';">'+text+'</div>';
    $('#cr-stage')
        .css('width', totalWidth)
        .append(html);
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
