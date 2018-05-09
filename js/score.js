$('document').ready(function () {
    var username = getCookie('username');
    $('#global').ready(function () {
        var tab = "global";
        $.ajax({
            url: "score.php",
            method: "GET",
            data: {tab: tab},
            dataType: "text",
            success: function (data) {
                var scores = jQuery.parseJSON(data);

                $('#pipe-score').html(scores['pipe']);
                $('#shooter-score').html(scores['shooter']);
            }
        });
    });

    $('#personal').ready(function () {
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

                $('#pipe-score-personal').html(scores['pipe']);
                $('#shooter-score-personal').html(scores['shooter']);
            }
        });
    });

    $('#team').ready(function () {
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