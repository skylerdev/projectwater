//Tap Game (Tap Turner, Whack A Tap)
var game = new Phaser.Game(500, 800, Phaser.AUTO, "tap-game");

const gameLength = 45;
const dripFreq = 2;
const showDripFreq = 1;
const maxTapsRunning = 4;

var newWidth;
var newHeight;
var paused = false;
var tapArray = [];
var dripSounds = [];
var faucetSounds = [];
var kills = 0;
var score = 0;
var scoreText;
var tier;
var tapsOn = 0;


var font = {
    font: "50px Times New Roman",
    fill: "#f5a3ff"
};

//boot
var bootState = {
    create: function() {
        //resize, arcade physics
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        resize();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        newWidth = game.canvas.width;
        newHeight = game.canvas.height;
        game.state.start("load");
    }
};

//load
var loadState = {
    preload: function() {
        let loadingLabel = game.add.text(newWidth / 3, newHeight / 3, "LOADING...", font);

        //ALL ASSETS LOADED HERE
        game.load.image("valve", "assets/valve.png");
        game.load.image("drop", "assets/drop.png");
        game.load.image("play", "assets/play.png");
        game.load.image("black", "assets/black.png");
        game.load.image("twitter", "assets/tweet.png");
        game.load.image("pipe", "assets/vertipipe.png")
        game.load.audio("drip0", "assets/drip6.mp3");
        game.load.audio("drip1", "assets/drip1.mp3");
        game.load.audio("drip2", "assets/drip2.mp3");
        game.load.audio("drip3", "assets/drip3.mp3");
        game.load.audio("drip4", "assets/drip4.mp3");
        game.load.audio("drip5", "assets/drip5.mp3");
        game.load.audio("faucet0", "assets/faucet1.mp3");
        game.load.audio("faucet1", "assets/faucet2.mp3");
        game.load.audio("music", "assets/tap_music.mp3");
        game.load.image("highscore", "assets/highscore.png");

        //TODO: more graphics
    },
    create: function() {
        game.state.start("menu");
    }
};

//menu
var menuState = {
    create: function() {
        game.stage.backgroundColor = "#2F95AA";

        let titleMain = game.add.text(10, 100, "WHACK A TAP", font);
        let playButton = game.add.button(0, 2 * newHeight / 5, "play", pressedPlay, this);

    }
};

//PLAY
var playState = {
    create: function() {


        game.stage.backgroundColor = "#2F95AA";

        var graphics = game.add.graphics(0, 0);

        //add audio
        for (let a = 0; a < 6; a++) {
            let sound = game.add.audio("drip" + a);
            sound.allowMultiple = true;
            dripSounds[a] = sound;
        }

        for (let b = 0; b < 2; b++) {
            let sound = game.add.audio("faucet" + b);
            sound.allowMultiple = true;
            faucetSounds[b] = sound;
        }

        let music = game.add.audio("music");
        music.play();


        //create
        let topHeight = newHeight / 6;
        let playHeight = newHeight - topHeight;

        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 4; j++) {
                let x = (i * newWidth / 3) + 10;
                let y = (j * playHeight / 4) + topHeight;
                //50 offset for the anchor point being set in middle
                let pipe = game.add.sprite(x, y, "pipe");
                let button = game.add.button(x + 70, y + 70, "valve", buttonEvent, this);
                button.anchor.setTo(0.5, 0.5);

                //create the buttons time
                button.timer = game.time.create(false);

                button.dripping = false;
                button.tween = game.add.tween(button).to({
                    angle: 0
                }, 1000);
                tapArray.push(button);
            }

        graphics.lineStyle(3, 0x003366, 1);

        graphics.drawRect(1, topHeight, newWidth - 1, newHeight - 1);




        //start drip timers
        game.time.events.loop(dripFreq * 999, startDrip, this);
        game.time.events.loop(showDripFreq * 1000, makeDrops, this);

        //end condition
        endtimer = game.time.events.add(1000 * gameLength, endGame, this);

        scoreText = game.add.text(newWidth / 3, 10, "SCORE: " + score);
        tapsText = game.add.text(10, 10, "TAPS: " + kills + "/22");

    },
    update: function() {
        //if at any time more than 5 taps dripping, loss condition
        let tapsOn = 0;
        for (let g = 0; g < tapArray.length; g++) {
            if (tapArray[g].dripping) {
                tapArray[g].angle += 1;
                tapsOn++;
            }
        }
        if (maxTapsRunning == tapsOn) {
            endGame();
        }

    },
    render: function() {
        scoreText.setText("SCORE: " + score);
        tapsText.setText("TAPS: " + kills + "/22");

    }
};

