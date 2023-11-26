const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');

// Passport Module
module.exports = (passport) => {     
    passport.use('userLogin', 
        new localStrategy(
            {usernameField: 'email'}, (email,password, done) => {
            User.findOne({email: email})
            .then(user => {
                if(!user){
                    return done(null, false, {message: 'User with this email does not exist'}); 
                }

                // Password Matching
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } 
                    else {
                        return done(null, false, {message:'Wrong Password'});
                    }
                });
            })
            .catch(err => console.log(err));
        })
    )
};

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
});