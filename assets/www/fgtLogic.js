var daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthShortName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var calDate = null;
var chat_count = 0;
var sending_time = 0;
var domainName = "http://morning-scrubland-4310.herokuapp.com";


function startProcessing(){
	if(window.localStorage.getItem("loginStatus")=="loggedin"){
		location.hash = "#page1";
		console.log("access_token = "+window.localStorage.getItem("facebook_token"));
		console.log("facebook_id = "+window.localStorage.getItem("facebook_id"));
		console.log("user_name = "+window.localStorage.getItem("user_name"));
		console.log("login Status = "+window.localStorage.getItem("loginStatus"));
	}
}

$("#facebook_connect").live("click", function(e){
	authenticate();
});

function getCurrentMonthName(){
	var d = new Date();
	return monthShortName[d.getMonth()];
}

function getMonthName(index){
	return monthShortName[index];
}

function twitterGetDate(date){
    var month=null;
    var splitDate=date.split(" ");
    for(var i=0; i<monthName.length; i++){
        if((monthName[i].substring(0,3))==splitDate[1]){
            month=i+1;
            if(month<10){
                month="0"+month;
            }
        }
    }
    var newDate=splitDate[5]+"-"+month+"-"+splitDate[2];
    return newDate;
}

function twitterGetTime(time){
    var splitDate=time.split(" ");
    var time1=splitDate[3].split(":");
    return time1[0]+":"+time1[1];
}

function isDateChanged(prevDate, currDate){

    var splitDateCurr = currDate.split("-");
    var splitDatePrev = prevDate.split("-");
    if (splitDateCurr[2][0] == "0") {
        splitDateCurr[2] = splitDateCurr[2][1];
    }
    if (splitDateCurr[1][0] == "0") {
        splitDateCurr[1] = splitDateCurr[1][1];
    }
    // alert(prevDate);
    // alert(splitDatePrev);
    if (splitDatePrev[2][0] == "0") {
        splitDatePrev[2] = splitDatePrev[2][1];
    }
    if (splitDatePrev[1][0] == "0") {
        splitDatePrev[1] = splitDatePrev[1][1];
    }
    if (splitDateCurr[0] == splitDatePrev[0]) {
        if (splitDateCurr[1] == splitDatePrev[1]) {
            if (parseInt(splitDateCurr[2]) != parseInt(splitDatePrev[2])) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}


function getTime(dateTime){
    var splitTime = dateTime.split("T");
    var newTime = splitTime[1];
    var time = newTime.split(":");
    return time[0] + ":" + time[1];
}

function getDate(dateTime){
    var splitDate = dateTime.split("T");
    var newDate = splitDate[0];
    return newDate;
}

function getChangedDateView(date){
    var splitDate = date.split("-");
    var year = parseInt(splitDate[0]);
    if (splitDate[2][0] == "0") {
        splitDate[2] = splitDate[2][1];
    }
    if (splitDate[1][0] == "0") {
        splitDate[1] = splitDate[1][1];
    }
    var mnth = parseInt(splitDate[1]);
    var dayInt = parseInt(splitDate[2]);
    var myDate = new Date(year, mnth - 1, dayInt);
    var day = myDate.getDay();
    var newDate = dayName[day] + ", " + monthShortName[mnth - 1] + " " + dayInt;
    return newDate;
}

function getTimeFormatted(time){
    var flag = false;
    var ampm = '';
    var arr = time.split(':');
    if(arr[0][0]=="0"){
       arr[0][0]==arr[0][1];
    }

    var hours = parseInt(arr[0]);
    if (hours > 12) {
        flag = true;
        hours = hours - 12;
    }
    ampm = hours + ':' + arr[1];
    if (flag) {
        ampm += " PM";
    }
    else {
        ampm += " AM";
    }
    return ampm;
}
