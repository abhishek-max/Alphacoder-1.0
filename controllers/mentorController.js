var express = require('express');

var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
//models
var User = mongoose.model('ActiveUser');
var Mentor = mongoose.model('ActiveMentor');
var ActiveBatch = mongoose.model('ActiveBatch');
var CompletedBatch = mongoose.model('CompletedBatch');


//log in function
function loggedInMen(req,res,next){
        if(req.isAuthenticated() && req.user.typeUser=="men"){
                return next();
        }
        else{
                req.flash("error","Please logIn and Try Again!")
                res.redirect('/signin');
        }
    }

//register get
router.get('/register',function(req,res){
        res.render('mentor/register',{
                title : 'Registration'
        });
});

//active batch list get
router.get('/activeBatch',loggedInMen,function(req,res){
        var name = req.user.username;
        ActiveBatch.find({mentor_id : name,mentor_approve:true})
        .then((active)=>{
                res.render('mentor/activeBatch',{
                        title: 'Batch list',
                        list : active,
                        
                        ismentor : true,
                
                });
        });
        
        
});

//deactive batch list get
router.get('/viewDeactiveBatch',loggedInMen,function(req,res){
        var name = req.user.username;
        CompletedBatch.find({mentor_id : name})
        .then((active)=>{
                res.render('mentor/viewDeactiveBatch',{
                        title: 'Deactive Batch list',
                        list : active,
                        //name : name,
                        ismentor : true,
                
                });
        });
        
        
});

//deactivate batch post
router.post('/Deactivate',loggedInMen,function(req,res){
        var id = req.body.id;
        var batchid = req.body.batchid;
       // var assgn = req.body.assgn;
       ActiveBatch.findOne({_id : id},(err,docs)=>{
        var deactive = new CompletedBatch({
                batch_id : docs.batch_id,
                batch_name : docs.batch_name,
                course_id : docs.course_id,
                course_name : docs.coursename,
                start_date : docs.start_date,
                end_date : docs.end_date,
                mentor_id : docs.mentor_id,
                no_assgn : docs.no_assgn,
                //assgn : req.body.assgn,
                });
        
                deactive.save(function(err,doc){
                        if(err){
                        console.log(err);     
                        }
                        else{
                                console.log('The course deleted from ActiveCourse Schema and inserted into Deactive Course schema');
                        }
                });
       })
       
        

        ActiveBatch.findOneAndDelete({batch_id : batchid},(err)=>{
                if(!err){
                        req.flash("success_msg","Batch Successfully Deleted");
                        res.redirect('/dashboard');
                }
                else{
                        console.log(err);
                }
        });
        
});

//view active batch get
router.get('/viewBatch',loggedInMen,function(req,res){
        var name = req.user.username;
       
        ActiveBatch.find({mentor_id : name,mentor_approve:true})
        .then((active)=>{
                res.render('mentor/viewBatch',{
                        title: ' View Batch list',
                        list : active,
                        
                        ismentor : true
                
                });
        })
         
})

//Verification get
router.get('/verify-email/:id',function(req,res){
        var id = req.params.id;
        Mentor.findOneAndUpdate({ 
               _id  : id,
               emailVerified : false 
        },{
                emailVerified : true
        },
        function(err,doc){
                if(!err){
                        req.flash('success_msg','Email verified!');
                        res.render('emailVerified');
                }else {
                        throw err;
                        console.log('err' + err);
                        res.redirect('/');
                }
        });
});

router.get('/assgn',function(req,res){
        res.render('mentor/assignment')
});



router.get('/assignment/:batchId',function(req,res){
        var batchId = req.params.batchId;
        console.log("Batchid - ",batchId);
        
        ActiveBatch.findOne({
                batch_id : batchId

        },function(err,doc){
                console.log(doc);
                console.log("start date : ",doc.start_date);
                
                var n = doc.no_assgn;
                var temp_array = [];
                for (var i =1 ;i <= n ;i++) {
                        temp_array.push(i);
                        
                }
                console.log(temp_array);
                
                res.render('mentor/noOfAssignments',{
                        batchId : batchId,
                        list : doc,
                        list1 : temp_array,
                        title : 'Assignment',
                        isMentor :true,
                })                       
        });
                
        
});



//register post

