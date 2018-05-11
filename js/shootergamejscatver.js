var game = new Phaser.Game(500,800, Phaser.AUTO, 'lawn-water', {preload: preload, create:create, update: update, render: render});

var player;
var soil;
var cursors;
var water;
var spray;
var sprayTimer = 0;
var shotCount = 0;
var goodShot = 0;
var grassPatch;
var bgrassPatch;
var dog;
var leftButton;
var rightButton;
var xpos;
var ypos;
var ypos1;
var xpos1;
var text;
var goodShotText;

function preload(){
  game.load.image('soil', 'assets/starfield.jpeg');
  game.load.image('hose', 'assets/hose.png');
  game.load.image('trail', 'assets/hosetrail.png');
  game.load.image('water', 'assets/water.png');
  game.load.image('grass', 'assets/grass.png');
  game.load.image('bgrass', 'assets/browngrass.png');
  //game.load.image('button', 'assets/leftbutton.png');
  game.load.image('Rbutton', 'assets/Spray.png');
  game.load.image('dog', 'assets/dog.png');
  game.load.image('nyancat', 'assets/nyancat.png');
  game.load.image('nyancattrail','assets/nyancattrail.png');
  game.load.image('nyancattrail2','assets/nyancattrailh.png');
  game.load.image('nyancat2', 'assets/nyancath.png');
  

}

function create(){
  
    canvas_width = window.innerWidth*window.devicePixelRatio;
  canvas_height = window.innerHeight*window.devicePixelRatio;


      resize();
  game.input.addPointer();
  game.input.addPointer();
  soil = game.add.tileSprite(0,0,1024,900, 'soil');
  player = game.add.sprite(250,650, 'nyancat');
  player.anchor.setTo(0.5,0.5);
  
  game.physics.enable(player, Phaser.Physics.ARCADE);
    rightButton = game.add.button(game.world.centerX-game.world.centerX/2, 725, 'Rbutton', actionOnClick);

  
  cursors = game.input.keyboard.createCursorKeys();
  hoseTrail = game.add.emitter(player.x, player.y+50, 400);
  //hoseTrail.makeParticles('trail');
  hoseTrail.makeParticles('nyancattrail');
  hoseTrail.setXSpeed(0);
  hoseTrail.setYSpeed(200,180);
  hoseTrail.setRotation(50,-50);
  hoseTrail.setAlpha(0.4, 0, 400);
  hoseTrail.start(false, 5000,10);
  
  
  water = game.add.group();
  water.enableBody = true;
  water.physicsBodyType = Phaser.Physics.ARCADE;
  water.createMultiple(30, 'water');
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
  
  bgrassPatch = game.add.group();
  bgrassPatch.enableBody = true;
  bgrassPatch.physicsBodyType = Phaser.Physics.ARCADE;
  bgrassPatch.createMultiple(20, 'bgrass');
  bgrassPatch.setAll('anchor.x', 0.5);
  bgrassPatch.setAll('anchor.y', 0.5);
  bgrassPatch.setAll('scale.x', 1.0);
  bgrassPatch.setAll('scale.y', 1.0);
  bgrassPatch.setAll('outOfBoundsKill', true);
  bgrassPatch.setAll('checkWorldBounds', true);
  launchbGrassPatch();
  
  dog = game.add.group();
  dog.enableBody = true;
  dog.physicsBodyType = Phaser.Physics.ARCADE;
  //dog.createMultiple(5, 'dog');
  dog.createMultiple(5, 'nyancat2');
  dog.setAll('anchor.x', 0.5);
  dog.setAll('anchor.y', 0.5);
  dog.setAll('scale.x', 1.0);
  dog.setAll('scale.y', 1.0);
  dog.setAll('outOfBoundsKill', true);
  //dog.setAll('checkWorldBounds', true);
//  nctrail = game.add.emitter(dog.x, dog.y+50, 400);
//  //hoseTrail.makeParticles('trail');
//  nctrail.makeParticles('nyancattrail');
//  nctrail.setXSpeed(200,180);
//  nctrail.setYSpeed(0);
//  nctrail.setRotation(50,-50);
  dog.forEach(function(enemy){
        addEnemyEmitterTrail(enemy);
    enemy.events.onKilled.add(function(){
      enemy.trail.kill();
    })
        });

  launchDog();
     text = game.add.text(0,0, "" + shotCount + " Litres of water used", {font : "35px Arial", fill: "#ff0044", align: "center"});
       text2 = game.add.text(0,50, "Score " + goodShot, {font : "35px Arial", fill: "#ff0044", align: "center"});
 sprayButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update(){
  text.setText("" + shotCount + " Litres used")
  text2.setText("Score " + goodShot)
  game.input.scale;

  resize();

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
  if( ypos1 > window.innerHeight*7/8 || ypos > window.innerHeight*7/8)
    {
     actionOnClick();
      ypos1 = 0;
      ypos = 0;
    }
  if(xpos > player.x && ypos < 685)
    { player.body.velocity.x = 1.5*(xpos - player.x);
     if (xpos - player.x < 150){
       player.body.velocity.x = 225;
     }
    }
  if(xpos < player.x && ypos <  685){
    player.body.velocity.x = 1.5*(xpos - player.x);
    if (player.x - xpos < 150){
      player.body.velocity.x = -225;
    }
  }
  if (xpos <= player.x + 5 && xpos >= player.x - 5){
    player.body.velocity.x = 0;
  }
  
  game.physics.arcade.overlap(grassPatch, water, hitGrass, null, this);
  game.physics.arcade.overlap(bgrassPatch, water, hitEnemy, null, this);
  game.physics.arcade.overlap(dog, water, hitDog, null, this);
  
  if (cursors.left.isDown)
    {
      player.body.velocity.x = -300;
    }
  else if (cursors.right.isDown)
    {
      player.body.velocity.x = 300;
    }
  if (player.x > game.width - 25) {
    player.x = game.width - 25;
    player.body.acceleration.x = 0;
  }
  if (player.x < 25){
    player.x = 25;
    player.body.acceleration.x = 0;
  }
  if (sprayButton.isDown){
    spray();
  }
hoseTrail.x = player.x;
}


function spray(){

  sprayDelay = 250;
  if(game.time.now > sprayTimer){
  var bullet = water.getFirstExists(false);
  if (bullet){
    bullet.reset(player.x, player.y +8);
    bullet.body.velocity.y = -400;
    sprayTimer = game.time.now + sprayDelay;
      shotCount++;
  }
}
}

function launchGrassPatch(){
  var MIN_ENEMY_SPACING = 600;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 200;
  var enemy = grassPatch.getFirstExists(false);
  if (enemy){
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.velocity.x = game.rnd.integerInRange(-100,100);
  }
  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGrassPatch);
}

