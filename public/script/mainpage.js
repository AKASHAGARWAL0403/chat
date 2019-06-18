
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
var chat_room = document.getElementById('chat-room');

var searchUser = function(name){
	if(name){
		$.ajax({
			type : 'POST',
			url : links.link+"/userDetails/searchUser",
			data : {
				name : name
			} , 
			success : function(data){
				if(data.success){

				} else {

				}
			}
		});
	}
}

$("#searchUser").on("keyup", function(e){
	if(e.keyCode === 13){

	} else {

	}
})

var getOnline = function(data){
	online.innerHTML = "";
	for(var i=0;i< data.length  ; i++)
	{
		if(data[i].userName != username)
	 	online.innerHTML += "<div class=people><span class=sign></span><h4 class=onlineUser >" +  data[i].userName + "  is online </h4>"+"<button id=submit class='btn btn-default' onclick=Gopersonal('"+username+"','"+data[i].userName+"') >chat</button>"+"<div id="+data[i].userName+" value=0 ></div></div>";
	}
}

var getMessages = function(data){
	output.innerHTML = "";
	for(var i=0;i< data.length  ; i++){
		output.innerHTML += "<p><strong>" + data[i].handle + "</strong> : " + data[i].messge + "</p><hr>" ;
	}
	chat_room.scrollTop = chat_room.scrollHeight;
}


var apiCalls = async function(){
	
	let login_result , get_user , group_message;
	try{
		
		login_result = await $.ajax({
			type: 'POST',
			url: links.link+"/userDetails/loggedIn",
			data: {
				socket_id : socket.id,
				username : username
			}
		});

		get_user = await $.ajax({
			type:'GET',
			url: links.link+"/userDetails/getUser"
		});

		getOnline(get_user.result);

		group_message = await $.ajax({
			type: 'GET',
			url: links.link+"/userDetails/getGroupMessages"
		});
		
		getMessages(group_message.result);

	} catch(error){
		console.log(error.responseText);
	}
}



var Gopersonal  = function(user1 , user2){
	sessionStorage.setItem("user2" , user2);

	try{
		const private_chat = $.ajax({
			type:'POST',
			url:links.link+"/userDetails/Gopersonal",
			data: {
				user1: user1,
				user2: user2
			}
		})
	
		if(data.success)
			window.location.href = "personalChat.html";
	}catch(error){
		console.log(error.responseText)
	}
	
	
	
};
var socket  = io.connect(links.link);

socket.on('connect', function(){
	sessionStorage.setItem("socket", socket.id);
	handle.value = username;
	apiCalls();
	socket.emit("username" , {username : username});
});

socket.on('disco' , function(){
	apiCalls();
});
var user_arr = [];



chat_form.addEventListener('submit', function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: links.link+"/userDetails/storeMessage",
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
	socket.emit("typing" , { name : handle.value , group: true});
});

socket.on("typing" , function(data){
	feedback.innerHTML = data + " : is typing";
});
}
