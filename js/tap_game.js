var game = new Phaser.Game(500, 800, Phaser.AUTO, 'tap-game');

var newWidth;
var newHeight;
var paused = false;
var gameLength = 1;
var tapArray = [];
var kills = 0;
var score = 0;

var dripFreq = 3;
var showDripFreq = 1;

var font = {
    font: '25px Times New Roman',
    fill: '#ff00ff'
};

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

        var loadingLabel = game.add.text(newWidth / 2, newHeight / 2, 'LOADING...', font);

        //ALL ASSETS LOADED HERE
        game.load.image("valve", "assets/valve.png");
        game.load.image("drop", "assets/drop.png");
        game.load.image("play", "assets/play.png");
        game.load.image('black', "assets/black.png");
        game.load.image('twitter', "assets/tweet.png");
        game.load.audio('')
        //TODO: more graphics


    },
    create: function () {

        var loadingLabel = game.add.text(200, 400, 'DONE...', font);
        game.state.start('menu');
    }
}

//men
var menuState = {
    create: function () {
        game.stage.backgroundColor = "#2F95AA";

        var titleMain = game.add.text(200, 400, 'WHACK A TAP', font);
        var playButton = game.add.button(0, 0, 'play', pressedPlay, this);


    }
}

//PLAY that funky music white boy
var playState = {
    create: function () {

            //create
            var topBarY = newHeight / 6;
            var rest = newHeight - topBarY;

            for(var i = 0; i < 3; i++) for (var j = 0; j < 4; j++) {

                var x = (i * newWidth/3) + 10;
                var y = (j * rest / 4) + topBarY;

                var button = game.add.button(x, y, 'valve', buttonEvent, this);
                button.dripping = false;
                tapArray.push(button);

            }
             game.time.events.loop(dripFreq * 999, startDrip, this);
             game.time.events.loop(showDripFreq * 1000, makeDrops, this);
            game.stage.backgroundColor = "#2F95AA";

            //end
            game.time.events.add(1000 * gameLength, endGame, this);



    },
    update: function() {

    },
    render: function () {
        game.debug.text("");
    }
}

//Done
var doneState = {
    create: function() {
        game.stage.backgroundColor = "#2F95AA";

        var titleMain = game.add.text(200, 200, 'YOURE DONE KID', font);
        var titleTwo = game.add.text(200, 600, kills + ' VALVES GOTTEN', font);
        var playButton = game.add.button(100, 600, 'play', pressedMenu, this);
        var tweetbutton = game.add.button(0, 700, 'twitter', tweetMe, this);

    }
}

function startDrip() {
    //chose a random one to start dripping.
    var randNum = Math.floor(Math.random() * tapArray.length);
    tapArray[randNum].dripping = true;
    //TODO: start timer

}

function buttonEvent() {
    var button = arguments[0];
    if (button.dripping) {
    button.dripping = false;
    kills++;
    //TODO: stop timer, add score
    }
}

function makeDrops() {
    var i;
    for(i = 0; i < tapArray.length; i++){
        if(tapArray[i].dripping){
            var drop = game.add.sprite(tapArray[i].x+30, tapArray[i].y+30, 'drop');

            game.physics.enable(drop, Phaser.Physics.ARCADE);
            drop.body.bounce.y = 0.1;
            drop.body.collideWorldBounds = false;
            drop.body.gravity.y = 200;
        }
    }
}

function endGame() {
    game.state.start('done');
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

function tweetMe() {
    var twittertext = 'My Whack a Tap score today was ' + score + '! Try to beat me at http://project-water.ca.';
    var outTweet = 'http://twitter.com/home?status=' + twittertext;
    window.open(outTweet, '_blank');
}

//TODO: fadeblack effect



var pressedPlay = function () {
    game.state.start('play');
}

var pressedPause = function() {
    paused = true;
}

var pressedMenu = function() {
    game.state.start('menu');
}

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('done', doneState);
game.state.start('boot');