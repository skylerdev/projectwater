<?php
    $servername = "localhost";
    $username = "projectw";
    $password = "9s4F1HWkgjqxpMnQ";
    $dbname = "projectw_test";

//Connects to database
$conn = new mysqli($servername,$username,$password,$dbname);
if($conn->connect_error){
    die("Connection failed");
}

//Sql statement
$sql = "SELECT * FROM capilano_reservoir";

//Executes statement
$data = mysqli_query($conn, $sql); 

//Creates array with header values for chart javascript
$date[] = array('date','level');

//Fills array with x value, y value for chart javascript
while($row = mysqli_fetch_assoc($data)){
    $date[]= array($row['date'], (float) $row['level']);
}


echo json_encode($date);
?>