const mongoose = require('mongoose');

var act_cou = mongoose.Schema({
    coursename:{
        type: String
    },
    domains:{
        type: String
    },
    courseID:{
        type: String
    },
    updatedBy:{
        type: String
    }
});

mongoose.model('ActiveCourse',act_cou);