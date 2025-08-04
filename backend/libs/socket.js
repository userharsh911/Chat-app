import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"
const app = express();
const server = createServer(app)

const io = new Server(server,{
    cors:{
        origin: [process.env.FRONTEND_URI],
        credentials: true,
        methods: ["GET", "POST","PUT", "DELETE"]
    }
})

const userMapped = {}

export const receiverSocketId = (userid)=>{
    console.log("socket id for send ",userMapped[userid])
    return userMapped[userid]
}

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);
    const userId = socket.handshake.query.userId
    if(userId) userMapped[userId] = socket.id;
    io.emit("onlineUsers",Object.keys(userMapped))

  socket.on("disconnect",()=>{
    console.log("user disconnected ",socket.id);
    delete userMapped[userId]
    io.emit("onlineUsers",Object.keys(userMapped))
  })
});
export {app,io, server};