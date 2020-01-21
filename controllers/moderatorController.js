//dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var ignoreCase = require('ignore-case');

//models
var User = mongoose.model('ActiveUser');
var Mentor = mongoose.model('ActiveMentor');
var Moderator = mongoose.model('ActiveModerator');
var ActiveQuesMCQ = mongoose.model('ActiveQuesMCQ');
var ActiveCourse = mongoose.model('ActiveCourse');
var ActiveMentor = mongoose.model('ActiveMentor');
var ActiveBatch = mongoose.model('ActiveBatch');
var DeactiveCourse = mongoose.model('DeactiveCourse');

// 
function loggedInMod(req,res,next){
        if(req.isAuthenticated() && req.user.typeUser=="mod"){
                return next();
        }
        else{
                req.flash("error","Please logIn and Try Again!")
                res.redirect('/signin');
        }
    }

//registration get
router.get('/register',function(req,res){
        res.render('moderator/register',{
                title : 'Registration'
        });
});

//Deactivecourse get
router.get('/deActiveCourse',loggedInMod,function(req,res){
        DeactiveCourse.find()
        .then((docs)=>{
                res.render('moderator/deactiveCourse',{
                        title : 'Deactivate Courses',
                        isMod : true,
                        list : docs
                });
                
        });
        
});



//Unverified mentors get
router.get('/unVerMentors',loggedInMod,(req,res)=>{
   Mentor.find({accountVerified : false})
   .then((mentor)=>{
           res.render('moderator/unVerMentors',{
                   title: 'UnVerified Mentors',
                   isMod : true,
                   list : mentor,

           });
   });   
});

//active course get
router.get('/activeCourse',loggedInMod,(req,res)=>{
        ActiveCourse.find()
        .then((docs)=>{
                res.render('moderator/activeCourse',{
                        title:'Active Course',
                        list : docs,
                        isMod : true
        
                });
        })
        
})



//adtopics post

router.post('/addtopics',loggedInMod,(req,res)=>{
        var topic = req.body.topic;
        var subtopic = req.body.subtopic;
        var question = req.body.question;
        var options = req.body.options;
        var domain = req.body.domain;
        let image = req.files.img;
        let imageName = Date.now()+'_'+req.files.img.name;

        if(options == 3){
                var option1 = req.body.option1;
                var option2 = req.body.option2;
                var option3 = req.body.option3;
                var correctanswer = req.body.option;
        }

        else if(options == 4){
                var option1 = req.body.option1;
                var option2 = req.body.option2;
                var option3 = req.body.option3;
                var option4 = req.body.option4;
                var correctanswer = req.body.option;
        }

        else if(options == 5){
                var option1 = req.body.option1;
                var option2 = req.body.option2;
                var option3 = req.body.option3;
                var option4 = req.body.option4;
                var option5 = req.body.option5;
                var correctanswer = req.body.option;
        }

        ActiveQuesMCQ.findOne({
                topic : topic
        })
        .then((topicss)=>{
                if(topicss){
                        req.flash('error','This topic is already registered');
                        res.redirect('/mod/addtopics');
                }
                else{
                        var userID = req.user.username;
                        var newQuestion = new ActiveQuesMCQ({
                                domain : domain,
                                topic : topic,
                                subtopic : subtopic,
                                question : question,
                                option1 : option1,
                                option2 : option2,
                                option3 : option3,
                                option4 : option4,
                                option5 : option5,
                                correctans : correctanswer,
                                imageName : imageName,
                                valid : "true",
                                userID : userID,
                                userType : "mod"
                                
                        });
                
                        newQuestion.save((err , doc)=>{
                                   if(err){
                                           console.log(err);
                                   }   
                                   
                                   else{
                                        image.mv('public/img/questionImg/'+imageName+'', function(err) {
                                                if (err){
                                                  console.log(err);
                                                  req.flash("error","File Upload Error");
                                                  res.redirect('/mod/domain');
                                                } 
                                                else{
                                                req.flash('success_msg','Topic & Question created successfully');
                                                res.redirect('/dashboard');
                                                }
                                              });
                                   }
                        })
                
                }
        }) 

        

        


});

//deactivate course post

