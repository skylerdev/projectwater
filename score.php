<?php

$servername = 'localhost';
$user = 'root';
$password = '';
$dbname = 'projectwater';

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

//Gets username and tab from GET
if (isset($_GET['username'])) {
    $username = $_GET['username'];
}
if (isset($_GET['team'])) {
    $team = $_GET['team'];
}
if (isset($_GET['tab'])) {
    $tab = $_GET['tab'];
}
date_default_timezone_set('America/Vancouver');
$date = date('Y-m-d');

/************************
 * Global All Time score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'global-at')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID ORDER BY score DESC');

    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $pipe .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

    }


    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID ORDER BY score DESC');

    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $shooter .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

    }


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN tap_score ON tap_score.UserID=users.UserID ORDER BY score DESC');

    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $tap .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

    }


    $result = array('pipe' => $pipe,'shooter' => $shooter, 'tap' => $tap);

    echo json_encode($result);
}


/************************
 * Personal All Time score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'personal-at')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID WHERE Username=? ORDER BY score DESC');
    $stmt->bind_param('s',$username);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $pipe .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }

    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE Username=? ORDER BY score DESC');
    $stmt->bind_param('s',$username);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $shooter .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE Username=? ORDER BY score DESC');
    $stmt->bind_param('s',$username);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $tap .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }


    $result = array('pipe' => $pipe,'shooter' =>$shooter, 'tap' => $tap);

    echo json_encode($result);
}


/************************
 * Team All Time score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'team-at')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID WHERE Teamname=? ORDER BY score DESC');
    $stmt->bind_param('s',$team);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $pipe .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }

    /************************
     * Returns Shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE Teamname=? ORDER BY score DESC');
    $stmt->bind_param('s',$team);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $shooter .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }

    /************************
     * Returns Tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE Teamname=? ORDER BY score DESC');
    $stmt->bind_param('s',$team);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        $tap .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }





    $result = array('pipe' => $pipe, 'shooter' => $shooter, 'tap' => $tap);

    echo json_encode($result);
}


/************************
 * Global Daily score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'global-daily')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID WHERE DATE=? ORDER BY score DESC');
    $stmt->bind_param('s',$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $pipe .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $pipe .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

    }

    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE DATE=? ORDER BY score DESC');
    $stmt->bind_param('s',$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $shooter .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $shooter .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

    }


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE DATE=? ORDER BY score DESC');
    $stmt->bind_param('s',$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $tap .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $tap .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

    }


    $result = array('pipe' => $pipe,'shooter' => $shooter, 'tap' => $tap);

    echo json_encode($result);
}


/************************
 * Personal Daily score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'personal-daily')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID WHERE Username=? AND DATE=? ORDER BY score DESC');
    $stmt->bind_param('ss',$username,$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $pipe .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $pipe .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }

    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE Username=? AND DATE=? ORDER BY score DESC');
    $stmt->bind_param('ss',$username,$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $shooter .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $shooter .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE Username=? AND DATE=? ORDER BY score DESC');
    $stmt->bind_param('ss',$username,$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $tap .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $tap .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }


    $result = array('pipe' => $pipe,'shooter' =>$shooter, 'tap' => $tap);

    echo json_encode($result);
}


/************************
 * Team Daily score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'team-daily')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID WHERE Teamname=? AND DATE=? ORDER BY score DESC');
    $stmt->bind_param('ss',$team,$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $pipe .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $pipe .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }

    /************************
     * Returns Shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE Teamname=? AND DATE=? ORDER BY score DESC');
    $stmt->bind_param('ss',$team,$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $shooter .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $shooter .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

    }

    /************************
     * Returns Tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE Teamname=? AND Date=? ORDER BY score DESC');
    $stmt->bind_param('ss',$team,$date);
    $stmt->execute();

    $result = $stmt->get_result();
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $row = $result->fetch_assoc();
        if(!$row && $count==1){
            $tap .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $tap .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }





    $result = array('pipe' => $pipe, 'shooter' => $shooter, 'tap' => $tap);

    echo json_encode($result);
}



$conn->close();
?>