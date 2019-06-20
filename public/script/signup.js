var files = document.getElementById("fileButton");

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
        $('#loader').css('display' , 'none');
        if(signUp.success){
            sessionStorage.setItem("userId" , signUp.result.result[0].id);
            sessionStorage.setItem("username" , username);
            const storageRef = firebase.storage().ref('userImages/'+ username);
            const ref = await storageRef.put(file);
            window.location.href = "/homepage.html"
        } else{
                var message = signUp.message;
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