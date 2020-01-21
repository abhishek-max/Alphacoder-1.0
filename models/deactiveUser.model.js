const mongoose = require('mongoose');

const deact_user = mongoose.Schema({
    email:{
        type: String
    },
    password:{
        type: String
    },
    type:{
        type: String
    }
});

mongoose.model('DeactiveUser',deact_user);