$(document).ready(function () {
    $("#loginForm").validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
        }
      },
      messages: {
        email: {
          required: "*Please enter your email",
          email: "*Please enter a valid email address"
        },
        password: {
          required: "*Please enter your password",
        }
      },
      submitHandler: function (form) {
        let formData = {
          email: $("#email").val(),
          password: $("#password").val()  
        };
  
        $.ajax({
          type: "POST",
          url: "/login",
          data: JSON.stringify(formData),
          contentType: "application/json",
          success: function (response) {
            if (response.status === 1) {
              $("#loginForm")[0].reset();
              window.open("success.html");
            } else if (response.status === 0) {
              alert ("Email doesnt exist.. \n create an account?")
              window.open("Register.html")
            }
          },
          error: function (error) {
            alert("Error: " + error.responseText);
          }
        });
      }
    });
  });
  