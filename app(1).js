const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/userSchema');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const app = express();

const PORT = process.env.PORT || 3000;

// Initialize passport.js Function
require('./config/passport')(passport);   

// Set The View Engine
app.set('view engine','ejs');
let conn_string = 'mongodb+srv://rahul:rahul@cluster0.rb9pz.mongodb.net/discussionforum?retryWrites=true&w=majority';

// Connect to atlas database
mongoose.connect(conn_string, { useNewUrlParser:true, useUnifiedTopology:true})
    .then( () => console.log("Connected to Atlas Database Successfully"))
    .catch( (err) => console.log("Error : ", err));


// Set The Static Path
app.use(express.static('static'));

// File Upload
app.use(fileUpload());
// Body-parser
app.use(express.urlencoded({extended:false}));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Use Connect Flash
app.use(flash());

// Global variables - Store success and error messages 
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Root 
app.get('/',(req,res) => {
    res.render('index');
});

app.post('/',(req,res) => {
    const {name,email,yearOfStudy} = req.body;
    var password = req.body.password;
    User.findOne({ email: email})
        .then(user => {
            if (user) {
                req.flash('error', 'User with this email already exists !!');
                res.redirect('/');
                
            }
            else {   
                const saltRounds = 10;  
                const post_count = 0;
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                         if(err) throw err;
                         else{
                            password = hash;
                            const newRecord = new User({
                                name,
                                yearOfStudy,
                                email,
                                password,
                                post_count
                            });
                            newRecord.save();
                            req.flash("success","Registration Successfull, Login with your Email and Password !!");
                            res.redirect("/login");
                         }
                    });
                });  
            }
        });
  
});

// Login handling
app.post('/login', (req, res, next) => {
    passport.authenticate('userLogin', {
        successRedirect: '/dashboard/all',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: 'Logged in Successfully'
    })(req, res, next);
});

// User Logout
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success','You Logged Out Successfully')
    res.redirect('/login');
});

app.get('/login',(req,res) => {
    res.render('login');
});

app.use('/dashboard',require('./routes/dashboard'));

app.listen(PORT,(req,res) => {
    console.log(`Listening on Port ${PORT}`);
});

