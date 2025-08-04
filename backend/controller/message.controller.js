import User from "../model/user.model.js"
import Message from "../model/message.model.js"
import cloudinary from "../libs/cloudinary.js";
import {io, receiverSocketId} from '../libs/socket.js'
export const getAllUsersForSidebar = async (req,res)=>{
    try {
        const userid = req.user._id;
        const allUsers = await User.find( {_id: {$ne:userid} } ).select("-password")
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
        })
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
            io.to(id).emit("updateMessage",senderMessage)
        }


        return res.status(201).json({message:senderMessage})

        
    } catch (error) {
        // console.log("error while uploading image or send message ",error);
        return res.status(500).json({message:"internal server error"});
    }
}
