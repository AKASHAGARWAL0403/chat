
$('#name').on('keyup',function(e){
    $('#errorValue').html("");
})

$('#password').on('keyup',function(e){
    $('#errorValue').html("");
})

var files = document.getElementById("fileButton");
$('#fileButton').on('change',function(e){
    $('#errorValue').html("")
})

$('#form').on('submit' , async function(e){
    e.preventDefault();
    const file = $('input[type="file"]')[0].files[0];
   // console.log(file)
    const username = $('#name').val();
    const password = $("#password").val();
    if(/[^a-z0-9]/gi.test(username)){
        $('#errorValue').html("Username cant contain special character");
        return;
    }
    try{
        $('#loader').css('display' , 'block');
        //console.log($('#loader'))
        const signUp = await $.ajax({
            type: 'POST',
            url: links.link+"/userDetails/signup",
            data: {
                username : username,
                password : password
            }
        });
        
        if(signUp.success){
            sessionStorage.setItem("userId" , signUp.result.result[0].id);
            sessionStorage.setItem("username" , username);
            const storageRef = firebase.storage().ref('userImages/'+ username);
            const ref = await storageRef.put(file);
            $('#loader').css('display' , 'none');
            window.location.href = "/homepage.html"
        } else{
                var message = signUp.message;
                $('#loader').css('display' , 'none');
                $('#errorValue').html(message);
        }
    }catch(error){
        console.log(error)
        $('#errorValue').html(error);
    }       
})

if(sessionStorage.getItem("userId") !== null && sessionStorage.getItem("username") !== null)
{
        window.location.href = "/homepage.html";
}