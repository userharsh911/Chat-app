import User from "../model/user.model.js"
import Message from "../model/message.model.js"
import cloudinary from "../libs/cloudinary.js";
import {io, receiverSocketId} from '../libs/socket.js'


export const getAllUsersForSidebar = async (req,res)=>{
    try {
        const userid = req.user._id;
        const user = await User.findById(userid)
        if(!user) return res.status(500).json({message:"something went wrong try again"})
        const allUsers = await User.find( {_id: {$in :user.friends, $ne:userid} } ).select("-password")
        if(!allUsers) return res.status(404).json({message:"Users not found in database"})
        
        return res.status(200).json(allUsers)
    } catch (error) {
        // console.log("error from getUsers controller while fetching all users ",error )
        return res.status(500).json({message:"internal server errro"})
    }
}

export const getMessages = async(req,res)=>{
    const {id:recieverId} =  req.params;
    const senderId = req.user._id;
    try {
        const yourMessage = await Message.find({
            $or:[
                { senderId,recieverId },
                {senderId:recieverId,recieverId:senderId}
            ]
        }).populate("senderId")
        if(!yourMessage) return res.status(404).json({message:"messages not found"});

        res.status(200).json({message:yourMessage})

    } catch (error) {
        // console.log("error while fetching all messages ",error)   
        res.status(500).json({message:"internal server error"})
    }
}

export const sendMessage = async(req,res)=>{
    // if(!req.user) return;
    const recieverId = req.params;
    const senderId = req.user._id;
    const {text,image} = req.body;
    try {
        const sendUser = await User.findById(senderId)
        // console.log("user use ruser : ",sendUser)
        if(!sendUser) return res.status(500).json({message:"fatal error"})
        // base64Image
        let imageUrl;
        // console.log("image ",image)
        // console.log("recieve ",recieverId)
        // console.log("send ",senderId)
        if(image){
            imageUrl = await cloudinary.uploader.upload(image)
        }
        const senderMessage = await new Message({
            senderId,
            recieverId:recieverId.id,
            text,
            image:imageUrl?.secure_url
        });
        await senderMessage.save();

        const id = receiverSocketId(recieverId.id)
        if(id){
            io.to(id).emit("updateMessage",{newMessage:senderMessage,sendUser:sendUser})
            io.to(id).emit("updateNotification",{newMessage:senderMessage,sendUser:sendUser})
        }


        return res.status(201).json({message:senderMessage})

        
    } catch (error) {
        // console.log("error while uploading image or send message ",error);
        return res.status(500).json({message:"internal server error"});
    }
}

export const getUsersByName = async(req,res)=>{
    const name = req.params.name;
    const user = req.user._id
    try {
        if(!name) return res.status(400).json({message:"Invalid search parameter"})
        const searchedUsers = await User.find({
             fullname: { $regex: name, $options: "i" },
             _id : {$ne:user}
        }).sort({ createdAt: -1 })
        if(!searchedUsers){
            return res.status(402).json({message:"users not found"})
        }
        // console.log(searchedUsers)
        return res.status(200).json(searchedUsers)

    } catch (error) {
        
    }
}

export const getUserByIds = async(req,res)=>{
    const IDs_1 = req.user.requests.send
    // console.log("ids 1 ",IDs_1)
    const IDs_2 = req.user.requests.receive
    try {
        const IDs = [...IDs_1,...IDs_2];
        // console.log("andar")
        // console.log("hua kuch")
        const users = await User.find({
            _id:{$in:IDs}
        })
        return res.status(200).json(users)
    } catch (error) {
        // console.log("eror ",error)
    }
}