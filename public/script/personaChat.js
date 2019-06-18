
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
var files = document.getElementById("fileButton");

files.addEventListener('change', function(e){
	var file = e.target.files[0];
	console.log(file);
	message.value = 'images/'+file.name;
	var storageRef = firebase.storage().ref('images/'+file.name);
	console.log(storageRef.put(file));
});

var addImageMessage = function(link , classNames){
	var starsRef = firebase.storage().ref(link);
			starsRef.getDownloadURL().then(function(url) {
				console.log(url);
				output.innerHTML += "<p class="+classNames+"><strong>"+data.handle + ":</strong><img src="+url+" /> </p>";
			   }).catch(function(error) {
				 switch (error.code) {
				   case 'storage/object_not_found':
					 // File doesn't exist
					 break;
				   case 'storage/unauthorized':
					 // User doesn't have permission to access the object
					 break;
				   case 'storage/canceled':
					 // User canceled the upload
					 break;
				   case 'storage/unknown':
					 // Unknown error occurred, inspect the server response
					 break;
				 }
			   });
}

var appendMessgae = async function(data){
	if(data.handle === username)
	{
		if(data.message.substr(0,7)=== 'images/'){
			var starsRef = firebase.storage().ref('images');
			await starsRef.child(data.message.substr(7)).getDownloadURL().then(function(url) {
				output.innerHTML += "<p class=mess1><strong>"+data.handle + ":</strong><img class=imageMessage src="+url+" /> </p>";
			   }).catch(function(error) {
				 	console.log(error.code)  
			   });
		} else{
			output.innerHTML += "<p class=mess1><strong>"+data.handle + ":</strong>  " +data.message+"</p>";
		}
	} 
	else{
		if(data.message.substr(0,7)=== 'images/'){
			var starsRef = firebase.storage().ref('images');
			await starsRef.child(data.message.substr(7)).getDownloadURL().then(function(url) {
				output.innerHTML += "<p class=mess2><strong>"+data.handle + ":</strong><img  class=imageMessage src="+url+" /> </p>";
			   }).catch(function(error) {
				 	console.log(error.code)
			   });
		} else{
			output.innerHTML += "<p class=mess2><strong>"+data.handle + ":</strong>  " +data.message+"</p>";
		}
	}
}


var apiCalls = function(){
	$.ajax({
		type: 'POST',
		url: links.link+"/userDetails/loggedIn",
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
		url: links.link+"/userDetails/removePersonalChat",
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

var socket  = io.connect(links.link);

var  displayMessage =async  function(data){
	output.innerHTML= "";
	console.log(data);
	for(var i=0;i<data.length ;i++){
		await appendMessgae(data[i]);
	}
	chat_room.scrollTop = chat_room.scrollHeight;
}

var restoreMessage = function(){
	$.ajax({
		type :'POST',
		url: links.link+"/userDetails/restoreMessage",
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
		url: links.link+"/userDetails/createTable",
		data: {
			user1: user1,
			user2: user2
		},
		success: function(data){
			if(data.success){
				sessionStorage.setItem("table" , data.tableName);
				restoreMessage();
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
		url :  links.link+"/userDetails/storePrivateMessage",
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
	apiCalls();
	socket.emit("username" , {username : username});
});

socket.on("audio" , function(){
	document.getElementById("audio").play();
});

chat_form.addEventListener('submit', function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: links.link+"/userDetails/getUserData",
		data : {
			user1 : username,
			user2 : user2
		},
		success : function(data){
			storeMessage(message.value , data);
			feedback.innerHTML = "";
			message.value = "";
		}
	});
});

socket.on("personalChat" , function(data){
	appendMessgae(data);
});

socket.on("notify" , function(data){
	alert("you have a new message from "+data.handle);
	document.getElementById("audio").play();
});

message.addEventListener('keypress' , function(){
	socket.emit("typing" , {name : handle.value , to : user2 , group : false});
});

socket.on("typing" , function(data){
	//output.innerHTML += data + " : is typing";
});

}
