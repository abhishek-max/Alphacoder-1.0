var express = require('express');

var router = express.Router();
var mongoose = require('mongoose');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


//models
var Moderator = mongoose.model('ActiveModerator');
var User = mongoose.model('ActiveUser');
var Student = mongoose.model('ActiveStudent');
var Mentor = mongoose.model('ActiveMentor');
var Batch = mongoose.model('ActiveBatch');
var Assignment = mongoose.model('ActiveAssignment');
router.get('/signin',(req,res)=>{
        res.render('signin');
})



function loggedIn(req,res,next){
    if(req.isAuthenticated()){
            return next();
    }
    else{
            res.redirect('/');
    }
}
function loggedOut(req,res,next){
    if(!req.isAuthenticated()){
            return next();
    }
    else{
            res.redirect('/dashboard');
    }
}

// function loggedIn(req,res,next){
//     if(req.isAuthenticated()){
//             return next();
//     }
//     else{
//             res.redirect('/');
//     }
// }
// function loggedOut(req,res,next){
//     if(!req.isAuthenticated()){
//             return next();
//     }
//     else{
//             res.redirect('/dashboard');
//     }
// }

// router.get('/',loggedOut,function(req,res){
//     res.render('login');
// });
// router.get('/logout',loggedIn,function(req,res){
//     req.logout();
//     req.flash('success_msg','You are logged out');
//     user = null;
//     res.redirect('/');
// });


// router.get('/test',function(req,res){
//     res.render('test');
// })



//localstrategy passport

passport.use(new localStrategy(function(username,password,done){
       
    User.getUserByUsername(username,function(err,user){
            if(err) throw err;
            if(!user){
                    return done(null,false,{message : 'Unknown User'});

            }

            User.comparedPassword(password,user.password,function(err,isMatch){
                    if(err) throw err;
                    if(isMatch){
                            
                            
                            return done(null,user);
                            
                    }
                    else{
                            return done(null,false,{message : 'Invalid passpword'})
                    }
            });Moderator
    });
})
);
    
passport.serializeUser(function(user, done) {

            console.log('userId: '+user._id);
            done(null, user._id);
    });
    
passport.deserializeUser(function(id, done) {
            User.getUserById(id, function(err, user) {
            done(err, user);
            });
    });


router.post('/',passport.authenticate('local',
    { successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash : true }),
    function(req,res){
    res.redirect('/dashboard');
});


//localstrategy ends


//Search page get
router.get('/search',(req,res)=>{
        res.render('testing/search');
});

//search page2 get
router.get('/search_2',(req,res)=>{
        //console.log('sssssssssssssss',req.query.search);
        if(req.query.search){
                const regex = new RegExp(escapeRegex(req.query.search),'gi');
               Batch.find({$or:[{batch_name : regex},{mentor_id : regex}]},(err,doc)=>{
                  //Assignment.find({ques: {ques_id : regex}},(err,doc)=>{
                        if(!err){
                                res.render('testing/search_2',{
                                        title : 'search',
                                        list : doc,
                                });
                        }
                        else{
                                console.log(err);
                        }
                });
        }
        else{
                Batch.find({},(err,doc)=>{
                        if(!err){
                                res.render('testing/search_2',{
                                        title : 'search',
                                        list : doc,
                                });
                        }
                        else{
                                console.log(err);
                        }
                });
        }
}); 


// dashboard 


router.get('/dashboard',loggedIn,function(req,res){
    var userType= "";
    if(req.user.typeUser == "mod") {
            userType = "Moderator";
           // var resume = "";
           // const adminDetails;
            var name = req.user.username;
            // var admin = new Admin();
            Moderator.findOne({email : name},function(err,doc){
                    if(!err){

                            const adminDetails = doc;
                            if(doc.emailVerified){

                                res.render('moderator/dashboard',{

                                        userType : userType,
                                        name : name,
                                        isMod :true,
                                
                                        });
                             }
                             else {
                                res.render('noemail');       
                             }
                            
                            
                        }
                    else {
                            console.log(err);
                    }
            });
            
          
    }
    else 
    if(req.user.typeUser == "stu") {
        userType = "Student";
       
       // const adminDetails;
        var name = req.user.username;
        // var admin = new Admin();
        Student.findOne({
                email : name
        },function(err,doc){
                if(!err){
                        const adminDetails = doc;

                        if(doc.emailVerified){
                                res.render('student/dashboard',{
                                        userType : userType,
                                        name : name,
                                        
                                
                                        });
                        }
                        else {
                                res.render('noemail');       
                        }

                        
                        
                }
                else {
                        console.log(err);
                }
        });
        
      
        }
        else {
                if(req.user.typeUser == "men") {
                        userType = "Mentor";
                       
                       // const adminDetails;
                        var id = req.user._id;
                        var name = req.user.username;
                        // var admin = new Admin();
                        Mentor.findOne({email : name},function(err,doc){
                                if(!err){
                                        const adminDetails = doc;
                                        if(doc.emailVerified){
                                                if(!doc.accountVerified){
                                                        res.render('noaccount');
                                                }
                                                else{
                                                        res.render('mentor/dashboard',{
                                                                userType : userType,
                                                                name : name,
                                                                ismentor :true,
                                                                
                                                        
                                
                                                        });
                                        }
                                        }
                                        else{
                                                res.render('noemail');    
                                        }
                                        

                                        
                                }
                                else {
                                        console.log(err);
                                }
                        });
                        
                      
                        }
        }
});

router.get('/logout',loggedIn,function(req,res){

        req.logout();
        
        req.flash('success_msg','You are logged out');
        
        user = null;
        
        res.redirect('/');
        
        });

router.get('/',function(req,res){
    res.render('index',{
        title: 'home'
    });

});

//signup
router.get('/signup',function(req,res){
    res.render('register',{
        title : 'Register'
    });
});


//test
router.get('/test/:batch_id/:batch_name',function(req,res){
        var batch_id = req.params.batch_id;
        var batch_name = req.params.batch_name;
        var arr = "WOWOWO";
        var date = Date.now();
        var myBatch = new Batch({
                batch_id : batch_id,
                batch_name : batch_name,
                assgn : {
                        assgn_id : arr
                }
        });

        myBatch.save(function(err,req,res){
                if (err) throw err;

                else {
                        console.log("LOOOOOOOOOOOOOOOOOOOOOL");
                }
        })

        res.render('test',{
        title: 'debug'
    });
});

router.post('/test',function(req,res){
    var name = req.body.name;
    console.log('name = ',name);
});

function escapeRegex(text){
        return text.replace(/[-[\]{}()*+?.,\\^$!#\s]/g,"\\$&");
}

module.exports = router;
