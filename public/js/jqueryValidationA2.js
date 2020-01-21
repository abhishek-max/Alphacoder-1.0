$(function() {
    $("#moderatorRegister").validate({
    
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
  
      mobile1: {
        required: true,
        minlength: 10,
        maxlength: 10,
        number: true
      },
  
      mobile2: {
        
        minlength: 10,
        maxlength: 10,
        number: true
      },
  
      address: "required",
  
      gender: "required",
  
     
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
  
      mobile1: {
        required: "Enter a Valid 10 Digit Mobile Number",
        minlength: "Enter a Valid 10 Digit Mobile Number",
        maxlength: "Enter a Valid 10 Digit Mobile Number",
        number: "Enter a Valid 10 Digit Mobile Number"
      },
  
      mobile2: {
        
        minlength: "Enter a Valid 10 Digit Mobile Number",
        maxlength: "Enter a Valid 10 Digit Mobile Number",
        number: "Enter a Valid 10 Digit Mobile Number"
      },
  
      address: "Provide an Address",
  
      gender: "Select a Gender",
  
     
    },
    
    submitHandler: function(form) {
      form.submit();
    }
  
  
  });
  });