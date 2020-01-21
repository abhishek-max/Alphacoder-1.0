const mongoose = require('mongoose');

var act_men_cou_app = mongoose.Schema({
    courseId:{
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

mongoose.model('ActiveMentorCourseApply',act_men_cou_app);