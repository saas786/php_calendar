Smooth PHP Calendar Reloaded

Summary
Smooth PHP Calendar Reloaded is simple JavaScript and PHP driven
calendar. This calendar script can be used to display unlimited number
of events with their descriptions. It also comes with a fully AJAX
enabled admin area to manage your calendar events.
Its main features are:
• Smooth transitions
• Can display unlimited number of events
• Works in IE 7, 8, 9, Firefox, Safari, Opera and Chrome.
• admin section
• MySQL Database Backend
• CSS based
• Can turn on/off creating events or deleting events and etc…
• Shows upcoming events (in admin panel)
• Creates, edits and deletes events (in admin panel)
• Supports PHP 5.x or later
• Supports MySQL 5.x or later
• Comprehensive documentation
Upgrade Notes
IF YOU ARE UPDATING A PREVIOUS VERSION OF THIS SCRIPT, THEN
PLEASE PAY ATTENTION TO THE FOLLOWING:
• Smooth PHP Calendar now uses jQuery as its underlying
framework, not Mootools
• The JavaScript file has been completely revamped to
accommodate jQuery.
• You must completely remove the previous version from your
project and re-embed the new version
• Smooth PHP calendar no longer tries to maintain compatibility
with IE6
• There has NOT been any database changes
Database
Smooth PHP Calendar Reloaded requires 1 database for keeping track of
your events. You must first create a database (you can call it what
ever you want) and in there create a new table called “events”. This is
the sql for creating the “events” table:
CREATE TABLE `events` (
`Description` longtext,
`Date` datetime default NULL,
`ID` int(11) NOT NULL auto_increment,
PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8 AUTO_INCREMENT=50 ;
You must remember the path to your DB, your username and password
plus the name of the database in which you’re creating the “events”
table.
PHP backend
All of the Smooth PHP Calendar Reloaded server side routines for
adding, removing and editing events are encapsulated inside the
“smoothcalendar.php” file. In order for the PHP script to successfully
connect to your database you must update this file with your
Username, Password and etc for your database.
It looks like so:
$server = "localhost";
$username = "admin";
$password = "password";
$dbname = "smoothphpcalendar";
Inside this file the “SmoothCalendar” class is instantiated to handle the
requests. Here you have the opportunity to modify the default options.
For example you could disable deleting, editing or even viewing events
if you wish to. At the bottom of the “smoothcalendar.php” file you will
find this code:
$calendar = new SmoothCalendar(array(
‘safe’ => true,
'view' => true,
'remove' => true,
'edit' => true,
'create' => true
));
Lets say if you wanted to disable deleting events, you could change the
above initialization code like this:
$calendar = new SmoothCalendar(array(
'view' => true,
'remove' => false,
'edit' => true,
'create' => true
));
Embedding the Calendar View
Inside the <head> in your HTML file, include the following lines:
<link href="smooth-php-cal.css" rel="stylesheet" />
<script src="jquery-1.6.2.min.js" type="text/javascript"></script>
<script src="smooth-php-cal-min.js" type="text/javascript"></script>
Smooth PHP Calendar Reloaded requires a simple HTML structure to
render itself. In order to create the Smooth PHP Calendar Reloaded the
HTML structure must be placed inside a DIV element with a unique id
(illustrated bellow with id=”calendar”). Following is an example of how
to setup the HTML structure in order for Smooth PHP Calendar
Reloaded to render itself.
<div id="calendar"></div>
Ensure that the paths to the JavaScript files are matching the
requirements of your web server directory structure. Next include this
script tag before the closing </head> tag to create the Smooth PHP
Calendar Reloaded UI. Notice how the selector string passed to $
function has the same value as the ID of the div element we created
earlier.
<script type="text/javascript">
$(window).ready(function(){
$("#calendar").smoothPhpCalendar();
});
</script>
Options
startDate (optional) : expects a date object which forces the calendar
to render itself based on the given date instead of the current date.
url (optional): tells the JavaScript the url address of the server side
script which resolves events
Calendar APIs
Following methods are accessible and can be used to interact with the
calendar:
nextMonth() ? tells the calendar to render the next month relative to
the month that is currently displayed.
$("#calendar").smoothPhpCalendar.nextMonth();
nextYear() ? tells the calendar to render the next year relative to the
year that is currently displayed.
$("#calendar").smoothPhpCalendar.nextYear();
prevMonth() - tells the calendar to render the previous month relative
to the month that is currently displayed.
$("#calendar").smoothPhpCalendar.prevMonth();
prevYear() ? tells the calendar to render the previous year relative to
the year that is currently displayed.
$("#calendar").smoothPhpCalendar.nextYear();
Once again, thank you for purchasing Smooth PHP Calendar Reloaded. As
I said at the beginning, I'd be glad to help you if you have any questions
relating to Smooth PHP Calendar Reloaded. No guarantees, but I'll do my
best to assist. If you have a more general question relating to the
Smooth PHP Calendar Reloaded on ThemeForest, you might consider
visiting the forums and asking your question in the "Item Discussion"
section.
DenonStudio