const mongoose = require('mongoose');

var act_stu_cou_app = mongoose.Schema({
    courseapplyid:{
        type: Number
    },
    coursename:{
        type: Number
    },
    stuentid:{
        type: Number
    }
});

mongoose.model('ActiveStudentCourseApply',act_stu_cou_app);