<?php

    $servername = "localhost";
    $username = "projectw";
    $password = "9s4F1HWkgjqxpMnQ";
    $dbname = "projectw_test";

$conn = new mysqli($servername,$username,$password,$dbname);


$user = $_POST['username'];
$score = (int) $_POST['score'];
$date = date('Y-m-d');
$tier = (int) $_POST['tier'];



$sql = 'INSERT INTO pipe_score (Score,Date,UserID,Tier) VALUES (?,?,(SELECT UserID FROM users WHERE username=?),?)';
$stmt = $conn->prepare($sql);

$stmt->bind_param("issi",$score,$date,$user,$tier);

$stmt->execute();
$stmt->close();
$conn->close();

//echo "<script> window.location=\"index.html\";</script>"


?>