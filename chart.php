<?php
    $servername = "localhost";
    $username = "projectw";
    $password = "9s4F1HWkgjqxpMnQ";
    $dbname = "projectw_test";

$conn = new mysqli($servername,$username,$password,$dbname);

if($conn->connect_error){
    die("Connection failed");
}
$sql = "SELECT * FROM capilano_reservoir";
$data = mysqli_query($conn, $sql); 
$date[] = array('date','level');
while($row = mysqli_fetch_assoc($data)){
    $date[]= array($row['date'], (float) $row['level']);
}
echo json_encode($date);
?>