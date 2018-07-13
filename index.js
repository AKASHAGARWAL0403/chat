var express = require('express');
var socket  = require('socket.io');
var bodyParser = require('body-parser');
const UserRouter = require('./Users/router');
const db = require("./Databse/chat_db");
var app = express();
var cors = require("cors");
var controllerDelete = require("./Users/controllerDelete")
app.use(cors());
var server;
var name;
db.connect(function(err){
	if(err)
	{
		console.log("unable to connect to database");
	} else {
		console.log("connected to database");
		server  = app.listen(5000, function () {
			console.log("listening to port no 5000");
		});
	}
});
var io = socket(server);
app.use(express.static(path.join(__dirname,'public')));
console.log(path.join(__dirname,'akash'));

app.use( "/frontpage" , express.static('akash'));
app.use("/userDetails" , UserRouter);

var client_socket = [];
io.on('connection' , function(socket)
{
	console.log("socket is connected");
	client_socket.push(socket);
	socket.broadcast.emit('disco');
	
	socket.on("username" , function(data){
		socket.username = data.username;
		console.log(socket.username);
	});

	socket.on("disconnect" , function(){
		var socketId = socket.id;
		console.log(socketId);
		console.log("logged into delete");
		console.log(client_socket.indexOf(socket))
		client_socket.splice(client_socket.indexOf(socket),1);
		console.log(client_socket.indexOf(socket));
		setTimeout(() => {
			controllerDelete.deleteLogged(socketId , function(err,result){
				if(result.result.affectedRows === 1){
					console.log(result);
					io.sockets.emit("disco");
				}
			});
		}, 1000);
	});

	socket.on("chat" , function(data,callback) {
		console.log("logged into chat");
		if(!data.to){
			io.sockets.emit("chat" ,data);
			socket.broadcast.emit("audio");
		} else {
			console.log(data);
			var to = data.to;
			var targetSocket = "";
			var i;
			for(i=0;i<client_socket.length ; i++){
				if(client_socket[i].username === to){
					targetSocket = client_socket[i];
					break;
				}
			}
			if(i != client_socket.length){
				if(data.active){
					console.log("active");
					targetSocket.emit("personalChat" , data);
				} else {
					console.log("not active");
					targetSocket.emit("notify" , data);
				}
				socket.emit("personalChat" , data);
			} else {
				socket.emit("personalChat" , data);
			}
			
		}
	});

	socket.on("typing" , function(data){
		socket.broadcast.emit("typing" , data);
	});

});
