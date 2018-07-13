if(sessionStorage.getItem("userId") === null || sessionStorage.getItem("username") === null)
{
	window.location.href = "/";
}
else{
var username = sessionStorage.getItem("username")
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var send =document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var online = document.getElementById("online");
var chat_hide = document.getElementById('chat_hide');
var chat_form = document.getElementById('chat_form');
var getOnline = function(data){
	online.innerHTML = "";
	for(var i=0;i< data.length  ; i++)
	{
		console.log(data[i]);
		if(data[i].userName != username)
	 	online.innerHTML += "<p>" +  data[i].userName + "  is online </p>"+"<button id=submit onclick=Gopersonal('"+username+"','"+data[i].userName+"') >chat</button>"+"<div id="+data[i].userName+" value=0 ></div>";
		else
		online.innerHTML += "<p>" + data[i].userName + "  is online</p> ";
	}
}

var getMessages = function(data){
	output.innerHTML = "";
	for(var i=0;i< data.length  ; i++){
		output.innerHTML += "<p><strong>" + data[i].handle + "</strong> : " + data[i].messge + "</p><hr>" ;
	}
}

var apiCalls = function(){
	$.ajax({
		type: 'POST',
		url: "http://127.0.0.1:5000/userDetails/loggedIn",
		data: {
			socket_id : socket.id,
			username : username
		},
		success: function(data){
			if(data.success){
				$.ajax({
				   type:'GET',
				   url: "http://127.0.0.1:5000/userDetails/getUser",
				   success: function(data){
						if(data.success){
							getOnline(data.result);
							$.ajax({
								type: 'GET',
								url: "http://127.0.0.1:5000/userDetails/getGroupMessages",
								success: function(data){
									if(data.success){
										getMessages(data.result);
									} else {
										console.log(data.message);
									}
								}
							});
						} else {
							console.log(data);
						}
				   }
			   })
			}
			else{
				console.log(data);
				window.location.href = "/";
			}
		}
	});
}
var Gopersonal  = function(user1 , user2){
	sessionStorage.setItem("user2" , user2);
	console.log(user1);
	console.log(user2);
	$.ajax({
		type:'POST',
		url:"http://127.0.0.1:5000/userDetails/Gopersonal",
		data: {
			user1: user1,
			user2: user2
		},
		success: function(data){
			if(data.success){
				window.location.href = "personalChat.html";
			}else{
				console.log(data);
			}
		}
	})
};
var socket  = io.connect("http://localhost:5000");

socket.on('connect', function(){
	sessionStorage.setItem("socket", socket.id);
	handle.value = username;
	apiCalls();
	socket.emit("username" , {username : username});
});

socket.on('disco' , function(){
	console.log("entered");
	apiCalls();
})
var user_arr = [];



chat_form.addEventListener('submit', function(e){
	e.preventDefault();
	console.log("logged into button click");
	$.ajax({
		type: 'POST',
		url: "http://127.0.0.1:5000/userDetails/storeMessage",
		data: {
			message : message.value,
			handle : handle.value
		},
		success: function(data){
			if(data.success){
				socket.emit("chat" , {
					message : message.value ,
					handle : handle.value
				} ,function(data){
						alert(data);
				});
				feedback.innerHTML = "";
				message.value = "";
			}
			else{
				alert(data.message);
			}
		}
	});
});

socket.on("chat" , function(data) {

	console.log("logged to chat");
	feedback.innerHTML = "";
	output.innerHTML += "<p><strong>" + data.handle + "</strong> : " + data.message + "</p><hr>" ;
});

socket.on("audio" , function(){
	document.getElementById("audio").play();
});

socket.on("notify" , function(data){
	alert("you have a new message from "+data.handle);
	
	document.getElementById("audio").play();
});

message.addEventListener('keypress' , function(){

	socket.emit("typing" , handle.value);
});

socket.on("typing" , function(data){
	feedback.innerHTML = data + " : is typing";
});
}
