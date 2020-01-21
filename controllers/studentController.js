var express = require('express');

var router = express.Router();
var mongoose = require('mongoose');
const nodemailer = require("nodemailer");
//models
var User = mongoose.model('ActiveUser');
var Student = mongoose.model('ActiveStudent');
var ActiveAssignment = mongoose.model('ActiveAssignment');
var ActiveMentorQues = mongoose.model('ActiveMentorQues');



//////////////////////////////////////////GET REQS////////////////////////////////////////////

//register get
router.get('/register',function(req,res){
        res.render('student/register',{
                title : 'Registration'
        });
});
//register get END


//exam get
router.get('/exam/:id',function(req,res){
        var id = req.params.id;
        var choices = [];
        var question = [];
        var correctans = [];

        var question1 = [];
        var question2 = [];
        var questions = [];

        ActiveAssignment.findOne({_id : id},function(err,doc1){
                var l=doc1.ques.length;
                for(var i=0;i<l;i++){
                        question1.push(doc1.ques[i].ques_id);
                }
                console.log('hello',question1);

                ActiveMentorQues.find(function(err,doc2){
                        console.log(doc2);
                        for(var j=0;j<doc2.length;j++){
                                question2.push(doc2[j]._id);
                        }
                        console.log('hiiiiiiiii',question2);

                        for(var k=0;k<doc2.length;k++){
                                question.push(doc2[k].question);
                        }
                        for(var l=0;l<doc2.length;l++){
                                question.push(doc2[l].question);
                        }
                        for(var k=0;k<doc2.length;k++){
                                question.push(doc2[k].question);
                        }
                });
        });
});


