const mongoose = require('mongoose');

var act_assign = mongoose.Schema({
    batch_id:{
        type: String
    },
    batch_name:{
        type: String
    },
    domain:{
        type: String
    },
    topic:{
        type: String
    },
    no_ques:{
        type: Number
    },
    ques:[{
        ques_id: String
    }],
    start_date:{
        type: Date
    },
    end_date:{
        type: Date
    },
    mentor_id:{
        type: String
    },
    upload_date : {
        type : Date,
        default : Date.now
    }
});

mongoose.model('ActiveAssignment',act_assign);