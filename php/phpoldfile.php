<?php

$servername = 'localhost';
$user = 'root';
$password = '';
$dbname = 'projectwater';

$conn = new mysqli($servername, $user, $password, $dbname);

//$username = $_POST['username'];
//$score = (int) $_POST['score'];
$username = "testing";
$userid = (int) 2;
$score = (int) 2;

echo "TESTING";

$date = "2018-05-11";
//$date = date('Y-m-d');

//$sql = 'INSERT INTO shooterscore (score,Date,UserID) VALUES (?,?,(SELECT UserID FROM Users WHERE username=?))';

$sql = 'INSERT INTO shooterscore (score,Date,UserID) VALUES (?,?,?)';


$stmt = $conn->prepare($sql);
$stmt->bind_param("isi",$score,$date,$userid);

$stmt->execute();
$stmt->close();
$conn->close();

echo "<script> window.location=\"index.html\";</script>"


?>