const mongoose = require('mongoose');

var deact_adm = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    mobile:{
        type: Number
    }
});

mongoose.model('DeactiveAdmin',deact_adm);