$('#form').submit(function(e){
    e.preventDefault();
    var username = $('#name').val();
    var password = $("#password").val();
    console.log(username);
    console.log(password);
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:5000/userDetails/signup",
        data: {
            username : username,
            password : password
        },
        success: function(data){
            if(data.success){
			    sessionStorage.setItem("userId" , data.result.result[0].id);
				window.location.href = "mainpage.html"
            } else{
					var message = data.message;
					console.log(message);
					$('#errorValue').html(message);
                }
            }
    });
})