router.post('/Deactivate',loggedInMod,function(req,res){
        var coursename = req.body.coursename;
        var domains = req.body.domains;
        var courseid = req.body.courseid;
        var updatedby = req.body.updatedby;

        ActiveCourse.findOneAndDelete({coursename : coursename},(err)=>{
                if(!err){
                        req.flash("success_msg","Course Successfully Deleted");
                        res.redirect('/mod/activeCourse');
                }
                else{
                        console.log(err);
                }
        });
        var deactive = new DeactiveCourse({
                coursename : coursename,
                domain : domains,
                courseID : courseid,
                updatedBy : updatedby,
        });

        deactive.save(function(err,doc){
                if(err){
                   console.log(err);     
                }
                else{
                        console.log('The course deleted from ActiveCourse Schema and inserted into Deactive Course schema');
                }
        });
});



//verification get
router.get('/verify-email/:id',function(req,res){
        var id = req.params.id;
        Moderator.findOneAndUpdate({
               _id  : id,
               emailVerified : false 
        },{
                emailVerified : true
        },
        function(err,doc){
                var correctanswer = req.body.option;        if(!err){
                        req.flash('success_msg','Email verified!');
                        res.render('emailVerified');
                }else {
                        throw err;
                        console.log('err' + err);
                        res.redirect('/');
                }
        });
});

//mentor verification post
router.post('/Verified',loggedInMod,(req,res)=>{
        var account = req.body.account; 
        var email = req.body.email;
        Mentor.findOneAndUpdate({email : email,
                
                accountVerified : false}
                ,{accountVerified : account},

        function(err,doc){
                if(!err){
                        res.redirect('/mod/unVerMentors');
                }
                else{
                        console.log(err);
                }

        });
        
});

//register post
router.post('/register',function(req,res){
    //form validation will be done in client side

    var name = req.body.name;
    var email = req.body.email;
    var mobile1 = req.body.mobile1;
    var mobile2 = req.body.mobile2;
    var addr = req.body.addr;
    var gender = req.body.gender;
    var pass = req.body.pass2;

    User.findOne({username:email})
    .then(user =>{
            if(user){
                    req.flash("error","Email already registered");
                    res.redirect('/mod/register');
            }
            else{
                var moderator = new Moderator();
        
                var newUser = new User({
                    username : email,       
                    password : pass,
                    typeUser : "mod"
                });

                User.createUser(newUser,function(err,user){
                        if(err) throw err;
        
                        moderator.name = name;
                        moderator.email = email;
                        moderator.mobile1 = mobile1;
                        moderator.mobile2 = mobile2;
                        moderator.address = addr;
                        moderator.gender = gender;
                        moderator.emailVerified = false;
                        moderator.save(function(err,doc) {
                                if(err) {
                                        throw err;
                                }
                                else {
                                        //TODO confirmation mail
                                        //TODO email verification
                                        var correctanswer = req.body.option;                                  req.flash('success_msg','account created successfully');
                                        res.redirect('/');
                                }

                                var secret = moderator._id; 
                                var transport = nodemailer.createTransport({
                                        service:'gmail',
                                        auth:{
                                                user:'info.netwizardt',
                                                pass:'Thisispassword'
                                        }
                                });
                                                        
                                var mailBody = `<p>Thankyou for creating your Account Mr. `+req.body.name+`.</p>`+`<p>Please verify your account by clicking this link : <a href='http://192.168.0.39:3001/mod/verify-email/`+secret+`'>click here</a></p>`;
                                const mailOptions = {
                                        from:'info.netwizardt@gmail.com',
                                        to:email,
                                        subject:'Email Verification!',
                                        html:mailBody
                                };
                                transport.sendMail(mailOptions,(err,info)=>{
                                        if(err)
                                                console.log(err);
                                        else
                                                console.log(info);
                                });
        
                        });
                    
                });
            }
    })
    .catch(err =>(console.log(err)));
});


//Domain Add
router.get('/addDomain',loggedInMod,function(req,res){
        res.render('questions/addDomain',{
                title : 'Add Domain',
                isMod :true,
        });
});

