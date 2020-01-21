const mongoose = require('mongoose');

var deact_men_cou_app = mongoose.Schema({
    courseId:{
        type: Number
    },
    courseName:{
        type: String
    },
    duration:{
        type: Number
    },
    noOfAssignment:{
        type: Number
    },
    listOfAssignment:{
        type: String
    }
});

mongoose.model('DeactiveMentorCourseApply',deact_men_cou_app);