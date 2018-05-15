var game = new Phaser.Game(384, 576, Phaser.AUTO, 'gameContainer');
var bootState = {
	create: function () {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		resize();
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('load');
	}
};
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
    game.load.image('Start_Page', 'assets/images/Start_Page.png');
		game.load.image('start', 'assets/images/Start.png');
    game.load.image('howtopage', 'assets/images/How_To.png');
    game.load.image('howto', 'assets/images/How_To_Button.png');
    game.load.image('Bad_Pipe', 'assets/images/Bad_Pipe.png');
    game.load.image('Start_Pipe', 'assets/images/Start_Pipe.png');
		game.load.image('board', 'assets/images/Game_Board_v4.png');
    game.load.image('Round_Complete', 'assets/images/Round_Complete.png');
		game.load.audio('click', 'assets/sounds/click.mp3');
		game.load.audio('flip', 'assets/sounds/flip_trim.mp3');
		game.load.audio('click_voice', 'assets/sounds/click_voice.mp3');
		game.load.audio('swoosh', 'assets/sounds/swoosh.mp3');
		game.load.audio('eEgg', 'assets/sounds/egg_active.mp3');
	}
	, create: function () {
		game.state.start('menu');
	}
}
var menuState = {
	create: function () {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.add.tileSprite(0,0,384,576,'Start_Page');
		eEgg = game.add.audio('eEgg');
		/*game.add.text(game.world.centerX - 110, 150, 'Swapping Pipes', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});*/
		game.add.button(97, 290, 'start', this.start, this);
    game.add.button(97, 365, 'howto', this.howto, this);
		game.input.onDown.add(function () {
			tapCounter++;
			if (tapCounter == 5) {
			updateEgg();
			eEgg.play();
		}}, this);
	},
	start: function () {
		game.state.start('play');
	},
	howto: function () {
		game.state.start('howTo');
    
	}
};
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
      if(howToCounter == 1){
        howToText.setText("Points are earned by: \nCompleting the path\nBeing quick\nSwapping as few times as\npossible\nUncovering as few pipes\nas possible");
      }else if(howToCounter == 2){
        howToText.setText("Watch out for stuck\npipes! You won't be\nable to swap them out.");
        image = game.add.image(game.world.centerX -32, 250, 'Bad_Pipe');
      }else if(howToCounter == 3){
        image.destroy();
        image = game.add.image(game.world.centerX -32, 325, 'Start_Pipe');
        howToText.setText("Act fast! The water\nflows shortly after\nstarting a round. Be sure\nto put a pipe at\nthe STARTING PIPE.");
      }else if(howToCounter == 4){
        game.state.start('menu');
      }
    });
  }
}
var map, layer1, layer2, layer3, layer4, layer5, marker, swapGraphics;
var swapSlot, tempPipe, startPipe, endPipe, curPipe, flowStarted;
var playCounter = 0
	, winCount = 0
	, loseCount = 0
	, score = 0
	, coveredTileCount = 0
	, moves = 0;
