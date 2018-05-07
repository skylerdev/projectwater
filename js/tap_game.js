var game = new Phaser.Game(500, 800, Phaser.AUTO, 'phaser-example', {
    preload: preload
    , create: create
    , update: update
});

var tapArray = [
    [],
    [],
    [],
    [],
];

function preload() {
    game.load.image("valve", "assets/valve.png");
    game.load.image("drop", "assets/drop.png");

}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    resize();



    for(var i = 0; i < 3; i++) for (var j = 0; j < 4; j++) {
        var x = i*150;
        var y = j*150;


        var image = game.add.sprite(x, y, 'valve');
        image.inputEnabled = true;
        image.events.onInputDown.add(clickListener, this);

        tapArray.push(image);
    }

    game.stage.backgroundColor = "#4488AA";

}

function update() {

}

function clickListener( ) {
    var drop = game.add.sprite(x, y, 'drop');

    game.physics.enable(drop, Phaser.Physics.ARCADE);

    drop.body.bounce.y = 0;
    drop.body.collideWorldBounds = true;
}



function resize() {
    var canvas = game.canvas
        , width = window.innerWidth
        , height = window.innerHeight;
    var wratio = width / height
        , ratio = canvas.width / canvas.height;
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    }
    else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}


