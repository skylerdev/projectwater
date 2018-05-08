<?php

$servername = 'localhost';
$user= 'root';
$password = '';
$dbname = 'projectwater';

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

//Gets post from form and creates variable
//$username = $_GET['username'];
$tab = $_GET['tab'];

if(isset($_GET['tab']) && ($_GET['tab'] == 'global')){
    
    /************************
        Returns pipe score
    *************************/
    
    //Sql statement to execute
    $sql = "SELECT username.username, pipe_score.score FROM pipe_score INNER JOIN username ON pipe_score.USER_ID=username.USER_ID ORDER BY score DESC";
    
    $data = mysqli_query($conn,$sql);
    $pipe = '<table><tr><th>Username</th><th>Score</th></tr>';
    for($count = 0; $count < 5; $count++){
        $row = mysqli_fetch_assoc($data);
        $pipe .= '<tr><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
    }
    
    /************************
        Returns shooter score
    *************************/
    $sql = "SELECT username.username, shooter_score.score FROM shooter_score INNER JOIN username ON shooter_score.USER_ID=username.USER_ID ORDER BY score DESC";
    $data = mysqli_query($conn,$sql);
    $shooter = '<table><tr><th>Username</th><th>Score</th></tr>';
    for($count = 0; $count < 5; $count++){
        $row = mysqli_fetch_assoc($data);
        $shooter .= '<tr><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
    }
    
    
    /************************
        Returns tap score
    *************************/
    $sql = "SELECT username.username, pipe_score.score FROM pipe_score INNER JOIN username ON pipe_score.USER_ID=username.USER_ID ORDER BY score DESC";
    $data = mysqli_query($conn,$sql);
    $pipe = '<table><tr><th>Username</th><th>Score</th></tr>';
    for($count = 0; $count < 5; $count++){
        $row = mysqli_fetch_assoc($data);
        $pipe .= '<tr><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
    }
    
    
    $result = array('pipe'=>$pipe, 'shooter'=>$shooter);
    
    echo json_encode($result);
}
$conn->close();
?>