router.post('/addDomain',loggedInMod,function(req,res){
        var domain = req.body.domain;
        var domain1 = req.body.domain;
        var topic = req.body.topic;
        var subTopic = req.body.subTopic;
        var question =req.body.question;
        var option1=req.body.option1;
        var option2=req.body.option2;
        var option3=req.body.option3;
        var option4=req.body.option4;
        var option5 = req.body.option5;
        var correctans = req.body.correctans;
        let image = req.files.img;
        let imageName = Date.now()+'_'+req.files.img.name;

        
        ActiveQuesMCQ.findOne({domain:domain})
        .then(domain =>{
                if(domain){
                        req.flash("error","Domain already Exists");
                        res.redirect('/mod/addDomain');
                }
                else{
                        var userID = req.user.username;
                        var mcq = new ActiveQuesMCQ({
                        domain : domain1,
                        topic : topic,
                        subtopic : subTopic,
                        question : question,
                        option1 : option1,
                        option2 : option2,
                        option3 : option3,
                        option4 : option4,
                        option5 : option5,
                        correctans : correctans,
                        imageName : imageName,                  
                        valid : "true",
                        userID : userID,
                        userType : "mod"                     
                    });          
                
                    mcq.save(function(err,doc) {
                                if(err) {
                                        throw err;
                                    }
                                else{
                                        image.mv('public/img/questionImg/'+imageName+'', function(err) {
                                                if (err){
                                                  console.log(err);
                                                  req.flash("error","File Upload Error");
                                                  res.redirect('/mod/domain');
                                                } 
                                                else{
                                                req.flash('success_msg','Domain & Question created successfully');
                                                res.redirect('/dashboard');
                                                }
                                              });
                                    }
                                });                                                   

                }
        })
        .catch(err =>(console.log(err)));
});

//Domain Select

router.get('/domain',loggedInMod,function(req,res){
        ActiveQuesMCQ.distinct('domain',function(err,doc){
              console.log(doc);
                res.render('moderator/domain',{
                        title : 'Domains',
                        list:  doc,
                        isMod :true,
                });
        });

});
// Topic Select
router.get('/domain/:domain',loggedInMod,function(req,res){
        var domain = req.params.domain;
        
        ActiveQuesMCQ.find({
                domain : domain
        }).distinct('topic',function(err,doc){
                if(!err){
                        res.render('moderator/topicDisplay',{
                                domain : domain,
                                list : doc,
                                title : 'Topics',
                                isMod :true,
                               
                        })
                }
                else throw err;
        });

        // ActiveQuesMCQ.distinct('topic',function(err,doc){
        //         console.log(doc);
        //         console.log(domain);
        //         res.render('moderator/topicDisplay',{
        //                                 title : 'Topics',
        //                                 list : doc,
        //                                 domain : domain,
        //                         });
        // });
        // ActiveQuesMCQ.distinct('topic',function(err,doc){
        //         res.render('moderator/topicDisplay',{
        //                 title : 'Topics',
        //                 list : doc,
        //                 domain : domain,
        //         });
        // })
});

router.get('/addtopics',loggedInMod,function(req,res){
        ActiveQuesMCQ.find(function(err,doc){
                res.render('questions/addTopics',{
                        title : 'Domains',
                        list:  doc,
                        isMod :true,
                });

        });
        
        
});

router.get('/addtopics/:dd',loggedInMod,function(req,res){
        var dd = req.params.dd;
        res.render('questions/addTopics',{
                title : 'Add Topic',
                domain : dd,
                isMod :true,
        });
});
        
router.get('/addquestion',loggedInMod,function(req,res){
        ActiveQuesMCQ.find(function(err,doc){
                res.render('questions/addQuestion',{
                        title : 'Question',
                        list:doc,
                        isMod :true,
                });
        });
});

router.get('/addquestion/:dd/:tp',loggedInMod,function(req,res){
        var dd = req.params.dd;
        var tp = req.params.tp;
        res.render('questions/addQuestion',{
                title : 'Add Topic',
                domain : dd,
                topic : tp,
                isMod :true,
        });
});

