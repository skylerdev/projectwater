var game = new Phaser.Game(384, 512, Phaser.AUTO, 'phaser-example', {
	preload: preload
	, create: create
	, update: update
	, render: render
});

function preload() {
	game.load.tilemap('map', 'assets/images/Pipes_Galore.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('Pipe_Sheet_Transparent', 'assets/images/Pipe_Sheet_Transparent.png');
	game.load.audio('click', 'assets/sounds/click.mp3');
}
var map, layer, marker, swapGraphics;
var thisTileData, swapSlot, tempPipe;
var xCo, yCo;

var click;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = "#4488AA";
	map = game.add.tilemap('map');
	map.addTilesetImage('Pipe_Sheet_Transparent');
	layer = map.createLayer('Tile Layer 1');
	layer.resizeWorld();
	marker = game.add.graphics();
	marker.lineStyle(2, 0xffffff);
	marker.drawRect(0, 0, 64, 64);
	
	swapGraphics = game.add.graphics();
	swapGraphics.lineStyle(2, 0xff4500);
	swapGraphics.drawRect(0,0,64,64);
	
	game.input.onDown.add(getTemp, this);
	game.input.onUp.add(swapTilesNow, this);
	swapSlot = map.getTile(layer.getTileX(0), layer.getTileY(0)).index;
	
	click = game.add.audio('click');
	randomizeBoard();
	updateTile();
}

function update() {
	updateMarker();
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
		getTileProperties();
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.G)) {
		updateTile();
	}
}

function getTemp() {
	updateMarker();
	tempPipe = map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)).index;
}

function swapTilesNow() {
	if (swapSlot != tempPipe && map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)).index == tempPipe) {
		map.putTile(tempPipe, layer.getTileX(0), layer.getTileY(0));
		map.putTile(swapSlot, layer.getTileX(marker.x), layer.getTileY(marker.y));
		swapSlot = map.getTile(layer.getTileX(0), layer.getTileY(0)).index;
		console.log(map.getTile(layer.getTileX(0), layer.getTileY(0)));
		click.play();
		updateTile();
	}
}

function getTileProperties() {
	var x = layer.getTileX(game.input.activePointer.worldX);
	var y = layer.getTileY(game.input.activePointer.worldY);
	var tile = map.getTile(x, y, layer);
	thisTileData = JSON.stringify(tile.properties);
	tile.properties.wibble = true;
}

function updateTile() {
	for (xCo = 0; xCo < 6; xCo++) {
		for (yCo = 1; yCo < 7; yCo++) {
			if (map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)) != null) {
				switch (map.getTile(layer.getTileX(xCo*64), layer.getTileY(yCo*64)).index){
					case 1:
							map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)).properties = {"right": true,"down:": true,"left": false,"up:": false};
							break;
					case 2:
							map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)).properties = {"right": true,"down:": false,"left": true,"up:": false};
							break;
					case 3:
							map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)).properties = {"right": false,"down:": true,"left": true,"up:": false};
							break;
					case 4:
							map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)).properties = {"right": false,"down:": true,"left": false,"up:": true};
							break;
					case 5:
							map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)).properties = {"right": true,"down:": false,"left": false,"up:": true};
							break;
					case 6:
							map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)).properties = {"right": false,"down:": false,"left": true,"up:": true};
							break;
					case 7:
							map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)).properties = {"right": true,"down:": true,"left": true,"up:": true};
							break;
				}
				
			}
		}
	}
}

function updateMarker() {
	marker.x = layer.getTileX(game.input.activePointer.worldX) * 64;
	marker.y = layer.getTileY(game.input.activePointer.worldY) * 64;
}

function render() {
	if (thisTileData) {
		game.debug.text(thisTileData, 0, 490);
	}
	else {
		game.debug.text("Click on a tile!", 16, 490);
	}
}

function randomizeBoard(){
	for (xCo = 0; xCo < 6; xCo++) {
		for (yCo = 1; yCo < 7; yCo++) {
			map.getTile(layer.getTileX(xCo * 64), layer.getTileY(yCo * 64)).index = Math.floor(Math.random()*7) + 1;
		}
	}
}

function click(){
	click.play();
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