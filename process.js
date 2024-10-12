import express from 'express'
const router=express.Router();
import mongoose from 'mongoose';
import {User,Process} from "./db.js"
router.post("/addProcess/:id", async (req,res)=>{
    const userId=req.params.id;
    const result=await User.findByIdAndUpdate(userId,{ $inc: { count: 1 } })
    if(!result){
        res.json({
            message:"user not valid"
        })
    }
    const processCreated=await Process.create({
        userID :req.params.id,
        pid :req.body.pid,
        duration : req.body.duration,
    })
    if(processCreated){
        res.json({
            success : true
        })
    }
    else{
        res.json({
            success : false
        })
    }
 
})

router.post("/pingProcess/:id",async(req,res)=>{
    const pid=req.params.id;
    const ping=await Process.findByIdAndUpdate(pid,{
        lastping: new Date(),
        status : ["ACTIVE"]
    })
    if(!ping){
        res.json({
            success:false
        })
    }
    else{
        res.json({
            success:true
        })
    }
})
router.get("/status/:id",async (req,res)=>{
    const pid=req.params.id;
    const proc=await Process.findById(pid);
    let lastPing=proc.lastping;
    const userId=proc.userId;
    const duration=proc.duration
    const currentTime=new Date();
    const seconds = (currentTime-lastPing)/1000
    if(seconds >duration + (duration/100)){
        const setInactive=await Process.findByIdAndUpdate(pid,{
            status:["UNRESPONSIVE"]
        })
        res.json({
            details : userId,
            pid:proc.pid
        })
    }
    else{
        res.json({
            details : "Heartbeat ok"
        })
    }
})

router.get("/all/:uid",async (req,res)=>{
    const uid=req.params.uid;
    const processes=await Process.find({
        userID:uid
    });
    if(processes){
        const unresponsive=processes.filter((process)=>{
            const now=new Date();
            const diff=process.duration + (process.duration/100);
            if((now-process.lastping)/1000>diff){
                return true;
            }
            else{
                return false;
            }

        })
        if(unresponsive){
            console.log(unresponsive)
            res.json({
                Processes:unresponsive,
                email: 'nkvnitk@gmail.com'
            })
        }
        
    }
    else{
        res.json({
            Message : "Unavailable"
        })
    }
})
export default router;

