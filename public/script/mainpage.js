
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
var search_form  = document.getElementById('search_user_form');
var search_query = document.getElementById('search_query');
var chat_room = document.getElementById('chat-room');
var user_list = document.getElementById('user_list');

var searchUser = async function(name){
	try{
		const search_result = await $.ajax({
			type : 'POST',
			url : links.link+"/userDetails/searchUser",
			data : {
				name : name
			}
		});
		return search_result;
	}catch(e){
		console.log("err");
		return {error : e.responseText}
	}
}

search_form.addEventListener('submit',async function(e){
	e.preventDefault();
	const search_result = await searchUser(search_query.value)
	user_list.innerHTML = "";
	console.log(search_result)
	if(search_result.error){
		console.log(search_result.error)
		user_list.innerHTML += "<div class=error>"+search_result.error+"</div>";
	}
	const data = search_result.result.filter(function(res){
		return res.username != username
	})
	for(var i = 0;i<data.length;i++)
	{
		user_list.innerHTML += "<div class=people><span class=sign></span><h4 class=onlineUser >" +  data[i].username + "  is online </h4>"+"<button id=submit class='btn btn-default' onclick=Gopersonal('"+username+"','"+data[i].username+"') >chat</button>"+"<div id="+data[i].username+" value=0 ></div></div>";
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

var Gopersonal  = async function(user1 , user2){
	sessionStorage.setItem("user2" , user2);
	try{
		const private_chat = await $.ajax({
			type:'POST',
			url:links.link+"/userDetails/Gopersonal",
			data: {
				user1: user1,
				user2: user2
			}
		})
	
		if(private_chat.success)
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

chat_form.addEventListener('submit', function(e){
	e.preventDefault();
	try{
		const chat_query = $.ajax({
			type: 'POST',
			url: links.link+"/userDetails/storeMessage",
			data: {
				message : message.value,
				handle : handle.value
			}
		});

		if(chat_query.success){
			socket.emit("chat" , {
				message : message.value ,
				handle : handle.value
			} , function(data){
					alert(data);
			});
			feedback.innerHTML = "";
			message.value = "";
		}else{
			alert(data.message);
		}
	} catch(error){
		console.log(error.responseText);
	}
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