router.post('/register',function(req,res){
        var name = req.body.name;
        var email = req.body.email;
        var mobile1 = req.body.mobile1;
        var mobile2 = req.body.mobile2;
        var addr = req.body.address;
        var gender = req.body.gender;
        var pass = req.body.pass2;
        
         
        var mentor = new Mentor();
        var secret = mentor._id;
        var newUser = new User({
            username : email,       
            password : pass,
            typeUser : "men"
        });

        //test
        User.findOne({username:email})
        .then(user =>{
                if(user){
                        req.flash("error","Email already registered");
                        res.redirect('/mod/register');
                }
                else{                                User.createUser(newUser,function(err,user){
                        if(err) throw err;
        
                        mentor.name = name;
                        mentor.email = email;
                        mentor.mobile1 = mobile1;
                        mentor.mobile2 = mobile2;
                        mentor.address = addr;
                        mentor.gender = gender;
                        mentor.emailVerified = false;
                        mentor.accountVerified = false;
                        
                        mentor.save(function(err,doc) {
                                if(err) {
                                        throw err;
                                }
                                else {
                                        //TODO confirmation mail
                                         
                                        var transport = nodemailer.createTransport({
                                        service:'gmail',
                                        auth:{
                                                user:'info.netwizardt',
                                                pass:'Thisispassword'
                                                }
                                        });
                                        
                                        var mailBody = `<p>Thankyou for creating your Account Mr. `+req.body.name+`.</p>`+`<p>Please verify your account by clicking this link : <a href='http://192.168.0.39:3001/mentor/verify-email/`+secret+`'>click here</a></p>`;
                                        const mailOptions = {
                                                from:'info.netwizardt@gmail.com',
                                                to:email,
                                                subject:'Mentor Email Verification!',
                                                html:mailBody
                                        };
                                        transport.sendMail(mailOptions,(err,info)=>{
                                                if(err)
                                                        console.log(err);
                                                else
                                                        console.log(info);
                                        });
                                        //TODO email verification
                                        req.flash('success_msg','account created successfully');
                                        req.flash('warning_msg','Please Verify your Email!');
                                        res.redirect('/');
                                }
                        });
        
                }); 
                }
        })
        .catch(err =>(console.log(err)));
        //test

        //check email exist..
        // User.findOne({username : email},function(err,doc){
        //         if(!err){
        //                 try {

        //                         if(doc.email==null){
        //                                 console.log('OK to go.');
        //                         }
        //                         else {
        //                         console.log('Existed email : ',doc.email);
        //                         req.flash('error','please use another email.');
        //                         res.redirect('/mentor/register');
        //                         }
        //                 } //try end
        //                 catch(Exception){
        //                         User.createUser(newUser,function(err,user){
        //                                 if(err) throw err;
                        
        //                                 mentor.name = name;
        //                                 mentor.email = email;
        //                                 mentor.mobile1 = mobile1;
        //                                 mentor.mobile2 = mobile2;
        //                                 mentor.address = addr;
        //                                 mentor.gender = gender;
        //                                 mentor.emailVerified = false;
        //                                 mentor.accountVerified = false;
                                        
        //                                 mentor.save(function(err,doc) {
        //                                         if(err) {
        //                                                 throw err;
        //                                         }
        //                                         else {
        //                                                 //TODO confirmation mail
                                                         
        //                                                 var transport = nodemailer.createTransport({
        //                                                 service:'gmail',
        //                                                 auth:{
        //                                                         user:'info.netwizardt',
        //                                                         pass:'Thisispassword'
        //                                                         }
        //                                                 });
                                                        
        //                                                 var mailBody = `<p>Thankyou for creating your Account Mr. `+req.body.name+`.</p>`+`<p>Please verify your account by clicking this link : <a href='http://192.168.0.39:3001/mentor/verify-email/`+secret+`'>click here</a></p>`;
        //                                                 const mailOptions = {
        //                                                         from:'info.netwizardt@gmail.com',
        //                                                         to:email,
        //                                                         subject:'Mentor Email Verification!',
        //                                                         html:mailBody
        //                                                 };
        //                                                 transport.sendMail(mailOptions,(err,info)=>{
        //                                                         if(err)
        //                                                                 console.log(err);
        //                                                         else
        //                                                                 console.log(info);
        //                                                 });
        //                                                 //TODO email verification
        //                                                 req.flash('success_msg','account created successfully');
        //                                                 req.flash('warning_msg','Please Verify your Email!');
        //                                                 res.redirect('/');
        //                                         }
        //                                 });
                        
        //                         });                      
        //                 }//catch end
        //         }
        //         else throw err;
        // });
});

//New Batch Get Request

router.get('/newBatchAllotted',loggedInMen,function(req,res){
        //var name = req.params.name;
        var userID = req.user.username;
        ActiveBatch.find({mentor_id : userID , mentor_approve : false},function(err,doc){
                //ActiveBatch.find({mentor_approve : "false"},function(err,doc){
                res.render('mentor/newBatchAllotted',{
                        title : 'New Batch',
                        list :  doc,
                        ismentor : true,
                        
                        
                });
        
        });


});


// post request for new Batch
router.post('/newBatchAllotted',function(req,res){
        var batch_id = req.body.value;
        
        ActiveBatch.findOneAndUpdate({batch_id:batch_id},{$set:{mentor_approve : "true"}},function(err,doc){
                if(err){
                        console/log("Something wrong when updating");
                }
                else{
                        res.redirect('/mentor/newBatchAllotted');
                }
        });
});


module.exports = router;