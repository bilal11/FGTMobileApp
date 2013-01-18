var daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthShortName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var calDate = null;
var chat_count = 0;
var sending_time = 0;
var domainName = "http://morning-scrubland-4310.herokuapp.com";
fbDomainName = domainName;
var myData;


function startProcessing(){
	//window.localStorage.setItem("facebook_id","100000026248887");
	if(window.localStorage.getItem("loginStatus")=="loggedin"){
		window.location.href = "#newsfeed";
		var url = domainName+'/get_all_posts.json?facebook_id='+window.localStorage.getItem("facebook_id");
		console.log("url-------------"+url);
		$.getJSON(url, displayAllPosts);
	}
}

var regular_update = setInterval(function(e){
	var url = domainName+'/home_posts.json?facebook_id='+window.localStorage.getItem("facebook_id");
	$.getJSON(url, function(e){
		console.log(JSON.stringify(e));
	});
	var url = domainName+'/feed_posts.json?facebook_id='+window.localStorage.getItem("facebook_id");
	$.getJSON(url, function(e){
		console.log(JSON.stringify(e));
	});
}, 1*60*1000);

$("#facebook_connect").live("click", function(e){
	authenticate();
});

$(".tab1").live("click", function(e){
	// window.location.href = "#newsfeed";
	var url = domainName+'/get_all_posts.json?facebook_id='+window.localStorage.getItem("facebook_id");
	$.getJSON(url, displayAllPosts);
});

function displayAllPosts(data){
	// alert("displayAllPosts");
	var mhtml = '';
	for(var i=0; i<data.length; i++){
		var post_text = data[i].text;
		if(post_text==null||post_text==""||data[i].status_type=="approved_friend"){
			post_text = data[i].story;
			if(post_text==null){
				post_text = "";
				console.log(post_text);
				console.log(data[i].fb_post_id);
				console.log(data[i].id);
				console.log(data[i].picture_url);
			}
				
		}
		var shared_pic = data[i].picture_url;
		var post_time = data[i].post_time;
		var user_image = "https://graph.facebook.com/"+data[i].poster_fb_id+"/picture?type=large";
		
		var formatedTime = getDate(post_time);
	  	formatedTime = getChangedDateView(formatedTime);
	   	formatedTime = formatedTime.split(",")[1];
	   	post_time = formatedTime+", "+getTimeFormatted(getTime(post_time));
	   	
	   	mhtml+='<a href="#" data-transition="slide">';
        mhtml+='<li class="news_feed_content_li" id="'+data[i].id+'">';
        mhtml+='<div class="news_feed_content_seperator"></div>';
        mhtml+='<div class="news_feed_content_container">';
        mhtml+='<div class="news_feed_content_c1">';
		mhtml+='<div class="news_feed_content_c1r1">';
		mhtml+='<img src="'+user_image+'"></div></div>';
		mhtml+='<div class="news_feed_content_c2">';
		mhtml+='<div class="news_feed_content_c2r1">'+data[i].poster_name+'</div>';
		mhtml+='<div class="news_feed_content_c2r2">'+post_text+'</div>';
		mhtml+='<div class="news_feed_content_c2r3">';
		mhtml+='<img src="images/like_btn.png">'+data[i].total_likes+'<img src="images/msg_btn.png">'+data[i].total_comments+'</div></div>';
		mhtml+='<div class="news_feed_content_c3">';
		mhtml+='<div class="news_feed_content_c3r1">'+post_time+'</div>';
		mhtml+='<div class="news_feed_content_c3r2">';
		if(shared_pic!=null){
			mhtml+='<img src="'+shared_pic+'">';
		}
		mhtml+='</div></div></div>';
		mhtml+='<div class="clr"></div></li></a>';
	}
	$(".news_feed_content_ul").html(mhtml);
}

$('.news_feed_content_li').live('click',function(e){
	var post_id = $(this).attr('id');
	var url = domainName+'/post_detail.json?facebook_id='+window.localStorage.getItem("facebook_id")+'&post_id='+post_id;
	console.log(url);
	$.getJSON(url,showPostDetailPage);
});

