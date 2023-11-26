const mongoose = require('mongoose');

const postModel = new mongoose.Schema({
    posted_by_id:{
        required:true,
        type:String
    },
    posted_by_name:{
        required:true,
        type:String
    },
    post_title:{
        required:true,
        type:String
    },
    post_body:{
        required:true,
        type:String
    },
    image:{
        data:Buffer,
        contentType:String
    },
    date:{
        required:true,
        type:Date
    },
    comments:[{
        "commented_by":String,
        "comment":String
    }]


});

const Post = mongoose.model('posts',postModel);
module.exports = Post;