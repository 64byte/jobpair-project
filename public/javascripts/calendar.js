var currentDate = new Date('2019-10-01');

var dayOfName = ["일", "월", "화", "수", "목", "금", "토"]
var daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var schedules = [];

function isLeapYear(year) {
    return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
}

function getDaysOfFeb(year) {
    return isLeapYear(year) ? 29 : 28;
}

function getDayOfDate(year, month) {
    return new Date(year + '-' + (month)).getDay();
}

function getPrevMonth(month) {
    return (month == 1) ? 12 : month-1;
}

function getNextMonth(month) {
    return (month == 12) ? 1: month+1;
}

function formatDate(date) {
    return date.getFullYear() + '년 ' + 
      (date.getMonth() + 1) + '월 ' + 
      date.getDate() + '일 ' + 
      date.getHours() + '시 ' + 
      date.getMinutes() + '분';
  }

function getPeriodString(startDate, endDate) {
    return formatDate(startDate) + ' ~ ' + formatDate(endDate);
}

function prevMonth() {
    $('.popover.fade.bs-popover-right.show').remove();
    currentDate.setMonth(currentDate.getMonth()-1);
    drawMontlyView();
    drawDailyView();
    updateSchedule();
}

function nextMonth() {
    $('.popover.fade.bs-popover-right.show').remove();
    currentDate.setMonth(currentDate.getMonth()+1);
    drawMontlyView();
    drawDailyView();
    updateSchedule();
}

function moveToYesterday() {
    $('.popover.fade.bs-popover-right.show').remove();
    currentDate.setDate(currentDate.getDate()-1);
    drawMontlyView();
    drawDailyView();
    updateSchedule();
}

function moveToTomorrow() {
    $('.popover.fade.bs-popover-right.show').remove();
    currentDate.setDate(currentDate.getDate()+1);
    drawMontlyView();
    drawDailyView();
    updateSchedule();
}

function updateDate(date) {
    currentDate = date;
    drawMontlyView();
    drawDailyView();
    updateSchedule();
}

function updateToday() {
    $('.popover.fade.bs-popover-right.show').remove();
    updateDate(new Date());
}

function initMontlyView() {
    $('.today').text('');
    for (var i=0; i<=5; ++i) {
        var week = $('.week:eq(' + i + ')');
        for (var j=0; j<7; ++j) {
            var day = week.children('.day:eq(' + j + ')');
            day.children('div').remove();
            var dayLabel = day.children('.day-label');
            dayLabel.removeAttr('style');
            dayLabel.text('');
        }
    }
}

function initDailyView() {
    $('.daily-calendar').children('.event').remove();
}

function drawMontlyView() {
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();

    daysOfMonth[1] = getDaysOfFeb(year);
    
    var startOfDays = getDayOfDate(year, month+1);

    initMontlyView();
    $('.today').text(year + "년 " + (month+1) + "월");

    var dayCount = 0;
    var prevMonth = getPrevMonth(month+1);
    var daysOfPrevMonth = daysOfMonth[prevMonth-1];

    for (var prevMonthDay = daysOfPrevMonth-startOfDays; prevMonthDay<daysOfPrevMonth; ++prevMonthDay) {
        var week = $('.week:eq(0)');
        var day = week.children('.day:eq(' + dayCount + ')');
        day.attr('class', 'day ' + (prevMonth) + '-' + (prevMonthDay+1));
        var dayLabel = day.children('.day-label');
        dayLabel.removeAttr('style');
        dayLabel.text(prevMonthDay+1);

        dayCount++;
    }

    var weekCount = 0;
    for (var j=0; j<daysOfMonth[month]; ++j) {
        var week = $('.week:eq(' + weekCount + ')');
        var day = week.children('.day:eq(' + dayCount + ')');
        // day.addClass((month+1) + '-' + (j+1));
        day.attr('class', 'day ' + (month+1) + '-' + (j+1));
        var dayLabel = day.children('.day-label');
        dayLabel.text(j+1);
        if (dayCount == 0)
            dayLabel.css("color", "red");
        else if (dayCount == 6)
            dayLabel.css("color", "blue");
        else
            dayLabel.css("color", "black");
        dayCount++;

        if (dayCount % 7 == 0)
        {
            dayCount = 0;
            weekCount++;
        }
    }

    var nextMonth = getNextMonth(month+1);
    var leftDays = (7 - dayCount) + 7;
    for (var j=0; j<leftDays; ++j) {
        var week = $('.week:eq(' + weekCount + ')');
        var day = week.children('.day:eq(' + dayCount + ')');
        day.attr('class', 'day ' + (nextMonth) + '-' + (j+1));
        var dayLabel = day.children('.day-label');
        dayLabel.text(j+1);

        dayCount++;

        if (dayCount % 7 == 0)
        {
            dayCount = 0;
            weekCount++;
        }
    }
}

