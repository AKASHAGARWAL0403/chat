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
                console.log(data);
                console.log(username);
			}
			else{
				console.log(data);
				window.location.href = "/";
			}
		}
	});
}
$('button').on('click',function(){
    console.log("mafda");
    window.location.href = "mainpage.html";
})

var socket  = io.connect("http://localhost:5000");

socket.on('connect', function(){
    sessionStorage.setItem("socket", socket.id);
    console.log(socket.id);
    console.log("dfgxc");
	apiCalls();
});

socket.on('alterActiveUser' , function(){
	console.log("entered");
	apiCalls();
})
var user_arr = [];



chat_form.addEventListener('submit', function(e){

	e.preventDefault();
	console.log("logged into button click");
	socket.emit("chat" , {
		message : message.value ,
		handle : handle.value
	} ,function(data){
			alert(data);
	});
	feedback.innerHTML = "";
	message.value = "";
});



socket.on("nickna" , function(data , client) {
//  online.innerHTML += "<p>" + data + " is online </p>";
 //  user_arr.push(data);
	var user_name = data[client.indexOf(socket.id)];
	online.innerHTML = "";
for(var i=0;i< data.length  ; i++)
{
	 if(client[i] != socket.id)
	 online.innerHTML += "<p>" +  data[i] + "  is online  <form id="+client[i]+" action=/chat/"+client[i]+" method=POST> <input type=text value="+user_name+" name=name style=display:none > <input  type=submit value=chat  ></form></p>"+"<div id="+data[i]+" style=display:none></div>";
		 else
			online.innerHTML += "<p>" + data[i] + "  is online</p> ";


}
});

//FOR SE

socket.on("chat" , function(data) {

	console.log("logged to chat");
	feedback.innerHTML = "";
	output.innerHTML += "<p><strong>" + data.handle + "</strong> : " + data.message + "</p><hr>" ;
});

socket.on("whisper" , function(data)
{
	feedback.innerHTML = "";
	output.innerHTML += "<p><strong>" + data.handle + "</strong> : " + data.message + "</p><hr>" ;
});

socket.on("mssg_emmited" , function(data)
{
		 document.getElementById(data.name).style.display = "block";
	//   document.getElementById(data.name).form.style.display = "block";
	document.getElementById(data.name).innerHTML += "new message";
//  alert("eesrx");
});
// FOR TYPING

message.addEventListener('keypress' , function(){

	socket.emit("typing" , handle.value);
});

socket.on("typing" , function(data){
	feedback.innerHTML = data + " : is typing";
});
}