router.post('/addQuestion',loggedInMod,function(req,res){
        var domain = req.body.domain;
        var domain1 = req.body.domain;
        var topic = req.body.topic;
        var subTopic = req.body.subTopic;
        var question =req.body.question;
        var option1=req.body.option1;
        var option2=req.body.option2;
        var option3=req.body.option3;
        var option4=req.body.option4;
        var option5 = req.body.option5;
        var correctans = req.body.correctans;
        let image = req.files.img;
        let imageName = Date.now()+'_'+req.files.img.name;
        var userID = req.user.username;
        var mcq = new ActiveQuesMCQ({
                domain : domain1,
                topic : topic,
                subtopic : subTopic,
                question : question,
                option1 : option1,
                option2 : option2,
                option3 : option3,
                option4 : option4,
                option5 : option5,
                correctans : correctans,
                imageName : imageName,
                valid : "true",
                userID : userID,
                userType : "mod"                       
        });          
                            
        mcq.save(function(err,doc) {
                if(err) {
                        throw err;
                }
                else {
                        image.mv('public/img/questionImg/'+imageName+'', function(err) {
                                if (err){
                                  console.log(err);
                                  req.flash("error","File Upload Error");
                                  res.redirect('/mod/domain');
                                } 
                                else{
                                req.flash('success_msg','Question created successfully');
                                res.redirect('/dashboard');
                                }
                        });
                }
        });    
});


//Course
router.get('/course',loggedInMod,function(req,res){
        res.render('moderator/course',{
                title : 'Course',
                isMod :true,
        });
});


//Adding course data to mongoose
router.post('/course',loggedInMod,function(req,res){
        var courseName = req.body.courseName;
        var domains = req.body.domains;
        var courseID = req.body.courseID;
        var courseID1 = req.body.courseID;

        ActiveCourse.findOne({courseID:courseID})
        .then(courseID =>{
                if(courseID){
                        req.flash("error","courseID already Exists");
                        res.redirect('/mod/course');
                }
                else{
                        var userID = req.user.username;
                        var course = new ActiveCourse({
                        coursename : courseName,
                        domains : domains,
                        courseID : courseID1,
                        updatedBy : userID                   
                    });          
                            
                            course.save(function(err,doc) {
                                    if(err) {
                                            throw err;
                                    }
                                    else {
                                            //TODO confirmation mail
                                            //TODO email verification
                                            req.flash('success_msg','Course created successfully');
                                            res.redirect('/mod/course');
                                        }

                                });
                }
        })
        .catch(err =>(console.log(err)));
});

// Batches of course

router.get('/batchCourse',loggedInMod,function(req,res){
        ActiveBatch.find(function(err,doc){
                res.render('moderator/batchCourse',{
                        title : 'Batch',
                        list:  doc,
                        isMod :true,
                });

        });
        

});

//Add Batch

router.get('/addBatch',loggedInMod,function(req,res){
        ActiveCourse.find(function(err,doc1){
        ActiveMentor.find(function(err,doc2){
                res.render('moderator/addBatch',{
                        title : 'Batch',
                        data1 :  doc1,
                        data2 :  doc2,
                        isMod :true,
                });
        });

        });


});

router.post('/addBatch',loggedInMod,function(req,res){
        var batch_id = req.body.batch_id;
        var batch_id1 = req.body.batch_id;
        var batch_name = req.body.batch_name;
        var course_id = req.body.course_id;
        var start_date=req.body.start_date;
        var end_date=req.body.end_date;
        var mentor_id=req.body.mentor_id;
        var no_assgn=req.body.no_assgn;


        ActiveBatch.findOne({batch_id:batch_id})
        .then(batch_id =>{
                if(batch_id){
                        req.flash("error","Batch ID already Exists");
                        res.redirect('/mod/addBatch');
                }
                else{
                        var batch = new ActiveBatch({
                                batch_id : batch_id1,
                                batch_name : batch_name,
                                course_id : course_id,
                                start_date : start_date,
                                end_date : end_date,
                                mentor_id : mentor_id,
                                no_assgn : no_assgn                             
                        });
                
                        batch.save(function(err,doc) {
                                        if(err) {
                                                throw err;
                                        }
                                        else {
                                                        req.flash('success_msg','Batch created successfully');
                                                        res.redirect('/dashboard');
                                        }
                                });                                                    

                }
        })
        .catch(err =>(console.log(err)));             
        
});


module.exports = router;