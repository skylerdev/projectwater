<?php

    $servername = "localhost";
    $username = "projectw";
    $password = "9s4F1HWkgjqxpMnQ";
    $dbname = "projectw_test";

// $servername = 'localhost';
// $username = 'root';
// $password = '';
// $dbname = 'projectwater';

$conn = new PDO("mysql:host=$servername;dbname=$dbname",$username,$password);
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
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID = users.UserID ORDER BY score DESC');

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
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID = users.UserID ORDER BY score DESC');

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
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID = users.UserID ORDER BY score DESC');

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
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID = users.UserID WHERE Username = :username ORDER BY score DESC');
    $stmt->bindValue(':username',$username,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $pipe .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);
    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID = users.UserID WHERE Username = :username ORDER BY score DESC');
    $stmt->bindValue(':username',$username,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;

    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $shooter .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID = users.UserID WHERE Username = :username ORDER BY score DESC');
    $stmt->bindValue(':username',$username,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;

    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $tap .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);

    $result = array('pipe' => $pipe, 'shooter' => $shooter, 'tap' => $tap);
    echo json_encode($result);
}


/************************
 * Team All Time score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'team-at')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID = users.UserID WHERE Teamname = :teamname ORDER BY score DESC');
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;

    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $pipe .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);


    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID = users.UserID WHERE Teamname = :teamname ORDER BY score DESC');
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;

    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $shooter .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID = users.UserID WHERE Teamname = :teamname ORDER BY score DESC');
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;

    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $tap .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    unset($stmt);


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
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID = users.UserID WHERE DATE = :date ORDER BY score DESC');

    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    
    
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $pipe .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max ==0){
        $pipe .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);


    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID = users.UserID WHERE DATE = :date ORDER BY score DESC');

    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $shooter .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max ==0){
        $shooter .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);


    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID = users.UserID WHERE DATE = :date ORDER BY score DESC');

    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $tap .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max ==0){
        $tap .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);


    $result = array('pipe' => $pipe, 'shooter' => $shooter, 'tap' => $tap);

    echo json_encode($result);
}


/************************
 * Personal Daily score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'personal-daily')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID = users.UserID WHERE Username= :username AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':username',$username,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $pipe .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max ==0){
        $pipe .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);

    /************************
     * Returns shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID = users.UserID WHERE Username= :username AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':username',$username,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $shooter .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max ==0){
        $shooter .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);

    /************************
     * Returns tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID = users.UserID WHERE Username= :username AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':username',$username,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $tap .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max ==0){
        $tap .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);


    $result = array('pipe' => $pipe, 'shooter' => $shooter, 'tap' => $tap);

    echo json_encode($result);
}


/************************
 * Team Daily score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'team-daily')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN pipe_score ON pipe_score.UserID = users.UserID WHERE Teamname= :teamname AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $count = 1;
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $pipe .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max == 0){
        $pipe .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);

    /************************
     * Returns Shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN shooter_score ON shooter_score.UserID = users.UserID WHERE Teamname= :teamname AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $count = 1;
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $shooter .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max ==0){
        $shooter .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);

    /************************
     * Returns Tap score
     *************************/
    $stmt = $conn->prepare('SELECT Username,Score,Teamname,Date FROM users INNER JOIN tap_score ON tap_score.UserID = users.UserID WHERE Teamname= :teamname AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $max = (sizeof($data)< 5) ? sizeof($data) : 5;
    $count = 1;
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for($count =0; $count < $max; $count++){
        $tap .= '<tr><td>' . ($count + 1) . '</td><td>' . $data[$count]['Username'] . '</td><td>' . $data[$count]['Score'] . '</td><td>'
            . $data[$count]['Teamname']  . '</td><td>' . $data[$count]['Date'] . '</td></tr>';

    }
    if($max ==0){
        $tap .= '<tr><td colspan="5" style="text-align: center">No Highscores have been place today! Be the First</td></tr>';
    }
    unset($stmt);





    $result = array('pipe' => $pipe, 'shooter' => $shooter, 'tap' => $tap);

    echo json_encode($result);
}



?>