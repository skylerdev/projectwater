<?php
file_put_contents("hydro.csv", fopen("http://dd.meteo.gc.ca/hydrometric/csv/BC/daily/BC_08MH149_daily_hydrometric.csv",'r'));

?>
<?php
$rows = file('hydro.csv');
$last_row = array_pop($rows);
$data = str_getcsv($last_row);

$date = (explode("T", $data[1]));
$level = $data[2];
$dat = $date[0];
date_default_timezone_set('America/Vancouver');
$today= date('Y-m-d');
$pop = 2463000;
$storage = 38000000000;

$servername = "localhost";
$username = "projectw";
$password = "9s4F1HWkgjqxpMnQ";
$dbname = "projectw_test";

$conn = new mysqli($servername, $username, $password, $dbname);

/**********************
  Shooter Daily Total
 *******************/
$stmt = "SELECT Tier From shooter_score Where Date=? AND Tier >=0";
$stmt = $conn->prepare($stmt);


$stmt->bind_param('s',$today);
$stmt->execute();
$stmt->bind_result($tier);


$count = 0.0;
$sum = 0;

if ($count == 0){
    $count = 1;
}
while ($stmt->fetch()){
    $sum += $tier;
    $count++;
}
$shooterTotal = $sum/$count;
if($shooterTotal == 0){
    $shooterTotal = rand(1,3);
}


/**********************
  Pipe Daily Total
 *******************/
$stmt = "SELECT Tier From pipe_score Where Date=? AND Tier >=0";
$stmt = $conn->prepare($stmt);

$stmt->bind_param('s',$today);
$stmt->execute();
$stmt->bind_result($tier);


$count = 0.0;
$sum = 0;
while ($stmt->fetch()){
    $sum += $tier;
    $count++;
}
if ($count == 0){
    $count = 1;
}
$pipeTotal = $sum/$count;
if($pipeTotal == 0){
    $pipeTotal = rand(2,5);
}


/**********************
  Tap Daily Total
 *******************/
$stmt = "SELECT Tier From tap_score Where Date=? AND Tier >=0";
$stmt = $conn->prepare($stmt);


$stmt->bind_param('s',$today);
$stmt->execute();
$stmt->bind_result($tier);


$count = 0.0;
$sum = 0;
while ($stmt->fetch()){
    $sum += $tier;
    $count++;
}

if ($count == 0){
    $count = 1;
}
$tapTotal = $sum/$count;

if($tapTotal == 0){
    $tapTotal = rand(2,5);
}

//Calculates daily total to add to reservoir
$dailyTotal = ($shooterTotal+$pipeTotal+$tapTotal)/3*80*$pop ;


unset($stmt);



/******************
 Reservoir insert
 
 ******************/
//Getting previous values
$stmt = "SELECT water_saved FROM capilano_reservoir WHERE id=(SELECT MAX(ID) FROM capilano_reservoir)";
$stmt = $conn->prepare($stmt);

$stmt->execute();
$stmt->bind_result($water);
$stmt->fetch();

//Water saved daily total added to overall
$water += $dailyTotal;

//Amount to increment by 
$virtual = $water / $storage;
$virtual +=$level;

//Sql statement to insert into table
$stmt = "INSERT INTO capilano_reservoir (date,reservoir,virtual_reservoir,water_saved) VALUES (?,?,?,?)";
$stmt = $conn->prepare($stmt);

$stmt->bind_param('ssss', $dat,$level, $virtual,$water);
$stmt->execute();
    

$conn->close();

?>

