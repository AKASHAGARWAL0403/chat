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
var linking ={};
var messages = {};
var linking_message = {};
var group_message = {};
var client_arr = [];
var client_name = [];
var client_socket = [];
var alert_mssg = {};
io.on('connection' , function(socket)
{
  console.log("socket is connected");
  client_arr.push(socket.id);
  client_socket.push(socket);
  socket.nickname = client_name[client_socket.indexOf(socket)];
//var clients = io.sockets.clients();
for(var key in linking)
{
    if(linking[key] == "")
       linking[key] = socket;
}

  io.sockets.emit("nickna" , client_name , client_arr );

  console.log(socket.nickname);




  socket.on("disconnect" , function(){
    console.log("logged into delete");
    for(var key in linking)
    {

        if(linking[key] == socket  )
        {
          linking[key] = "";
        }
    }
      client_name.splice(client_arr.indexOf(socket.id) ,1);
      client_socket.splice(client_arr.indexOf(socket.id) ,1);
      client_arr.splice(client_arr.indexOf(socket.id) ,1);

      io.sockets.emit("nickna" , client_name, client_arr);
  });





  socket.on("chat" , function(data,callback) {
    console.log("logged into chat in seerver");
    var mssg = data.message.trim();
    if(mssg.substr(0,3) === "/w ")
    {
        mssg = mssg.substr(3);
        var ind = mssg.indexOf(' ');
        if(ind != -1)
        {
          var name = mssg.substr(0,ind);
          mssg = mssg.substr(ind+1);
          if(client_name.indexOf(name) != -1)
          {
               console.log("whisper");
               client_socket[client_name.indexOf(name)].emit("whisper" , {message:mssg , handle: data.handle});
          }
          else {
              callback("enter correct name");
          }
        }
        else {
             callback("enter the message");
        }
    }
    else {
    console.log("logged in else");
    io.sockets.emit("chat" ,data);
  }
  });

  socket.on("typing" , function(data){
    socket.broadcast.emit("typing" , data);
  });

  socket.on("mssg_send" , function(data)
{
  console.log("babababaa0");
//  if(socket == linking[linking[client_name[client_socket.indexOf(socket)]].nickname])\
if(linking[linking[client_name[client_socket.indexOf(socket)]].nickname] == undefined  || linking[linking[client_name[client_socket.indexOf(socket)]].nickname].nickname == socket.nickname)
{
  console.log("here");
  //  console.log(linking[linking[client_name[client_socket.indexOf(socket)]].nickname].nickname);
  if( linking[linking[client_name[client_socket.indexOf(socket)]].nickname] == undefined )
linking_message[linking[client_name[client_socket.indexOf(socket)]].nickname]  = {name : socket.nickname , message : data.message};
linking[client_name[client_socket.indexOf(socket)]].emit("mssg_emmited" , data);
socket.emit('mssg_emmited',data);
}
else
{
//  linking_message[socket.nickname] = data.message;
  linking_message[linking[client_name[client_socket.indexOf(socket)]].nickname]  = {name : socket.nickname , message : data.message};
  linking[client_name[client_socket.indexOf(socket)]].emit("alert_him" , data);
}

});

socket.on('closing_time' , function(data)
{
  if(linking_message[socket.nickname] == undefined)
  socket.emit('take_name' , { name :client_name[client_arr.indexOf(socket.id)] , message : ""});
  else {
    if(linking[client_name[client_socket.indexOf(socket)]].nickname == linking_message[client_name[client_socket.indexOf(socket)]].name)
    socket.emit('take_name' , { name :client_name[client_arr.indexOf(socket.id)] , message : linking_message[socket.nickname]});
    else {
      socket.emit('take_name' , { name :client_name[client_arr.indexOf(socket.id)] , message : ""});
    }
  }
});

});

app.post("/contact" , bodyParser.urlencoded({ extended: false }) , function(req,res){

  var n = req.body.sign_in_name;
  var n2 = req.body.name2;
  var n_sign_up = req.body.name;


  console.log(n +" "+n2 + " "+ n_sign_up);
  if( n2 == undefined && n== undefined)
{
  console.log("eterong");
  Entry.findOne({name: req.body.name}).then(function(entry){
        if(entry == null)
   {
     Entry.create(req.body).then(function(entry){

     res.sendFile(__dirname + "/public/index.html");
     client_name.push(req.body.name);
     console.log("yipeee   " + req.body);
     console.log("location is:   "+ req.body.URL);
     });
   }
   else {
     res.sendFile(__dirname + "/akash/sign_up.html");
     console.log("abe koi aur naam lai");
   }

 });


/*  if(client_name.indexOf(n)==-1)
  {
  res.sendFile(__dirname + "/public/index.html");
    client_name.push(req.body.name);
      console.log("yipeee" + req.body.name);
  }
  else
  {
    res.sendFile(__dirname + "/akash/index.html");
    console.log("account already exist");
  }*/
}
else if(n2 == undefined && n_sign_up == undefined)
{
  Entry.findOne({name:req.body.sign_in_name , password : req.body.sign_in_password}).then(function(entry)
{
  console.log(entry+ "   check it");
  if(entry != null)
  {
  res.sendFile(__dirname + "/public/index.html");
  client_name.push(req.body.sign_in_name);
  console.log("yipeee   " + req.body);
  console.log("location is:   "+ req.body.URL);
 }
 else {
   res.sendFile(__dirname+"/akash/index.html");
   console.log("bhai sahi daal lai");
 }
});
}
else {
  res.sendFile(__dirname + "/public/index.html");
    client_name.push(req.body.name2);
      console.log("yipeee" + req.body.name2);
}
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
