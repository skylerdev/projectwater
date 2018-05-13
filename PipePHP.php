<?php
	$servername = "localhost";
  $user = "projectw";
  $password = "9s4F1HWkgjqxpMnQ";
	$dbname = "projectw_test";
//$servername = 'localhost';
//$user= 'root';
//$password = '';
//$dbname = 'projectwater';

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

//Gets post from form and creates variable
$username = $_POST['username'];
$score= (int) $_POST['score'];
$date = date('Y-m-d');

echo $date;
echo $username;
//Prepared Statement
$sql = 'INSERT INTO PipeScores (Score, Date, UserID) VALUES (?,?,(SELECT UserID FROM Users WHERE username=?))';

//Prepares and binds parameters
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss",$score, $date, $username);

//Execute statement
$stmt->execute();

//mysqli_query($conn,$sql);
$stmt->close();
$conn->close();

?>
