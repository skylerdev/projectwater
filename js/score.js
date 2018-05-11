$('document').ready(function () {

    //Gets username from Cookie
    var username = getCookie('username');
    var team = getCookie('team');

    $('#global-at').ready(function () {
        var tab = "global";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {tab: tab},
            dataType: "text",
            success: function (data) {

                var scores = jQuery.parseJSON(data);

                $('#pipe-score-at').html(scores['pipe']);
                $('#shooter-score-at').html(scores['shooter']);
            }
        });
    });

    $('#personal-at').ready(function () {
        var tab = "personal";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {
                tab: tab,
                username: username
            },
            dataType: "text",
            success: function (data) {

                var scores = jQuery.parseJSON(data);

                $('#pipe-score-personal-at').html(scores['pipe']);
                $('#shooter-score-personal-at').html(scores['shooter']);
            }
        });
    });

    $('#team-at').ready(function () {
        var tab = "team";
        var team = "Werter";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {
                tab: tab,
                team: team,
            },
            dataType: "text",
            success: function (data) {
                //console.log(data);
                var scores = jQuery.parseJSON(data);

                $('#pipe-score-team').html(scores['pipe']);
                $('#shooter-score-team').html(scores['shooter']);
            }
        });
    });

    $('#global-daily').ready(function () {
        var tab = "global";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {tab: tab},
            dataType: "text",
            success: function (data) {

                var scores = jQuery.parseJSON(data);

                $('#pipe-score-at').html(scores['pipe']);
                $('#shooter-score-at').html(scores['shooter']);
            }
        });
    });

    $('#personal-daily').ready(function () {
        var tab = "personal";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {
                tab: tab,
                username: username
            },
            dataType: "text",
            success: function (data) {

                var scores = jQuery.parseJSON(data);

                $('#pipe-score-personal-at').html(scores['pipe']);
                $('#shooter-score-personal-at').html(scores['shooter']);
            }
        });
    });

    $('#team-daily').ready(function () {
        var tab = "team";
        var team = "Werter";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {
                tab: tab,
                team: team,
            },
            dataType: "text",
            success: function (data) {
                //console.log(data);
                var scores = jQuery.parseJSON(data);

                $('#pipe-score-team').html(scores['pipe']);
                $('#shooter-score-team').html(scores['shooter']);
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