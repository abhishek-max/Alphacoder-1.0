const mongoose = require('mongoose');

var deact_assign_sub = mongoose.Schema({
    studentId:{
        type: Number
    },
    courseId:{
        type: Number
    },
    assignmentId:{
        type: Number
    },
    mcqid:{
        type: Number
    },
    solnOfMcq:{
        type: String
    },
    solnOfAlgo:{
        type: String
    },
    result:{
        type: Number
    }
});

mongoose.model('DeactiveAssinmentSubmit',deact_assign_sub);