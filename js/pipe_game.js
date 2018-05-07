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
  game.load.image('Water_Sheet_Transparent', 'assets/images/Water_Sheet_Transparent.png');
  game.load.audio('click', 'assets/sounds/click.mp3');
	game.load.audio('flip', 'assets/sounds/flip_trim.mp3');
	game.load.audio('click_voice', 'assets/sounds/click_voice.mp3');
	game.load.audio('swoosh', 'assets/sounds/swoosh.mp3');
  game.load.audio('eEgg', 'assets/sounds/egg_active.mp3');
}
var map, layer1, layer2, layer3, layer4, marker, swapGraphics;
var swapSlot, tempPipe, startPipe, endPipe, curPipe;

//For loop variables
var xCo, yCo;

//Main Audio
var click, flip;

//Easter Egg
var clickV, swoosh, eEgg, eggActive;

//Debugging
var thisTileData;

function create() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	resize();
	game.physics.startSystem(Phaser.Physics.ARCADE);
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
	
	click = game.add.audio('click');
	click.allowMultiple = true;
	flip = game.add.audio('flip');
	flip.allowMultiple = true;
  clickV = game.add.audio('click_voice');
	clickV.allowMultiple = true;
	swoosh = game.add.audio('swoosh');
	swoosh.allowMultiple = true;
  eEgg = game.add.audio('eEgg');
	randomizeBoard();
  
  game.time.events.add(Phaser.Timer.SECOND * 5, startFlow, this);
  
  findEnd();
}

function update() {
	updateMarker();
	if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
		getTileProperties();
		console.log(map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index);
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.G)) {
		updateEgg();
	}
  if(endPipe != null && endPipe.properties.inFlow == "down"){
    gameWin();
  }
}

function updateEgg(){
  if(!eggActive){
    eEgg.play();
  }
  
  eggActive = true;
}

function getTemp() {
	updateMarker();
	tempPipe = map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index;
}

function swapTilesNow() {
	if (map.getTile(layer2.getTileX(marker.x), layer2.getTileY(marker.y), 'Tile Layer 2').index == 8) {
		map.putTile(9, layer2.getTileX(marker.x), layer2.getTileY(marker.y), 'Tile Layer 2');
    if(eggActive){
      swoosh.play();
    }else{
      flip.play();
    }
		
	}
	else {
		if (swapSlot != tempPipe && map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).index == tempPipe && map.getTile(layer1.getTileX(marker.x), layer1.getTileY(marker.y)).properties.inFlow == "") {
			map.putTile(tempPipe, layer3.getTileX((1 * 64)), layer3.getTileY((1 * 64)), 'Tile Layer 3');
			map.putTile(swapSlot, layer1.getTileX(marker.x), layer1.getTileY(marker.y));
			swapSlot = map.getTile(layer3.getTileX((1 * 64)), layer3.getTileY((1 * 64)), 'Tile Layer 3').index;
      if(eggActive){
        clickV.play();
      }else{
        click.play();
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
	if (game.input.activePointer.worldY > 128 && game.input.activePointer.worldY < 512) {
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
function randomizeBoard() {
	for (xCo = 0; xCo < 6; xCo++) {
		for (yCo = 2; yCo < 8; yCo++) {
			map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).index = Math.floor(Math.random() * 7) + 1;
		}
	}
}
//Finds the end 
function findEnd(){
  endPipe = map.getTile(layer1.getTileX(5 * 64), layer1.getTileY(1 * 64));
}
//Finds the start pipe and send an inflow signal to the next pipe.
function startFlow(){
  yCo = 8;
	for (xCo = 0; xCo < 6; xCo++) {
		if(map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)) != null && map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY(yCo * 64)).index == 10){
      map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY((yCo - 1) * 64)).properties.inFlow = "down";
      curPipe = map.getTile(layer1.getTileX(xCo * 64), layer1.getTileY((yCo - 1) * 64));
      animateFlow(curPipe);
    game.time.events.loop(Phaser.Timer.SECOND * 5, runFlow, this);
	}
    
  }
}
  function runFlow(){
    if(endPipe.properties.inFlow == "down"){
    gameWin();
  } else {
    flow(curPipe);
  }
    
  }
