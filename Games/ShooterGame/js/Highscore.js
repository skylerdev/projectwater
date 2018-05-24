$('document').ready(function () {

    var tab = "global-at";
    $.ajax({
        url: "score.php",
        method: "GET",
        data: {tab: tab},
        dataType: "text",
        success: function (data) {
            console.log(data);
            var scores = jQuery.parseJSON(data);

            //$('#highscores').html(scores['pipe']);
            $('#shooter-score-at').html(scores['shooter']);
            //$('#tap-score-at').html(scores['tap']);
        }
    });
    
});

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
    return "";
}