import express from 'express'
import mongoose  from "mongoose"
import dotenv from "dotenv"
import authRouter from '../routes/auth.route.js';
import cookieParser from "cookie-parser"
import message from '../routes/message.route.js';
import cors from "cors"
import {app, server,io} from '../libs/socket.js';
import path from "path"
import userRequest from '../routes/requests.routes.js';


dotenv.config()

const __dirname = path.resolve();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

app.use('/api/auth',authRouter)
app.use('/api/messages',message)
app.use('/api/requests',userRequest)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}

mongoose.connect(process.env.MONGO_DB_API)
.then(()=>{ 
    server.listen(process.env.PORT,()=>{
        // console.log("the server is on port "+process.env.PORT)
    })
})
