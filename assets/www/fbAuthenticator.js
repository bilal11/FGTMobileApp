//A2ADB1s
var imageURI;
var picture_of_event_id;
var fbDomainName;
//var app_id = "455419371188015"; 
//var app_secret = "109cce03082a0e4191081df21a498268";
var app_id = "482249595151685"; 
var app_secret = "e011fb6285ac388ca902a556e31e2f71"; 

	
function authenticate(){
    var client_browser = window.plugins.childBrowser;
    var my_redirect_uri = "https://www.facebook.com/connect/login_success.html", my_type = "user_agent", my_display = "touch";
    var authorize_url = "https://graph.facebook.com/oauth/authorize?";
    authorize_url += "client_id=" + app_id;
    authorize_url += "&redirect_uri=" + my_redirect_uri;
    authorize_url += "&display=" + my_display;
    authorize_url += "&scope=read_stream,publish_stream,offline_access,publish_checkins"
    
    client_browser.onLocationChange = function(loc){
        facebookLocChanged(loc);
    };
    if (client_browser != null) {
        client_browser.showWebPage(authorize_url);
    }
}

function facebookLocChanged(loc){

    if (loc.indexOf("https://www.facebook.com/connect/login_success.html") > -1) {
        var fbCode = loc.match(/code=(.*)$/)[1]
        console.log('https://graph.facebook.com/oauth/access_token?client_id='+app_id+'&client_secret='+app_secret+'&redirect_uri=https://www.facebook.com/connect/login_success.html&code=' + fbCode);
//       	$.support.cors = true;
        $.ajax({
            url: 'https://graph.facebook.com/oauth/access_token?client_id='+app_id+'&client_secret='+app_secret+'&redirect_uri=https://www.facebook.com/connect/login_success.html&code=' + fbCode,
            data: {},
            success: function(data, status){
                window.localStorage.setItem("facebook_token", data.split("=")[1]);
                window.plugins.childBrowser.close();
//                alert("in success");
                initialize_facebook();
            },
            error: function(error){
//                alert(JSON.stringify(error));
                window.plugins.childBrowser.close();
            },
            dataType: 'text',
            type: 'POST'
        });
    }
}

function initialize_facebook(){
//	$(".fb_connect img").attr("src","images/ajax-loader.gif");
	var url = "https://graph.facebook.com/me?access_token=" + window.localStorage.getItem('facebook_token');
	$.getJSON(url, function(data){
		window.localStorage.setItem("facebook_id", data.id);
		window.localStorage.setItem("user_name", data.name);
		window.localStorage.setItem("loginStatus", "loggedin");
		var command = fbDomainName + "/facebook/connect.json?facebook_id=" + window.localStorage.getItem("facebook_id") + "&access_token=" + window.localStorage.getItem("facebook_token");
		$.getJSON(command, function(datam){
			if (datam) {
				console.log(datam);
				location.hash = "#page1";
				startProcessing();
			}
		});
	});
}

function inviteFriends(){
	var client_browser = window.plugins.childBrowser;
    var link='http://nightlifeapp.hoosierballs.com';
	var redirect_uri='http://nightlifeapp.hoosierballs.com/';
	var message="check this fantastic app";
	var invited_url='https://www.facebook.com/dialog/apprequests?app_id=267408530037764&message='+message+'&redirect_uri='+redirect_uri;
//	var invite_url='http://www.facebook.com/dialog/send?app_id=267408530037764&to='+friend_id+'&name=SOCIOLOCITY&link='+link+'&redirect_uri='+redirect_uri;
	console.log(invited_url);
	client_browser.onLocationChange = function(loc){
        closeChildBrowser(loc);
    };
	
    if (client_browser != null) {
        client_browser.showWebPage(invited_url);
    }
	
}


function closeChildBrowser(loc){
	if (loc.indexOf("http://nightlifeapp.hoosierballs.com/?request") > -1) {
		window.plugins.childBrowser.close();
		alert("Invitation sent.");
	}
    
}


//pictureSource = navigator.camera.PictureSourceType;
//destinationType = navigator.camera.DestinationType;

