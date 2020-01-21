const mongoose = require('mongoose');

var act_adm = mongoose.Schema({
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

mongoose.model('ActiveAdmin',act_adm);