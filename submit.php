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
    $stmt = "INSERT INTO users (Username,Teamname) VAlUES(?,null )";
    $stmt = $conn->prepare($stmt);

    $stmt->bind_param('s', $username);
    $stmt->execute();


}

$conn->close();
?>