$('document').ready(function () {

    //Gets username from Cookie
    var username = getCookie('username');
    var team = getCookie('team');
    


    $('#team-at').ready(function () {
        var tab = "team-daily";
        $.ajax({
            url: "score.php?v=1",
            method: "GET",
            data: {
                tab: tab,
                team: team
            },
            dataType: "text",
            success: function (data) {
                console.log(data);
                var scores = jQuery.parseJSON(data);
                console.log(scores);

                $('#pipe-score-team-at').html(scores['pipe']);
                $('#shooter-score-team-at').html(scores['shooter']);
                $('#tap-score-team-at').html(scores['tap']);
            }
        });
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