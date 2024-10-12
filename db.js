// backend/db.js
import mongoose from 'mongoose'

mongoose.connect("mongodb://localhost:27017/acm")

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        maxLength:50
    },
    email:{
        type:String,
        required:true,
        minLength:7,
        maxLength:50,
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    count:{
        type:Number,
        default:0
    }
})

const ProcessSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    pid:{
        type:Number,
        required:true,
    },
    lastping:{
        type:Date,
        required:true,
        default: Date.now()
    },
    duration:{
        type:Number,
        required:true,

    },
    status:{
        type:['ACTIVE','EXPIRED','UNRESPONSIVE'],
        reqiured:true,
        default : "ACTIVE"
    }

})
export const User=mongoose.model('User',UserSchema);
export const Process=mongoose.model('Process',ProcessSchema);


