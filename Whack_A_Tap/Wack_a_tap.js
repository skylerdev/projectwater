var taps;
var spacing;
var startx = 30;
var starty = 30;
var spacing = 10;
var defaultNumber;
var defaultSize = 70;
var maxCols = 4;
var difficulty;

function setup() {
  createCanvas(500, 800);
  taps = [];
  
  var y = starty;
  var x = startx;
  var row = 1;
  
  for(var i = 0; i < 20; i++){
  taps[i] = new Tap(x, y);
  x += defaultSize + spacing;
  if(x > maxCols * (defaultSize + spacing - 10)){
    y += defaultSize + spacing;
    x = startx;
  }
    
  }
    
  
  
}

function draw() {
  background(0);
 
  
  //display each tapp
  taps.forEach(function(item) {
    item.update();
    item.display();
  });
  
   fill(255, 255, 255);
  text('Make sure they dont go blue', 100, 100);
  
  

}

function Tap(ix, iy) {
  this.x = ix;
  this.y = iy;
  this.size = defaultSize;
  this.on = false;
  
  this.display = function() {
    if (this.on) {
      fill(0, 0, 255);
    }else{
    fill(0, 255, 0);
    }
    
    ellipse(this.x, this.y, this.size, this.size);
    
    
  }
  
  this.update = function() {
    
    //turn off if clicked on
     if(this.x < mouseX && mouseX < this.x + this.size){
       if(this.y < mouseY && mouseY < this.y + this.size){
         if(mouseIsPressed){
           this.on = false;
         }
       }
     }
     
     
     //turn on if randomly selected by rnjesus 
     var rand = Math.floor((Math.random() * 900) + 1);
     if(rand == 10){
       this.on = true;
     }
       
     
     
     
  }
  
  this.toggle = function() {
    if(this.on){
      this.on = false;
    }else{
      this.on = true;
    }
  }

}
