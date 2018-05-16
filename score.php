<?php

$servername = 'localhost';
$user = 'root';
$password = '';
$dbname = 'projectwater';

//Create connection
$conn = new PDO("mysql:host=$servername;dbname=$dbname",$user,$password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID ORDER BY score DESC');

    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count <5; $count++){
        $pipe .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);


    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID ORDER BY score DESC');

    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count <5; $count++){
        $shooter .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID=users.UserID ORDER BY score DESC');

    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count <5; $count++){
        $tap .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);


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
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID WHERE Username=? ORDER BY score DESC');
    $stmt->bind_param('s',$username);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count <5; $count++){
        $shooter .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);
    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE Username=? ORDER BY score DESC');
    $stmt->bind_param('s',$username);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        $shooter.= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE Username=? ORDER BY score DESC');
    $stmt->bind_param('s',$username);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $tap= '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        $tap.= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);

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
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID WHERE Teamname=? ORDER BY score DESC');
    $stmt->bind_param('s',$team);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        $pipe .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);


    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE Teamname=? ORDER BY score DESC');
    $stmt->bind_param('s',$team);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        $shooter .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE Teamname=? ORDER BY score DESC');
    $stmt->bind_param('s',$team);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $tap= '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        $tap .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);


    $result = array('pipe' => $pipe,'shooter' => $shooter, 'tap' => $tap);

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

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    $result;
    for($count =1; $count <=5; $count++){
        $result = $stmt->fetch();
        if($stmt && $count==1){
            $pipe .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';

        }
        $pipe .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    echo $result;
    unset($stmt);

    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE DATE=? ORDER BY score DESC');

    $stmt->bind_param('s',$date);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        if($stmt && $count==1){
            $shooter .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $shooter .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE DATE=? ORDER BY score DESC');

    $stmt->bind_param('s',$date);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $tap= '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    $stmt->fetch();
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        if($stmt && $count==1){
            $tap .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $tap .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);


    $result = array('pipe' => $pipe);

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

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        if($stmt && $count==1){
            $pipe .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $pipe .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);

    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID WHERE Username=? AND DATE=? ORDER BY score DESC');
    $stmt->bind_param('ss',$username,$date);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $shooter= '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        if($stmt == null && $count==1){
            $shooter .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $shooter .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    echo $stmt == true;

    unset($stmt);

    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM Users INNER JOIN tap_score ON tap_score.UserID=users.UserID WHERE Username=? AND DATE=? ORDER BY score DESC');
    $stmt->bind_param('ss',$username,$date);
    $stmt->execute();

    $stmt->bind_result($user,$score,$teamname,$dat);
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =1; $count <=5; $count++){
        $stmt->fetch();
        if(!$stmt && $count==1){
            $tap .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
            break;
        }
        $tap .= '<tr><td>' . $count . '</td><td>' . $user . '</td><td>' . $score . '</td><td>'
            . $teamname . '</td><td>' . $dat . '</td></tr>';
    }
    unset($stmt);


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



//$conn->close();
?>