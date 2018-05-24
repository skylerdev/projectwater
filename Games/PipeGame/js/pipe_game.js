var game = new Phaser.Game(384, 576, Phaser.AUTO, 'gameContainer');

//Boot state
var bootState = {
	create: function () {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		resize();
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('load');
	}
};

//Current background music
var curBgMusic;

//Load state
var loadState = {
	preload: function () {
		var loadingLabel = game.add.text(game.canvas.width / 2, game.canvas.height / 2, 'LOADING...', {
			font: '20px Comic Sans'
			, fill: '#ffff00'
		});
		game.load.tilemap('map', 'assets/images/Pipes_Galore.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('Pipe_Sheet_Transparent', 'assets/images/Pipe_Sheet_Transparent_v2.png');
		game.load.image('Hidden_Pipe', 'assets/images/Hidden_Pipe.png');
		game.load.image('Pipe_Goals', 'assets/images/Pipe_Goals.png');
		game.load.image('Water_Sheet_Transparent', 'assets/images/Water_Sheet_Transparent.png');
		game.load.image('button', 'assets/images/Fast_Flow.png');
		game.load.image('Pause_Button', 'assets/images/Pause_Button.png');
		game.load.image('Pause_Background', 'assets/images/Pause_Background.png');
		game.load.image('Game_Start_Bg', 'assets/images/Semi_Background2.png');
    game.load.image('Start_Page', 'assets/images/Start_Page.png');
		game.load.image('start', 'assets/images/Start.png');
    game.load.image('howtopage', 'assets/images/How_To.png');
    game.load.image('howto', 'assets/images/How_To_Button.png');
		game.load.image('Bad_Pipe', 'assets/images/Bad_Pipe.png');
		game.load.image('Bonus_Pipe', 'assets/images/Bonus_Pipe.png');
    game.load.image('Mod_Pipes', 'assets/images/Mod_Pipes.png');
    game.load.image('Start_Pipe', 'assets/images/Start_Pipe.png');
		game.load.image('board', 'assets/images/Game_Board_v5.png');
    game.load.spritesheet('Timer_Bar', 'assets/images/Timer_Bar_Sheet.png', 160, 32, 37);
    game.load.image('Round_Complete', 'assets/images/Round_Complete.png');
		game.load.image('Tweet', 'assets/images/Twitter_Bird_v2.png');
		game.load.image('Continue', 'assets/images/Continue.png');
		game.load.audio('click', 'assets/sounds/click (3).mp3');
		game.load.audio('flip', 'assets/sounds/flip_trim (2).mp3');
		game.load.audio('click_voice', 'assets/sounds/click_voice (1).mp3');
		game.load.audio('swoosh', 'assets/sounds/swoosh (3).mp3');
		game.load.audio('eEgg', 'assets/sounds/egg_active (3).mp3');
		game.load.audio('bgMusic', 'assets/sounds/Eric_Skiff_-_06_-_Searching.mp3');
		game.load.audio('bgMusicEgg', 'assets/sounds/Monplaisir_-_03_-_Level_0.mp3');
	}
	, create: function () {
	    curBgMusic = game.add.audio('bgMusic');
	    curBgMusic.loopFull();
		game.state.start('menu');
	}
}

//Start Menu state
var menuState = {
	create: function () {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		
		game.add.tileSprite(0,0,384,576,'Start_Page');
		eEgg = game.add.audio('eEgg');
		/*game.add.text(game.world.centerX - 110, 150, 'Swapping Pipes', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});*/
		game.add.button(97, 284, 'start', this.start, this);
        game.add.button(97, 356, 'howto', this.howto, this);
		game.input.onDown.add(function () {
			tapCounter++;
			if (tapCounter == 5) {
			updateEgg();
			eEgg.play();
			curBgMusic.destroy();
			curBgMusic = game.add.audio('bgMusicEgg');
			curBgMusic.loopFull();
		}}, this);
	},
	start: function () {
		game.state.start('play');
	},
	howto: function () {
		game.state.start('howTo');
    
	}
};

//Game how to state
var howToState = {
  create: function () {
    game.add.tileSprite(0,0,384,576,'howtopage');
    var howToCounter = 0;
    var image;
    var text = "Swap tiles on the board\nwith the tile in your swap\nslot to create a path to\nthe end.The STARTING\nPIPE will always be on the\nbottom and the ENDING\nPIPE will always be on\nthe top.";
    var howToText = game.add.text(75, 150, text, {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
    game.add.text(80, 450, "Tap to continue", {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
    game.input.onDown.add(function () { 
      howToCounter ++; 
      flip = game.add.audio('flip');
      flip.play();
      if(howToCounter == 1){
        howToText.setText("Points are earned by: \nCompleting the path\nBeing quick\nSwapping as few times as\npossible\nUncovering as few pipes\nas possible");
      }else if(howToCounter == 2){
        howToText.setText("Watch out for stuck\npipes! You won't be\nable to swap them out.");
        image = game.add.image(game.world.centerX -30, 250, 'Bad_Pipe');
      }else if(howToCounter == 3){
				image.destroy();
        howToText.setText("Try to divert the flow\nover the bonus tiles for\nbonus points!");
        image = game.add.image(game.world.centerX -30, 250, 'Bonus_Pipe');
      }else if(howToCounter == 4){
        image.destroy();
        image = game.add.image(game.world.centerX -30, 325, 'Start_Pipe');
        howToText.setText("Act fast! The water flows\nshortly after you make a\nmove. Be sure to put a\npipe at the STARTING\nPIPE!");
      }else if(howToCounter == 5){
        game.state.start('menu');
      }
    });
  }
}

//Tile Layers
var map, layer1, layer2, layer3, layer4, layer5, marker, swapGraphics;

//Pipe Types and swapping
var swapSlot, tempPipe, startPipe, endPipe, curPipe, flowStarted;

//Scoring
var playCounter = 0
	, winCount = 0
	, loseCount = 0
	, score = 0
	, coveredTileCount = 0
	, moves = 0
	, bonus = 0
	, threshold = 0;
	
//Time
var time = 0;

//Timers
var animateTimer, startFlowTimer, flowTimer, timeIncrementer, timerBar, flowStarted;

//For loop variables
var xCo, yCo;

//Main Audio
var click, flip;

//Easter Egg
var clickV, swoosh, eEgg, eggActive, tapCounter = 0;

//Debugging
var thisTileData;

//Flow Speed
var animateSpeed, flowSpeed;

//Text on round start
var gameStartButton, gameStartText;
//Pausing
var pauseBtn,
    pauseBG,
    unpauseBtn;
    
//Play state
var playState = {
	create: function () {
	    //Background Image
		game.add.tileSprite(0, 0, 384, 576, 'board');
		
		//Game Tilesets
		map = game.add.tilemap('map');
		map.addTilesetImage('Pipe_Sheet_Transparent');
		map.addTilesetImage('Hidden_Pipe');
		map.addTilesetImage('Pipe_Goals');
		map.addTilesetImage('Water_Sheet_Transparent');
        map.addTilesetImage('Mod_Pipes');
        
        //Board Layers
        layer4 = map.createLayer('Tile Layer 4');
		layer1 = map.createLayer('Tile Layer 1');
		layer5 = map.createLayer('Tile Layer 5');
		layer5.alpha = 0.5;
		layer2 = map.createLayer('Tile Layer 2');
		layer3 = map.createLayer('Tile Layer 3');
		layer1.resizeWorld();
		
		//Cursor Location
		marker = game.add.graphics();
		marker.lineStyle(2, 0xffffff);
		marker.drawRect(0, 0, 64, 64);
		marker.x = layer1.getTileX(0) * 64;
		marker.y = layer1.getTileY(128) * 64;
		
		swapGraphics = game.add.graphics();
		swapGraphics.lineStyle(2, 0xff4500);
		swapGraphics.drawRect(32, 32, 64, 64);
		
		
		pauseBtn = game.add.button(320, 0, 'Pause_Button', pause, this);
		
		game.input.onDown.add(getTemp, this);
		game.input.onUp.add(swapTilesNow, this);
		swapSlot = map.getTile(layer3.getTileX(1 * 64), layer3.getTileY(1 * 64), 'Tile Layer 3').index;
		
		animateSpeed = 0.17;
		flowSpeed = 3.1;
		click = game.add.audio('click');
		click.allowMultiple = true;
		flip = game.add.audio('flip');
		flip.allowMultiple = true;
		clickV = game.add.audio('click_voice');
		clickV.allowMultiple = true;
		swoosh = game.add.audio('swoosh');
		swoosh.allowMultiple = true;
		coveredTileCount = 36;
		randomizeBoard();
		game.canvas.margin = "0px";
		
    
        flowStarted = false;
        map.putTile(10, layer1.getTileX((Math.floor(Math.random() * 3)) * 64), layer1.getTileY(8 * 64), 'Tile Layer 1');
		
		game.add.button(192, 512, 'button', fastFlow, this);
		findEnd();
		timerBar = game.add.sprite(208, 528, "Timer_Bar");
		timerBar.animations.add('startTimer');
		flowStarted = false;
		
		gameStartButton = game.add.button(0,0,"Game_Start_Bg", function(){
		    startFlowTimer = game.time.events.add(Phaser.Timer.SECOND * 7, startFlow, this);
            timerBar.animations.play('startTimer', 5, false);
            flowStarted = true;
            timeIncrementer = game.time.events.loop(Phaser.Timer.SECOND, function () {
			time++;
		}, this);
		    gameStartButton.destroy();
		}, this);
	}
	, update: function () {
		updateMarker();
		//Debugging
		/*
		if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
			getTileProperties();
			console.log(map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index, 'Tile Layer 1');
		}
		*/
		if (map.getTile(layer1.getTileX(endPipe.x * 64), layer1.getTileY(endPipe.y * 64), 'Tile Layer 1').properties.inFlow == "down") {
		gameWin();
	}
	}
	, Win: function () {
		game.state.start('win');
	}
	, Lose: function () {
		game.state.start('lose');
	}
	, complete: function () {
		game.state.start('complete');
	}
	, render: function () {
		game.debug.text("Time:", game.world.centerX - 50, 30);
		game.debug.text(time, game.world.centerX - 42, 48);
	}
}

//Win state
var winState = {
	create: function () {
    game.add.tileSprite(0,0,384,576,'Round_Complete');
		game.add.text(game.world.centerX - 60, 150, 'You Win', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 110, 200, 'Tap The Screen\n   To Continue', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.input.onDown.add(this.restart, this);
	}
	, restart: function () {
		game.state.start('play');
	}
}

//Lose state
var loseState = {
	create: function () {
    game.add.tileSprite(0,0,384,576,'Round_Complete');
		game.add.text(game.world.centerX - 60, 150, 'You Lose', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 110, 200, 'Tap The Screen\n   To Continue', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.input.onDown.add(this.restart, this);
	}
	, restart: function () {
		game.state.start('play');
	}
}

//Game completion state
var completeState = {
	create: function () {
    game.add.tileSprite(0,0,384,576,'Round_Complete');
		calculateScore();
		var username = getCookie("username");
		$.ajax({
      method: "POST",
      url: "PipePHP.php",
      data: {username: username, score: score, tier: threshold},
      dataType: "text",
      success: function(data){
          console.log(data);
          console.log("Ajax Success");
      },
      error: function(data){
          console.log("Ajax Error");
      }
    });
		game.add.text(game.world.centerX - 110, 100, 'Game Complete', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
    game.add.text(game.world.centerX - 110, 130, 'Score', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 110, 170, 'Win: (' + winCount + ') x 100 = ' + (winCount * 100)+'\nLoss: (' + loseCount + ") x -50 = " + (loseCount * -50)+'\nTime: (100 - ' + time + ") x 1 = " + (100 - time)+'\nMoves: (50 - ' + moves + ") x 2 = " + (50 - moves) * 2 + '\nEfficiency: (' + coveredTileCount + ") x 2 = " + (coveredTileCount * 2)+'\nBonus: (' + bonus + ") x 15 = " + (bonus * 15)+'\nTotal: ' + score, {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
		if(!getCookie("username")){
     game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {alert("You aren't signed in! Your score will not be saved.")}, this);
    }
		
		game.add.button(256, 448, 'Tweet', tweetMe, this)/*.scale.setTo(0.205, 0.205)*/;
		game.add.button(64, 448, 'Continue' ,this.return , this);
	},
	return: function () {
		window.location.href = 'http://project-water.ca/Games/ShooterGame/scores.html';
	}
}

//Updates the easter egg mode
function updateEgg() {
	eggActive = true;
}

//Gets the index of the clicked tile for use in swapping
function getTemp() {
	updateMarker();
	if (game.input.activePointer.worldY > 128 && game.input.activePointer.worldY < 512) {
		tempPipe = map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y), 'Tile Layer 1').index;
	}
}

//Handles swapping tiles
function swapTilesNow() {
	if (game.input.activePointer.worldY > 128 && game.input.activePointer.worldY < 512 && game.paused == false) {
		if (map.getTile(layer2.getTileX(marker.x), layer2.getTileY(marker.y), 'Tile Layer 2').index == 8) {
			map.putTile(9, layer2.getTileX(marker.x), layer2.getTileY(marker.y), 'Tile Layer 2');
			coveredTileCount--;
			if (eggActive) {
				swoosh.play();
			}
			else {
				flip.play();
			}
		}else if(map.getTile(layer5.getTileX(marker.x), layer5.getTileY(marker.y), 'Tile Layer 5') != null && map.getTile(layer5.getTileX(marker.x), layer5.getTileY(marker.y), 'Tile Layer 5').index == 312) {
			console.log("Hello");
		}else {
			if (swapSlot != tempPipe && map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y), 'Tile Layer 1').index == tempPipe && map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y), 'Tile Layer 1').properties.inFlow == "") {
				map.putTile(tempPipe, layer3.getTileX((1 * 64)), layer3.getTileY((1 * 64)), 'Tile Layer 3');
				map.putTile(swapSlot, layer1.getTileX(marker.x), layer1.getTileY(marker.y), 'Tile Layer 1');
				swapSlot = map.getTile(layer3.getTileX((1 * 64)), layer3.getTileY((1 * 64)), 'Tile Layer 3').index;
				moves++;
				if (eggActive) {
					clickV.play();
				}
				else {
					click.play();
				}
			}
		}
	}
}

//Debugging
/*
function getTileProperties() {
	var x = layer1.getTileX(game.input.activePointer.worldX);
	var y = layer1.getTileY(game.input.activePointer.worldY);
	var tile = map.getTile(x, y, layer1);
	thisTileData = JSON.stringify(tile.properties.inFlow);
}
*/

//Updates cursor square
function updateMarker() {
    if(game.paused == false){
        marker.x = layer1.getTileX(game.input.activePointer.worldX) * 64;
    	marker.y = layer1.getTileY(game.input.activePointer.worldY) * 64;
    }
	
}

//Debugging purposes
/*
function render() {
	if (thisTileData) {
		game.debug.text(thisTileData, 0, 32);
	}
	else {
		game.debug.text("Click on a tile!", 16, 490);
	}
}
*/

//Randomizes the game board
function randomizeBoard() {
	for (xCo = 0; xCo < 6; xCo++) {
		for (yCo = 2; yCo < 8; yCo++) {
				map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64), 'Tile Layer 1').index = Math.floor(Math.random() * 7) + 1;
		}
	}
	for(let i = 0; i <= playCounter; i++){
  	genBadPipes();
	}
	genBonusPipes();
}

//Generates the red modifier tile locations
function genBadPipes() {
  var xPos = Math.floor(Math.random() * 5);
  var yPos = Math.floor(Math.random() * 4) + 3;
  map.putTile(312, layer5.getTileX(xPos * 64), layer5.getTileY(yPos * 64), 'Tile Layer 5');
}

//Generates the green modifier tile locations
function genBonusPipes() {
	var xPos = Math.floor(Math.random() * 6);
  var yPos = Math.floor(Math.random() * 6) + 2;
  map.putTile(313, layer5.getTileX(xPos * 64), layer5.getTileY(yPos * 64), 'Tile Layer 5');
}

//Finds the end 
function findEnd() {
  yCo = 1;
  map.putTile(11, layer1.getTileX((Math.floor(Math.random() * 4) + 2) * 64), layer1.getTileY(1 * 64), 'Tile Layer 1');
  for (xCo = 0; xCo < 6; xCo++) {
		if (map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64), 'Tile Layer 1') != null && map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64), 'Tile Layer 1').index == 11) {
      endPipe = map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64), 'Tile Layer 1');
			endPipe.properties.inFlow = "";
    }
  }
}

