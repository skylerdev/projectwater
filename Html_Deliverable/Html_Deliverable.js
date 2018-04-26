function setup() {
	drawFrowny();
	showMock1();
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

function showMock1() {
	var img = document.getElementById("mockupDisplay");
	img.src = "mock1.png";

}

function showMock2() {
	var img = document.getElementById("mockupDisplay");
	img.src = "mock2.png";

}

function showMock3() {
	var img = document.getElementById("mockupDisplay");
	img.src = "mock3.png";
	
}