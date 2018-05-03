var game = new Phaser.Game(384, 512, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload(){
  game.load.tilemap('map', 'assets/Pipes_Galore.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('Pipe_Sheet_Transparent', 'assets/Pipe_Sheet_Transparent.png');
}

var map, layer, marker;

var thisTileData, swapSlot, tempPipe;

var toSwap, tempStored;

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#4488AA";
  
  map = game.add.tilemap('map');
  
  map.addTilesetImage('Pipe_Sheet_Transparent');
  
  layer = map.createLayer('Tile Layer 1');
  
  layer.resizeWorld();
  
  marker = game.add.graphics();
  marker.lineStyle(2, 0xffffff);
  marker.drawRect(0, 0, 64, 64);
  
  game.input.onDown.add(getTemp, this);
  game.input.onUp.add(swapTilesNow, this)
  
  
  swapSlot = map.getTile(layer.getTileX(0), layer.getTileY(0)).index;
  toSwap = false;
  tempStored = false;
}

function update() {
  updateMarker();
  if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
    getTileProperties();
  }
}

function getTemp() {
  updateMarker();
  tempPipe = map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)).index;
}

function swapTilesNow() {
  if(swapSlot != tempPipe && map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)).index == tempPipe){
  map.putTile(tempPipe, layer.getTileX(0), layer.getTileY(0));
  map.putTile(swapSlot, layer.getTileX(marker.x), layer.getTileY(marker.y));
  swapSlot = map.getTile(layer.getTileX(0), layer.getTileY(0)).index;
  console.log(map.getTile(layer.getTileX(0), layer.getTileY(0)));
  }
  
}

function getTileProperties() {
  
  var x = layer.getTileX(game.input.activePointer.worldX);
  var y = layer.getTileY(game.input.activePointer.worldY);
	
	var tile = map.getTile(x, y, layer);
  
  thisTileData = JSON.stringify(tile.properties);
  
  tile.properties.wibble = true;
}

function updateMarker() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 64;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 64;
}



function render(){
  if(thisTileData){
    game.debug.text('Tile properties: ' + thisTileData, 16, 490);
    
  }else {
    game.debug.text("Click on a tile!", 16, 490);
  }
}