//Finds the start pipe and send an inflow signal to the next pipe.
function startFlow() {
	yCo = 8;
  
	for (xCo = 0; xCo < 6; xCo++) {
		if (map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64), 'Tile Layer 1') != null && map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64), 'Tile Layer 1').index == 10) {
			map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY((yCo - 1) * 64), 'Tile Layer 1').properties.inFlow = "down";
			curPipe = map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY((yCo - 1) * 64), 'Tile Layer 1');
			animateFlow(curPipe);
			checkIfFlowable(curPipe);
			timerBar.destroy();
			flowTimer = game.time.events.loop(Phaser.Timer.SECOND * flowSpeed, runFlow, this);
		}
	}
  flowStarted = true;
}

//Checks if the game has been won or continues the flow signal if it hasn't been won
function runFlow() {
	if (map.getTile(layer1.getTileX(endPipe.x * 64), layer1.getTileY(endPipe.y * 64), 'Tile Layer 1').properties.inFlow == "down") {
		gameWin();
	}
	else {
		flow(curPipe);
	}
}

//Sends flow signals along the pipes
function flow(inTile) {
	switch (inTile.index) {
	case 1:
		if (inTile.properties.inFlow == "right") {
			if(map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1').properties.inFlow = "up";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "down") {
			if(map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1').properties.inFlow = "left";
			curPipe = map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		break;
	case 2:
		if (inTile.properties.inFlow == "right") {
			if(map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1').properties.inFlow = "right";
			curPipe = map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "left") {
			if(map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1').properties.inFlow = "left";
			curPipe = map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		break;
	case 3:
		if (inTile.properties.inFlow == "left") {
			if(map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1').properties.inFlow = "up";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "down") {
			if(map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1').properties.inFlow = "right";
			curPipe = map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		break;
	case 4:
		if (inTile.properties.inFlow == "up") {
			if(map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1').properties.inFlow = "up";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "down") {
			if(map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1').properties.inFlow = "down";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		break;
	case 5:
		if (inTile.properties.inFlow == "up") {
			if(map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1').properties.inFlow = "left";
			curPipe = map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "right") {
			if(map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1').properties.inFlow = "down";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		break;
	case 6:
		if (inTile.properties.inFlow == "up") {
			if(map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1').properties.inFlow = "right";
			curPipe = map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "left") {
			if(map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1').properties.inFlow = "down";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		break;
	case 7:
		if (inTile.properties.inFlow == "left") {
			if(map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1').properties.inFlow += "left";
			curPipe = map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "right") {
			if(map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1').properties.inFlow += "right";
			curPipe = map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "up") {
			if(map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1').properties.inFlow += "up";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
		else if (inTile.properties.inFlow == "down") {
			if(map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1') != null){
				map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1').properties.inFlow += "down";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64), 'Tile Layer 1');
			}else {
				gameLose();
			}
			
		}
	}
	if(map.getTile(layer5.getTileX(curPipe.x * 64), layer5.getTileY(curPipe.y * 64), 'Tile Layer 5') != null && map.getTile(layer5.getTileX(curPipe.x * 64), layer5.getTileY(curPipe.y * 64), 'Tile Layer 5').index == 313){
		bonus++;
	}
	checkIfFlowable(curPipe);
	animateFlow(curPipe);
}

//Checks if the next pipe can accept the type of inflow
function checkIfFlowable(inTile) {
	if (inTile.index == 1) {
		if (!(inTile.properties.inFlow == "right" || inTile.properties.inFlow == "down")) {
			gameLose();
		}
	}
	else if (inTile.index == 2) {
		if (!(inTile.properties.inFlow == "right" || inTile.properties.inFlow == "left")) {
			gameLose();
		}
	}
	else if (inTile.index == 3) {
		if (!(inTile.properties.inFlow == "down" || inTile.properties.inFlow == "left")) {
			gameLose();
		}
	}
	else if (inTile.index == 4) {
		if (!(inTile.properties.inFlow == "up" || inTile.properties.inFlow == "down")) {
			gameLose();
		}
	}
	else if (inTile.index == 5) {
		if (!(inTile.properties.inFlow == "right" || inTile.properties.inFlow == "up")) {
			gameLose();
		}
	}
	else if (inTile.index == 6) {
		if (!(inTile.properties.inFlow == "up" || inTile.properties.inFlow == "left")) {
			gameLose();
		}
	}
}

//Checks the index of the pipe and animates accordingly
function animateFlow(inTile) {
	var animFrame;
	switch (inTile.index) {
	case 1:
		if (inTile.properties.inFlow == "down") {
			animFrame = 12;
		}
		else if (inTile.properties.inFlow == "right") {
			animFrame = 27;
		}
		break;
	case 2:
		if (inTile.properties.inFlow == "left") {
			animFrame = 42;
		}
		else if (inTile.properties.inFlow == "right") {
			animFrame = 57;
		}
		break;
	case 3:
		if (inTile.properties.inFlow == "left") {
			animFrame = 72;
		}
		else if (inTile.properties.inFlow == "down") {
			animFrame = 87;
		}
		break;
	case 4:
		if (inTile.properties.inFlow == "down") {
			animFrame = 102;
		}
		else if (inTile.properties.inFlow == "up") {
			animFrame = 117;
		}
		break;
	case 5:
		if (inTile.properties.inFlow == "up") {
			animFrame = 132;
		}
		else if (inTile.properties.inFlow == "right") {
			animFrame = 147;
		}
		break;
	case 6:
		if (inTile.properties.inFlow == "left") {
			animFrame = 162;
		}
		else if (inTile.properties.inFlow == "up") {
			animFrame = 177;
		}
		break;
	case 7:
		if (inTile.properties.inFlow == "up") {
			if (inTile.properties.passed == true) {
				animFrame = 192;
			}
			else {
				animFrame = 222;
				inTile.properties.passed = true;
			}
		}
		else if (inTile.properties.inFlow == "down") {
			if (inTile.properties.passed == true) {
				animFrame = 237;
			}
			else {
				animFrame = 207;
				inTile.properties.passed = true;
			}
		}
		else if (inTile.properties.inFlow == "left") {
			if (inTile.properties.passed == true) {
				animFrame = 282;
			}
			else {
				animFrame = 252;
				inTile.properties.passed = true;
			}
		}
		else if (inTile.properties.inFlow == "right") {
			if (inTile.properties.passed == true) {
				animFrame = 297;
			}
			else {
				animFrame = 267;
				inTile.properties.passed = true;
			}
		}
	}
	animateTimer = game.time.events.repeat(Phaser.Timer.SECOND * animateSpeed, 15, function () {
		map.putTile(animFrame, layer4.getTileX(inTile.x * 64), layer4.getTileY(inTile.y * 64));
		animFrame++;
	}, this);
}

//Counts up the wins and transfers over to the complete state if 3 games have been played
function gameWin() {
	playCounter++;
	winCount++;
	console.log("You won!");
	if (playCounter < 3) {
		game.state.start('win');
	}
	else {
		game.state.start('complete');
	}
}

//Counts up the losses and transfers over to the complete state if 3 games have been played
function gameLose() {
	playCounter++;
	loseCount++;
	console.log("You lose...");
	if (playCounter < 3) {
		game.state.start('lose');
	}
	else {
		game.state.start('complete');
	}
}

//Calculates the final score
function calculateScore() {
	score = winCount * 100 + loseCount * -50 + (coveredTileCount * 2) + (100 - time) + (50 - moves) * 2 + (bonus * 15);
}

//Activates the fast flow mode
function fastFlow() {
  if(flowTimer != null && flowStarted){
    game.time.events.remove(flowTimer);
	animateSpeed = 0.01;
	flowSpeed = 0.19;
	try {animateTimer.delay = Phaser.Timer.SECOND * animateSpeed;}
		
	catch (error) {console.log("Animation not started. " + error);}
		
	
    game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {flowTimer = game.time.events.loop(Phaser.Timer.SECOND * flowSpeed, runFlow, this);}, this);
    
	
  game.time.events.remove(timeIncrementer);
}
}

//Handles pausing
function pause() {
    game.paused = true;
    pauseBG = game.add.image(0,0,'Pause_Background');
    pauseText = game.add.text(game.world.centerX - 54, game.world.centerY, 'PAUSED', {
			font: '20px Comic Sans'
			, fill: '#ffff00'
		});
    unpauseBtn = game.add.button(320,0,'Pause_Button', unpause, this);
    pauseBtn.inputEnabled = false;
}

//Handles getting out of the pause mode
function unpause() {
    game.paused = false;
    pauseBG.destroy();
    pauseText.destroy();
    unpauseBtn.destroy();
    pauseBtn.inputEnabled = true;
}

//Makes a cookie
/*
function makeCookie3(name, content) {
  var d = new Date();
  d.setTime(d.getTime() + (5 * 24 * 60 * 60 * 1000));

  var expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + content + ";" + expires + ";path=/";
}
*/

//Gets a cookie
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
	return "";
}

//Handles tweeting
function tweetMe() {
	var twittertext = 'My Piping Paths score today was ' + score + '! Try to beat me at www.project-water.ca. %23projectwaterapp';
	var outTweet = 'http://twitter.com/home?status=' + twittertext;
	window.open(outTweet, '_blank');
}

//Handles window resizing
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
		canvas.style.height = height+ "px";
	}
	
}

//Game states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('howTo', howToState);
game.state.add('play', playState);
game.state.add('win', winState);
game.state.add('lose', loseState);
game.state.add('complete', completeState);
game.state.start('boot');