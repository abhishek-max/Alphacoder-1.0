const mongoose = require('mongoose');

var deact_ques_alg = mongoose.Schema({
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
    }
});

mongoose.model('DeactiveQuestionAlgo',deact_ques_alg);