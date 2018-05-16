

//var RunRun = window.RunRun || (window.RunRun = {});
//window.onload = function() {
var game = new Phaser.Game(500, 800, Phaser.AUTO, 'lawn-water'
                           //, {
//  preload: preload,
//  create: create,
//  update: update,
//  render: render
//}
                          );

//game.state.add('boot', bootState);
//game.state.add('load', loadState);
//game.state.add('menu', menuState);
//game.state.add("play", game.playState);
//game.state.add('win' , winState);

//game.state.start("play");
//}
var player;
var catplayer;
var soil;
var cursors;
var water;
var spray;
var sprayTimer = 0;
var shotCount = 0;
var goodShot = 0;
var score = 0;
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
var slashes;
var gcat;
var timer;
var total = 0;
var meow;
var splash;
var boop;
var drink;
var gamemode = 0;
var starfield;
var hose;
var cattrail;
var nyanmy;
var nyansong;
    
//    $.ajax({
//      method: "POST",
//      url: "php.php",
//      data: {score: score},
//      dataType: "int",
//      
//    })

var bootState = {
  
  create: function (){
    
    //game.physics.startSystem(Phaser.Physics.ARCADE);
    game.state.start('menu');
    //console.log("DFSFSDFSFS");
    resize();
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
  }
  
  

  
  
}

//var loadState = {
//  
//  preload: function()
//  
//  
//}

var menuState = {
  
  preload: function () {
    
    game.load.image('start', 'assets/start.png');
    resize();
  },
  create:function () {
//    game.load.image('start', 'assets/start.png');
    resize();
    
    var nameLabel = game.add.text(70,400, 'Water the Lawn', { font: '50px Arial', fill: '#ffffff'});
    
    var startLabel = game.add.text(0, game.world.height - 80, 'Hit the start button or press the spacebar key to start' ,{ font: '25px Arial', fill: '#ffffff'});
    
      var startButton = game.add.button(0, 500, 'start', this.start);

    
    var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacekey.onDown.addOnce(this.start, this);
    
  },
  
  start: function (){
    game.state.start('play');
  },
  
};

var winState = {
  create:function () {
    
    calcScore();
    
//    var username = "testing";
    var username = "John";
    var winLabel = game.add.text(70,200, 'Times up', { font: '50px Arial', fill: '#ffffff'});
    
    var startLabel = game.add.text(200, game.world.height/2, 'Your final score ' + score ,{ font: '25px Arial', fill: '#ffffff'});
    
    console.log("dsfdsfdsfds");
        $.ajax({
      method: "POST",
      url: "shooterphp.php",
      data: {username: username,
        score: score},
      dataType: "text",
          success:function(data){
            console.log(data);
          }
      
    });
  },
  
}

