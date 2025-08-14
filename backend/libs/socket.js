import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"
import Group from "../model/group.model.js";
const app = express();
const server = createServer(app)

const io = new Server(server,{
    cors:{
        origin: ["http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST","PUT", "DELETE"]
    }
})

const userMapped = {}

export const receiverSocketId = (userid)=>{
    // console.log("socket id for send ",userMapped[userid])
    return userMapped[userid]
}

io.on('connection', async(socket) => {
  // console.log('a user connected',socket.id);
    const userId = socket.handshake.query.userId
    if(userId) userMapped[userId] = socket.id;
    io.emit("onlineUsers",Object.keys(userMapped))

    const group = await Group.find({
      $or:[
        {adminInfo:userId},
        {people:userId}
      ]
    }).select("_id")

    group.forEach(obj => {
      socket.join(obj._id.toString())
    });

    socket.on("joinRoom",(grpId)=>{
      socket.join(grpId.toString())
    })
  socket.on("disconnect",()=>{
    // console.log("user disconnected ",socket.id);
    delete userMapped[userId]
    io.emit("onlineUsers",Object.keys(userMapped))
  })
});
export {app,io, server};