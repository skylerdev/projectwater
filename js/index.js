$('document').ready(function(){
            //Creates User login info cookies
            startCookies()
            /**
             * Logout JS
             */
             
            $('#logout-link').click(function(e){
                e.preventDefault();
                deleteCookie("username");
                deleteCookie("teamname");
                window.location = "/index.html";
            });
            /**
            *Signup JS
            **/
            $('#signup-button').click(function(e){
                e.preventDefault();
                var username = $('#signup').val();
                console.log(username);
                if(username){
                $.ajax ({
                    url : "verify.php",
                    method : "POST",
                    data :  {username:username},
                    dataType: "text",
                    success:function(data) {
                        if(data == 'false'){
                            $('#signup').css('border','2px solid red');
                            $('#error-signup').html('  Username is taken');
                        } else {
                            $('#signup').css('border','2px solid #39ff14');
                            $('#error-signup').html('');
                            $.ajax ({
                                url : "submit.php",
                                method : "POST",
                                data :  {username:username},
                                dataType: "text",
                                success:function(data) {
                                    makeCookie2("username",username);
                                     window.location = "/index.html";
                                  }
                            });
                        }
                    }
                })
                } else {
                    $('#error-signup').html('Name cannot be blank');
                }
                
                
            });
            
            /**
            *Login JS
            **/
            $('#login-button').click(function(e){
                e.preventDefault();
                var username = $('#login').val();
                $.ajax ({
                    
                    url : "verify.php",
                    method : "POST",
                    data :  {username:username},
                    dataType: "text",
                    success:function(data) {
                        
                        if(data.length > 0){
                            makeCookie2("username",username);
                            makeCookie2("teamname",data)
                            window.location = "/index.html";
                        } else {
                            $('#login').css('border','2px solid red');
                            $('#error-login').html('  Username does not exist');
                            
                        }
                    }
                })
                
            });
            
            /***
             * Team JS
             ***/
            $('#team-button').click(function(e){
                e.preventDefault();
                var username = getCookie("username");
                var team = $('#teamname').val();
                console.log(username);
                console.log(team);
                $.ajax ({
                    url : "submit.php",
                    method : "POST",
                    data :  {username:username,
                             teamname:team
                    },
                    dataType: "text",
                    success:function(data) {
                        
                            console.log("success");
                            makeCookie2("username",username);
                            makeCookie2("teamname",team);
                            window.location = "/index.html";
                        
                    }
                })
                
            });
            
           $('#game-button').mouseup(function(){
               
/**         $('#game-button').css("background-color","rgba(0, 89, 135 ,1)").css         ("width", "820px").css("height", "340px");       */
                
                randGame();
            });
   });









const quotes = [
	{ 
		"quote" : "The average canadian uses 329 litres of water every day while the average African family uses only 20 litres."
	},
	{
		"quote" : "Running the tap while brushing your teeth can waste 16 litres of water!"
	},
	{
		"quote" : "From May 1st to October 15th citizens are only allowed to water their lawns on specific days, visit metrovancouver.org to find out more!"
	},
	{
        "quote" : "Newer toilets use as little as a third as much water as older toilets!"
    },
    {
        "quote" : "Fixing a leaky faucet can save over 10 000 litres of water in a year!"
    },
    {
        "quote" : "Low-flow shower heads use as little as half as much water as regular shower heads!"
    },
    {
        "quote" : "Instead of running the tap while washing dishes, fill the sink with soapy water."
    },
    {
        "quote" : "Watering your plants early in the morning can reduce the amount of water needed because a lot less will evaporate"
    },
    { 
        "quote" : "If it's yellow let it mellow. If its brown flush it down!"
    },
]


function randomQuote() {
  let random = quotes[Math.floor(Math.random() * quotes.length)];
  quotation.innerText = `${random.quote}`;
}

randomQuote();

/* Cookie Functions */

function makeCookie() {
  var cookieExist = checkCookie();
    if(!cookieExist){
        var d = new Date();
        d.setTime(d.getTime() + (1*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "username" + "=" + myForm.signup.value + ";" + expires + ";path=/";
        document.cookie = "teamname" + "=" + myFormTwo.teamname.value + ";" + expires + ";path=/";

    }
}
function makeCookie2(name,content) {
    
    var d = new Date();
    d.setTime(d.getTime() + (1*365*24*60*60*1000));
    
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + content + ";" + expires + ";path=/";
}

function checkCookie(){
  if (document.cookie.indexOf("visited=")>= 0){
    return true;
  }
}
function startCookies(){
    let user = getCookie('username');
    if (user){
        $('#signup-link').attr('class','hide');
        $('#login-link').attr('class','hide');
        $('#logout-link').removeClass("hide");
        $('#team-link').removeClass("hide");
    }
    
    if(user){
        
    loginInfo();
    }
}

function loginInfo(){
    let user = getCookie("username");
    let team = getCookie("teamname");
    if(team === false) {
        team = "";
    }
    $('#loginUsername').removeClass("hide").html("Username: " + user);
    $('#loginTeamname').removeClass("hide").html("Teamname: " + team);
    
}
/* Deletes a cookie*/

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


/* Gets a cookie */
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
  return false;
}
/* Log off */
function logOff() {
   deleteCookie("username");
}
/* Chooses a random game */

function randGame(){
     var url = [
        'Games/ShooterGame',
        'Games/PipeGame',
        'Games/TapGame'
    ]
    var rand = Math.floor(Math.random() * url.length);
    console.log(rand);
    window.location = url[rand];
}
