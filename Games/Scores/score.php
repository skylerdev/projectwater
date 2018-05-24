<?php

    $servername = "localhost";
    $username = "projectw";
    $password = "9s4F1HWkgjqxpMnQ";
    $dbname = "projectw_test";

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
 * Team Daily score screen
 *************************/

if (isset($_GET['tab']) && ($_GET['tab'] == 'team-daily')) {

    /************************
     * Returns pipe score
     *************************/
    $stmt = $conn->prepare('SELECT Score FROM users INNER JOIN pipe_score ON pipe_score.UserID = users.UserID WHERE Teamname= :teamname AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $pipe = $data[0]['Score'];
    
    unset($stmt);

    /************************
     * Returns Shooter score
     *************************/
    $stmt = $conn->prepare('SELECT Score FROM users INNER JOIN shooter_score ON shooter_score.UserID = users.UserID WHERE Teamname= :teamname AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $shooter = $data[0]['Score'];
    unset($stmt);

    /************************
     * Returns Tap score
     *************************/
    $stmt = $conn->prepare('SELECT Score FROM users INNER JOIN tap_score ON tap_score.UserID = users.UserID WHERE Teamname= :teamname AND DATE = :date  ORDER BY score DESC');
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':teamname',$team,PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $Tap = $data[0]['Score'];
    unset($stmt);
    unset($stmt);





    $result = array('pipe' => $pipe, 'shooter' => $shooter, 'tap' => $tap);

    echo json_encode($result);
}
?>