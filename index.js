import express from 'express'
const app=express();
import cors from 'cors';
import userRouter from "./user.js"
import processRouter from "./process.js"

import { config } from 'dotenv';
config();
app.use(cors());
app.use(express.json());

app.use('/user',userRouter);
app.use('/process',processRouter);

app.listen(process.env.PORT,()=>{
    console.log(`App is listening at PORT :${process.env.PORT}`);
})

