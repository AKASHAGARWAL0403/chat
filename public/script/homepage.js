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
    const userMessageInput = document.getElementById('user-message')
    const userMessageButton = document.getElementById('user-message-button')

    profile_username.innerHTML = username.toUpperCase()

    const appendOnlineUsers = function(data){
        contact_list.innerHTML = "";
        data.forEach(function(element){
            contact_list.innerHTML += generateContactHtml("online" , element.userName.toLowerCase())
        });
        $('.contact').on('click',contactOnClick)
        $('.message-input').css('display' , 'block')
        if(data.length != 0)
            contact_list.childNodes[1].click()
        else{
            contactDisplayDiv.childNodes[3].innerHTML = ""
            chatMessageDOM.innerHTML = "";    
            $('.message-input').css('display' , 'none')
        }
           
    }

    const appendSingleChatMessage = function(element){
        chatMessageDOM.innerHTML += generateMessageHtml((element.handle === username?"replies":"sent") , element.message)
    }

    const appendChatMessages = function(data){
        chatMessageDOM.innerHTML = "";
        data.forEach(function(element){
            appendSingleChatMessage(element);
        })
    }

    const contactOnClick = async function(e){
        await goPersonal(username , this.id);
        const tableName = await checkTable(username , this.id)
        const messages = await restoreMessage(tableName);
        contactDisplayDiv.childNodes[3].innerHTML = this.id;
        appendChatMessages(messages);
        sessionStorage.setItem(this.id , tableName); 
    }

    const goPersonal  = async function(user1 , user2){
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
        }catch(error){
            console.log(error.responseText)
        }	
    };

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

    const getUserData = async function(data){
        const userResult = await $.ajax({
            type: 'POST',
            url: links.link+"/userDetails/getUserData",
            data : data
        });
        return userResult
    }

    const storeMessage = function(message , user2){
        const tableName = sessionStorage.getItem(user2);
        try{
            const privateMessageQuery = $.ajax({
                type : 'POST',
                url :  links.link+"/userDetails/storePrivateMessage",
                data : {
                    tableName : tableName , 
                    handle : username , 
                    message : message
                }
            });

            return privateMessageQuery;
        }catch(error){
            console.log(error);
        }
    }

    userMessageButton.addEventListener('click', async function(e){
        e.preventDefault();
        const user2 = contactDisplayDiv.childNodes[3].innerHTML.toLowerCase()
        const userData = await getUserData({user1 : username , user2 : user2})
        const storeMessageQuery = await storeMessage(userMessageInput.value , user2);
        if(storeMessageQuery.success) {
            if(userData.success){
                if(userData.sameUser){
                    socket.emit("chat" , {
                        message : userMessageInput.value ,
                        handle : username,
                        to : user2,
                        active : true
                    } , function(data){
                            alert(data);
                        }
                    );
                } else{
                    socket.emit("chat" , {
                        message : userMessageInput.value ,
                        handle : username,
                        to : user2,
                        active : false
                    } , function(data){
                            alert(data);
                        }
                    );
                }
            }
        }
        userMessageInput.value = "";
    })

    socket.on('connect', function(){
        sessionStorage.setItem("socket", socket.id);
        apiCalls();
        socket.emit("username" , {username : username});
    });

    socket.on('disco' , function(){
        apiCalls();
    });

    socket.on("personalChat" , function(data){
        appendSingleChatMessage(data);
    });
    
    socket.on("notify" , function(data){
        alert("you have a new message from "+data.handle);
        document.getElementById("audio").play();
    });

})