var time = 0;
var animateTimer, flowTimer, timeIncrementer;
//For loop variables
var xCo, yCo;
//Main Audio
var click, flip;
//Easter Egg
var clickV, swoosh, eEgg, eggActive, tapCounter = 0;
//Debugging
var thisTileData;
var animateSpeed, flowSpeed;
var playState = {
	create: function () {
		
		game.add.tileSprite(0, 0, 384, 576, 'board');
		map = game.add.tilemap('map');
		map.addTilesetImage('Pipe_Sheet_Transparent');
		map.addTilesetImage('Hidden_Pipe');
		map.addTilesetImage('Pipe_Goals');
		map.addTilesetImage('Water_Sheet_Transparent');
    map.addTilesetImage('Bad_Pipe');
    layer4 = map.createLayer('Tile Layer 4');
		layer1 = map.createLayer('Tile Layer 1');
		layer5 = map.createLayer('Tile Layer 5');
		layer5.alpha = 0.5;
		layer2 = map.createLayer('Tile Layer 2');
		layer3 = map.createLayer('Tile Layer 3');
		layer1.resizeWorld();
		marker = game.add.graphics();
		marker.lineStyle(2, 0xffffff);
		marker.drawRect(0, 0, 64, 64);
		swapGraphics = game.add.graphics();
		swapGraphics.lineStyle(2, 0xff4500);
		swapGraphics.drawRect(32, 32, 64, 64);
		game.input.onDown.add(getTemp, this);
		game.input.onUp.add(swapTilesNow, this);
		swapSlot = map.getTile(layer3.getTileX(1 * 64), layer3.getTileY(1 * 64), 'Tile Layer 3').index;
		marker.x = layer1.getTileX(0) * 64;
		marker.y = layer1.getTileY(128) * 64;
		animateSpeed = 0.15;
		flowSpeed = 3;
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
		timeIncrementer = game.time.events.loop(Phaser.Timer.SECOND, function () {
			time++;
		}, this);
    flowStarted = false;
    map.putTile(10, layer1.getTileX((Math.floor(Math.random() * 3)) * 64), layer1.getTileY(8 * 64), 'Tile Layer 1');
		game.time.events.add(Phaser.Timer.SECOND * 7, startFlow, this);
		game.add.button(192, 512, 'button', fastFlow, this);
		findEnd();
	}
	, update: function () {
		updateMarker();
		if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
			getTileProperties();
			console.log(map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index, 'Tile Layer 1');
		}
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
		game.debug.text('Time: ' + time, game.world.centerX - 50, 32);
	}
}
var winState = {
	create: function () {
    game.add.tileSprite(0,0,384,576,'Round_Complete');
		game.add.text(game.world.centerX - 65, 150, 'You Win', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 110, 200, 'Tap The Screen\n   To Continue', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.input.onDown.add(this.restart, this);
		console.log("Win! " + coveredTileCount);
	}
	, restart: function () {
		game.state.start('play');
	}
}
var loseState = {
	create: function () {
    game.add.tileSprite(0,0,384,576,'Round_Complete');
		game.add.text(game.world.centerX - 65, 150, 'You Lose', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 110, 200, 'Tap The Screen\n   To Continue', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.input.onDown.add(this.restart, this);
		console.log("Lose! " + coveredTileCount);
	}
	, restart: function () {
		game.state.start('play');
	}
}
var completeState = {
	create: function () {
    game.add.tileSprite(0,0,384,576,'Round_Complete');
		calculateScore();
		var username = "Adam";
		$.ajax({
      method: "POST",
      url: "PipePHP.php",
      data: {username: username, score: score},
      dataType: "text",
    });
		game.add.text(game.world.centerX - 110, 100, 'Game Complete', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
    game.add.text(game.world.centerX - 110, 130, 'Score', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 110, 170, 'Win: ' + winCount + ' x 100 = ' + (winCount * 100)+'\nLoss: ' + loseCount + " x -50 = " + (loseCount * -50)+'\nTime: 100 - ' + time + " = " + (100 - time)+'\nMoves: 50 - ' + moves + " x 2 = " + (50 - moves) * 2 + '\nBonus: ' + coveredTileCount + " x 2 = " + (coveredTileCount * 2)+'\nTotal: ' + score, {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
    
		game.add.text(game.world.centerX - 115, 360, 'Tap The Screen', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 115, 400, 'To Return to Main Page', {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.input.onDown.add(this.return, this);
		console.log("Complete! " + coveredTileCount);
	}
	, return: function () {
		document.location.href = "/";
	}
}

function updateEgg() {
	eggActive = true;
}

function getTemp() {
	updateMarker();
	if (game.input.activePointer.worldY > 128 && game.input.activePointer.worldY < 512) {
		tempPipe = map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y), 'Tile Layer 1').index;
	}
}

function swapTilesNow() {
	if (game.input.activePointer.worldY > 128 && game.input.activePointer.worldY < 512) {
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

function getTileProperties() {
	var x = layer1.getTileX(game.input.activePointer.worldX);
	var y = layer1.getTileY(game.input.activePointer.worldY);
	var tile = map.getTile(x, y, layer1);
	thisTileData = JSON.stringify(tile.properties.inFlow);
}

function updateMarker() {
	marker.x = layer1.getTileX(game.input.activePointer.worldX) * 64;
	marker.y = layer1.getTileY(game.input.activePointer.worldY) * 64;
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
function randomizeBoard() {
	for (xCo = 0; xCo < 6; xCo++) {
		for (yCo = 2; yCo < 8; yCo++) {
			map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64), 'Tile Layer 1').index = Math.floor(Math.random() * 7) + 1;
		}
	}
	for(let i = 0; i <= playCounter; i++){
  genBadPipes();
	}
}
function genBadPipes() {
  var xPos = Math.floor(Math.random() * 5);
  var yPos = Math.floor(Math.random() * 4) + 3;
  map.putTile(312, layer5.getTileX(xPos * 64), layer5.getTileY(yPos * 64), 'Tile Layer 5');
	console.log("bad pipe: " + xPos +", "+ yPos);
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
			flowTimer = game.time.events.loop(Phaser.Timer.SECOND * flowSpeed, runFlow, this);
		}
	}
  flowStarted = true;
}

function runFlow() {
	if (map.getTile(layer1.getTileX(endPipe.x * 64), layer1.getTileY(endPipe.y * 64), 'Tile Layer 1').properties.inFlow == "down") {
		gameWin();
	}
	else {
		flow(curPipe);
	}
}

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
	checkIfFlowable(curPipe);
	animateFlow(curPipe);
}

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

function calculateScore() {
	score = winCount * 100 + loseCount * -50 + (coveredTileCount * 2) + (100 - time) + (50 - moves) * 2;
}

function fastFlow() {
  if(flowTimer != null && flowStarted){
    game.time.events.remove(flowTimer);
	animateSpeed = 0.01;
	flowSpeed = 0.19;
	try {animateTimer.delay = Phaser.Timer.SECOND * animateSpeed;}
		
	catch (error) {console.log("Animation not started. " + error);}
		
	
    game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {flowTimer = game.time.events.loop(Phaser.Timer.SECOND * flowSpeed, runFlow, this);}, this);
    
		//flowTimer.delay = Phaser.Timer.SECOND * flowSpeed;
	
  game.time.events.remove(timeIncrementer);
}
	
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
		canvas.style.height = height+ "px";
	}
	
}
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('howTo', howToState);
game.state.add('play', playState);
game.state.add('win', winState);
game.state.add('lose', loseState);
game.state.add('complete', completeState);
game.state.start('boot');