var playState = {
preload: function () {
//function preload() {
  game.load.image('soil', 'assets/soil.png');
  game.load.image('hose', 'assets/hose.png');
  game.load.image('trail', 'assets/hosetrail.png');
  game.load.image('water', 'assets/water.png');
  game.load.image('grass', 'assets/grass.png');
  game.load.image('bgrass', 'assets/browngrass.png');
  game.load.image('button', 'assets/leftbutton.png');
  game.load.image('Rbutton', 'assets/Spray.png');
  game.load.image('dog', 'assets/dog.png');
  game.load.image('gcat', 'assets/grumpycat3.png');
  game.load.spritesheet('slash', 'assets/grumpycatws2.png', 400, 400);
  game.load.audio('meow', 'assets/catmeow.mp3');
  game.load.audio('splash', 'assets/splash.mp3');
  game.load.audio('boop', 'assets/boop.mp3');
  game.load.audio('drink', 'assets/drink.mp3');
  game.load.audio('nyansong', 'assets/nyan_cat.mp3');
  game.load.image('nyancat', 'assets/nyancat.png');
  game.load.image('nyancattrail', 'assets/nyancattrail.png');
  game.load.image('nyancattrail2', 'assets/nyancattrailh.png');
  game.load.image('nyancat2', 'assets/nyancath.png');
  game.load.image('starfield', 'assets/starfield.jpeg');



},
create: function () {
//function create() {

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  canvas_width = window.innerWidth * window.devicePixelRatio;
  canvas_height = window.innerHeight * window.devicePixelRatio;
  timer = game.time.create(false);
  timer.loop(1000, updateCounter, this);
  timer.start();

  game.input.addPointer();
  game.input.addPointer();
  soil = game.add.tileSprite(0, 0, 1024, 900, 'soil');
  starfield = game.add.tileSprite(0, 0, 1024, 900, 'starfield');
  starfield.alpha = 0;
  hose = game.add.sprite(250, 650, 'hose');
  player = hose;
  catplayer = game.add.sprite(250, 650, 'nyancat');
  player.anchor.setTo(0.5, 0.5);
  catplayer.anchor.setTo(0.5, 0.5);
  catplayer.alpha = 0;
  game.physics.enable(player, Phaser.Physics.ARCADE);


  rightButton = game.add.button(game.world.centerX - game.world.centerX / 2, 725, 'Rbutton', actionOnClick);

  // sounds 
  meow = game.add.audio('meow');
  meow.allowMultiple = true;
  splash = game.add.audio('splash');
  splash.allowMultiple = true;
  boop = game.add.audio('boop');
  boop.allowMultiple = true;
  drink = game.add.audio('drink');
  drink.allowMultiple = true;
  nyansong = game.add.audio('nyansong');
  nyansong.allowMultiple = false;


  cursors = game.input.keyboard.createCursorKeys();
  hoseTrail = game.add.emitter(player.x, player.y + 20, 400);
  hoseTrail.makeParticles('trail');
  hoseTrail.setXSpeed(0);
  hoseTrail.setYSpeed(200, 180);
  hoseTrail.setRotation(50, -50);
  hoseTrail.start(false, 5000, 10);



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
  dog.createMultiple(5, 'dog');
  dog.setAll('anchor.x', 0.5);
  dog.setAll('anchor.y', 0.5);
  dog.setAll('scale.x', 1.0);
  dog.setAll('scale.y', 1.0);
  dog.setAll('outOfBoundsKill', true);
  dog.setAll('checkWorldBounds', true);
  launchDog();


  nyanmy = game.add.group();
  nyanmy.enableBody = true;
  nyanmy.physicsBodyType = Phaser.Physics.ARCADE;
  nyanmy.createMultiple(5, 'nyancat2');
  nyanmy.setAll('anchor.x', 0.5);
  nyanmy.setAll('anchor.y', 0.5);
  nyanmy.setAll('scale.x', 1.0);
  nyanmy.setAll('scale.y', 1.0);
  nyanmy.setAll('outOfBoundsKill', true);

  nyanmy.forEach(function (enemy) {
    addEnemyEmitterTrail(enemy);
    enemy.events.onKilled.add(function () {
      enemy.trail.kill();
    })
  });
  //launchNyan();


  text = game.add.text(0, 0, "" + shotCount + " Litres of water used", {
    font: "35px Arial",
    fill: "#ff0044",
    align: "center"
  });
  text2 = game.add.text(0, 50, "Score " + goodShot, {
    font: "35px Arial",
    fill: "#ff0044",
    align: "center"
  });
  sprayButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


  gcat = game.add.group();
  gcat.enableBody = true;
  gcat.physicsBodyType = Phaser.Physics.ARCADE;
  gcat.createMultiple(5, 'gcat');
  gcat.setAll('anchor.x', 0.5);
  gcat.setAll('anchor.y', 0.5);
  gcat.setAll('scale.x', 1.0);
  gcat.setAll('scale.y', 1.0);
  gcat.setAll('outOfBoundsKill', true);
  gcat.setAll('checkWorldBounds', true);
  launchCat();

  slashes = game.add.group();
  slashes.enableBody = true;
  slashes.physicsBodyType = Phaser.Physics.ARCADE;
  slashes.createMultiple(30, 'slash');
  slashes.setAll('anchor.x', 0.5);
  slashes.setAll('anchor.y', 0.5);
  slashes.forEach(function (slash) {
    slash.animations.add('slash');
  })

},

update: function () {
//function update() {
  text.setText("" + shotCount + " Litres used")
  text2.setText("Score " + goodShot)
  game.input.scale;




  //resize();

  soil.tilePosition.y += 2;
  player.body.velocity.setTo(0, 0);
  if (game.input.pointer1.isDown) {
    xpos = game.input.pointer1.x;
    ypos = game.input.pointer1.y;
  }
  if (game.input.pointer2.isDown) {
    xpos1 = game.input.pointer2.x;
    ypos1 = game.input.pointer2.y;
  }
  if (ypos1 > window.innerHeight * 7 / 8 || ypos > window.innerHeight * 7 / 8) {
    actionOnClick();
    ypos1 = 0;
    ypos = 0;
  }
  if (xpos > player.x && ypos < 685) {
    player.body.velocity.x = 1.5 * (xpos - player.x);
    if (xpos - player.x < 150) {
      player.body.velocity.x = 225;
    }

  }
  if (xpos < player.x && ypos < 685) {
    player.body.velocity.x = 1.5 * (xpos - player.x);
    if (player.x - xpos < 150) {
      player.body.velocity.x = -225;
    }

  }
  if (xpos <= player.x + 5 && xpos >= player.x - 5) {
    player.body.velocity.x = 0;
  }

  
  
  
  // COllISSION TYPES
  game.physics.arcade.overlap(grassPatch, water, hitGrass, null, this);
  game.physics.arcade.overlap(bgrassPatch, water, hitEnemy, null, this);
  game.physics.arcade.overlap(dog, water, hitDog, null, this);
  game.physics.arcade.overlap(gcat, water, hitCat, null, this);
  game.physics.arcade.overlap(nyanmy, water, hitNyan, null, this);

  if(total >= 5){
    game.state.start('win');
    
  }

  if (cursors.left.isDown) {
    player.body.velocity.x = -300;
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 300;
  }
  if (player.x > game.width - 25) {
    player.x = game.width - 25;
    player.body.acceleration.x = 0;
  }
  if (player.x < 25) {
    player.x = 25;
    player.body.acceleration.x = 0;
  }
  if (sprayButton.isDown) {
    spray();
  }
  hoseTrail.x = player.x;
},

  
  render: function () {
//function render() {
  game.debug.text(total, 400, 63);
  game.debug.text(gamemode, 400, 50);
}
}


