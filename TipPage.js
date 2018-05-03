var myTips = new Array();
myTips[0] = "To be or not to be";
myTips[1] = "The only thing we have to fear is fear itself";
myTips[2] = "Give me liberty or give me death";
  
var myRandom = Math.floor(Math.random() * myQuotes.length);

$('#myTips').html(myTips[myRandom]);