import express from 'express'
const router=express.Router();
import {User} from "./db.js"
router.post('/signup',async (req,res)=>{
    console.log(req.body);
    const result = await User.create({
        email:req.body.email,
        password:req.body.password,
        name:req.body.name,
    })
    if(result){
        res.json({
            message:"User created successfully"
        })
    }
})

router.post('/login',async (req,res)=>{
    //login logic
})
export default router;