function flow(inTile) {
	switch (inTile.index) {
		case 1:
			if(inTile.properties.inFlow == "right"){
				map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y+1)*64)).properties.inFlow = "up";
        curPipe = map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y+1)*64));
			}else if(inTile.properties.inFlow == "down"){
				map.getTile(layer1.getTileX((inTile.x+1)*64), layer1.getTileY((inTile.y)*64)).properties.inFlow = "left";
        curPipe = map.getTile(layer1.getTileX((inTile.x+1)*64), layer1.getTileY((inTile.y)*64));
			} else {
        gameLose();
      }
			break;
		case 2:
			if(inTile.properties.inFlow == "right"){
				map.getTile(layer1.getTileX((inTile.x-1)*64), layer1.getTileY((inTile.y)*64)).properties.inFlow = "right";
        curPipe = map.getTile(layer1.getTileX((inTile.x-1)*64), layer1.getTileY((inTile.y)*64));
			}else if(inTile.properties.inFlow == "left"){
				map.getTile(layer1.getTileX((inTile.x+1)*64), layer1.getTileY((inTile.y)*64)).properties.inFlow = "left";
        curPipe = map.getTile(layer1.getTileX((inTile.x+1)*64), layer1.getTileY((inTile.y)*64));
			} else {
        gameLose();
      }
			break;
		case 3:
			if(inTile.properties.inFlow == "left"){
				map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y+1)*64)).properties.inFlow = "up";
        curPipe = map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y+1)*64));
			}else if(inTile.properties.inFlow == "down"){
				map.getTile(layer1.getTileX((inTile.x-1)*64), layer1.getTileY((inTile.y)*64)).properties.inFlow = "right";
        curPipe = map.getTile(layer1.getTileX((inTile.x-1)*64), layer1.getTileY((inTile.y)*64));
			} else {
        gameLose();
      }
      break;
		case 4:
			if(inTile.properties.inFlow == "up"){
				map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y+1)*64)).properties.inFlow = "up";
        curPipe = map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y+1)*64));
			}else if(inTile.properties.inFlow == "down"){
				map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y-1)*64)).properties.inFlow = "down";
        curPipe = map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y-1)*64));
			} else {
        gameLose();
      }
      break;
		case 5:
			if(inTile.properties.inFlow == "up"){
				map.getTile(layer1.getTileX((inTile.x+1)*64), layer1.getTileY((inTile.y)*64)).properties.inFlow = "left";
        curPipe = map.getTile(layer1.getTileX((inTile.x+1)*64), layer1.getTileY((inTile.y)*64));
			}else if(inTile.properties.inFlow == "right"){
				map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y-1)*64)).properties.inFlow = "down";
        curPipe = map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y-1)*64));
			} else {
        gameLose();
      }
      break;
		case 6:
			if(inTile.properties.inFlow == "up"){
				map.getTile(layer1.getTileX((inTile.x-1)*64), layer1.getTileY((inTile.y)*64)).properties.inFlow = "right";
        curPipe = map.getTile(layer1.getTileX((inTile.x-1)*64), layer1.getTileY((inTile.y)*64));
			}else if(inTile.properties.inFlow == "left"){
				map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y-1)*64)).properties.inFlow = "down";
        curPipe = map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y-1)*64));
			} else {
        gameLose();
      }
      break;
		case 7:
			if(inTile.properties.inFlow == "left"){
				map.getTile(layer1.getTileX((inTile.x+1)*64), layer1.getTileY((inTile.y)*64)).properties.inFlow += "left";
        curPipe = map.getTile(layer1.getTileX((inTile.x+1)*64), layer1.getTileY((inTile.y)*64));
			}else if(inTile.properties.inFlow == "right"){
				map.getTile(layer1.getTileX((inTile.x-1)*64), layer1.getTileY((inTile.y)*64)).properties.inFlow += "right";
        curPipe = map.getTile(layer1.getTileX((inTile.x-1)*64), layer1.getTileY((inTile.y)*64));
			}else if(inTile.properties.inFlow == "up"){
				map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y+1)*64)).properties.inFlow += "up";
        curPipe = map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y+1)*64));
			} else if(inTile.properties.inFlow == "down"){
				map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y-1)*64)).properties.inFlow += "down";
        curPipe = map.getTile(layer1.getTileX((inTile.x)*64), layer1.getTileY((inTile.y-1)*64));
			} else {
        gameLose();
      }
      break;
	}
  
  animateFlow(curPipe);
}

function animateFlow(inTile){
  var animFrame;
  switch(inTile.index){
    case 1:
      if (inTile.properties.inFlow == "down"){
        animFrame = 12;
      } else if (inTile.properties.inFlow == "right"){
        animFrame = 27;
      }
      break;
    case 2:
      if (inTile.properties.inFlow == "left"){
        animFrame = 42;
      } else if (inTile.properties.inFlow == "right"){
        animFrame = 57;
      }
      break;
    case 3:
      if (inTile.properties.inFlow == "left"){
        animFrame = 72;
      } else if (inTile.properties.inFlow == "down"){
        animFrame = 87;
      }
      break;
    case 4:
      if (inTile.properties.inFlow == "down"){
        animFrame = 102;
      } else if (inTile.properties.inFlow == "up"){
        animFrame = 117;
      }
      break;
    case 5:
      if (inTile.properties.inFlow == "up"){
        animFrame = 132;
      } else if (inTile.properties.inFlow == "right"){
        animFrame = 147;
      }
      break;
    case 6:
      if (inTile.properties.inFlow == "left"){
        animFrame = 162;
      } else if (inTile.properties.inFlow == "up"){
        animFrame = 177;
      }
      break;
    case 7:
      if (inTile.properties.inFlow == "up"){
        if (inTile.properties.passed == true){
          animFrame = 192;
        } else {
          animFrame = 222;
          inTile.properties.passed = true;
        }
      } else if (inTile.properties.inFlow == "down"){
        if (inTile.properties.passed == true){
          animFrame = 237;
        } else {
          animFrame = 207;
          inTile.properties.passed = true;
        }
      } else if (inTile.properties.inFlow == "left"){
        if (inTile.properties.passed == true){
          animFrame = 282;
        } else {
          animFrame = 252;
          inTile.properties.passed = true;
        }
      } else if (inTile.properties.inFlow == "right"){
        if (inTile.properties.passed == true){
          animFrame = 297;
        } else {
          animFrame = 267;
          inTile.properties.passed = true;
        }
      }
  }
  game.time.events.repeat(Phaser.Timer.SECOND * 0.25, 15, function() {map.putTile(animFrame, layer4.getTileX(inTile.x * 64), layer4.getTileY(inTile.y * 64), 'Tile Layer 4'); animFrame++;}, this);
}
  
function gameWin(){
  console.log("You won!");
  game.state.restart();
}
  
function gameLose(){
  console.log("You lose...");
  window.location.assign("Main_Page.html");
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