function drawDailyView() {
    var todayDate = currentDate.getDate();
    var dayName = dayOfName[currentDate.getDay()];

    initDailyView();
    $('#daliy-text').text(todayDate + " 일 " + dayName + "요일");
}

function createPopup(name, desc, startDate, endDate) {
    return "'" + '<div class="content-line"><div class="event-consecutive-marking"></div><div class="title">\
                <h5>' + name +'</h5>\
                <h7 class="reservation">' + getPeriodString(startDate, endDate) + '\
            </div>\
        </div>\
        <div class="content-line">\
        <i class="material-icons">notes</i>\
        <div class="title"><h7 class="reservation">'
         + desc + '</div>' + "'";
}

function initSchedule() {
    for (var i=0; i<=5; ++i) {
        var week = $('.week:eq(' + i + ')');
        for (var j=0; j<7; ++j) {
            week.children('.day:eq(' + j + ')').children('.event').remove();
        }
    }
}

function createSchedule() {
    var name = $('#scheduleName').val();

    var desc = $('#scheduleText').val();

    var startDate = $('#startDate').val();

    var startTime = $('#startTime').val();

    var endDate = $('#endDate').val();

    var endTime = $('#endTime').val();

    

/*    console.log(startDate.val());
    console.log(startTime.val());
    console.log(endDate.val());
    console.log(endTime.val());

    console.log (new Date(startDate.val()));
    var dd = new Date(startDate)
    console.log(dd); */

    $.ajax({
        url: '/schedules',
        type: 'post',
        data: 'name=' + name + "&desc=" + desc + "&startDate=" + new Date(startDate + ' ' + startTime).toISOString() + '&endDate=' + new Date(endDate + ' ' + endTime).toISOString(),
        success: (resp, err) => {
            if (resp.status != "success")
                throw err;

            console.log(resp);
            
            $('#registerSchedule').modal('hide');
            updateSchedule();
        },
        error: (resp, err) => {

        }
    });
}

function loadSchedule() {
    $.ajax({
        url: '/schedules',
        type: 'get',
        success: (resp, err) => {
            if (resp.status != "success")
                throw err;

            schedules = resp.data.schedules;
        }
    });
}

