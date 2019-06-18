$(document).ready(function(){

    if(sessionStorage.getItem("userId") === null || sessionStorage.getItem("username") === null)
    {
        window.location.href = "/";
    }

    const socket  = io.connect(links.link);
    const username = sessionStorage.getItem("username").toLowerCase()
    const contact_list = document.getElementById('contact-list')
    const profile_username = document.getElementById('profile-username')
    const chatMessageDOM = document.getElementById('chat-messages')
    const contactDisplayDiv = document.getElementById('contact-profile-div')

    profile_username.innerHTML = username.toUpperCase()

    const appendOnlineUsers = function(data){
        contact_list.innerHTML = "";
        data.forEach(function(element){
            contact_list.innerHTML += generateContactHtml("online" , element.userName.toLowerCase())
        });
        $('.contact').on('click',contactOnClick)
    }

    const appendChatMessages = function(data){
        chatMessageDOM.innerHTML = "";
        data.forEach(function(element){
            chatMessageDOM.innerHTML += generateMessageHtml((element.handle === username?"replies":"sent") , element.message)
        })
    }

    const contactOnClick = async function(e){
        const tableName = await checkTable(username , this.id)
        const messages = await restoreMessage(tableName);
        contactDisplayDiv.childNodes[3].innerHTML = this.id;
        appendChatMessages(messages);
    }


    const restoreMessage = async function(tableName){
        try{
            const messageQuery = await $.ajax({
                type :'POST',
                url: links.link+"/userDetails/restoreMessage",
                data: {
                    tableName : tableName
                }
            });
            return messageQuery.result;
        }catch(error){
            console.log(error);
        }
    }

    const checkTable = async function(user1,user2){
        try{
            const table_query = await  $.ajax({
                type: 'POST',
                url: links.link+"/userDetails/createTable",
                data: {
                    user1: user1,
                    user2: user2
                }
            });
            return table_query.tableName
        }catch(error){
            console.log(error);
        }
    }

    const apiCalls = async function(){
	    try{
            
            await logInUser();
            await getOnlineUser();
    
        } catch(error){
            console.log(error.responseText);
        }
    }
    
    const logInUser = async function(){
        login_result = await $.ajax({
            type: 'POST',
            url: links.link+"/userDetails/loggedIn",
            data: {
                socket_id : socket.id,
                username : username
            }
        });
    }

    const getOnlineUser = async function(){
        
        get_user = await $.ajax({
			type:'GET',
			url: links.link+"/userDetails/getUser"
        });
        
        get_user = get_user.result.filter(function(res){
            return res.userName.toLowerCase() != username.toLowerCase()
        })
        
        appendOnlineUsers(get_user);
    }

    const generateContactHtml = function(status , username){
        let contact_html = "\
            <li class='contact' id='"+username+"'>\
                <div class='wrap'>\
                <span class='contact-status "+status+"'></span>\
                <img src='http://emilcarlsson.se/assets/louislitt.png' alt='' />\
                <div class='meta'>\
                    <p class='name'>"+ username.toUpperCase() + "</p>\
                </div>\
            </div>\
        </li>" 

        return contact_html
    }

    const generateMessageHtml = function(usage , message){
        let messageHtml = "\
            <li class='"+usage+"'>\
				<img src='http://emilcarlsson.se/assets/mikeross.png' alt='' />\
				<p>"+message+"</p>\
            </li>"
        return messageHtml
    }

    socket.on('connect', function(){
        sessionStorage.setItem("socket", socket.id);
        apiCalls();
    });

})


