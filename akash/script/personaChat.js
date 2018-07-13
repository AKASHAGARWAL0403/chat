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
$('button').on('click',function(){
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
				console.log(sessionStorage.getItem("table"));
			} else{
				window.location.href = "mainpage.html";
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
			if(data.success){
				if(data.sameUser){
					socket.emit("chat" , {
						message : message.value ,
						handle : handle.value,
						to : user2,
						active : true
					} , function(data){
							alert(data);
						}
					);
				} else{
					socket.emit("chat" , {
						message : message.value ,
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
			feedback.innerHTML = "";
			message.value = "";
		}
	});
});
socket.on("personalChat" , function(data){
	console.log(data);
	output.innerHTML += "<p><strong>"+data.handle + ":</strong>  " +data.message+"</p>";
});
socket.on("notify" , function(data){
	alert("you have a new message");
});
message.addEventListener('keypress' , function(){
	socket.emit("typing" , handle.value);
});

// socket.on("typing" , function(data){
	//feedback.innerHTML = data + " : is typing";
// });
}