game.state.add('boot', bootState);
//game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add("play", playState);
game.state.add('win' , winState);

game.state.start('boot');


/*
END OF GAME STATES

*/
/*

CONTROLS GAME MODE RIGHT HERE
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************
******************************************************

*/
function spray() {
  if (total > 5 && shotCount == 0) {
    gamemode = 1;
  }
  if (gamemode == 1) {
    launchNyan();
  }
  sprayDelay = 250;
  if (game.time.now > sprayTimer) {
    var bullet = water.getFirstExists(false);
    if (bullet) {
      bullet.reset(player.x, player.y + 8);
      bullet.body.velocity.y = -400;
      sprayTimer = game.time.now + sprayDelay;
      shotCount++;
      boop.play();
      modeChange();

    }
  }
}



function actionOnClick() {

  if (total > 5 && shotCount == 0) {
    gamemode = 1;
  }
  sprayDelay = 250;
  if (gamemode == 1) {
    launchNyan();
  }
  if (game.time.now > sprayTimer) {
    var bullet = water.getFirstExists(false);
    if (bullet) {
      bullet.reset(player.x, player.y + 8);
      bullet.body.velocity.y = -400;
      sprayTimer = game.time.now + sprayDelay;
      shotCount++;
      boop.play();
      modeChange();
    }
  }
}

function launchGrassPatch() {
  var MIN_ENEMY_SPACING = 600;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 200;
  var enemy = grassPatch.getFirstExists(false);
  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.velocity.x = game.rnd.integerInRange(-100, 100);
  }
  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchGrassPatch);
}

function launchbGrassPatch() {
  var MIN_ENEMY_SPACING = 600;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 150;
  var enemy = bgrassPatch.getFirstExists(false);
  //console.log(enemy);
  if (enemy) {
    enemy.reset(game.rnd.integerInRange(0, game.width), -20);
    enemy.body.velocity.y = ENEMY_SPEED;

  }
  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchbGrassPatch);
}

