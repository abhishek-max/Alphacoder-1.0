const mongoose = require('mongoose');

var deact_ques_mcq = mongoose.Schema({
    domain:{
        type: String
    },
    topic:{
        type: String
    },
    subtopic:{
        type: String
    },
    question:{
        type: String
    },
    option:{
        type: Number
    },
    correctans:{
        type: String
    }
});

mongoose.model('DeactiveQuestionMcq',deact_ques_mcq);