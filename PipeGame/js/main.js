var counter = 0;

var PipeGame = new Phaser.Class({
   Extends: Phaser.Scene,
   initialize: function PipeGame() {
      Phaser.Scene.call(this, {
         key: 'pipeGame'
      });

      this.pipes;
      this.score;
   },

   //Where game files are loaded.
   preload: function () {
      this.load.atlas('pipe', 'Assets/Pipe_Sheet_Transparent.png', 'Assets/Pipe_Sheet.json');
   },

   //Assets can be quickly accessed.
   create: function () {
      window.addEventListener('resize', resize);
      resize();
      
      // this.pipes = this.add.image(50, 50, 'pipe');
      this.pipes = this.add.group({
         key: 'pipe',
         frame: ["rightDown", "horizontal", "leftDown", "vertical", "rightUp", "leftUp", "allPipe"], frameQuantity: 6,
         gridAlign: {width:6, height: 7, cellWidth: 64, cellHeight: 64, x: 32, y: 32}
      });
      
      
      
      this.input.on('pointerup', function () {
         counter++;
         this.score.setText("You clicked " + counter + " times!");
      }, this);
      
      this.score = this.add.text(300, 200, '', 20);
      this.score.setColor("rgb(0,0,0)");
   },
   //Runs constantly to check user input, game actions, etc.
   update: function () {
   }

});

var config = {
   type: Phaser.AUTO,
   width: 600,
   height: 600,
   backgroundColor: "#ffffff",
   scene: [ PipeGame ]
};



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

var game = new Phaser.Game(config);