var pipeArray = [
   [],
   [],
   [],
   [],
   [],
   [],
];

var canvas = document.getElementById("gameDisplay"),
		ctx = canvas.getContext("2d"),
		vPipe = document.getElementById("vPipe"),
		hPipe = document.getElementById("hPipe"),
		leftUp = document.getElementById("lUPipe"),
		rightUp = document.getElementById("rUPipe"),
		rightDown = document.getElementById("rDPipe"),
		leftDown = document.getElementById("lDPipe"),
		allPipe = document.getElementById("allPipe"),
    startPipe = document.getElementById("startPipe"),
    endPipe = document.getElementById("endPipe");

var timer, time = 0;

var xPos, yPos;

/*
var event = new MouseEvent( "click", {'view': window, 'bubbles': true, 'cancelable': true});
document.dispatchEvent(event);
document.getElementById("canvas").dispatchEvent(event);
*/

function setup() {
	createPipeArray();
  drawBoard();
	drawPipes();
	logArray();
  animateTimer();
	console.log("initialized");
}

function drawTimer() {
  ctx.clearRect(0, 0, 320, 64);
  ctx.font = "30px Verdana";
  ctx.fillText("Time: " + time, 10, 40);
  time++;
}
function animateTimer() {
  drawTimer();
  timer = setInterval(drawTimer, 1000);
}
function drawBoard() {
  ctx.beginPath();
  ctx.moveTo(canvas.width * (1 / 6), 64);
  ctx.lineTo(canvas.width * (1 / 6), canvas.height - 64);
  ctx.moveTo(canvas.width * (2 / 6), 64);
  ctx.lineTo(canvas.width * (2 / 6), canvas.height - 64);
  ctx.moveTo(canvas.width * (3 / 6), 64);
  ctx.lineTo(canvas.width * (3 / 6), canvas.height - 64);
  ctx.moveTo(canvas.width * (4 / 6), 64);
  ctx.lineTo(canvas.width * (4 / 6), canvas.height - 64);
  ctx.moveTo(canvas.width * (5 / 6), 64);
  ctx.lineTo(canvas.width * (5 / 6), canvas.height - 64);
  ctx.moveTo(0, canvas.height * (1 / 8));
  ctx.lineTo(canvas.width, canvas.height * (1 / 8));
  ctx.moveTo(0, canvas.height * (2 / 8));
  ctx.lineTo(canvas.width, canvas.height * (2 / 8));
  ctx.moveTo(0, canvas.height * (3 / 8));
  ctx.lineTo(canvas.width, canvas.height * (3 / 8));
  ctx.moveTo(0, canvas.height * (4 / 8));
  ctx.lineTo(canvas.width, canvas.height * (4 / 8));
  ctx.moveTo(0, canvas.height * (5 / 8));
  ctx.lineTo(canvas.width, canvas.height * (5 / 8));
  ctx.moveTo(0, canvas.height * (6 / 8));
  ctx.lineTo(canvas.width, canvas.height * (6 / 8));
  ctx.moveTo(0, canvas.height * (7 / 8));
  ctx.lineTo(canvas.width, canvas.height * (7 / 8));
  ctx.stroke();
  
  ctx.drawImage(startPipe, 0, 448);
  ctx.drawImage(endPipe, 320, 0);
}

function drawPipes() {
	var toDrawn = vPipe;

	let xPos = 0, yPos = 64;
	let x, y;
	for (y = 0; y < 6; y++) {
		for (x = 0; x < 6; x++) {
			switch (pipeArray[x][y]) {
				case 1:
					toDrawn = rightDown;
					break;
				case 2:
					toDrawn = hPipe;
					break;
				case 3:
					toDrawn = leftDown;
					break;
				case 4:
					toDrawn = vPipe;
					break;
				case 5:
					toDrawn = rightUp;
					break;
				case 6:
					toDrawn = leftUp;
					break;
				case 7:
					toDrawn = allPipe;
			}
			ctx.drawImage(toDrawn, xPos, yPos);
			xPos += 64;
			if (xPos >= 384) {
				xPos = 0;
				yPos += 64;
			}
		}
	}
}

function createPipeArray() {
	let x, y;
	for (y = 0; y < 6; y++) {
		for (x = 0; x < 6; x++) {
			pipeArray[x][y] = Math.floor(Math.random() * 7) + 1;
		}
	}
}

function logArray() {
	let x, y;
	
	for (x = 0; x < 6; x++) {
		for (y = 0; y < 6; y++) {
			console.log("Arr: (" + x + ", " + y + ") " + pipeArray[x][y]);
		}
	}
}

function touchPos(event){
  console.log("touchstart")
  xPos = event.touches[0].clientX;
  yPos = event.touches[0].clientY;
}

function displayPos(event) {
  ctx.clearRect(64, 448, canvas.width, canvas.height);
  ctx.fillText("(" + Math.floor(xPos) + ", " + Math.floor(yPos) + ")", 64, 475);
}