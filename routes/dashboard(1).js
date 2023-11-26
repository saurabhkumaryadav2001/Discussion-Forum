const express = require('express');
const router = express.Router();
const { isAuth } = require('../config/auth');
const Post = require('../models/postModel');
const User = require('../models/userSchema');
const Event = require('../models/eventModel');

router.get('/all',isAuth, (req,res) => {
    Post.find({}, (err, result) => {
        if (err){
            console.log(err);
        }
        else{
            result.reverse();
            res.render('dashboard', {
               'posts':result,
               'user':req.user
            });
        }
    });
    
});

router.get('/post',async (req,res) => {
    let data = await Post.findOne({_id:req.query.id});
    res.render('post',{
        'post':data,
        'user':req.user
    });
});

router.post('/addPost',async (req,res) => {
     const {post_title,post_body} = req.body;
     const date = new Date();
     const newPost = new Post({
        posted_by_id:req.user._id,
        posted_by_name:req.user.name,
        post_title:post_title,
        post_body:post_body,
        image:{
            data:req.files.post_image.data,
            contentType:req.files.post_image.mimetype
        },
        date:date
    });
    try{
       newPost.save();
       let data = await User.findOneAndUpdate({_id:req.user._id},{
           $inc:{
               post_count:1
           }
       });
    }
    catch(err){
      console.log(err);
    }
     res.redirect('/dashboard/all');
});

router.post('/comment',async (req,res) => {
    const {comment} = req.body;
    const id = req.query.id;
    let update = await Post.findOneAndUpdate({_id:id},{
         $push:{
             comments:{
                commented_by:req.user.name,
                comment:comment
             }
         }
    });
    res.redirect(`/dashboard/post?id=${id}`);
   
});

router.get('/alumni',(req,res) => {
    res.render('alumni',{
        'user':req.user
    });
});

router.get('/events',async (req,res) => {
    let events = await Event.find();
    res.render('events',{
        'user':req.user,
        'events':events
    });
});

router.get('/announcements',(req,res) => {
    res.render('announcements',{
        'user':req.user
    });
});

router.post('/addEvent',(req,res) => {
    const {event_title,event_body} = req.body;
    const date = new Date();
    const newEvent = new Event({
       posted_by_name:req.user.name,
       event_title:event_title,
       event_body:event_body,
       image:{
           data:req.files.event_image.data,
           contentType:req.files.event_image.mimetype
       },
       date:date
   });
   try{
      newEvent.save();
   }
   catch(err){
     console.log(err);
   }
    res.redirect('/dashboard/events');
    
});

module.exports = router;