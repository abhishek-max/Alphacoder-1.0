const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/learnabyte',{useNewUrlParser : true},function(err){

        if(!err)
                console.log('MongoDB connected');
        else
                console.log('Error found : '+err);
});

require('./activeUser.model');
require('./activeModerator.model');
require('./activeStudent.model');
require('./activeMentor.model');
require('./activeQuestionMcq.model');
require('./activeCourse.model');
require('./activeBatch.model');
require('./deactiveCourse.model');
require('./CompletedBatch');
require('./activeAssignment.model');
require('./activeMentorQuestion.model');