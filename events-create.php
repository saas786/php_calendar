<?php 
require_once('header.php');
require_once('smoothcalendar.php');
?>
<div class="main-content">
	<div class="header" >
		<div class="hdrl"></div>
		<div class="hdrr"></div>
		<h2>Edit Event</h2>
	</div>
	<div class="block">

<?php
	if (isset($_POST["event"]))
	{
		$description = $_POST["event"]["description"];
		$eventtime   = mktime($_POST["event"]["hour"  ], 
							  $_POST["event"]["minute"], 0,
							  $_POST["event"]["month" ], 
							  $_POST["event"]["day"   ], 
							  $_POST["event"]["year"  ]);
		$eventtime   = date('Y-m-d H:i:s', $eventtime); 

		if (strcmp($description, "") == 0)
		{
?>				
	<p class="message error">
		You forgot to add description
	</p>
<?php
		}
		else if (strcmp($eventtime, "") == 0)
		{
?>				
	<p class="message error">
		Event time or date were invalid
	</p>
<?php
		}
		else
		{
			$result = $calendar->createEvent(array("date" => $eventtime, "content" => $description));				
			
			if (isset($result["error"]))
			{
?>				
	<p class="message error">
		<?php echo $result["error"]; ?>
	</p>
		
<?php
			}
			else
			{
?>				
	<p class="message">
		Done creating event. <a href="events.php?m=<?php echo $_POST["event"]["month" ] ?>&y=<?php echo $_POST["event"]["year"] ?>">view here</a> or create another event</a>
	</p>
		
<?php
			}
		}
	}	

		$currentYearInfo = getdate(time());
?>			
		<form method="POST" action="<?php echo $_SERVER["REQUEST_URI"]?>" >
			<div class="western">
				<p>
					<label>Title Speed <em>(speed of title appereance in ms)</em></label>
					<br/>
					<textarea id="setname" class="text" type="text"  name="event[description]" ></textarea>
				</p>
			</div>
			<div class="eastern">
				<p>
					<label>Date <em>(dd-mm-yyyy)</em></label>
					<br/>
					<select name="event[day]">
<?php
						for($i = 1; $i < 32; $i++)
						{
							$value    = ($i < 10) ? "0" . $i : $i;
							$day      = (int)$currentYearInfo["mday"];
							$selected = ($day == $i) ? 'selected="selected"' : "";
?>
							<option <?php echo $selected; ?> value="<?php echo $value; ?>"><?php echo $value; ?></option>						
<?php
						}
?>
					</select>
	
					<select name="event[month]">
<?php
						for($i = 1; $i < 13; $i++)
						{
							$value = ($i < 10) ? "0" . $i : $i;
							$month    = (int)$currentYearInfo["mon"];
							$selected = ($month == $i) ? 'selected="selected"' : "";
?>
							<option <?php echo $selected; ?> value="<?php echo $value; ?>"><?php echo $value; ?></option>						
<?php
						}
?>
					</select>
	
					<select name="event[year]">
<?php
						$years = (int)$currentYearInfo["year"];
						
						for($i = $years; $i <= $years + 3; $i++)
						{
?>
							<option value="<?php echo $i; ?>"><?php echo $i; ?></option>						
<?php
						}
?>
					</select>
				</p>
				<p>
					<label>Time <em>(hh:mm)</em></label>
					<br/>
					<select name="event[hour]">
<?php
						for($i = 0; $i < 24; $i++)
						{
							$value    = ($i < 10) ? "0" . $i : $i;
							$hours    = (int)$currentYearInfo["hours"];
							$selected = ($hours == $i) ? 'selected="selected"' : "";
?>
							<option <?php echo $selected; ?> value="<?php echo $value; ?>"><?php echo $value; ?></option>						
<?php
						}
?>
					</select>
	
					<select name="event[minute]">
<?php
						for($i = 0; $i < 60; $i = $i + 5)
						{
							$value = ($i < 10) ? "0" . $i : $i;
?>
							<option value="<?php echo $value; ?>"><?php echo $value; ?></option>						
<?php
						}
?>
					</select>
				</p>
			</div>
			<div class="clearfix"></div>
			<p class="rightalign">
				<input type="submit" class="submit" value="Save" />
			</p>
		</form>
	</div>
	<div class="bdrl"></div>
	<div class="bdrr"></div>
</div>

<?php require_once('footer.php') ?>