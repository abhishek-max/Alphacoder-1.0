const mongoose = require('mongoose');

var act_stu = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    mobile1:{
        type: Number
    },
    mobile2:{
        type: Number
    },
    address:{
        type: String
    },
    gender:{
        type: String
    },
    profession:{
        type: String
    },
    institute:{
        type: String
    },
    degree:{
        type: String
    },
    yearOfPassing:{
        type: String
    },
    department:{
        type: String
    },
    companyName:{
        type: String
    },    
    other:{
        type: String
    },
    emailVerified:{
        type: Boolean
    }
});

mongoose.model('ActiveStudent',act_stu);