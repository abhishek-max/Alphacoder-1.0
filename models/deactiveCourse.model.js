const mongoose = require('mongoose');

var deact_cou = mongoose.Schema({
    coursename:{
        type: String
    },
    domain:{
        type: String
    },
    courseID:{
        type: String
    },
    updatedBy:{
        type: String
    }
});

mongoose.model('DeactiveCourse',deact_cou);