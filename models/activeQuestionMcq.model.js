const mongoose = require('mongoose');

var act_ques_mcq = mongoose.Schema({
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
    option1:{
        type: String
    },
    option2:{
        type: String
    },
    option3:{
        type: String
    },
    option4:{
        type: String
    },
    option5:{
        type: String
    },
    correctans:{
        type: Number
    },
    valid:{
        type : Boolean
    },
    userID:{
        type : String
    },
    userType : {
        type : String
    },
    imageName : {
        type : String
    },
    upload_date : {
        type : Date,
        default : Date.now
    }
});

mongoose.model('ActiveQuesMCQ',act_ques_mcq);