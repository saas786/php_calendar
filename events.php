<?php 
require_once('header.php');
require_once('smoothcalendar.php');

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

?>

<div class="main-content">
	<div class="header" >
		<div class="hdrl"></div>
		<div class="hdrr"></div>
		<h2>Events for <?php echo date('M Y', $from);?></h2>
	</div>
	<div class="block">
		<div class="navigation">
			<a href="events.php?y=<?php echo $year - 1; ?>&m=<?php echo $month; ?>">previous year</a>
			<a href="events.php?y=<?php echo ($month - 1 == 0) ? $year - 1 : $year; ?>&m=<?php echo ($month - 1 == 0) ? 12 : $month - 1; ?>">previous month</a>
			<a href="events.php?y=<?php echo ($month + 1 == 13) ? $year + 1 : $year; ?>&m=<?php echo ($month + 1 == 13) ? 1 : $month + 1; ?>">next month</a>
			<a href="events.php?y=<?php echo $year + 1; ?>&m=<?php echo $month; ?>">next year</a>
<?php
		$currentMonthInfo = getdate(time());
?>

			<a href="events.php?y=<?php echo $currentMonthInfo["year"]; ?>&m=<?php echo $currentMonthInfo["mon"]; ?>">View Current Month</a>
		</div>
<?php

$events = $calendar->listEvents($from, $to);
if (count($events) > 0)
{
?>
		<table>
			<thead>
				<tr>
					<th>No.</th>
					<th>Id</th>
					<th>Date</th>
					<th>Description</th>
					<th colspan="2">Actions</th>
				</tr>
			</thead>
			<tbody>
<?php 
	for($i = 0; $i < count($events); $i++)
	{
		$e    = $events[$i];
		$time = strtotime($e["date"]);
	
?>
				<tr>
					<td><?php echo $i + 1; ?></td>
					<td><?php echo $e["id"]; ?></td>
					<td><?php echo date('M d, Y h:i A', $time); ?></td>
					<td><?php echo $e["content"]; ?></td>
					<td><a href="events-edit.php?id=<?php echo $e["id"]; ?>" >edit</a></td>
					<td><a href="events-delete.php?id=<?php echo $e["id"]; ?>" >delete</a></td>
				</tr>
<?php
	}
?>
			</tbody>
		</table>
<?php 
}
else
{
?>
		<p class="message error">There are no events to show for <?php echo date('M Y', $from); ?></p>
<?php
}
?>
	</div>
	<div class="bdrl"></div>
	<div class="bdrr"></div>
</div>

<?php require_once('footer.php') ?>