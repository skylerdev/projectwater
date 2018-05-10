var game = new Phaser.Game(384, 576, Phaser.AUTO, 'gameBoard');
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
		game.load.image('Pipe_Sheet_Transparent', 'assets/images/Pipe_Sheet_Transparent.png');
		game.load.image('Hidden_Pipe', 'assets/images/Hidden_Pipe.png');
		game.load.image('Pipe_Goals', 'assets/images/Pipe_Goals.png');
		game.load.image('Water_Sheet_Transparent', 'assets/images/Water_Sheet_Transparent.png');
		game.load.image('button', 'assets/images/Fast_Flow.png');
		game.load.image('start', 'assets/images/Start.png');
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
		game.stage.backgroundColor = "#84a7e0";
		eEgg = game.add.audio('eEgg');
		game.add.text(game.world.centerX - 110, 150, 'Swapping Pipes', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		//game.add.text(game.world.centerX - 100, 200, 'Tap To Start', {font: '30px Comic Sans MS', fill: '#ffff00'});
		game.add.button(game.world.centerX - 100, 200, 'start', this.start, this);
		game.input.onDown.add(function () {
			tapCounter++;
			if (tapCounter > 5) {
			updateEgg();
			eEgg.play();
		}}, this);
	},
	start: function () {
		game.state.start('play');
	}
};
var map, layer1, layer2, layer3, layer4, marker, swapGraphics;
var swapSlot, tempPipe, startPipe, endPipe, curPipe;
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
		game.stage.backgroundColor = "#4488AA";
		map = game.add.tilemap('map');
		map.addTilesetImage('Pipe_Sheet_Transparent');
		map.addTilesetImage('Hidden_Pipe');
		map.addTilesetImage('Pipe_Goals');
		map.addTilesetImage('Water_Sheet_Transparent');
		layer1 = map.createLayer('Tile Layer 1');
		layer4 = map.createLayer('Tile Layer 4');
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
		game.canvas.style.margin = "10px";
		timeIncrementer = game.time.events.loop(Phaser.Timer.SECOND, function () {
			time++;
		}, this);
		game.time.events.add(Phaser.Timer.SECOND * 7, startFlow, this);
		game.add.button(128, 512, 'button', fastFlow, this);
		findEnd();
	}
	, update: function () {
		updateMarker();
		if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
			getTileProperties();
			console.log(map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index);
		}
		if (endPipe != null && endPipe.properties.inFlow == "down") {
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
		game.add.text(game.world.centerX - 75, 150, 'You Win', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 125, 200, 'Tap The Screen\n    To Restart', {
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
		game.add.text(game.world.centerX - 75, 150, 'You Lose', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 125, 200, 'Tap The Screen\n    To Restart', {
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
		calculateScore();
		game.add.text(game.world.centerX - 125, 100, 'Game Complete', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 125, 'Score', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 160, 'Win: ' + winCount + " x100 = " + (winCount * 100), {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 185, 'Loss: ' + loseCount + " x25 = " + (loseCount * 25), {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 210, 'Time: 100 - ' + time + " = " + (100 - time), {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 235, 'Moves: 50 - ' + moves + " x2 = " + (50 - moves) * 2, {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 260, 'Bonus: ' + coveredTileCount + " x3 = " + (coveredTileCount * 3), {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 285, 'Total: ' + score, {
			font: '20px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 310, 'Tap The Screen', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.add.text(game.world.centerX - 150, 335, 'To Return to Main Page', {
			font: '30px Comic Sans MS'
			, fill: '#ffff00'
		});
		game.input.onDown.add(this.return, this);
		console.log("Complete! " + coveredTileCount);
	}
	, return: function () {
		window.location.assign('Main_Page.html');
	}
}

function updateEgg() {
	eggActive = true;
}

function getTemp() {
	updateMarker();
	if (game.input.activePointer.worldY > 128 && game.input.activePointer.worldY < 512) {
		tempPipe = map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index;
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
		}
		else {
			if (swapSlot != tempPipe && map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index == tempPipe && map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).properties.inFlow == "") {
				map.putTile(tempPipe, layer3.getTileX((1 * 64)), layer3.getTileY((1 * 64)), 'Tile Layer 3');
				map.putTile(swapSlot, layer1.getTileX(marker.x), layer1.getTileY(marker.y));
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
			map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).index = Math.floor(Math.random() * 7) + 1;
		}
	}
}
//Finds the end 
function findEnd() {
	endPipe = map.getTile(layer1.getTileX(5 * 64), layer1.getTileY(1 * 64));
}
//Finds the start pipe and send an inflow signal to the next pipe.
function startFlow() {
	yCo = 8;
	for (xCo = 0; xCo < 6; xCo++) {
		if (map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)) != null && map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).index == 10) {
			map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY((yCo - 1) * 64)).properties.inFlow = "down";
			curPipe = map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY((yCo - 1) * 64));
			animateFlow(curPipe);
			checkIfFlowable(curPipe);
			flowTimer = game.time.events.loop(Phaser.Timer.SECOND * flowSpeed, runFlow, this);
		}
	}
}

function runFlow() {
	if (endPipe.properties.inFlow == "down") {
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
			map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64)).properties.inFlow = "up";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64));
		}
		else if (inTile.properties.inFlow == "down") {
			map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64)).properties.inFlow = "left";
			curPipe = map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64));
		}
		break;
	case 2:
		if (inTile.properties.inFlow == "right") {
			map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64)).properties.inFlow = "right";
			curPipe = map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64));
		}
		else if (inTile.properties.inFlow == "left") {
			map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64)).properties.inFlow = "left";
			curPipe = map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64));
		}
		break;
	case 3:
		if (inTile.properties.inFlow == "left") {
			map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64)).properties.inFlow = "up";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64));
		}
		else if (inTile.properties.inFlow == "down") {
			map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64)).properties.inFlow = "right";
			curPipe = map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64));
		}
		break;
	case 4:
		if (inTile.properties.inFlow == "up") {
			map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64)).properties.inFlow = "up";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64));
		}
		else if (inTile.properties.inFlow == "down") {
			map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64)).properties.inFlow = "down";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64));
		}
		break;
	case 5:
		if (inTile.properties.inFlow == "up") {
			map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64)).properties.inFlow = "left";
			curPipe = map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64));
		}
		else if (inTile.properties.inFlow == "right") {
			map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64)).properties.inFlow = "down";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64));
		}
		break;
	case 6:
		if (inTile.properties.inFlow == "up") {
			map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64)).properties.inFlow = "right";
			curPipe = map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64));
		}
		else if (inTile.properties.inFlow == "left") {
			map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64)).properties.inFlow = "down";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64));
		}
		break;
	case 7:
		if (inTile.properties.inFlow == "left") {
			map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64)).properties.inFlow += "left";
			curPipe = map.getTile(layer1.getTileX((inTile.x + 1) * 64), layer1.getTileY((inTile.y) * 64));
		}
		else if (inTile.properties.inFlow == "right") {
			map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64)).properties.inFlow += "right";
			curPipe = map.getTile(layer1.getTileX((inTile.x - 1) * 64), layer1.getTileY((inTile.y) * 64));
		}
		else if (inTile.properties.inFlow == "up") {
			map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64)).properties.inFlow += "up";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y + 1) * 64));
		}
		else if (inTile.properties.inFlow == "down") {
			map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64)).properties.inFlow += "down";
			curPipe = map.getTile(layer1.getTileX((inTile.x) * 64), layer1.getTileY((inTile.y - 1) * 64));
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
		map.putTile(animFrame, layer4.getTileX(inTile.x * 64), layer4.getTileY(inTile.y * 64), 'Tile Layer 4');
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
	score = winCount * 100 + loseCount * 25 + (coveredTileCount * 3) + (100 - time) + (50 - moves) * 2;
}

function fastFlow() {
	animateSpeed = 0.01;
	flowSpeed = 0.17;
	try {
		animateTimer.delay = Phaser.Timer.SECOND * animateSpeed;
	}
	catch {
		console.log("Animation not started");
	}
	try {
		flowTimer.delay = Phaser.Timer.SECOND * flowSpeed;
	}
	catch {
		console.log("Flow not started");
	}
	game.time.events.remove(timeIncrementer);
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
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);
game.state.add('lose', loseState);
game.state.add('complete', completeState);
game.state.start('boot');