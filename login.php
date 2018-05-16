<?php

$servername = 'localhost';
$user= 'root';
$password = '';
$dbname = 'projectwater';

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);


if(isset($_POST['username']) && isset($_POST['password'])){
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
        session_start();
        //setcookie('session',session_id());
        $_SESSION['logged_in'] = true;
        if(isset($_SESSION['logged_in'])){
            if($_SESSION['logged_in'] == true){
                echo "logged in";
                
            }
        }
        //echo "yep";
    } else {
        //$session = $_COOKIE['session'];
        //echo $session;
        session_start();
        //setcookie('PHPSESSID','');
        if(isset($_SESSION['logged_in'])){
            if($_SESSION['logged_in'] == false){
                echo "logged out";
                
            }
        }
        //echo "nope";
    }
}


$conn->close();
?>