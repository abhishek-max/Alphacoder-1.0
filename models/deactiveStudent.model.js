const mongoose = require('mongoose');

var deact_stu = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    mobile:{
        type: Number
    },
    address:{
        type: String
    },
    yearOfAdm:{
        type: Date
    },
    instName:{
        type: String
    },
    stream:{
        type: String
    },
    currAcademic:{
        type: string
    },
    cgpa:{
        type: Double
    }
});

mongoose.model('DeactiveStudent',deact_stu);