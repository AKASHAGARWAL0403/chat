var files = document.getElementById("fileButton");

$('#submit').on('click' , async function(e){
    e.preventDefault();
    const file = $('input[type="file"]')[0].files[0];
   // console.log(file)
    const username = $('#name').val().toLowerCase();
    const password = $("#password").val();
    try{
        const signUp = await $.ajax({
            type: 'POST',
            url: links.link+"/userDetails/signup",
            data: {
                username : username,
                password : password
            }
        });
      //  console.log(signUp)
        if(signUp.success){
            sessionStorage.setItem("userId" , signUp.result.result[0].id);
            sessionStorage.setItem("username" , username);
            console.log("alas0")
            const storageRef = firebase.storage().ref('userImages/'+ username);
            const ref = await storageRef.put(file);
            window.location.href = "/homepage.html"
        } else{
                var message = data.message;
                console.log(message);
                $('#errorValue').html(message);
        }
    }catch(error){
        console.log(error)
    }       
})

if(sessionStorage.getItem("userId") !== null && sessionStorage.getItem("username") !== null)
{
        window.location.href = "/homepage.html";
}