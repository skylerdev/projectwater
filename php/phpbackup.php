<?php

$servername = 'localhost';
$user = 'root';
$password = '';
$dbname = 'projectwater';

$conn = new mysqli($servername, $user, $password, $dbname);

$score = $_POST['score'];

$sql = 'INSERT INTO shooter_score (score) VALUES (?)';

$stmt = $conn->prepare($sql);
$stmt->bind_param("i",$score);

$stmt->execute();
$stmt->close();
$conn->close();

echo "<script> window.location=\"index.html\";</script>"


?>