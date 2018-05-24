<?php

$servername = "localhost";
$user = "projectw";
$password = "9s4F1HWkgjqxpMnQ";
$dbname = "projectw_test";

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

if(isset($_GET['username'])){
    $username = $_GET['username'];
}


if(isset($_GET['username'])){

    $stmt = "Select Teamname FROM users WHERE username = ?";
    $stmt = $conn->prepare($stmt);
    $stmt->bind_param('s', $username);
    $stmt->bind_result($team);
    $stmt->execute();
    $stmt->fetch();

    if($team != null){
        echo $team;
    }
}
?>