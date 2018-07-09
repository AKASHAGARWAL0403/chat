var socket  = io.connect("http://localhost:5000");

var message = document.getElementById("message");
 var handle = document.getElementById("handle");
var send =document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var online = document.getElementById("online");

var chat_hide = document.getElementById('chat_hide');
var chat_form = document.getElementById('chat_form');
var dropdown = document.getElementById('dropdown');
var user_arr = [];
var client_name = [];
var client_id = [];
var name_of_user;
var no_of_mssg = 0;
online.style.height = chat_hide.style.height;

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

 function ale(n)
 {
//  var btn = document.getElementById(id);
  alert(n.id);

 }

socket.on("nickna" , function(data , client,alert) {
//  online.innerHTML += "<p>" + data + " is online </p>";
 //  user_arr.push(data);

  var user_name = data[client.indexOf(socket.id)];
  online.innerHTML = "";
for(var i=0;i< data.length  ; i++)
{
   if(client[i] != socket.id)
   online.innerHTML += "<p style=display:inline>" +  data[i] + "  is online  <form id="+client[i]+" action=/chat/"+client[i]+" method=POST style=display:inline> <input type=text value="+user_name+" name=name style=display:none > <input  type=submit value=chat  ></form></p>"+"<div id="+data[i]+"  class=alerting_mssg ></div>";
     else
      online.innerHTML += "<p>" + data[i] + "  is online</p><br> ";


}

/*alert.forEach(function(item)
{
   document.getElementById(data.to).style.display = "block";
    document.getElementById(data.to).style.display = " new message from "+item;
});*/
});

//FOR SE

socket.on("chat" , function(data) {

  console.log("logged to chat");
  feedback.innerHTML = "";

//  console.log(data.message[data.name[data.socke.indexOf(socket)]]);
  output.innerHTML = data[name_of_user] ;
});

socket.on("whisper" , function(data)
{
  feedback.innerHTML = "";
  output.innerHTML =  data[name_of_user] ;
});

socket.on("mssg_emmited" , function(data)
{
     document.getElementById(data.to).style.display = "block";
  //   document.getElementById(data.name).form.style.display = "block";
  //if(no_of_mssg == 0)

//  no_of_mssg++;
  document.getElementById(data.to).innerHTML = " new message from "+data.to;
   document.getElementById('audio').play();

//  alert("eesrx");
});
// FOR TYPING

message.addEventListener('keypress' , function(){

  socket.emit("typing" , handle.value);
});

socket.on("typing" , function(data){
  feedback.innerHTML = data + " : is typing";
});

window.addEventListener('load' , function(){
  socket.emit("tell_name" , {});
})

socket.on("take_name_ur" , function(data){

    console.log("i_want_id dfdgv");


    console.log("i_want_id");
  for(var key in data.persronal_message)
  {
    if(data.persronal_message[key] != "")
    {
/*   var place = data.persronal_message[key].indexOf('/');
   var id = data.persronal_message[key].substr(0,place);
   console.log(id + "   "  );*/
  dropdown.innerHTML += "<form> <input type=text value="+data.name+" name=name style=display:none > <input  type=submit value="+key+"  ></form>"
  }
}
  name_of_user = data.name;
  console.log(name_of_user);
  handle.value = name_of_user;
  output.innerHTML = data.message[name_of_user];

});
