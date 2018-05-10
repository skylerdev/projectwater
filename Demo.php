<?php

$servername = 'localhost';
$user= 'root';
$password = '';
$dbname = 'projectwater';

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

//Gets post from form and creates variable
$username = $_POST['Username'];
$score= $_POST['Score'];
$date = date('Y-m-d');


//Prepared Statement
$sql = 'INSERT INTO shooter_score (Score,Date,UserID) VALUES (?,?,(SELECT UserID FROM Users WHERE username=?))';

//Prepares and binds parameters
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss",$score,$date,$username);

//Execute statement
$stmt->execute();

//mysqli_query($conn,$sql);
$stmt->close();
$conn->close();

?>
