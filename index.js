var express = require('express');
var socket  = require('socket.io');
var bodyParser = require('body-parser');
const Entry  = require('./mongoose/ninja');
const mongoose = require('mongoose');
const UserRouter = require('./Users/router');
const db = require("./Databse/chat_db");
var app = express();
var path = require('path'); 
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
app.use(express.static(path.join(__dirname,'akash')));
console.log(path.join(__dirname,'akash'));

app.use( "/frontpage" , express.static('akash'));
app.use("/userDetails" , UserRouter);
//app.use(express.static('public'));
//app.use("/contact" ,express.static('public'));
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
			for(var i=0;i<client_socket.length ; i++){
				if(client_socket[i].username === to){
					targetSocket = client_socket[i];
					break;
				}
			}
			if(data.active){
				console.log("active");
				targetSocket.emit("personalChat" , data);
			} else {
				console.log("not active");
				targetSocket.emit("notify" , data);
			}
			socket.emit("personalChat" , data);
		}
	});

	socket.on("typing" , function(data){
		socket.broadcast.emit("typing" , data);
	});

// 	socket.on("mssg_send" , function(data)
// {
// 	console.log("babababaa0");
// //  if(socket == linking[linking[client_name[client_socket.indexOf(socket)]].nickname])\
// if(linking[linking[client_name[client_socket.indexOf(socket)]].nickname] == undefined  || linking[linking[client_name[client_socket.indexOf(socket)]].nickname].nickname == socket.nickname)
// {
// 	console.log("here");
// 	//  console.log(linking[linking[client_name[client_socket.indexOf(socket)]].nickname].nickname);
// 	if( linking[linking[client_name[client_socket.indexOf(socket)]].nickname] == undefined )
// linking_message[linking[client_name[client_socket.indexOf(socket)]].nickname]  = {name : socket.nickname , message : data.message};
// linking[client_name[client_socket.indexOf(socket)]].emit("mssg_emmited" , data);
// socket.emit('mssg_emmited',data);
// }
// else
// {
// //  linking_message[socket.nickname] = data.message;
// 	linking_message[linking[client_name[client_socket.indexOf(socket)]].nickname]  = {name : socket.nickname , message : data.message};
// 	linking[client_name[client_socket.indexOf(socket)]].emit("alert_him" , data);
// }

// });

// socket.on('closing_time' , function(data)
// {
// 	if(linking_message[socket.nickname] == undefined)
// 	socket.emit('take_name' , { name :client_name[client_arr.indexOf(socket.id)] , message : ""});
// 	else {
// 		if(linking[client_name[client_socket.indexOf(socket)]].nickname == linking_message[client_name[client_socket.indexOf(socket)]].name)
// 		socket.emit('take_name' , { name :client_name[client_arr.indexOf(socket.id)] , message : linking_message[socket.nickname]});
// 		else {
// 			socket.emit('take_name' , { name :client_name[client_arr.indexOf(socket.id)] , message : ""});
// 		}
// 	}
// });

});



app.post("/chat/:id" , bodyParser.urlencoded({ extended: false }) , function(req,res)
{
	//name  = req.body.name;
	soc = req.params.id;

	name = req.body.name;
	linking[name] = client_socket[client_arr.indexOf(soc)];
	console.log(soc);
	console.log(linking[name].nickname + "   aaa toh raha h ");
	console.log(client_name.indexOf(name)+ "  fvcxgvdzxvcdfvccxvadfcbvdfcgv");
	client_name.push(name);
	res.sendFile(__dirname + "/public/i.html");
} );
