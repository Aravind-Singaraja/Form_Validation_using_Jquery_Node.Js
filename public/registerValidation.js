$(document).ready(function () {
  $("#simpleForm").validate({
    rules: {
      fname: {
        required: true,
        minlength: 3
      },
      lname: {
        required: true,
        minlength: 3
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6,
      }
    },
    messages: {
      fname: {
        required: "*Please enter your First Name",
        minlength: "*First name cannot be less than 3 letters"
      },
      lname: {
        required: "*Please enter your Last Name",
        minlength: "*Last name cannot be less than 3 letters"
      },
      email: {
        required: "*Please enter your email",
        email: "*Please enter a valid email address"
      },
      password: {
        required: "*Please enter your password",
        minlength: "*Password should be minimum of 6 characters"
      }
    },
    submitHandler: function (form) {
      let formData = {
        fname: $("#fname").val(),
        lname: $("#lname").val(),
        email: $("#email").val(),
        password: $("#password").val()  
      };

      $.ajax({
        type: "POST",
        url: "/submit",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function (response) {
          if (response.status === 1) {
            alert("Account Created Successfully");
            window.open("login.html");
            $("#simpleForm")[0].reset();
          } else if (response.status === 2) {
            alert("Email Already exists");
          }
        },
        error: function (error) {
          alert("Error: " + error.responseText);
        }
      });
    }
  });
});
