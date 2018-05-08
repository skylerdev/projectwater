<?php

$servername = 'localhost';
$user= 'root';
$password = '';
$dbname = 'projectwater';

//Create connection
$conn = new mysqli($servername, $user, $password, $dbname);

//Gets username and tab from GET
if(isset($_GET['username'])) {
    $username = mysqli_real_escape_string($conn,$_GET['username']);
}
$tab = mysqli_real_escape_string($conn,$_GET['tab']);

/************************
    Global score screen
 *************************/

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
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th></tr>';
    for($count = 1; $count < 6; $count++){
        $row = mysqli_fetch_assoc($data);
        $shooter .= '<tr><td>' . $count . '</td><td>' .$row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
    }
    
    
    /************************
        Returns tap score
    *************************/
    $sql = "SELECT username.username, pipe_score.score FROM pipe_score INNER JOIN username ON pipe_score.USER_ID=username.USER_ID ORDER BY score DESC";
    $data = mysqli_query($conn,$sql);
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th></tr>';
    for($count = 1; $count < 6; $count++){
        $row = mysqli_fetch_assoc($data);
        $pipe .= '<tr><td>' . $count . '</td><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
    }
    
    
    $result = array('pipe'=>$pipe, 'shooter'=>$shooter);
    
    echo json_encode($result);
}



/************************
    Personal score screen
 *************************/

if(isset($_GET['tab']) && ($_GET['tab'] == 'personal')){

    /************************
        Returns pipe score
     *************************/

    //Sql statement to execute
    $sql = "SELECT username.username, pipe_score.score FROM pipe_score INNER JOIN username ON pipe_score.USER_ID=username.USER_ID ORDER BY score DESC";

    $data = mysqli_query($conn,$sql);
    $pipe = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th></tr>';
    $counter = 1;
    while($row = mysqli_fetch_assoc($data)) {
        if($row['username'] == $username){
            $pipe .= '<tr><td>' . $counter . '</td><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
        }
        $counter++;
    }
    /*
    for($count = 0; $count < 5; $count++){
        $row = mysqli_fetch_assoc($data);
        $pipe .= '<tr><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
    }*/

    /************************
        Returns shooter score
     *************************/
    $sql = "SELECT username.username, shooter_score.score FROM shooter_score INNER JOIN username ON shooter_score.USER_ID=username.USER_ID ORDER BY score DESC";
    $data = mysqli_query($conn,$sql);
    $shooter = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th></tr>';
    while($row = mysqli_fetch_assoc($data)) {
        if($row['username'] == $username){
            $shooter .= '<tr><td>' . $counter . '</td><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
        }
        $counter++;
    }


    /************************
        Returns tap score
     *************************/
    $sql = "SELECT username.username, pipe_score.score FROM pipe_score INNER JOIN username ON pipe_score.USER_ID=username.USER_ID ORDER BY score DESC";
    $data = mysqli_query($conn,$sql);
    $tap = '<table class="table"><tr><th>Rank</th><th>Username</th><th>Score</th></tr>';
    while($row = mysqli_fetch_assoc($data)) {
        if($row['username'] == $username){
            $tap .= '<tr><td>' . $counter . '</td><td>' . $row['username'] . '</td><td>' . $row['score'] . '</td></tr>';
        }
        $counter++;
    }


    $result = array('pipe'=>$pipe, 'shooter'=>$shooter);

    echo json_encode($result);
}
$conn->close();
?>