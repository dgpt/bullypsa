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

Text index must match response index
For example, to have a few boxes of text before having
an available response, do this
var t = Dialog.player.scene[0];
t.text[0] = 'this is a message. continue.'
t.text[1] = 'hello again.'
t.text[2] = 'do you want to eat pie?'
t.response[2] = ['yes', 'no', 'maybe so']
*/

Dialog = {
    player: {
        room: [],
        street: [],
        corridor: [],
        park: [],
        library: [],
        classroom: []
    }
};

Dialog.girl = _.clone(Dialog.player);
Dialog.boy = _.clone(Dialog.player);

Dialog.girl.room[0] = {
    text: [
        "In this game, you'll be entering different scenarios to help you become aware of common bullying situations that you might find yourself in. You will have (2) choices to choose from; one right and one wrong."+br+br+"(Press space to continue)",
        "Being bullied and then choosing to be able to stand up to the things that are the hardest for you is difficult sometimes. It is also important to know how you can help others who are being bullied. Practicing making the right choices will help you know just what to do next time you find yourself in a similar situation.",
        "Stand up and believe in yourself, make the right choices, you can do it! What happens next depends on your answer."+br+br+
        "(Press the left arrow key or A to move left.)"+br+
        "(Press the right arrow key or D to move right.)"
    ],
    response: [

    ]
};
Dialog.girl.room[1] = {
    text: [
        "When you see this emote appear over the player,"+br+
        "press space to move to the next area."
    ],
    response: [[]]
};

// USES GLOBALS: State.scene, State.index
// returns dialog array for given entity, scene and index
// if scene or index is not provided, defaults to current scene and index
// based on global state variables
// return value {text: [], response: [[]]}
Dialog.get = function(entity, scene, index) {
    scene = (scene || State.scene).lowerFirst();
    index = index || State.index[scene.upperFirst()];
    var dEnt = Dialog[entity.name.toLowerCase()];
    if (!existy(dEnt)) {
        warn('Dialog.get: Dialog[entity.name] does not exist. entity.name: ' + entity.name.toLowerCase());
        return;
    }
    var dSce = dEnt[scene];
    if (!existy(dSce)) {
        warn('Dialog.get: Dialog[entity.name][scene] does not exist. scene: ' + scene);
        return;
    }
    var d = dSce[index];
    if (!existy(d)) {
        warn('Dialog.get: Dialog[entity.name][scene][index] does not exist. index: ' + index);
        return;
    }
    return d;
};

Dialog.show = function(entity, scene, index) {
    var dialog = Dialog.get(entity, scene, index);
    if (!existy(dialog))
        return;
    var text = dialog.text;
    var response = dialog.response;

    var i = 0;
    // Cycles through text array, spawning a speech bubble for each entry
    var speech = function(selected) {
        if (i < text.length) {
            Crafty.e('Speech').speech(entity, text[i], response[i]);
            i += 1;
        }
        // handle responses here
    };
    speech();
    Crafty.bind('CloseSpeech', speech);
    State.next(scene);
    console.log('Index: ' + State.getIndex(scene));
};


State = {
    scene: 'Room',
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
