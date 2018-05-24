<?php
    $servername = "localhost";
    $username = "projectw";
    $password = "9s4F1HWkgjqxpMnQ";
    $dbname = "projectw_test";

$conn = new mysqli($servername,$username,$password,$dbname);

if($conn->connect_error){
    echo "Nope";
    die("Connection failed");
    
}
$sql = "SELECT * FROM capilano_reservoir ORDER BY ID ASC";
$data = mysqli_query($conn, $sql); 
$date[] = array('Date','Reservoir','Virtual Reservoir');
while($row = mysqli_fetch_assoc($data)){
    $dat = $row['date'];
    $dat = substr($dat,-5);
    $date[]= array($dat, (float) $row['reservoir'],(float) $row['virtual_reservoir']);
}
echo json_encode($date);
?>