const mongoose = require('mongoose');

var act_mod = mongoose.Schema({
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
    accountVerified:{
        type: Boolean
    },
    emailVerified:{
        type: Boolean
    }
});

mongoose.model('ActiveModerator',act_mod);