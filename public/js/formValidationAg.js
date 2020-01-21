$(function() {
    
    $.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
      }, "Value must not equal arg.");


      $("#studentRegister").validate({
      
      rules: {
        
        name: "required",

        email: {
          required: true,
          email: true
        },

        pass1: {
          required: true,
          minlength: 8
        },

        pass2: {
          equalTo: "#pass1"
        },

        mobile: {
          required: true,
          minlength: 10,
          maxlength: 10,
          number: true
        },

        address: "required",

        gender: { valueNotEquals: "default" },

        proffession: { valueNotEquals: "default" },

        instituteName: "required",

        degree: { valueNotEquals: "default" },

        passingYear: "required",

        department: "required",

        companyName : "required",

        specify: "required"
      },
      /////////////////////////////////////////
      messages: {
        name: "Enter Your Full Name",

        email: "Please provide a valid email",

        pass1: {
          required: "Please enter a Password",
          minlength: "Must have atleast 8 Charecters"
        },

        pass2: {
          equalTo: "Passwords NOT matching!"
        },

        mobile: {
          required: "Enter a Valid 10 Digit Mobile Number",
          minlength: "Enter a Valid 10 Digit Mobile Number",
          maxlength: "Enter a Valid 10 Digit Mobile Number",
          number: "Enter a Valid 10 Digit Mobile Number"
        },

        address: "Provide an Address",

        gender: { valueNotEquals: "Select a Gender" },

        proffession: { valueNotEquals: "Select a Proffession" },

        instituteName: "Enter your Institute Name",

        degree: { valueNotEquals: "Select a Degree" },

        passingYear: "Select a passing year",

        department: "Enter your Department",

        companyName : "Enter your Company Name",

        specify: "Please Specify!"
      },
      
      submitHandler: function(form) {
        form.submit();
      }


    });
  });