
var smiley = document.createElement("img");
smiley.src = "Smiley.png";
var sad = document.createElement("img");
sad.src = "Sad.png";
var mockup1 = document.createElement("img");
mockup1.src = "mock1.png";
var mockup2 = document.createElement("img");
mockup2.src = "mock2.png";
var mockup3 = document.createElement("img");
mockup3.src = "mock3.png";

function setup(){
	drawFrowny();
}
function saveWater() {
	document.getElementById("tap").src = "tap_off.png";
}

function dontSaveWater() {
	document.getElementById("tap").src = "tap.png";
}

function drawSmiley() {
	var canvas = document.getElementById("faces");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(smiley, 10, 10, canvas.width - 20, canvas.height - 20);
}

function drawFrowny() {
	var canvas = document.getElementById("faces");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(sad, 10, 10, canvas.width - 20, canvas.height - 20);
}

function showMock1(){
	var canvas = document.getElementById("mockupDisplay");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(mockup1, 10, 10, canvas.width - 20, canvas.height - 20);
}

function showMock2(){
	var canvas = document.getElementById("mockupDisplay");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(mockup2, 10, 10, canvas.width - 20, canvas.height - 20);
}