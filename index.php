<?php 
require_once('header.php');
?>

<div class="main-content">
	<div class="header" >
		<div class="hdrl"></div>
		<div class="hdrr"></div>
		<h2>Calendar View</h2>
	</div>
	<div class="block">
		<div id="calendar"></div>
		<script type="text/javascript">
			$(window).ready(function(){
				$("#calendar").smoothPhpCalendar();
			});
		</script>
	</div>
	<div class="bdrl"></div>
	<div class="bdrr"></div>
</div>

<?php require_once('footer.php') ?>