function launchDog() {
  if (gamemode == 0) {
    var MIN_ENEMY_SPACING = 1200;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 340;
    var enemy = dog.getFirstExists(false);

    if (enemy) {
      enemy.reset(game.rnd.integerInRange(0, game.width), -20);
      enemy.body.velocity.y = ENEMY_SPEED;

      enemy.body.velocity.x = game.rnd.integerInRange(-200, 200);

    }
    game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchDog);
  }
}



function actionOnClick2() {
  player.body.velocity.x = +800;
}



function hitGrass(enemy, bullet) {
  sprayTrail = game.add.emitter(bullet.x, bullet.y + 20, 10);
  sprayTrail.makeParticles('water');
  sprayTrail.setXSpeed(100);
  sprayTrail.setYSpeed(200, 180);
  sprayTrail.setRotation(50, -50);
  sprayTrail.start(false, 600, 2, 40);
  enemy.kill();
  bullet.kill();
  splash.play();
}

function hitEnemy(enemy, bullet) {
  enemy.kill();
  bullet.kill();
  goodShot++;
  splash.play();
}

function hitDog(enemy, bullet) {
  bullet.kill();
  enemy.body.velocity.x = 0;
  drink.play();
}

function hitNyan(enemy, bullet) {
  bullet.kill();
}


function launchCat() {
  if (gamemode == 0) {
    var MIN_ENEMY_SPACING = 1200;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 200;

    var enemy = gcat.getFirstExists(false);
    if (enemy) {
      enemy.reset(game.rnd.integerInRange(0, game.width), -20);
      enemy.body.velocity.y = ENEMY_SPEED;
      enemy.body.velocity.x = game.rnd.integerInRange(-200, 200);
    }
    game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchCat);
  }
}


function hitCat(enemy, bullet) {
  meow.play();
  var slash = slashes.getFirstExists(false);

  slash.reset(game.width * 0.5, game.height * 0.5);
  slash.alpha = 0.7;
  slash.play('slash', 5, false, true);
  enemy.kill();
  bullet.kill();



}

function modeChange() {

  if (gamemode == 1) {
    nyansong.loopFull();
    //player.kill();
    catplayer.alpha = 1;
    starfield.alpha = 1;
    player = catplayer;
    game.physics.enable(player, Phaser.Physics.ARCADE);
    //hose.setAlpha = 0;
    hose.kill();
    hoseTrail.destroy();

    hoseTrail = game.add.emitter(player.x, player.y + 50, 400);
    hoseTrail.makeParticles('nyancattrail');
    hoseTrail.setXSpeed(0);
    hoseTrail.setYSpeed(200, 180);
    hoseTrail.setRotation(50, -50);
    hoseTrail.setAlpha(0.4, 0, 400);
    hoseTrail.start(false, 5000, 10);

    gamemode++;

  }
}


function addEnemyEmitterTrail(enemy) {
  var nctrail = game.add.emitter(enemy.x - 500, enemy.y, 50);
  //hoseTrail.makeParticles('trail');
  nctrail.makeParticles('nyancattrail2');
  nctrail.setXSpeed(-200);
  nctrail.setYSpeed(-10, 10);
  nctrail.setRotation(-10, 10);
  nctrail.setAlpha(0.4, 0, 400);
  enemy.trail = nctrail;
}


function launchNyan() {
  var MIN_ENEMY_SPACING = 600;
  var MAX_ENEMY_SPACING = 3000;
  var ENEMY_SPEED = 340;
  var enemy = nyanmy.getFirstExists(false);

  if (enemy) {
    enemy.reset(-20, game.rnd.integerInRange(0, game.height-100));
    //enemy.body.velocity.y = ENEMY_SPEED;
    enemy.body.velocity.x = 400;

    enemy.trail.start(false, 200, 3);
    enemy.update = function () {
      enemy.trail.x = enemy.x - 50;
      enemy.trail.y = enemy.y;
      if (enemy.x > game.width + 400) {
        enemy.trail.kill()
      }
      if (enemy.x > game.width + 200) {
        enemy.kill();
      }
    }
  }
  game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchNyan);
}

function updateCounter() {
  total++;

}

function calcScore (){
  
  score = goodShot*4 - shotCount;
}


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
