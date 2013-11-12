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
        'Move left with the left arrow key or A. '+
        'Move right with the right arrow key or D.'+
        '<br>Press space to continue.'+br+
        'more text yo it\'s getting crazy up in here'+br+
        'yoyoyo is this crazay text ever going to stop?'+br+
        'no son, it aint'
    ],
    response: [

    ]
};
Dialog.girl.room[1] = {
    text: [
        'small text',
        'longer text yes woo',
        'even longer text awaits you here'
    ],
    response: [,,
        [
            'pineapples',
            'mangos',
            'kittens'
        ]
    ]
};

Dialog.girl.room[2] = {
    text: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla feugiat dolor ligula, sed lobortis eros interdum vel. Vestibulum at lorem eros.',
        'Ut consectetur, mauris at placerat tincidunt, neque diam ultrices lectus',
        'pulvinar interdum massa'+br+
        'pulvinar interdum massa',
        'pulvinar interdum massa'+br+
        'pulvinar interdum massa'+br+
        'pulvinar interdum massa',
        'pulvinar interdum massa'+br+
        'pulvinar interdum massa'+br+
        'pulvinar interdum massa'+br+
        'pulvinar interdum massa',
    ],
    response: [[
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla feugiat dolor ligula, sed lobortis eros interdum vel. Vestibulum at lorem eros.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla feugiat dolor ligula, sed lobortis eros interdum vel. Vestibulum at lorem eros.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla feugiat dolor ligula, sed lobortis eros interdum vel. Vestibulum at lorem eros.',
    ]],
};

Crafty.bind('SelectedOption0', () => console.log('yay'));

// USES GLOBALS: State.scene, State.index
// returns dialog array for current player, scene, and state index
// return value {text: [], response: [[]]}
Dialog.getDialog = function(entity) {
    if (!existy(entity.name))
        fail('Dialog.getDialog: entity.name does not exist.');

    var scene = State.scene;
    var index = State.index;
    if (State.index[scene] >= Dialog[scene.lowerFirst()])
        return null;
    else
        return Dialog[entity.name][scene.lowerFirst()][index[scene]];
};

Dialog.showDialog = function(entity) {
    var dialog = Dialog.getDialog(entity);
    if (!existy(dialog))
        return;
    var text = dialog.text;
    var response = dialog.response;

    var i = 0;
    var speech = function(selected) {
        if (i < text.length) {
            Crafty.e('Speech').speech(entity, text[i], response[i]);
            i += 1;
        }
        // handle responses here
    };
    speech();
    Crafty.bind('CloseSpeech', speech);
    State.index[State.scene] += 1;
    console.log('Index: ' +State.index[State.scene]);
};


State = {
    scene: 'Room',
    player: 'Girl',
    index: {
        'Room': 1,
        'Street': 0,
        'Corridor': 0,
        'Park': 0,
        'Library': 0,
        'Classroom': 0
    },
    next: function() {
        State.index[State.scene]++;
    },
    config: function() {
        return State['_'+State.player.lowerFirst()]();
    },

    _girl: function() {
        return {
            roomAccess: true
        };
    },

    _boy: function() {
        return {
            roomAccess: false
        };
    }
};
