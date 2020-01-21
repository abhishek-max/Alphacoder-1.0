require('./models/db');

const express = require('express');
const morgan = require('morgan');
const expHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');


var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');


var app = express();


//middlewares

app.use(morgan('combined'));

app.use(bodyParser.urlencoded({
        extended : true
}));
app.use(bodyParser.json());



app.use(cookieParser('foo'));
//express Session
app.use(session({
        secret : 'secret',
        saveUninitialized : true,
        resave : true
}));
//passport init
app.use(passport.initialize());
app.use(passport.session());


//static folder
app.use(express.static(path.join(__dirname,'public')));



// //use express-validator
// app.use(expressValidator({
//         errorFormatter: function(param, msg, value) {
//             var namespace = param.split('.')
//             , root    = namespace.shift()
//             , formParam = root;
       
//           while(namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//           }
//           return {
//             param : formParam,
//             msg   : msg,
//             value : value
//           };
//         }
//       }));

//use flash
app.use(flash());

//global variables
app.use(function(req,res,next){
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
});

//fileupload
app.use(fileUpload());







var userController = require('./controllers/userController');
// var adminController = require('./controllers/adminController');
 var moderatorController = require('./controllers/moderatorController');
 var mentorController = require('./controllers/mentorController');
 var studentController = require('./controllers/studentController');

app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',expHandlebars({
        extname : 'hbs',
        defaultLayout : 'mainLayout1',
        layoutsDir : __dirname+'/views/layouts/'
}));
app.set('view engine','hbs');




app.use('/',userController);
// app.use('/admin',adminController);
 app.use('/mod',moderatorController);
 app.use('/mentor',mentorController);
 app.use('/student',studentController);



var port = 3001;
app.listen(port,function(){
        console.log('Server is listening to port : '+port);
});