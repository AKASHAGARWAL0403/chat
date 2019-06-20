

    $('#name').on('keyup',function(e){
        $('#errorValue').html("");
    })

    $('#password').on('keyup',function(e){
        $('#errorValue').html("");
    })
    
    $('#form').on('submit',function(e){
        e.preventDefault();
        var username = $('#name').val();
        var password = $("#password").val();
        if(/[^a-z0-9]/gi.test(username)){
            $('#errorValue').html("Username cant contain special character");
            return;
        }
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

