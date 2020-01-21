const mongoose = require('mongoose');

var act_ques_alg = mongoose.Schema({
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

mongoose.model('ActiveQuesAlgo',act_ques_alg);