const mongoose = require('mongoose');

var deact_assign = mongoose.Schema({
    courseId:{
        type: Number
    },
    courseName:{
        type: String
    },
    domain:{
        type: String
    },
    mcq:{
        type: String
    },
    questionId:{
        type: Number
    },
    algoQues:{
        type: String
    }
});

mongoose.model('DectiveAssignment',deact_assign);