if(sessionStorage.getItem("userId") === null || sessionStorage.getItem("username") === null || sessionStorage.getItem("user2") === null)
{
	window.location.href = "/";
}
else{
var username = sessionStorage.getItem("username");
var user2 = sessionStorage.getItem("user2");
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var send =document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var chat_hide = document.getElementById('chat_hide');
var chat_form = document.getElementById('chat_form');
var chat_room = document.getElementById('chat-room');
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
				checkTable(username , user2);
			}
			else{
				console.log(data);
				window.location.href = "mainpage.html";
			}
		}
	});
}
$('#button').on('click',function(){
	$.ajax({
		type: 'POST',
		url: "http://127.0.0.1:5000/userDetails/removePersonalChat",
		data: {
			username : username
		},
		success: function(data){
			if(data.success){
				window.location.href = "mainpage.html";
			} else{ 
				alert(data.message);			
			}
		}
	});
});

var socket  = io.connect("http://localhost:5000");

var displayMessage = function(data){
	output.innerHTML= "";
	for(var i=0;i<data.length ;i++){
		if(data[i].handle === username)
			output.innerHTML += "<p class=mess1><strong>"+data[i].handle + ":</strong>  " +data[i].message+"</p>";
		else
			output.innerHTML += "<p class=mess2><strong>"+data[i].handle + ":</strong>  " +data[i].message+"</p>";
	}
	chat_room.scrollTop = chat_room.scrollHeight;
}

var restoreMessage = function(){
	$.ajax({
		type :'POST',
		url: "http://127.0.0.1:5000/userDetails/restoreMessage",
		data: {
			tableName : sessionStorage.getItem("table")
		},
		success : function(data){
			if(data.success){
				displayMessage(data.result);
			} else {

			}
		}
	});
}

var checkTable = function(user1,user2){
	$.ajax({
		type: 'POST',
		url: "http://127.0.0.1:5000/userDetails/createTable",
		data: {
			user1: user1,
			user2: user2
		},
		success: function(data){
			if(data.success){
				sessionStorage.setItem("table" , data.tableName);
				restoreMessage();
				console.log(sessionStorage.getItem("table"));
			} else{
				window.location.href = "mainpage.html";
			}
		}
	});
}

var storeMessage = function(message , data){
	var tableName = sessionStorage.getItem("table");
	$.ajax({
		type : 'POST',
		url :  "http://127.0.0.1:5000/userDetails/storePrivateMessage",
		data : {
			tableName : tableName , 
			handle : username , 
			message : message
		},
		success : function(response){
			if(response.success) {
				if(data.success){
					if(data.sameUser){
						socket.emit("chat" , {
							message : message ,
							handle : handle.value,
							to : user2,
							active : true
						} , function(data){
								alert(data);
							}
						);
					} else{
						socket.emit("chat" , {
							message : message ,
							handle : handle.value,
							to : user2,
							active : false
						} , function(data){
								alert(data);
							}
						);
					}
				} else{ 
					alert(data.message);
				}
			} else {
				alert("unablle to send message please try again");
			}
		}
	});
}

socket.on('connect', function(){
	sessionStorage.setItem("socket", socket.id);
	handle.value = username;
	console.log(socket.id);
	apiCalls();
	socket.emit("username" , {username : username});
});

socket.on("audio" , function(){
	document.getElementById("audio").play();
});

chat_form.addEventListener('submit', function(e){
	e.preventDefault();
	console.log("logged into button click private");
	$.ajax({
		type: 'POST',
		url: "http://127.0.0.1:5000/userDetails/getUserData",
		data : {
			user1 : username,
			user2 : user2
		},
		success : function(data){
			console.log(data);
			storeMessage(message.value , data);
			feedback.innerHTML = "";
			message.value = "";
		}
	});
});
socket.on("personalChat" , function(data){
	console.log(data);
	if(data.handle === username)
		output.innerHTML += "<p class=mess1><strong>"+data.handle + ":</strong>  " +data.message+"</p>";
	else
		output.innerHTML += "<p class=mess2><strong>"+data.handle + ":</strong>  " +data.message+"</p>";
	chat_room.scrollTop = chat_room.scrollHeight;
});
socket.on("notify" , function(data){
	alert("you have a new message from "+data.handle);
	document.getElementById("audio").play();
});
message.addEventListener('keypress' , function(){
	socket.emit("typing" , handle.value);
});

// socket.on("typing" , function(data){
	//feedback.innerHTML = data + " : is typing";
// });
}
