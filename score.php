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

/************************
 * Global score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'global')) {

    /************************
     * Returns pipe score
     *************************/

    //Sql statement to execute
    $sql = "SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID ORDER BY score DESC";

    $data = mysqli_query($conn, $sql);
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for ($count = 1; $count < 6; $count++) {
        $row = mysqli_fetch_assoc($data);
        $pipe .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }

    /************************
     * Returns shooter score
     *************************/
    $sql = "SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID ORDER BY score DESC";
    $data = mysqli_query($conn, $sql);
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    for ($count = 1; $count < 6; $count++) {
        $row = mysqli_fetch_assoc($data);
        $shooter .= '<tr><td>' . $count . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>'
            . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
    }


    /************************
     * Returns tap score
     *************************/
    //$sql = "SELECT username.username, pipe_score.score FROM pipe_score INNER JOIN username ON pipe_score.USER_ID=username.USER_ID ORDER BY score DESC";
    //$data = mysqli_query($conn, $sql);
    //$pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th></tr>';
    //for ($count = 1; $count < 6; $count++) {
    //    $row = mysqli_fetch_assoc($data);
    //    $pipe .= '<tr><td>' . $count . '</td><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
    //}


    $result = array('pipe' => $pipe,'shooter' => $shooter);

    echo json_encode($result);
}


/************************
 * Personal score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'personal')) {

    /************************
     * Returns pipe score
     *************************/
    //Sql statement to execute
    $sql = "SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID ORDER BY score DESC";

    $data = mysqli_query($conn, $sql);
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    $counter = 1;
    $entry = 1;
    while ($row = mysqli_fetch_assoc($data)) {
        if ($row['Username'] == $username) {
            $pipe .= '<tr><td>' . $counter . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>' . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
            if ($entry == 5) {
                break;
            }
            $entry++;
        }
        $counter++;
    }

    /************************
     * Returns shooter score
     *************************/
    $sql = "SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID ORDER BY score DESC";
    $data = mysqli_query($conn, $sql);
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    $counter = 1;
    $entry = 1;
    while ($row = mysqli_fetch_assoc($data)) {
        if ($row['Username'] == $username) {
            $shooter .= '<tr><td>' . $counter . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>' . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

            if ($entry == 5) {
                break;
            }
            $entry++;
        }
        $counter++;
    }


    /************************
     * Returns tap score
     *************************/
    $sql = "SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID ORDER BY score DESC";
    $data = mysqli_query($conn, $sql);
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    $counter = 1;
    $entry = 1;
    while ($row = mysqli_fetch_assoc($data)) {
        if ($row['Username'] == $username) {
            $tap .= '<tr><td>' . $counter . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>' . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';

            if ($entry == 5) {
                break;
            }
            $entry++;
        }
        $counter++;
    }


    $result = array('pipe' => $pipe,'shooter' =>$shooter);

    echo json_encode($result);
}


/************************
 * Team score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'team')) {

    /************************
     * Returns pipe score
     *************************/
    //Sql statement to execute
    $sql = "SELECT Username,Score,Teamname,Date FROM Users INNER JOIN pipe_score ON pipe_score.UserID=users.UserID ORDER BY score DESC";

    $data = mysqli_query($conn, $sql);
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    $counter = 1;
    $entry = 1;
    while ($row = mysqli_fetch_assoc($data)) {
        if ($row['Teamname'] == $team) {
            $pipe .= '<tr><td>' . $counter . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>' . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
            if ($entry == 5) {
                break;
            }
            $entry++;
        }
        $counter++;
    }
    /*
    for($count = 0; $count < 5; $count++){
        $row = mysqli_fetch_assoc($data);
        $pipe .= '<tr><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
    }*/


    /************************
     * Returns Shooter score
     *************************/
    //Sql statement to execute
    $sql = "SELECT Username,Score,Teamname,Date FROM Users INNER JOIN shooter_score ON shooter_score.UserID=users.UserID ORDER BY score DESC";

    $data = mysqli_query($conn, $sql);
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th><th>Team</th><th>Date</th></tr>';
    $counter = 1;
    $entry = 1;
    while ($row = mysqli_fetch_assoc($data)) {
        if ($row['Teamname'] == $team) {
            $shooter .= '<tr><td>' . $counter . '</td><td>' . $row['Username'] . '</td><td>' . $row['Score'] . '</td><td>' . $row['Teamname'] . '</td><td>' . $row['Date'] . '</td></tr>';
            if ($entry == 5) {
                break;
            }
            $entry++;
        }
        $counter++;
    }
    $result = array('pipe' => $pipe, 'shooter' => $shooter);

    echo json_encode($result);
}
$conn->close();
?>