function updateSchedule() {
    initSchedule();

    $.ajax({
        url: '/schedules',
        type: 'get',
        success: (resp) => {
            if (resp.status != "success")
                return;
                
            console.log(resp);
            var schedules = resp.data.schedules;
            for (var i=0; i<schedules.length; ++i) {

                var startDate = new Date(schedules[i].startDate);
                var endDate = new Date(schedules[i].endDate);
                var diffDate = new Date(endDate - startDate);
                
                let minRow = 0;
                for (var d = 0; d<diffDate.getDate(); ++d) {
                    let year = startDate.getFullYear();
                    let month = startDate.getMonth()+1;
                    let day = startDate.getDate();

                    if (currentDate.getFullYear() == year) {
                        minRow = $('.' + month + '-' + day).children().length;
                    }
                }

                console.log("Values = " + minRow);
                for (var d = 0; d<diffDate.getDate(); ++d) {
                    let year = startDate.getFullYear();
                    let month = startDate.getMonth()+1;
                    let day = startDate.getDate();

                    var popup = createPopup(schedules[i].name, schedules[i].desc, startDate, endDate);

                    if (currentDate.getFullYear() == year) {
                        var curEle = $('.' + month + '-' + day);
                        var childLen = curEle.children().length;
                        if (d == 0) {
                            for (var pad = childLen; pad<minRow; pad++)
                                curEle.append('<div></div>');

                            curEle.append('<div class="event event-consecutive event-start" data-span="1" data-toggle="popover" data-html="true" data-content=' + popup + '>' + schedules[i].name + '</div>');
                        } else if (d == diffDate.getDate()-1) {
                            for (var pad = childLen; pad<minRow; pad++)
                                curEle.append('<div></div>');

                            curEle.append('<div class="event event-consecutive event-end" data-span="1" data-toggle="popover" data-html="true" data-content=' + popup + '></div>');
                        } else {
                            for (var pad = childLen; pad<minRow; pad++)
                                curEle.append('<div></div>');

                            curEle.append('<div class="event event-consecutive" data-span="1" data-toggle="popover" data-html="true" data-content=' + popup + '></div>');
                        }
                        
                        if (month == currentDate.getMonth()+1 && day == currentDate.getDate())
                            $('.daily-calendar').append('<div class="event event-start event-end" data-span="1" data-toggle="popover" data-html="true" data-content=' + popup + '>' + schedules[i].name + '</div>');
                    }

                    startDate.setDate(startDate.getDate() + 1);
                }
            }

            $('[data-toggle="popover"]').popover().on('inserted.bs.popover')
        }
    });
}

function initRegModal() {
    $('#scheduleName').val('');
    $('#scheduleText').val('');
    $('#startDate').val('');
    $('#startTime').val('');
    $('#endDate').val('');
    $('#endTime').val('');
}

$(document).ready(() => {
    $('#tab-month').click(() => {
        $('.popover.fade.bs-popover-right.show').remove();
    });

    $('#tab-day').click(() => {
        $('.popover.fade.bs-popover-right.show').remove();
    });

    $('#prevBtn').click(() => {
        if ($('#tab-month').attr('aria-selected') == "true") {
            prevMonth();
        } else if ($('#tab-day').attr('aria-selected') == "true") {
            moveToYesterday();
        }
    });

    $('#nextBtn').click(() => {
        if ($('#tab-month').attr('aria-selected') == "true") {
            nextMonth();
        } else if ($('#tab-day').attr('aria-selected') == "true") {
            moveToTomorrow();
        }
    });
    $('#updateToday').click(updateToday);

    $('.week .day .day-label, .daily-calendar .day-name').click(function() {
        console.log("current Label: ");
        console.log(this.innerText);
        let month = this.innerText;
        if ($('#tab-day').attr('aria-selected') == "true")
            month = currentDate.getDate()

        initRegModal();

        $('#startDate').val((currentDate.getMonth()+1) + '/' + month + '/' + currentDate.getFullYear());
        $('#registerSchedule').modal('show');
    });
    
    $(".event-consecutive, .event, .event-repeated").click(function(event) {
        event.stopPropagation();
    });

    drawMontlyView();
    drawDailyView();
    updateSchedule();

    $('#reg-schedule').click(() => {
        console.log('sadfsdf');
    
        createSchedule();
    })
    
});

$(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'L'
    });
    $('#datetimepicker3').datetimepicker({
        format: 'L'
    });
});

$(function () {
    $('#datetimepicker2').datetimepicker({
        format: 'LT'
    });
    $('#datetimepicker4').datetimepicker({
        format: 'LT'
    });
});
