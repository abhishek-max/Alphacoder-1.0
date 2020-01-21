const mongoose = require('mongoose');

var act_bat = mongoose.Schema({
    batch_id : {
        type : String
    },
    batch_name : {
        type : String
    },
    course_id : {
        type : String
    },
    course_name : {
        type : String
    },
    start_date : {
        type : Date
    },
    end_date : {
        type : Date
    },
    mentor_id : {
        type : String
    },
    mod_id : {
        type : String
    },
    batch_status : {
        type : Boolean,
        default : true
    },
    mentor_approve : {
        type : Boolean,
        default : false
    },
    no_assgn : {
        type : Number
    },
    assgn : [{
        assgn_id : String,
        assgn_date : {type : Date, default : Date.now}
    }]
});

mongoose.model('ActiveBatch',act_bat);