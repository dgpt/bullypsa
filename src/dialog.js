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
        '<br>Press space to continue.'
    ],
    response: [

    ]
};
Dialog.girl.room[1] = {
    text: [
        'what is this little baby?',
        'who is this little baby?',
        'move the little baby to the left.'
    ],
    response: [,,
        [
            'make me',
            'okay'
        ]
    ]
};

// USES GLOBALS: State.scene, State.index
// returns dialog array for current player, scene, and state index
// return value {text: [], response: [[]]}
Dialog.getDialog = function(entity) {
    if (!existy(entity.name))
        fail('Dialog.getDialog: entity.name does not exist.');

    var dialog = Dialog[entity.name][State.scene.lowerFirst()][State.index[State.scene]];

    if (!existy(dialog))
        fail('Dialog.getDialog: Could not locate specified dialog. Name: ' + entity.name + ' Scene: ' +State.scene+' Index: ' + State.index);
    return dialog;
};

Dialog.showDialog = function(entity) {
    var dialog = Dialog.getDialog(entity);
    var text = dialog.text;
    var response = dialog.response;
    // may have to replace this with an event system.
    for (var i = 0; i < text.length; i++) {
        console.log(i);
        Crafty.e('Speech').speech(entity, text[i], response[i]);
    }
    State.index[State.scene] += 1;
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
    }
};