//Done
var doneState = {
    create: function() {
        game.stage.backgroundColor = "#2F95AA";

        let titleMain = game.add.text(newWidth / 10, newHeight / 5, "Game Over", font);
        let titleTwo = game.add.text(newWidth / 10, 2 * newWidth / 5, score + " score", font);
        let titleThree = game.add.text(newWidth / 10, 4 * newWidth / 5, "Way to go!", font);
        let tweetButton = game.add.button(newWidth / 10, newWidth, "twitter", tweetMe);
        let highscoreButton = game.add.button(newWidth / 10, newHeight - 100, "highscore", highscoreOpen);

        //score tiers are in increments of 10000, with 60,000 being theoretical max score (0.5 second reaction time!)
        let tier = Math.floor(score / 10000);
        if (tier > 5) {
            tier = 5;
        }

        if (!getCookie("username")) {
            game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
                alert("You are not signed in! Your score will not be saved.")
            }, this);
        }

        let username = getCookie("username");

        //highscore submit
        $.ajax({
            method: "POST",
            url: "tapphp.php",
            data: {
                username: username,
                score: score,
                tier: tier
            },
            dataType: "text",
            success: function(data) {
                console.log(data);
            }
        });

    }
};

function scoreTimerEnd() {
    if (score >= 3000) {
        score -= 3000;
    }

}

function tweetMe() {
    let twittertext = "My Whack a Tap score today was " + score + "! Try to beat me at http://www.project-water.ca. %23projectwaterapp";
    let outTweet = "http://twitter.com/home?status=" + twittertext;
    window.open(outTweet, "_blank");
}

function startDrip() {
    //chose a random one to start dripping
    var randNum = Math.floor(Math.random() * tapArray.length);
    tapArray[randNum].dripping = true;
    //add an event

    tapArray[randNum].timer.add(3000, scoreTimerEnd, this);
    tapArray[randNum].timer.start();
}

function buttonEvent() {
    var button = arguments[0];
    if (button.dripping) {
        kills++;
        button.dripping = false;

        //add remaining time on tap to score
        score = score + button.timer.duration;
        button.timer.stop(true);
        //TODO: show score gained

        faucetSounds[randomInt(faucetSounds.length)].play();
        button.tween.start();
    }
}

function highscoreOpen() {
    window.location.href = "http://project-water.ca/Games/ShooterGame/scores.html";
}


function makeDrops() {
    var i;
    for (i = 0; i < tapArray.length; i++) {
        if (tapArray[i].dripping) {
            var drop = game.add.sprite(tapArray[i].x + 30, tapArray[i].y + 30, "drop");

            game.physics.enable(drop, Phaser.Physics.ARCADE);
            drop.body.bounce.y = 0.1;
            drop.body.collideWorldBounds = true;
            drop.body.gravity.y = 200;

            drop.body.onWorldBounds = new Phaser.Signal();
            drop.body.onWorldBounds.add(hitWorldBounds, this);

        }
    }
}

function scoreDecrement() {
    //score--;
}

function hitWorldBounds() {
    arguments[0].destroy();
    var randNum = randomInt(5);
    dripSounds[randNum].play();
}

function endGame() {
    game.state.start("done");
}

function resize() {
    var canvas = game.canvas,
        width = window.innerWidth,
        height = window.innerHeight;
    var wratio = width / height,
        ratio = canvas.width / canvas.height;
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}


var pressedPlay = function() {
    game.state.start("play");
};

var pressedPause = function() {
    paused = true;
};

var pressedMenu = function() {
    game.state.start("menu");
};

game.state.add("boot", bootState);
game.state.add("load", loadState);
game.state.add("menu", menuState);
game.state.add("play", playState);
game.state.add("done", doneState);
game.state.start("boot");