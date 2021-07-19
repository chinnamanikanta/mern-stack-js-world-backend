const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const bookSchema = new mongoose.Schema({
    bookName: {
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    bookImg: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true

    },
    pages: {
        type:Number,
        required:true
    },
    website: {
        type:String,
        required:true
    },
    availableQty:{
        type:Number,
        required:true

    },
    likes:[{type:ObjectId, ref:'User'}],
   
    dislikes:[{type:ObjectId,ref:'User'}],
   

    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:'User'}
    }],
    
    rating:{type:Number,
    required:true},

    owner : {
        type:mongoose.Schema.Types.ObjectID,
        required:true,
        ref:'User'

    }


})

const Books = mongoose.model('Books',bookSchema);
module.exports = Books