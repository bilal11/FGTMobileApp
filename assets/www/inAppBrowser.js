var app_id = "455419371188015"; 
var app_secret = "109cce03082a0e4191081df21a49";
var ref = null;
var fbDomainName;

function authenticateIAB(){
    var my_redirect_uri = "https://www.facebook.com/connect/login_success.html", my_type = "user_agent", my_display = "touch";
    var authorize_url = "https://graph.facebook.com/oauth/authorize?";
    authorize_url += "client_id=" + app_id;
    authorize_url += "&redirect_uri=" + my_redirect_uri;
    authorize_url += "&display=" + my_display;
    authorize_url += "&scope=read_stream,publish_stream,offline_access,publish_checkins"

	ref = window.open(authorize_url, '_blank', 'location=yes');
//	ref.addEventListener("loadstart", facebookLocChangedIAB);
	ref.addEventListener("loadstop", facebookLocChangedIAB);
}


function facebookLocChangedIAB(event){
//	alert("facebookLocChangedIAB");
    if (event.url.indexOf("https://www.facebook.com/connect/login_success.html") > -1) {
//    	alert("reached");
        var fbCode = event.url.match(/code=(.*)$/)[1]
        console.log('https://graph.facebook.com/oauth/access_token?client_id='+app_id+'&client_secret='+app_secret+'&redirect_uri=https://www.facebook.com/connect/login_success.html&code=' + fbCode);
//       	$.support.cors = true;
        $.ajax({
            url: 'https://graph.facebook.com/oauth/access_token?client_id='+app_id+'&client_secret='+app_secret+'&redirect_uri=https://www.facebook.com/connect/login_success.html&code=' + fbCode,
            data: {},
            success: function(data, status){
            	alert("success");
                window.localStorage.setItem("facebook_token", data.split("=")[1]);
				if(ref){
					ref.close();
				}
                initialize_facebookIAB();
            },
            error: function(error){
				if(ref){
					ref.close();
				}
				alert("in loc change error");
            },
            dataType: 'text',
            type: 'POST'
        });
    }
}

function initialize_facebookIAB(){
	var url = "https://graph.facebook.com/me?access_token=" + window.localStorage.getItem('facebook_token');
	console.log("initialize_facebookIAB = "+url);
	$.getJSON(url, function(data){
		alert("my data received");
		window.localStorage.setItem("facebook_id", data.id);
		window.localStorage.setItem("user_name", data.name);
		window.localStorage.setItem("loginStatus", "loggedin");
		window.localStorage.getItem("user_name");
		var command = fbDomainName + "/facebook/connect.json?facebook_id=" + window.localStorage.getItem("facebook_id") + "&access_token=" + window.localStorage.getItem("facebook_token");
		alert("command = "+command);
		$.get(command, function(datam){
			alert("connect request sent");
			if (datam) {
				alert(JSON.stringify(datam));
				window.location.href = "#newsfeed";
				startProcessing();
			}
		});
	});
}


function initialize_facebookIAB(){
	var url = "https://graph.facebook.com/me?access_token=" + window.localStorage.getItem('facebook_token');
	console.log("initialize_facebookIAB = "+url);
	$.getJSON(url, function(data){
		console.log("my data received");
		window.localStorage.setItem("facebook_id", data.id);
		window.localStorage.setItem("user_name", data.name);
		window.localStorage.setItem("loginStatus", "loggedin");
		window.localStorage.getItem("user_name");
		var command = fbDomainName + "/facebook/connect.json?facebook_id=" + window.localStorage.getItem("facebook_id") + "&access_token=" + window.localStorage.getItem("facebook_token");
		console.log("command = "+command);
		$.getJSON(command, function(datam){
			console.log("connect request sent");
			if (datam) {
				console.log(JSON.stringify(datam));
				window.location.href = "#newsfeed";
				startProcessing();
			}
		});
	});
}


