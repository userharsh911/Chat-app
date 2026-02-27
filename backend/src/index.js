import express from 'express'
import mongoose  from "mongoose"
import dotenv from "dotenv"
import authRouter from '../routes/auth.route.js';
import cookieParser from "cookie-parser"
import message from '../routes/message.route.js';
import cors from "cors"
import {app, server} from '../libs/socket.js';
import path from "path"
import userRequest from '../routes/requests.routes.js';
import groupsRouter from '../routes/group.route.js';
    
dotenv.config()

app.use(express.json({limit: '50mb'}))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))

app.use('/api/auth',authRouter)
app.use('/api/messages',message)
app.use('/api/requests',userRequest)
app.use('/api/groups',groupsRouter)

mongoose.connect(process.env.MONGO_DB_API)
.then(()=>{ 
    server.listen(process.env.PORT || 5000,'0.0.0.0',()=>{
        console.log("the server is on port "+process.env.PORT)
    })
})
