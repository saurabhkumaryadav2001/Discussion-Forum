const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    yearOfStudy:{
        required:true,
        type:Number
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    post_count:{
        required:true,
        type:Number
    }

});

const User = mongoose.model('users',userSchema);
module.exports = User;