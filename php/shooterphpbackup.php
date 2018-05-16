<?php

$servername = 'localhost';
$user = 'root';
$password = '';
$dbname = 'projectwater';

$conn = new mysqli($servername, $user, $password, $dbname);

$username = $_POST['username'];
$score = (int) $_POST['score'];
$date = date('Y-m-d');

$sql = 'INSERT INTO ShooterScore (Score,Date,UserID) VALUES (?,?,(SELECT UserID FROM Users WHERE username=?))';

$stmt = $conn->prepare($sql);
$stmt->bind_param("iss",$score,$date,$username);

$stmt->execute();
$stmt->close();
$conn->close();

//echo "<script> window.location=\"index.html\";</script>"


?>