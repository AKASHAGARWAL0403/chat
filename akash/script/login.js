$('#form').submit(function(e){
    e.preventDefault();
    var username = $('#name').val();
    var password = $("#password").val();
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:5000/userDetails/login",
        data: {
            username : username,
            password : password
        },
        success: function(data){
            if(data.success){
			   console.log("fuck");
               sessionStorage.setItem("userId" , data.result[0].id);
               sessionStorage.setItem("username" , data.result[0].username)
			   window.location.href = "mainpage.html"
            }
                else{
					var message = data.message;
					console.log(message);
					$('#errorValue').html(message);
                }
            }
    });
})