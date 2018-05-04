var game = new Phaser.Game(500,800, Phaser.AUTO, 'lawn-water', {preload: preload, create:create, update: update, render: render});

var player;
var soil;
//var cursors;
var water;
var spray;
var sprayTimer = 0;
var shotCount = 0;
var grassPatch;
var leftButton;
var rightButton;
var xpos;
var ypos;
var ypos1;
var xpos1;

function preload(){
  game.load.image('soil', 'soil.png');
  game.load.image('hose', 'hose.png');
  game.load.image('trail', 'hosetrail.png');
  game.load.image('water', 'water.png');
  game.load.image('grass', 'grass.png');
  game.load.image('button', 'leftbutton.png');
  game.load.image('Rbutton', 'rightbutton.png');
  
  

}

function create(){
  //xpos = game.input.mousePointer.x;
  //ypos = game.input.mousePointer.y;
  game.input.addPointer();
  game.input.addPointer();
  soil = game.add.tileSprite(0,0,1024,768, 'soil');
  player = game.add.sprite(250,650, 'hose');
  player.anchor.setTo(0.5,0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);
    rightButton = game.add.button(game.world.centerX, 750, 'Rbutton', actionOnClick);

  
  //cursors = game.input.keyboard.createCursorKeys();
  hoseTrail = game.add.emitter(player.x, player.y +30, 400);
  hoseTrail.width = 10;
  hoseTrail.makeParticles('trail');
  hoseTrail.setXSpeed(30,-30);
  hoseTrail.setYSpeed(200,180);
  hoseTrail.setRotation(50,-50);
  //hoseTrail.setAlpha(1,0.01, 800);
//  hoseTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
  hoseTrail.start(false, 5000,10);
  
  
  water = game.add.group();
  water.enableBody = true;
  water.physicsBodyType = Phaser.Physics.ARCADE;
  water.createMultiple(30, 'bullet');
  water.setAll('anchor.x', 0.5);
  water.setAll('anchor.y', 1);
  water.setAll('outOfBoundsKill', true);
  water.setAll('checkWorldBounds', true);
  
  grassPatch = game.add.group();
  grassPatch.enableBody = true;
  grassPatch.physicsBodyType = Phaser.Physics.ARCADE;
  grassPatch.createMultiple(20, 'grass');
  grassPatch.setAll('anchor.x', 0.5);
  grassPatch.setAll('anchor.y', 0.5);
  grassPatch.setAll('scale.x', 1.0);
  grassPatch.setAll('scale.y', 1.0);
  grassPatch.setAll('outOfBoundsKill', true);
  grassPatch.setAll('checkWorldBounds', true);
  launchGrassPatch();
//    if( ypos1 > 600)
//    {
//     actionOnClick();
//    }
//  xpos = game.input.pointer1.x;
//  ypos = game.input.pointer1.y;
  
  //launchGrassPatch();
  
  
  
  
}

function update(){
  soil.tilePosition.y +=2;
  player.body.velocity.setTo(0,0);
  if (game.input.pointer1.isDown){
  xpos = game.input.pointer1.x;
  ypos = game.input.pointer1.y;
  }
  if( game.input.pointer2.isDown){
  xpos1 = game.input.pointer2.x;
  ypos1 = game.input.pointer2.y;
  }
  
  if( ypos1 > 600 || ypos > 600)
    {
     actionOnClick();
      ypos1 = 0;
      ypos = 0;
    }
  
    //if(game.input.pointerDown){
    //xpos = game.input.activePointer.x;
  //if(game.input.activePointer.y < 600){
  //ypos = game.input.activePointer.y;
 // }
     // console.log(fdsfsdfdsfsdfdsfdssd);
 // }
   //console.log(xpos);

  
//  xpos = game.input.mousePointer.x;
//  ypos = game.input.mousePointer.y;
  
//  if(leftButton.input.pointerDown() && player.x > 25){
//    player.body.velocity.x = -200;
//  } else if (rightButton.input.pointerDown()){
//    player.body.velocity.x = 200;
//  } else {
//    player.body.velocity.x = 0;
//  }

  if(xpos > player.x && ypos < 600)
    {
      player.body.velocity.x = 200
    }
  if(xpos < player.x && ypos < 600){
    player.body.velocity.x = -200;
  }
  if (xpos <= player.x + 5 && xpos >= player.x - 5){
    player.body.velocity.x = 0;
  }
 // console.log(ypos);
//    if(leftButton.input.pointerDown() && player.x > 25){
//    player.body.velocity.x = -200;}
//  else { //player.body.velocity.x = 0;}
//      
//        if(rightButton.input.pointerDown() && player.x > 25){
//    player.body.velocity.x = 200;}
//  else {
//    //player.body.velocity.x = 0;
//  }
//  if (game.input.pointerUp()){
//  player.body.velocity.x = 0;
//  }
//  
  
//    if(rightButton.input.pointerOver()){
//    player.body.velocity.x = 200;
//  }

  
//  if (cursors.left.isDown)
//    {
//      player.body.velocity.x = -200;
//    }
//  else if (cursors.right.isDown)
//    {
//      player.body.velocity.x = 200;
//    }
  if (player.x > game.width - 25) {
    player.x = game.width - 25;
    player.body.acceleration.x = 0;
  }
  if (player.x < 25){
    player.x = 25;
    player.body.acceleration.x = 0;
  }
//  if (sprayButton.isDown || game.input.activePointer.isDown){
//    spray();
//  }
  //player.angle = bank * 30;
hoseTrail.x = player.x;
}


//function spray(){
//
//  sprayDelay = 250;
//  if(game.time.now > sprayTimer){
//  var bullet = water.getFirstExists(false);
//  if (bullet){
//    bullet.reset(player.x, player.y +8);
//    bullet.body.velocity.y = -400;
//    sprayTimer = game.time.now + sprayDelay;
//      shotCount++;
//  console.log(shotCount);
//  }
//}
//}

function launchGrassPatch(){
  var MIN_ENEMY_SPACING = 300;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 100;
  var enemy = grassPatch.getFirstExists(false);
  //console.log(enemy);
  if (enemy){
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    // enemy.body.velocity.x = game.rnd.integerInRange(-300,300);
    enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.drag.x = 100;
    
  }
  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGrassPatch);
}



//function actionOnClick(){
//  player.body.velocity.x = -800;
//}
function actionOnClick(){
  sprayDelay = 250;
  if(game.time.now > sprayTimer){
  var bullet = water.getFirstExists(false);
  if (bullet){
    bullet.reset(player.x, player.y +8);
    bullet.body.velocity.y = -400;
    sprayTimer = game.time.now + sprayDelay;
      shotCount++;
  console.log(shotCount);
  }
}
}


function actionOnClick2(){
  player.body.velocity.x = +800;
}
function render(){
  
}


function init(){
    var container = document.querySelector("#container");
    var cs = getComputedStyle(container);

    var width = parseInt(cs.getPropertyValue('width'), 10);
    var height = parseInt(cs.getPropertyValue('height'), 10);


    var canvas = document.querySelector("#canvas");
    canvas.width = width;
    canvas.height = height;
    console.log(width);
    console.log(height);

    var c = canvas.getContext('2d');
    c.fillStyle="red";
    c.strokeStyle="blue";
    c.rect(width/2 - ((width/10)/2),height - width/10,width/10,width/10);
    c.lineWidth=4;
    c.stroke();
    c.fill();

}