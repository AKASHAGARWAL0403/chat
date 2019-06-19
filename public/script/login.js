

    $('#submit').on('click',function(e){
        e.preventDefault();
        var username = $('#name').val();
        var password = $("#password").val();
        console.log(username)
        console.log(password)
        $.ajax({
            type: 'POST',
            url: links.link+"/userDetails/login",
            data: {
                username : username,
                password : password
            },
            success: function(data){
                if(data.success){
                   sessionStorage.setItem("userId" , data.result[0].id);
                   sessionStorage.setItem("username" , data.result[0].username)
                   console.log("ALAS")
                   window.location.href = "/homepage.html"
                }
                    else{
                        var message = data.message;
                        
                        $('#errorValue').html(message);
                    }
                }
        });
    })


    
    if(sessionStorage.getItem("userId") !== null && sessionStorage.getItem("username") !== null)
    {
        window.location.href = "/homepage.html";
    }

