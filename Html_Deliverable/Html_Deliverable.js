var xWave = -900;
var yWave = 10;
var tapOn = true;

var animateWater;
var animateLevel;
var animateLevelOn = false;

function setup() {
	drawFrowny();
	animateWaterLevel();
}

function clickFaucet(){
	if(tapOn == true){
		drawSmiley();
		saveWater();
		tapOn = false;
	}else if(tapOn == false){
		drawFrowny();
		dontSaveWater();
		tapOn = true;
	}
}
function saveWater() {
	document.getElementById("tap").src = "tap_off.png";
}

function dontSaveWater() {
	document.getElementById("tap").src = "tap.png";
}

function drawSmiley() {
	var img = document.getElementById("faces");
	img.src = "Smiley.png";
}

function drawFrowny() {
	var img = document.getElementById("faces");
	img.src = "Sad.png";
}
function drawWaterLevel(){
	var canvas = document.getElementById("waterLevelDisplay");
	var ctx = canvas.getContext("2d");
	var waveImg = document.getElementById("waves");
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.drawImage(waveImg, xWave, yWave);
	xWave += 3; 
	if(xWave > canvas.width - 260){
		xWave = -830;
	}
}
function animateWaterLevel(){
	animateWater = setInterval(drawWaterLevel,1000/30);
}

function raiseWaterLevel(){
	if(animateLevelOn == false){
		var count = 0;
		animateLevelOn = true;
		animateWaterAgain = setInterval(function(){
		yWave -= 2;
		count += 1;
	if(count == 5){
		clearInterval(animateWaterAgain);
		count = 0;
		animateLevelOn = false;
	}
	}, 1000/20);
	}
}
function lowerWaterLevel(){
	if(animateLevelOn == false){
		var count = 0;
		animateLevelOn = true;
		animateWaterAgain = setInterval(function(){
		yWave += 2;
		count += 1;
	if(count == 5){
		clearInterval(animateWaterAgain);
		count = 0;
		animateLevelOn = false;
	}
	}, 1000/20);
	}
}