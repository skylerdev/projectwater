var game = new Phaser.Game(384, 576, Phaser.AUTO, 'phaser-example', {
	preload: preload
	, create: create
	, update: update
});

function preload() {
	game.load.tilemap('map', 'assets/images/Pipes_Galore.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('Pipe_Sheet_Transparent', 'assets/images/Pipe_Sheet_Transparent.png');
	game.load.image('Hidden_Pipe', 'assets/images/Hidden_Pipe.png');
	game.load.image('Pipe_Goals', 'assets/images/Pipe_Goals.png');
	game.load.audio('click', 'assets/sounds/click.mp3');
	game.load.audio('flip', 'assets/sounds/flip_trim.mp3');
}
var map, layer1, layer2, layer3, marker, swapGraphics;
var swapSlot, tempPipe, startPipe, endPipe;
var xCo, yCo;
var click, flip;

function create() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	resize();
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = "#4488AA";
	map = game.add.tilemap('map');
	map.addTilesetImage('Pipe_Sheet_Transparent');
	map.addTilesetImage('Hidden_Pipe');
	map.addTilesetImage('Pipe_Goals');
	layer1 = map.createLayer('Tile Layer 1');
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
	
	click = game.add.audio('click');
	click.allowMultiple = true;
	click.allowMultiple = true;
	flip = game.add.audio('flip');
	flip.allowMultiple = true;
	randomizeBoard();
	updateTile();
}

function update() {
	updateMarker();
	if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
		getTileProperties();
		console.log(map.getTile(layer2.getTileX(marker.x), layer2.getTileY(marker.y), 'Tile Layer 2').index);
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.G)) {
		updateTile();
	}
}

function getTemp() {
	updateMarker();
	tempPipe = map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index;
}

function swapTilesNow() {
	if (map.getTile(layer2.getTileX(marker.x), layer2.getTileY(marker.y), 'Tile Layer 2').index == 8) {
		map.putTile(9, layer2.getTileX(marker.x), layer2.getTileY(marker.y), 'Tile Layer 2');
		flip.play();
	}
	else {
		if (swapSlot != tempPipe && map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index == tempPipe) {
			map.putTile(tempPipe, layer3.getTileX((1 * 64)), layer3.getTileY((1 * 64)), 'Tile Layer 3');
			map.putTile(swapSlot, layer1.getTileX(marker.x), layer1.getTileY(marker.y));
			swapSlot = map.getTile(layer3.getTileX((1 * 64)), layer3.getTileY((1 * 64)), 'Tile Layer 3').index;
			console.log(map.getTile(layer3.getTileX((1 * 64)), layer3.getTileY((1 * 64)), 'Tile Layer 3'));
			click.play();
			updateTile();
		}
	}
}

function getTileProperties() {
	var x = layer1.getTileX(game.input.activePointer.worldX);
	var y = layer1.getTileY(game.input.activePointer.worldY);
	var tile = map.getTile(x, y, layer1);
	thisTileData = JSON.stringify(tile.properties);
}

function updateTile() {
	for (xCo = 0; xCo < 6; xCo++) {
		for (yCo = 2; yCo < 8; yCo++) {
			if (map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)) != null) {
				switch (map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).index) {
				case 1:
					map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).properties = {
						"right": true
						, "down:": true
						, "left": false
						, "up:": false
						, "inFlow": ""
					};
					break;
				case 2:
					map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).properties = {
						"right": true
						, "down:": false
						, "left": true
						, "up:": false
						, "inFlow": ""
					};
					break;
				case 3:
					map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).properties = {
						"right": false
						, "down:": true
						, "left": true
						, "up:": false
						, "inFlow": ""
					};
					break;
				case 4:
					map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).properties = {
						"right": false
						, "down:": true
						, "left": false
						, "up:": true
						, "inFlow": ""
					};
					break;
				case 5:
					map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).properties = {
						"right": true
						, "down:": false
						, "left": false
						, "up:": true
						, "inFlow": ""
					};
					break;
				case 6:
					map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).properties = {
						"right": false
						, "down:": false
						, "left": true
						, "up:": true
						, "inFlow": ""
					};
					break;
				case 7:
					map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).properties = {
						"right": true
						, "down:": true
						, "left": true
						, "up:": true
						, "inFlow": ""
					};
					break;
				}
			}
		}
	}
}

function updateMarker() {
	if (game.input.activePointer.worldY > 128 && game.input.activePointer.worldY < 512) {
		marker.x = layer1.getTileX(game.input.activePointer.worldX) * 64;
		marker.y = layer1.getTileY(game.input.activePointer.worldY) * 64;
	}
}
//Debugging purposes
/*
function render() {
	if (thisTileData) {
		game.debug.text(thisTileData, 0, 490);
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
function startFlow(){
	
}
function flow(inTile) {
	switch (inTile.index) {
		case 1:
			if(inTile.properties.flowIn == "right"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "down";
			}else{
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "right";
			}
			break;
		case 2:
			if(inTile.properties.flowIn == "right"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "left";
			}else{
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "right";
			}
			break;
		case 3:
			if(inTile.properties.flowIn == "left"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "down";
			}else{
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "left";
			}
		case 4:
			if(inTile.properties.flowIn == "up"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "down";
			}else{
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "up";
			}
		case 5:
			if(inTile.properties.flowIn == "up"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "right";
			}else{
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "up";
			}
		case 6:
			if(inTile.properties.flowIn == "up"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "left";
			}else{
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "up";
			}
		case 7:
			if(inTile.properties.flowIn == "left"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "right";
			}else if(inTile.properties.flowIn == "right"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "left";
			}else if(inTile.properties.flowIn == "up"){
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "down";
			} else{
				map.getTile(layer1.getTileX(inTile.x), layer1.getTileY(inTile.y)).properties.inFlow = "up";
			}
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
		canvas.style.height = height + "px";
	}
}