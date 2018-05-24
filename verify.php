<?php

$servername = "localhost";
$user = "projectw";
$password = "9s4F1HWkgjqxpMnQ";
$dbname = "projectw_test";

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

if(isset($_POST['username']) && !empty($_POST['username'])){

    $username = $_POST['username'];
    
    //Sql statement
    $stmt = "SELECT UserID,Teamname FROM users WHERE username = ?";
    $stmt = $conn->prepare($stmt);
    
    $stmt->bind_param('s', $username);
    $stmt->bind_result($id,$team);
    $stmt->execute();
    $stmt->fetch();

    //Checks if username already exists returns false if found
    if($id>0){
        echo $team;
    }

}

$conn->close();
?>