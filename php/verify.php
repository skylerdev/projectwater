<?php

$servername = "localhost";
$username = "projectw";
$password = "9s4F1HWkgjqxpMnQ";
$dbname = "projectw_test";

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

if(isset($_POST['username']) && !empty($_POST['username'])){

    $username = $_POST['username'];

    //Sql statement
    $sql = "SELECT * FROM users WHERE username = ?";
    $sql->bind_param('s', $username);

    //Executes query
    $result = mysqli_query($conn,$sql);

    //Checks if username already exists returns false if found
    $count = mysqli_num_rows($result);
    if($count>0){
        echo 'false';
    }

}

$conn->close();
?>