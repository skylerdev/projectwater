$('document').ready(function () {

    //Gets username from Cookie
    var username = getCookie('username');
    var team = getCookie('team');
    $('#global-at').ready(function () {
        var tab = "global-at";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {tab: tab},
            dataType: "text",
            success: function (data) {
                var scores = jQuery.parseJSON(data);

                $('#pipe-score-at').html(scores['pipe']);
                $('#shooter-score-at').html(scores['shooter']);
                $('#tap-score-at').html(scores['tap']);
            }
        });
    });

    $('#personal-at').ready(function () {
        var tab = "personal-at";

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
                $('#tap-score-personal-at').html(scores['tap']);
            }
        });
    });

    $('#team-at').ready(function () {
        var tab = "team-at";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {
                tab: tab,
                team: team
            },
            dataType: "text",
            success: function (data) {
                var scores = jQuery.parseJSON(data);

                $('#pipe-score-team-at').html(scores['pipe']);
                $('#shooter-score-team-at').html(scores['shooter']);
                $('#tap-score-team-at').html(scores['tap']);
            }
        });
    });

    $('#global-daily').ready(function () {
        var tab = "global-daily";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {tab: tab},
            dataType: "text",
            success: function (data) {
                var scores = jQuery.parseJSON(data);

                $('#pipe-score-daily').html(scores['pipe']);
                $('#shooter-score-daily').html(scores['shooter']);
                $('#tap-score-daily').html(scores['tap']);
            }
        });
    });

    $('#personal-daily').ready(function () {
        var tab = "personal-daily";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {
                tab: tab,
                username: username
            },
            dataType: "text",
            success: function (data) {
                console.log(data);

                //var scores = jQuery.parseJSON(data);

                //$('#pipe-score-personal-daily').html(scores['pipe']);
                //$('#shooter-score-personal-daily').html(scores['shooter']);
                //$('#tap-score-personal-daily').html(scores['tap']);

            }
        });
    });

    $('#team-daily').ready(function () {
        var tab = "team-daily";
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
                //var scores = jQuery.parseJSON(data);

                //$('#pipe-score-team-daily').html(scores['pipe']);
                //$('#shooter-score-team-daily').html(scores['shooter']);
                //$('#tap-score-team-daily').html(scores['tap']);
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