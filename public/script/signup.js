$('#form').submit(function(e){
    e.preventDefault();
    var username = $('#name').val();
    var password = $("#password").val();
    console.log(username);
    console.log(password);
    console.log(links.link+"/userDetails/signup");
    $.ajax({
        type: 'POST',
        url: links.link+"/userDetails/signup",
        data: {
            username : username,
            password : password
        },
        success: function(data){
            if(data.success){
                sessionStorage.setItem("userId" , data.result.result[0].id);
                sessionStorage.setItem("username" , username);
				window.location.href = "mainpage.html"
            } else{
					var message = data.message;
					console.log(message);
					$('#errorValue').html(message);
                }
            }
    });
})


if(sessionStorage.getItem("userId") !== null && sessionStorage.getItem("username") !== null)
{
        window.location.href = "/mainpage.html";
}