function capturePhoto(selected_event_id){
    picture_of_event_id=selected_event_id;
//	alert(picture_of_event_id);
    navigator.camera.getPicture(getUploadOption, onFail, {
        quality: 20,
        allowEdit: true,
        destinationType: navigator.camera.DestinationType.FILE_URI
    });
}


function selectPhotoFromAlbum(selected_event_id){
    picture_of_event_id=selected_event_id;
    navigator.camera.getPicture(getUploadOption, onFail, {
        quality: 20,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
    });
}

function getUploadOption(image_uri){
    imageURI = image_uri;
    getOption();
}

function getOption(){
	//    navigator.notification.confirm('Select an option', upload, 'Upload to:', 'Facebook,Competition,Ignore ');
	$('#upload_options').scroller({
		preset: 'select',
		theme: 'ios',
		display: 'modal',
		mode: 'mixed',
		inputClass: 'i-txt'
	});
	$('#upload_options').scroller('show');
}

function onFail(message){
    alert('Failed because: ' + message);
}


function upload(btnIndex){
	if (btnIndex == "1") {
		uploadToFacebook();
	}
	else {
		if (btnIndex == "3") {
			var mhtml = "";
			var url = fbDomainName + "/nightlife/get_competetion.json?facebook_id=" + window.localStorage.getItem("facebook_id");
			$.getJSON(url, function(data){
				//				navigator.notification.confirm('Select an option', uploadToCompetetion, 'Upload to:', 'Cancel,' + data[0].name + ',' + data[1].name);
				for (var i = 0; i < data.length; i++) {
					mhtml += '<option value ="' + data[i].id + '">' + data[i].name + '</option>';
				}
				$('#competition_select').html(mhtml);
				$('#competition_select').scroller({
					preset: 'select',
					theme: 'ios',
					display: 'modal',
					mode: 'mixed',
					inputClass: 'i-txt'
				});
				$('#competition_select').scroller('show');
			});
		}
		else {
			if (btnIndex == "2") {
				uploadToEvent();
			}
		}
	}
}

function uploadToFacebook(){
    var message = prompt("Photo caption: ");
    var options = new FileUploadOptions();
    options.fileKey = "photo";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
	options.chunkedMode=false;
    var params = new Object();
    params.access_token = window.localStorage.getItem("facebook_token").split("&")[0];
	params.type = "photo";
    params.message = message;
	params.event_id = picture_of_event_id;
	params.category_id = 0;
    options.params = params;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("https://graph.facebook.com/me/photos"), win, fail, options);
}



function uploadToCompetetion(competition_id){
	var message = prompt("Photo caption: ");
	var options = new FileUploadOptions();
	options.fileKey = "picture[photo]";
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";
	options.chunkedMode = false;
	
	var params = new Object();
	
	params.access_token = window.localStorage.getItem("facebook_token").split("&")[0];
	params.type = "photo";
	params.message = message;
	params.event_id = 0;
	params.category_id = competition_id;
	options.params = params;
	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI(fbDomainName + "/nightlife/upload_picture"), win, fail, options);
}


function uploadToEvent(){
	var message = prompt("Photo caption: ");
	var options = new FileUploadOptions();
	options.fileKey = "picture[photo]";
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";
	options.chunkedMode = false;
	
	var params = new Object();
	
	params.access_token = window.localStorage.getItem("facebook_token").split("&")[0];
	params.type = "photo";
	params.message = message;
	params.event_id = picture_of_event_id;
	params.category_id = 0;
	options.params = params;
	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI(fbDomainName + "/nightlife/upload_picture"), win, fail, options);
}

function win(r){
    alert("File Uploaded Successfully.\nCode = " + r.responseCode);
	getOption();
}
function fail(error){
	alert("File Uploaded Successfully.");
//    alert("An error has occurred: Code = " + error.code);
	getOption();
}

$(function(){
	$("#competition_select").change(function(){
		var competition_id = $('#competition_select').attr('value');
		uploadToCompetetion(competition_id);
	});
});

$(function(){
	$("#upload_options").change(function(){
		var btnIndex = $('#upload_options').attr('value');
		upload(btnIndex);
	});
	
});