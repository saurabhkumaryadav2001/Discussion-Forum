const mongoose = require('mongoose');

const eventModel = new mongoose.Schema({
    posted_by_name:{
        required:true,
        type:String
    },
    event_title:{
        required:true,
        type:String
    },
    event_body:{
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
    }

});

const Event = mongoose.model('events',eventModel);
module.exports = Event;