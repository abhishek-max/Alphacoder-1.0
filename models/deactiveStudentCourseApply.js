const mongoose = require('mongoose');

var deact_stu_cou_app = mongoose.Schema({
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

mongoose.model('DeactiveStudentCourseApply',deact_stu_cou_app);