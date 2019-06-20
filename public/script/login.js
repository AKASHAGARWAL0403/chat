

    $('#name').on('keyup',function(e){
        $('#errorValue').html("");
    })

    $('#password').on('keyup',function(e){
        $('#errorValue').html("");
    })
    
    $('#form').on('submit',async function(e){
        e.preventDefault();
        var username = $('#name').val();
        var password = $("#password").val();
        if(/[^a-z0-9]/gi.test(username)){
            $('#errorValue').html("Username cant contain special character");
            return;
        }
        try{
            $('#loader').css('display' , 'block');
            const login_res = await $.ajax({
                type: 'POST',
                url: links.link+"/userDetails/login",
                data: {
                    username : username,
                    password : password
                }
            });
            if(login_res.success){
                sessionStorage.setItem("userId" , login_res.result[0].id);
                sessionStorage.setItem("username" , login_res.result[0].username)
                $('#loader').css('display' , 'none');
                window.location.href = "/homepage.html"
            }else{
                var message = login_res.message;
                $('#loader').css('display' , 'none');
                $('#errorValue').html(message);
            }
        }catch(error){
            $('#loader').css('display' , 'none');
            $('#errorValue').html(error);
        }
    })


    
    if(sessionStorage.getItem("userId") !== null && sessionStorage.getItem("username") !== null)
    {
        window.location.href = "/homepage.html";
    }