//Verification get
router.get('/verify-email/:id',function(req,res){
        var id = req.params.id;
        Student.findOneAndUpdate({
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
//Verification get END


////////////////////////////////////////////POST REQS/////////////////////////////////////

//register post
router.post('/register',function(req,res){
        //form validation will be done in client side
    
        var name = req.body.name;
        var email = req.body.email;

//test
User.findOne({username:email})
.then(user =>{
        if(user){
                req.flash("error","Email already registered");
                res.redirect('/mod/register');
        }
        else{
                var mobile1 = req.body.mobile1;
                var mobile2 = req.body.mobile2;
                var addr = req.body.address;
                var gender = req.body.gender;
                var pass = req.body.pass2;
                var profession = req.body.profession;
        
                if(profession=="student"){
                        var institute = req.body.instituteName;
                        var degree = req.body.degree;
                        var yearOfPassing = req.body.passingYear;
                }
        
                else if(profession=="service"){
                        var department = req.body.department;
        
                }
        
                else if(profession=="business"){
                        var companyName = req.body.companyName;
        
                }
        
                else if(profession=="others"){
                        var other = req.body.specify;
                }
        
        
        
                console.log('name = ',name);
                console.log('email = ',email);
                console.log('mobile1 = ',mobile1);
                console.log('mobile2 = ',mobile2);
                console.log('password = ',pass);
                console.log('Gender = ',gender);
                console.log('Profession = ',profession);
                if(profession=="student"){
                        console.log("institute name = ",institute);
                        console.log("degree = ",degree);
                        console.log("Year of passing = ",yearOfPassing)
                }
        
                else if(profession=="service"){
                        console.log("Department = ",department);
                }
                
        
                else if(profession=="business"){
                        console.log("Company name = ",companyName);
                }
        
                else if(profession=="others"){
                        console.log("other specification = ",other);
                }
        
        
                var student = new Student();
                
                var newUser = new User({
                username : email,       
                password : pass,
                typeUser : "stu"
                });
        
                User.createUser(newUser,function(err,user){
                        if(err) throw err;
        
                        student.name = name;
                        student.email = email;
                        student.mobile1 = mobile1;
                        student.mobile2 = mobile2;
                        student.address = addr;
                        student.gender = gender;
                        student.profession = profession;
                        student.emailVerified = false;

                        if(profession=="student"){
                                student.institute = institute;
                                student.degree = degree;
                                student.yearOfPassing = yearOfPassing;
                        }
                        
                        else if(profession=="service"){
                                student.department = department;
                        
                        }
                        
                        else if(profession=="business"){
                                student.companyName = companyName;
                        
                        }
                        
                        else if(profession=="others"){
                                student.other = other;
                        }
                        
                        
                        student.save(function(err,doc) {
                                if(err) {
                                        throw err;
                                }
                                else {
                                        req.flash('success_msg', 'You are registered sucessfully! Please Check your Email for Verification..');
                                        res.redirect('/');
                                }//else end
                                
                                //TODO email verification

                

                                var secret = student._id; 
                                var transport = nodemailer.createTransport({
                                service:'gmail',
                                auth:{
                                        user:'info.netwizardt',
                                        pass:'Thisispassword'
                                        }
                                });
                                
                                var mailBody = `<p>Thankyou for creating your Account Mr. `+req.body.name+`.</p>`+`<p>Please verify your account by clicking this link : <a href='http://192.168.0.39:3001/student/verify-email/`+secret+`'>click here</a></p>`;
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
//end here

         //check email exist..
        //  User.findOne({
        //         username : email
        // },function(err,doc){
        //         if(!err){
        //                 try {

        //                         if(doc.email==null){
        //                                 console.log('OK to go.');
        //                         }
        //                         else {
        //                         console.log('Existed email : ',doc.email);
        //                         req.flash('error','please use another email.');
        //                         res.redirect('/student/register');
        //                         }
        //                 }catch(Exception ){
        //                         console.log('OK to go.');
        
        
        //                                 var mobile1 = req.body.mobile1;
        //                                 var mobile2 = req.body.mobile2;
        //                                 var addr = req.body.address;
        //                                 var gender = req.body.gender;
        //                                 var pass = req.body.pass2;
        //                                 var profession = req.body.profession;
                                
        //                                 if(profession=="student"){
        //                                         var institute = req.body.instituteName;
        //                                         var degree = req.body.degree;
        //                                         var yearOfPassing = req.body.passingYear;
        //                                 }
                                
        //                                 else if(profession=="service"){
        //                                         var department = req.body.department;
                                
        //                                 }
                                
        //                                 else if(profession=="business"){
        //                                         var companyName = req.body.companyName;
                                
        //                                 }
                                
        //                                 else if(profession=="others"){
        //                                         var other = req.body.specify;
        //                                 }
                                
                                
                                
        //                                 console.log('name = ',name);
        //                                 console.log('email = ',email);
        //                                 console.log('mobile1 = ',mobile1);
        //                                 console.log('mobile2 = ',mobile2);
        //                                 console.log('password = ',pass);
        //                                 console.log('Gender = ',gender);
        //                                 console.log('Profession = ',profession);
        //                                 if(profession=="student"){
        //                                         console.log("institute name = ",institute);
        //                                         console.log("degree = ",degree);
        //                                         console.log("Year of passing = ",yearOfPassing)
        //                                 }
                                
        //                                 else if(profession=="service"){
        //                                         console.log("Department = ",department);
        //                                 }
                                        
                                
        //                                 else if(profession=="business"){
        //                                         console.log("Company name = ",companyName);
        //                                 }
                                
        //                                 else if(profession=="others"){
        //                                         console.log("other specification = ",other);
        //                                 }
                                
                                
        //                                 var student = new Student();
                                        
        //                                 var newUser = new User({
        //                                 username : email,       
        //                                 password : pass,
        //                                 typeUser : "stu"
        //                                 });
                                
        //                                 User.createUser(newUser,function(err,user){
        //                                         if(err) throw err;
                                
        //                                         student.name = name;
        //                                         student.email = email;
        //                                         student.mobile1 = mobile1;
        //                                         student.mobile2 = mobile2;
        //                                         student.address = addr;
        //                                         student.gender = gender;
        //                                         student.profession = profession;
        //                                         student.emailVerified = false;
        
        //                                         if(profession=="student"){
        //                                                 student.institute = institute;
        //                                                 student.degree = degree;
        //                                                 student.yearOfPassing = yearOfPassing;
        //                                         }
                                                
        //                                         else if(profession=="service"){
        //                                                 student.department = department;
                                                
        //                                         }
                                                
        //                                         else if(profession=="business"){
        //                                                 student.companyName = companyName;
                                                
        //                                         }
                                                
        //                                         else if(profession=="others"){
        //                                                 student.other = other;
        //                                         }
                                                
                                                
        //                                         student.save(function(err,doc) {
        //                                                 if(err) {
        //                                                         throw err;
        //                                                 }
        //                                                 else {
        //                                                         req.flash('success_msg', 'You are registered sucessfully! Please Check your Email for Verification..');
        //                                                         res.redirect('/');
        //                                                 }//else end
                                                        
        //                                                 //TODO email verification
        
                                        
        
        //                                                 var secret = student._id; 
        //                                                 var transport = nodemailer.createTransport({
        //                                                 service:'gmail',
        //                                                 auth:{
        //                                                         user:'info.netwizardt',
        //                                                         pass:'Thisispassword'
        //                                                         }
        //                                                 });
                                                        
        //                                                 var mailBody = `<p>Thankyou for creating your Account Mr. `+req.body.name+`.</p>`+`<p>Please verify your account by clicking this link : <a href='http://192.168.0.39:3001/student/verify-email/`+secret+`'>click here</a></p>`;
        //                                                 const mailOptions = {
        //                                                         from:'info.netwizardt@gmail.com',
        //                                                         to:email,
        //                                                         subject:'Email Verification!',
        //                                                         html:mailBody
        //                                                 };
        //                                                 transport.sendMail(mailOptions,(err,info)=>{
        //                                                         if(err)
        //                                                                 console.log(err);
        //                                                         else
        //                                                                 console.log(info);
        //                                                 });
        
        //                                         });
                                                
        //                                 });
        //                 }

        //         }
        //         else throw err;
        // });

        //ends here
});
//register post END
 

router.post('/test/:id',function(req,res){
        var id = req.params.id;
        ActiveAssignment.findOneAndUpdate({_id : id},{$push: {ques : [{ques_id : 'hgfdjh'}]}},function(err,doc){

        });
});



module.exports = router;