function showPostDetailPage(data){
	window.location.href = "#photodetail";
	if(data!=null||data!=""){
		var mhtml = "";
		var post_text = data.post.text;
		if(post_text==null||data.post.status_type=="approved_friend"){
			post_text = data.post.story;
			if(post_text==null)
				post_text = "";
		}
		var shared_pic = data.post.picture_url;
		var post_time = data.post.post_time;
		var user_image = "https://graph.facebook.com/"+data.post.poster_fb_id+"/picture?type=large";
		var formatedTime = getDate(post_time);
	  	formatedTime = getChangedDateView(formatedTime);
	   	formatedTime = formatedTime.split(",")[1];
	   	post_time = formatedTime+", "+getTimeFormatted(getTime(post_time));
		mhtml+='<div class="post_detail_container_details_c1">';
		mhtml+='<img src="'+user_image+'"></div>';
		mhtml+='<div class="post_detail_container_details_c2">';
		mhtml+='<div class="post_detail_container_details_c2r1">'+data.post.poster_name+'</div>';
		mhtml+='<div class="post_detail_container_details_c2r2">'+post_text+'</div>';
		mhtml+='</div><div class="post_detail_container_details_c3">'+post_time+'</div>';
		$(".post_detail_container_details").html(mhtml);
		if(shared_pic!=null){
			if(shared_pic.indexOf("_s.")>-1){
				var big_img = shared_pic.split("_s.");
				shared_pic = big_img[0]+"_b."+big_img[1];
			}
			$('.post_detail_container_image').html('<img src="'+shared_pic+'">');
		}else{
			$('.post_detail_container_image').html("");
		}
		var total_comments = data.post.total_comments;
		$('.post_detail_like_count').html(data.post.total_likes);
		$('.post_detail_comment_count').html(total_comments);
		$('.comments_count').html(total_comments+" of "+total_comments);
		mhtml = "";
		for(var i=0; i<data.post_comments.length; i++){
			var commenter_image = 'https://graph.facebook.com/'+data.post_comments[i].commenter_fb_id+'/picture';
			mhtml+='<div class="comment_container" id="'+data.post_comments[i].comment_fb_id+'">';
			mhtml+='<div class="comment_container_image">';
			mhtml+='<img src="'+commenter_image+'"></div>';
			mhtml+='<div class="comment_container_comment">';
			mhtml+='<div class="comment_body">';
			mhtml+='<span class="comment_user_name">'+data.post_comments[i].commenter_name+'</span>'+data.post_comments[i].text+'</div>';
			mhtml+='<div class="comment_options">';
			mhtml+='<span class="comment_option_time"> 11 minutes ago </span>';
			mhtml+='<span class="comment_option_like"> <a href="#"> Like </a> </span></div></div>';
			mhtml+='<div class="clr"></div></div>';
		}
		$('.comments_container').html(mhtml);
		$('.new_com_sub img').attr("src", "https://graph.facebook.com/"+window.localStorage.getItem("facebook_id")+"/picture");
	}
}

$(".tab2").live("click", function(e){
	var url = domainName+'/get_my_posts.json?facebook_id='+window.localStorage.getItem("facebook_id");
	$.getJSON(url, displayMyPosts);
});



function displayMyPosts(data){
	// alert("displayMyPosts");
	var mhtml = '';
	for(var i=0; i<data.length; i++){
		var post_text = data[i].text;
		if(post_text==null||post_text==""||data[i].status_type=="approved_friend"){
			post_text = data[i].story;
			if(post_text==null)
				post_text = "";
		}
		var shared_pic = data[i].picture_url;
		var post_time = data[i].post_time;
		var user_image = "https://graph.facebook.com/"+data[i].poster_fb_id+"/picture?type=large";
		
		var formatedTime = getDate(post_time);
	  	formatedTime = getChangedDateView(formatedTime);
	   	formatedTime = formatedTime.split(",")[1];
	   	post_time = formatedTime+", "+getTimeFormatted(getTime(post_time));
	   	mhtml+='<a href="#" data-transition="slide">';
        mhtml+='<li class="news_feed_content_li" id="'+data[i].id+'">';
        mhtml+='<div class="news_feed_content_container">';
        mhtml+='<div class="news_feed_content_c1">';
		mhtml+='<div class="news_feed_content_c1r1">';
		mhtml+='<img src="'+user_image+'"></div></div>';
		mhtml+='<div class="news_feed_content_c2">';
		mhtml+='<div class="news_feed_content_c2r1">'+data[i].poster_name+'</div>';
		mhtml+='<div class="news_feed_content_c2r2">'+post_text+'</div>';
		mhtml+='<div class="news_feed_content_c2r3">';
		mhtml+='<img src="images/like_btn.png">'+data[i].total_likes+'<img src="images/msg_btn.png">'+data[i].total_comments+'</div></div>';
		mhtml+='<div class="news_feed_content_c3">';
		mhtml+='<div class="news_feed_content_c3r1">'+post_time+'</div>';
		mhtml+='<div class="news_feed_content_c3r2">';
		if(shared_pic!=null){
			mhtml+='<img src="'+shared_pic+'">';
		}
		mhtml+='</div></div></div>';
		mhtml+='<div class="news_feed_content_seperator"><img src="images/news_feed_seperator.png"></div>';
		mhtml+='<div class="clr"></div></li></a>';
	}
	$(".myposts_content_ul").html(mhtml);
}

/*
function tables(tx){
    tx.executeSql('DROP TABLE IF EXISTS POSTS');
//    tx.executeSql('DROP TABLE IF EXISTS FRIENDS');
//    tx.executeSql('DROP TABLE IF EXISTS MESSAGES');
    tx.executeSql('CREATE TABLE IF NOT EXISTS POSTS (id unique, post_from)');
//    tx.executeSql('CREATE TABLE IF NOT EXISTS FRIENDS (id unique, facebook_id, name)');
//    tx.executeSql('CREATE TABLE IF NOT EXISTS MESSAGES (id unique, time, message, group_id, sender_id, sender_name,flag)');
}
*/

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
