<?php
file_put_contents("hydro.csv", fopen("http://dd.meteo.gc.ca/hydrometric/csv/BC/daily/BC_08MH149_daily_hydrometric.csv",'r'));

?>
<?php
$rows = file('hydro.csv');
$last_row = array_pop($rows);
$data = str_getcsv($last_row);

$date = (explode("T", $data[1]));
$level = $data[2];


$servername = "localhost";
$username = "projectw";
$password = "9s4F1HWkgjqxpMnQ";
$dbname = "projectw_test";

$conn = new mysqli($servername, $username, $password, $dbname);

$sql = "INSERT INTO capilano_reservoir (date,level) VALUES ('"
    . $date[0] . "'," . $level . ")";
    
if (mysqli_query($conn, $sql)) {
} else {
}

$conn->close();

?>

