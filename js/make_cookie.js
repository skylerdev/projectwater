function makeCookie() {
  var cookieExist = checkCookie();
    if(!cookieExist){
        var d = new Date();
        d.setTime(d.getTime() + (10*365*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "username" + "=" + myForm.username.value + ";" + expires + ";path=/";
        document.cookie = "team" + "=" + myForm.team.value + ";" + expires + ";path=/";

    }
}

function checkCookie(){
  if (document.cookie.indexOf("visited=")>= 0){
    return true;
  }
}

var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

//password.onchange = validatePassword;
//confirm_password.onkeyup = validatePassword;