function launchbGrassPatch(){
  var MIN_ENEMY_SPACING = 600;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 150;
  var enemy = bgrassPatch.getFirstExists(false);
  if (enemy){
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.y = ENEMY_SPEED;
  }
  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchbGrassPatch);
}

function launchDog(){
  var MIN_ENEMY_SPACING = 600;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 340;
  var enemy = dog.getFirstExists(false);
  
  if (enemy){
    enemy.reset(-20,game.rnd.integerInRange(0,game.height));
    //enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.velocity.x = 400;
     
    enemy.trail.start(false, 200, 3);
    enemy.update = function(){
    enemy.trail.x = enemy.x-50;
    enemy.trail.y = enemy.y;
            if (enemy.x > game.width+400) {
        enemy.trail.kill()
      }
      if (enemy.x > game.width +200) {
        enemy.kill();
      }
    }
  }
  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchDog);
}

function actionOnClick(){
  sprayDelay = 250;
  if(game.time.now > sprayTimer){
  var bullet = water.getFirstExists(false);
  if (bullet){
    bullet.reset(player.x, player.y +8);
    bullet.body.velocity.y = -400;
    sprayTimer = game.time.now + sprayDelay;
      shotCount++;
  }
}
}


function actionOnClick2(){
  player.body.velocity.x = +800;
}
function render(){
  
}

function hitGrass(enemy, bullet){
  sprayTrail = game.add.emitter(bullet.x,bullet.y+20, 10);
  sprayTrail.makeParticles('water');
  sprayTrail.setXSpeed(100);
  sprayTrail.setYSpeed(200,180);
  sprayTrail.setRotation(50,-50);
  sprayTrail.start(false, 600, 2, 40);
  enemy.kill();
  bullet.kill();
}

function hitEnemy(enemy, bullet){
  enemy.kill();
  bullet.kill();
  goodShot++;
}

function hitDog(enemy, bullet){
  bullet.kill();
  //enemy.body.velocity.x = 0;
}

function addEnemyEmitterTrail(enemy){
  var nctrail = game.add.emitter(enemy.x-500, enemy.y, 50);
  //hoseTrail.makeParticles('trail');
  nctrail.makeParticles('nyancattrail2');
  nctrail.setXSpeed(-200);
  nctrail.setYSpeed(-10,10);
  nctrail.setRotation(-10,10);
  nctrail.setAlpha(0.4, 0, 400);
  enemy.trail = nctrail;
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