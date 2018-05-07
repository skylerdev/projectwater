<?php

$servername = 'localhost';
$user= 'root';
$password = '';
$dbname = 'projectwater';

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

if(isset($_POST['username']) && !empty($_POST['username'])){
    //Sanitizes input
    $username = mysqli_real_escape_string($conn,$_POST['username']);
    
    //Sql statement
    $sql = "SELECT * FROM users WHERE username ='$username' ";
    
    //Executes query
    $result = mysqli_query($conn,$sql);
    
    //Checks if username already exists returns false if found
    $count = mysqli_num_rows($result);  
    if($count>0){
        echo 'false';
    }
    
}
if(isset($_POST['email']) && !empty($_POST['email'])){
    
    //Sanitizes input
    $email  = mysqli_real_escape_string($conn,$_POST['email']);
    
    //Sql statement
    $sql = "SELECT * FROM users WHERE email ='$email' ";
    
    //Executes query
    $result = mysqli_query($conn,$sql);
    
    
    //Checks if email already exists returns false if found
    $count = mysqli_num_rows($result);
    if($count>0){
        echo 'false';
    } 
}
if(isset($_POST['username']) && isset($_POST['password']) && !empty($_POST['password'])){
    //Sanitizes input
    $username = mysqli_real_escape_string($conn,$_POST['username']);
    $password = mysqli_real_escape_string($conn,$_POST['password']);
    
    //SQL statement
    $sql = "SELECT * FROM users WHERE username ='$username'";
    
    //Fetch assoc
    $result = mysqli_query($conn,$sql);
    $row = $result->fetch_assoc();
    
    //
    $valid = password_verify($password,$row['password']);
    if ($valid){
        echo "yep";
    } else {
        echo "nope";
    }
}


$conn->close();
?>