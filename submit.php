<?php

$servername = 'localhost';
$user= 'root';
$password = '';
$dbname = 'projectwater';

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

//Gets post from form and creates variable
$username = $_POST['username'];
$password = $_POST['password'];
$email = $_POST['email'];

//Hashes password
$hash = password_hash($password,PASSWORD_DEFAULT);

//Prepared Statement
$sql = 'INSERT INTO users (username,password,email) VALUES (?,?,?)';

//Prepares and binds parameters
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss",$username,$hash,$email);

//Execute statement
$stmt->execute();

//mysqli_query($conn,$sql);
$stmt->close();
$conn->close();

echo "<script> window.location=\"index.html\";</script>"
?>