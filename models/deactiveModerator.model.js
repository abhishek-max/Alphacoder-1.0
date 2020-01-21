const mongoose = require('mongoose');

var deact_mod = mongoose.Schema({
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
    }
});

mongoose.model('DeactiveModerator',deact_mod);