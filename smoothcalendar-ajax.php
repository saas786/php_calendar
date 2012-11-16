<?php

include_once("smoothcalendar.php");

$month = (isset($_GET["m"]) && is_numeric($_GET["m"])) ? (int)$_GET["m"] : "";
$year  = (isset($_GET["y"]) && is_numeric($_GET["y"])) ? (int)$_GET["y"] : "";

if (strcmp($month, "") == 0 || strcmp($year, "") == 0)
{
	$from  = time();
	$info  = getdate($from);
	$month = $info["mon"];
	$year  = $info["year"];
}

$from = mktime(0, 0, 0, $month, 1, $year);
$to   = mktime(0, 0, 0, ($month + 1 == 13) ? 1 : $month + 1, 1, ($month + 1 == 13) ? $year + 1 : $year);

echo json_encode($calendar->listEvents($from, $to));

?>