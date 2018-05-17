var canvas = document.getElementById("canvas1"),
    ctx1 = canvas.getContext("2d"),
    f1 = document.getElementById("faucet_full1"),
    f2 = document.getElementById("faucet_full2"),
    f3 = document.getElementById("faucet_full3"),
    f4 = document.getElementById("faucet_full4"),
    d1 = document.getElementById("faucet_drip1"),
    d2 = document.getElementById("faucet_drip2"),
    d3 = document.getElementById("faucet_drip3"),
    d4 = document.getElementById("faucet_drip4"),
    d5 = document.getElementById("faucet_drip5"),
    d6 = document.getElementById("faucet_drip6"),
    d7 = document.getElementById("faucet_drip7"),
    d8 = document.getElementById("faucet_drip8"),
    d9 = document.getElementById("faucet_drip9"),
    curFrame = 0,
    outFrame;

function drawFaucet() {
  if(curFrame == 0){
    outFrame = f1;
    curFrame++;
  }else if(curFrame == 1){
    outFrame = f2;
    curFrame++;
  }else if(curFrame == 2) {
    outFrame = f3;
    curFrame++;
  }else if(curFrame == 3) {
    outFrame = f4;
    curFrame = 0;
  }
  ctx1.clearRect(0,0,canvas.width,canvas.height);
  ctx1.drawImage(outFrame, 0, 0, canvas.width, canvas.height);
}

function drawDrip() {
  if(curFrame == 0){
    outFrame = d1;
    curFrame++;
  }else if(curFrame == 1){
    outFrame = d2;
    curFrame++;
  }else if(curFrame == 2) {
    outFrame = d3;
    curFrame++;
  }else if(curFrame == 3) {
    outFrame = d4;
    curFrame++;
  }else if(curFrame == 4) {
    outFrame = d5;
    curFrame++;
  }else if(curFrame == 5) {
    outFrame = d6;
    curFrame++;
  }else if(curFrame == 6) {
    outFrame = d7;
    curFrame++;
  }else if(curFrame == 7) {
    outFrame = d8;
    curFrame++;
  }else if(curFrame == 8) {
    outFrame = d9;
    curFrame = 0;
  }
  ctx1.clearRect(0,0,canvas.width,canvas.height);
  ctx1.drawImage(outFrame, 0, 0, canvas.width, canvas.height);
}

function animateFaucet(){
  setInterval(drawFaucet, 1000);
}

function animateDrip(){
  setInterval(drawDrip, 500);
}