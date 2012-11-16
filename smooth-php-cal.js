(function($){

    var options = new Array();
    var events  = new Array();
    var _this   = null;

    $.fn.smoothPhpCalendar = function(opts){

        function init(el)
        {
			var id = el.id;
			$(el).addClass("smoothcalendar");

			events [id] = new Array();
			options[id] = $.extend({ id : id }, $.fn.smoothPhpCalendar.defaults, opts);
			options[id].currentDate = options[id].startDate;

			load(el, options[id]);
        }
        
        function load(el,options)
        {
			$.get(options.url, { 
					event: "view", 
					y    : options.currentDate.getFullYear(),
					m    : options.currentDate.getMonth() + 1
				}, function(data){  
					
					if (data.error)
					{
						alert(data.error);
						return;
					}
					
					events[options.id] = data;
					generateCalendar(el, options);				
				}, "json"
			);
        }
        
        function generateCalendar(el, options)
        {
			var container = $(el).empty();

			var monthlyViewContainer = $("<div class=monthly-view ></div>").append(getNavigationRow(el, options), getWeekDaysRow(el, options));
      		var dailyViewContainer   = $("<div class=daily-view ></div>"  );

			container.append(dailyViewContainer, monthlyViewContainer);

		    positionStackPanels(options);
        }

		function getNavigationRow(el, options)
		{
	        var dateString = options.monthsOfYear[options.currentDate.getMonth()] + ', ' + options.currentDate.getFullYear();
			var width      = $(el).width() / 3;
			var center 	   = $('<div class=' + ($().isIE6() ? 'current_date_IE6' : 'current_date') + '></div>').width(width).text(dateString);
			var left       = $("<div></div>").width(width);
			var right      = $("<div></div>").width(width);
			
			var pYear = $('<a href="" id="previousYear" title="Previous Year">&nbsp;</a>'  ).click(function(e){
				e.preventDefault();
				prevYear(el, options);
			});
			
			var pMonth = $('<a href="" id="previousMonth" title="Previous Month">&nbsp;</a>').click(function(e){
				e.preventDefault();
				prevMonth(el, options);
			});
			
			var nMonth = $('<a href="" id="nextMonth" title="Next Month">&nbsp;</a>').click(function(e){
				e.preventDefault();
				nextMonth(el, options);
			});
			
			var nYear = $('<a href="" id="nextYear" title="Next Year">&nbsp;</a>').click(function(e){
				e.preventDefault();
				nextYear(el, options);
			});
			
			left .append(pYear , "<span>&nbsp;&nbsp;</span>", pMonth);						
			right.append(nMonth, "<span>&nbsp;&nbsp;</span>", nYear );						
			
	        return $("<div class=navigations></div>").append(left, center, right);
		}
        
        function prevYear(el, options)
        {
			options.currentDate.setYear(options.currentDate.getFullYear() - 1);     
			load(el, options);
        }
        
        function prevMonth(el, options)
        {
			options.currentDate.setMonth(options.currentDate.getMonth() - 1);     
			load(el, options);
        }

        function nextMonth(el, options)
        {
			options.currentDate.setMonth(options.currentDate.getMonth() + 1);     
			load(el, options);
        }

        function nextYear(el, options)
        {
			options.currentDate.setYear(options.currentDate.getFullYear() + 1);     
			load(el, options);
        }

		function getWeekDaysRow(el, options)
		{
			var row                = $("<div class=weekDays></div>"); 
			var firstDayOfMonth    = getFirstDayOfMonth(options.currentDate);
			var totalDaysInMonth   = getNumberOfDaysInMonth(options, options.currentDate);
			var dayBox             = null;
			var currentPrintedDays = 0;
			var actualPrintedDays  = 0;
			var columns            = [];
			var weekDays           = [];
			var width              = ($(el).width() / 7) - 1;
	
			for (var i = 0; i < 7; i++)
			{
				columns.push($('<div class=columns></div>').width(width));
			}

			for (var i = 0; i < options.weekDays.length; i++)
			{
				weekDays.push($('<div class=dayNames></div>').text(options.weekDays[i]));
			}

			for (i = 0; i < weekDays.length; i++)
			{
				columns[i].append(weekDays[i]);    
			}
	
			var ownerColumnIndex = 0;
			while (actualPrintedDays != totalDaysInMonth && currentPrintedDays != (totalDaysInMonth + firstDayOfMonth + Math.ceil(totalDaysInMonth / 7))) 
			{
				dayBox      = $('<div></div>');
				columnIndex = (currentPrintedDays % 7 == 0) ? 0 : columnIndex + 1;
				
				if (currentPrintedDays >= firstDayOfMonth && actualPrintedDays <= totalDaysInMonth - 1) 
				{
					var dayNumber  = actualPrintedDays + 1;
					var eventCount = getEventsOfDay(options, dayNumber).length;

					dayBox.append(
						$("<p class=day_number></p>"    ).html((dayNumber  < 10) ? '0' + dayNumber : dayNumber),
						$("<p class=day_event_count></p>").html((eventCount != 0) ? eventCount + ' event' + ((eventCount > 1) ? 's' : '') : '&nbsp;')
					).attr("id", options.id + '_day' + dayNumber);
					
					if (dayHasEvents(options, dayNumber)) 
					{
						dayBox.bind({
							'mouseover' : function(e){ onCalendarDayMouseHover(el, options, e); },
							'mouseout'  : function(e){ onCalendarDayMouseHover(el, options, e); },
							'click'     : function(e){ onCalendarDayMouseClick(el, options, e); }
						}).addClass(isToday(options, dayNumber) ? 'day_content_today_with_event' : 'day_content_with_event');
					} 
					else 
					{
						dayBox.addClass(isToday(options, dayNumber) ? 'day_content_today':'day_content');
					}
	
					actualPrintedDays++;
				} 
				else 
				{
					dayBox.addClass('emptyBox').html('<p class="day_number">&nbsp</p><p class="day_event_count">&nbsp</p>');
				}
	
				currentPrintedDays++;
				columns[columnIndex].append(dayBox);
			}
			
			for (i = 0; i < weekDays.length; i++)
			{
				row.append(columns[i]);    
			}

			return row;
		}
		
		function onCalendarDayMouseHover(el, options, e)
		{
			if (options.dayBeingViewed)
				return;

			var container = $(extractTargetFromEvent(e)); 
			if (container.length == 0) 
				return;

			if (e.type == 'mouseover')
			{
				var dayNumber = container.children().first().text();
				container.addClass(isToday(dayNumber) ? "day_content_today_with_event_mouseover" : "day_content_with_event_mouseover");
			}
			else
			{
				container.removeClass("day_content_today_with_event_mouseover");
				container.removeClass("day_content_with_event_mouseover");
			}
		}
		
		function onCalendarDayMouseClick(el, options, e)
		{
			if (options.dayBeingViewed)
				return;
				
			var container = $(extractTargetFromEvent(e)); 
			if (!container) 
				return;
				
			var dayNumber = parseInt(container.children().first().text(), 10);

			options.dateBeingViewed = options.currentDate;
			options.dateBeingViewed.setDate(dayNumber);
			
			onCalendarDayMouseHover(el, options, e);
			animateOpenningDayEvents(options, dayNumber);
		};
		
		function animateOpenningDayEvents(options, dayNumber)
		{
			var eventsOfDay = getEventsOfDay(options, dayNumber);
			
			if (eventsOfDay && eventsOfDay.length == 0)
				return;        
				
            var pTags  = $("#" + options.id + " p");
			var target = null;

            for (var i = 0; i < pTags.length; i++)
            {
				 var p = $(pTags[i]);
                 target = (parseInt(p.text(), 10) == dayNumber) ? p.parent() : null;       
                 if (target) 
                     break;
            } 

            if (!target) 
            	return;
			
			var dailyViewContainer = $("#" + options.id + " .daily-view");
			var children           = target.children();
			
			for(var i = 0; i < children.length; i++) 
			{
				dailyViewContainer.append.apply($(children[i]).clone());
			}
			
			options.dayBeingViewed = { day : dayNumber, target : target, animationEl : dailyViewContainer };
			animateStackPanelIntoView(options, options.DAILY_VIEW, function(){
				onOpenningDayEventAnimationComplete(options, dayNumber);
			});
		}
		
		function animateStackPanelIntoView(options, stackIndex, onComplete)
		{
			var monthlyViewContainer = $("#" + options.id + " .monthly-view");
			var dailyViewContainer   = $("#" + options.id + " .daily-view"  );
			var height               = monthlyViewContainer.offsetParent().height();
	
			switch(stackIndex)
			{
				case 0:
					monthlyViewContainer.animate({"top" : "0px", "opacity" : "1"          }, 800, onComplete);
					dailyViewContainer  .animate({"top" : -height + "px", "opacity" : "0" }, 800);
				break;        
	
				case 1:
					monthlyViewContainer.animate({"top" : height + "px", "opacity" : "0" }, 800, onComplete);
					dailyViewContainer  .animate({"top" : "0px", "opacity" : "1"         }, 800);
				break;        
			}
		}
		
		function onOpenningDayEventAnimationComplete(options, dayOfMonth) 
		{
			var closeElement = $('<a href="">&times;</a>').click(function(e){ 
				e.preventDefault();
				onCloseClick(options, e); 
			}).attr({ "id" : options.id + '_close', "class" : "close-button" });

			with (options.dateBeingViewed) 
				var dayText = options.weekDays[getDay()] + ' ' + 
							  options.monthsOfYear[getMonth()] + ' ' + 
							  getDate() + ', ' + 
							  getFullYear();
			
			var animationPanel = options.dayBeingViewed.target;
			var origDayNumber  = animationPanel.children().first();
			var dayNumber      = origDayNumber.clone().attr({ "id" : options.id + "_anime_number" });     
	        var eventCountText = origDayNumber.next().clone().attr({ "id" : options.id + '_events_count' });
			var fullDayText    = dayNumber.clone().html(dayText.toUpperCase()).attr({ "id" : options.id + '_anime_text', "class" : "fullDateText"});

			var div = $('<div></div>').css({
				'height' : origDayNumber.height() + 'px', 
				'overflow' : 'hidden', 
				'position' : 'relative'
			}).append(dayNumber, fullDayText);
			
			dayNumber.css({
				'position' : 'absolute', 
				'top'      : '0px', 
				'left'     : '0px'
			});
				
			fullDayText.css({
				'position' : 'absolute', 
				'top'      : div.height() + 'px', 
				'left'     : '0px'
			});
			
			options.dayBeingViewed.animationEl.append(div, eventCountText, closeElement);

			var eventListContainer = $('<div id=' + options.id + '_eventListContainer class=eventListContainer></div>').hide();
			var eventsOfDay        = getEventsOfDay(options, dayOfMonth);
			
			for (var i = 0; i < eventsOfDay.length; i++)
			{
				var e = eventsOfDay[i];

				eventListContainer.append(
					$('<p class=event-time></p>'   ).html(getTimeOfEvent(e.date)),
					$('<p class=event-details></p>').html(e.content)
				);
			}

			options.dayBeingViewed.animationEl.append(eventListContainer);    
			
			dayNumber  .animate({'top': -div.height() + 'px'}, 500);
			fullDayText.animate({'top': '0px'}, 500);
			
			eventListContainer.fadeIn(500);
		}

		function onCloseClick(options, e)
		{
			options.dayBeingViewed.closingStage = 0;
			animateClosingDayEvents(options, e);
		}
		
		function animateClosingDayEvents(options, e)
		{
	
			var animationPanel = options.dayBeingViewed.animationEl;
			var listContainer  = $("#" + options.id + "_eventListContainer");
			var eventsCount    = $("#" + options.id + "_events_count"      );
			var dayNumber      = $("#" + options.id + "_anime_number"      );
			var dayName        = $("#" + options.id + "_anime_text"        );
			var closeButton    = $("#" + options.id + "_close"             );
	
			options.dayBeingViewed.closingStage++;
			
			switch (options.dayBeingViewed.closingStage) 
			{
				case 1 : 
					listContainer.fadeOut(500);
					closeButton  .fadeOut(500);
					eventsCount  .fadeOut(500);
					
					dayNumber.animate({ 'top' : '0px'}, 500, function(){
						animateClosingDayEvents(options);
					});
					
					dayName.animate({'top': dayNumber.height() + 'px'}, 500);
				break;
	
				case 2 : 
					animateStackPanelIntoView(options, options.MONTHLY_VIEW, function(){
						animateClosingDayEvents(options);
					});
				break;
				
				case 3 : 
					animationPanel.empty();    
					options.dayBeingViewed = null;
				break;
			}
		}

		function getTimeOfEvent(time)
		{
			time = new Date(time);
			var result = "";
			var h      = time.getHours();
			var m      = time.getMinutes();
			
			result += h + ":" + ((m >= 10) ? m : "0" + m); 
			result += ((h > 11) ? " pm" : " am");
			
			return result;
		}

		function extractTargetFromEvent(event)
		{
			return ((event.target.nodeName == 'P') ? event.target.parentNode : event.target);
		}

		function positionStackPanels(options)
		{
			var dailyViewContainer   = $("#" + options.id + " .daily-view"  );
			var monthlyViewContainer = $("#" + options.id + " .monthly-view");

			var padding = parseInt(dailyViewContainer.css("padding-left"), 10) + parseInt(dailyViewContainer.css("padding-right"), 10);
			var height  = monthlyViewContainer.height(); 
			var width   = monthlyViewContainer.width();
		
			monthlyViewContainer.css({
				"position" : "absolute",
				"top"      : "0px",
				"height"   : height + "px",
				"width"    : width + "px"
			});
	
			dailyViewContainer.css({
				"position" : "absolute",
				"top"      : -height + "px",
				"height"   : (height - padding) + "px",
				"width"    : (width - padding) + "px"
			});

			$("#" + options.id).css({ "height" : height + "px" });
		}
		
		function getFirstDayOfMonth(dateObject)
		{
			dateObject.setDate(1);
			return dateObject.getDay();
		}
		
		function getNumberOfDaysInMonth(options, dateObject)
		{
			var month = dateObject.getMonth();
			if (month == 1)
			{
				var leapYear = (new Date(dateObject.getYear(),1,29).getDate()) == 29;
				return (leapYear) ? 29 : 28;
			} 
			
			return options.daysInMonth[month];
		}

		function getEventsOfDay(options, dayOfMonth) 
		{
			var year        = options.currentDate.getFullYear();
			var month       = options.currentDate.getMonth();
			var monthEvents = events[options.id];
			var result      = []; 
	
			for (var i = 0; i < monthEvents.length; i++)
			{
				 var date = new Date(monthEvents[i].date);
				 
				 if (date.getFullYear() == year && date.getMonth() == month && date.getDate() == dayOfMonth) 
					 result.push(monthEvents[i]);
			}
			
			return result;
		}
	
		function dayHasEvents(options, day)
		{
			return getEventsOfDay(options, day).length > 0;
		}

		function isToday(options, dayNumber)
		{
			var today = new Date();
			return today.getDate() == dayNumber && today.getFullYear() == options.currentDate.getFullYear() && today.getMonth() == options.currentDate.getMonth();
		}
	

		$.fn.smoothPhpCalendar.prevYear = function()
		{
			_this.each(function(){
				prevYear(this, options[this.id]);
			}); 
		};

		$.fn.smoothPhpCalendar.prevMonth = function()
		{
			_this.each(function(){
				prevMonth(this, options[this.id]);
			}); 
		};

		$.fn.smoothPhpCalendar.nextMonth = function()
		{
			_this.each(function(){
				nextMonth(this, options[this.id]);
			}); 
		};

		$.fn.smoothPhpCalendar.nextYear = function()
		{
			_this.each(function(){
				nextYear(this, options[this.id]);
			}); 
		};

		_this = this;
        this.each(function(){
            init(this);
        }); 
    };
    
    $.fn.smoothPhpCalendar.defaults = {
		startDate            : new Date(),
		currentDate          : null,
		url                  : "smoothcalendar-ajax.php",
		MONTHLY_VIEW         : 0,
		DAILY_VIEW           : 1,
		daysInMonth          : [31,28,31,30,31,30,31,31,30,31,30,31],
		weekDays             : ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],
		monthsOfYear         : ["January","February","March","April","May","June","July","August","September","October","November","December"],
		dayNumbers           : {"sunday" : 0, "monday" : 1, "tuesday" : 2, "wednesday" : 3, "thursday" : 4, "friday" : 5, "saturday" : 6},
		container            : null,
		dateBeingViewed      : null,
		dayBeingViewed       : null,
	    MONTHLY_VIEW         : 0,
	    DAILY_VIEW           : 1
    };
    
    $.fn.isIE6 = function()
    {
    	return $().isIE() && $.browser.version == "6.0";
    };
    
    $.fn.isIE = function()
    {
		return $.browser.msie;    
    };

})(jQuery);
