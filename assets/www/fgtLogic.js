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
