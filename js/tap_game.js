var game = new Phaser.Game(500, 800, Phaser.AUTO, 'tap-game');

var newWidth;
var newHeight;
var paused = false;

//boot
var bootState = {
    create: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        resize();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        newWidth = game.canvas.width;
        newHeight = game.canvas.height;
        game.state.start('load');
    }
};

//load
var loadState = {
    preload: function () {

        var loadingLabel = game.add.text(newWidth / 2, newHeight / 2, 'LOADING...', {
            font: '20px Comic Sans'
            , fill: '#ff0000'
        });

        //ALL ASSETS LOADED HERE

        game.load.image("valve", "assets/valve.png");
        game.load.image("drop", "assets/drop.png");
        game.load.image("play", "assets/play.png");


    },
    create: function () {

     var done = game.add.text(newWidth/2 +100  , newHeight/2 + 100, 'DONE :)');
     game.state.start('menu');

    }
}

//menu
var menuState = {
    create: function () {
        game.stage.backgroundColor = "#2F95AA";

        var titleMain = game.add.text(game.canvas.width / 2, game.canvas.height / 2, 'WHACK A TAP', {
            font: '25 px Times New Roman',
            fill: '#ff00ff'
        });
        var playButton = game.add.button(0, 0, 'play', pressedPlay, this);

    },
}

//variables for playstate
var time = 0;


//PLAY that funky music white boy
var playState = {
    create: function () {

            //create
            for(var i = 0; i < 3; i++) for (var j = 0; j < 4; j++) {
                //add
                var image = game.add.sprite(0, 0, 'valve');
                //calc and set pos
                var x = i*image.width;
                var y = j*image.height;
                image.x = x;
                image.y = y;

                image.inputEnabled = true;
                image.events.onInputDown.add(clickListener, this);


            }

            //pausebutton
            var pause = game.add.button(0, 0, 'valve', pressedPause, this);
            pause.width = 50;
            pause.height = 50;
            pause.x = game.width-50;
            pause.y = game.height-50;


            game.stage.backgroundColor = "#2F95AA";


    },
    update: function () {
        time++;
        if(time > 500){
            game.state.start('done');
        }

    }
}

var doneState = {
    create: function() {

    }
}

function pauseGame() {


}

function clickListener() {
    var drop = game.add.sprite(0, 0, 'drop');

    game.physics.enable(drop, Phaser.Physics.ARCADE);
    drop.body.bounce.y = 0.1;
    drop.body.collideWorldBounds = true;
    drop.body.gravity.y = 200;

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

var pressedPlay = function () {
    game.state.start('play');
}

var pressedPause = function() {
    paused = true;
}


game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('done', doneState);
game.state.start('boot');