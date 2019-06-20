

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
        try{
            $('#loader').css('display' , 'block');
            const login = $.ajax({
                type: 'POST',
                url: links.link+"/userDetails/login",
                data: {
                    username : username,
                    password : password
                }
            });

            if(login.success){
                sessionStorage.setItem("userId" , login.result[0].id);
                sessionStorage.setItem("username" , login.result[0].username)
                $('#loader').css('display' , 'none');
                window.location.href = "/homepage.html"
            }else{
                var message = login.message;
                $('#loader').css('display' , 'none');
                $('#errorValue').html(message);
            }
        }catch(error){
            $('#errorValue').html(error);
        }
    })


    
    if(sessionStorage.getItem("userId") !== null && sessionStorage.getItem("username") !== null)
    {
        window.location.href = "/homepage.html";
    }

