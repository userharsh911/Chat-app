import  User from '../model/user.model.js'
import {io, receiverSocketId} from "../libs/socket.js"


export const sendRequest = async (req,res)=>{
    const sendToId = req.params.userid
    const sendFromId  = req.user._id;
    // console.log("sender ",sendFromId)
    // console.log("receiver ",sendToId)
    try {
        if(sendToId==sendFromId) return res.status(400).json({message:"you can't request yourself"});
        const sendFromUser = await User.findById(sendFromId)
        if(!sendFromUser) return res.status(402).json({message:"sender not found"})
        if(sendFromUser.friends.includes(sendToId)){
            return res.status(400).json({message:"the person is already yours friend"})
        }
        if(sendFromUser.requests.send.includes(sendToId) || sendFromUser.requests.receive.includes(sendToId)){
            return res.status(400).json({message:"the person is already requested in your wishlist "})
        }
        
        sendFromUser.requests.send.push(sendToId)
        const updatedSendFromUser = await sendFromUser.save();
        if(!updatedSendFromUser) return  res.status(402).json({message:"updated sender not found"})
        
        const sendToUser = await User.findById(sendToId);
        if(!sendToUser) return res.status(402).json({message:"receiver not found"})
        sendToUser.requests.receive.push(sendFromId)
        sendToUser.save();

        const sendToSocketId = receiverSocketId(sendToId)
        io.to(sendToSocketId).emit("someoneSendMessage",{sender:updatedSendFromUser,getter:sendToUser})

        return res.status(200).json({user:updatedSendFromUser,sendTo:sendToUser.fullname})
    } catch (error) {
        console.log("internal error ",error.message)
        res.status(400).json({message:"internal server error"})
    }
    
}

export const acceptRequest = async(req,res)=>{
    const reqSenderId = req.params.userid
    const acceptorId = req.user._id;
    try {
        if(reqSenderId==acceptorId) return res.status(400).json({message:"you can't request yourself"});
        const reqSenderUser = await User.findById(reqSenderId);
        const acceptorUser = await User.findById(acceptorId)
        if(!acceptorUser || !reqSenderUser) return res.status(402).json({message:"User not found"}); 

        if(reqSenderUser.friends.includes(acceptorId)) {
            return res.status(400).json({message:"the user is already in your friends list"})
        }

        if(!reqSenderUser.requests.send.includes(acceptorId) || !acceptorUser.requests.receive.includes(reqSenderId)){
            return res.status(400).json({message:"Looks like he didn't send you friend request"})
        }
        
        acceptorUser.friends.push(reqSenderId);
        acceptorUser.requests.receive.splice(acceptorUser.requests.receive.indexOf(reqSenderId),1)
        acceptorUser.save();

        reqSenderUser.friends.push(acceptorId)
        reqSenderUser.requests.send.splice(reqSenderUser.requests.send.indexOf(acceptorId),1)
        reqSenderUser.save()

        const reqSenderUserSocketId = receiverSocketId(reqSenderId);
        io.to(reqSenderUserSocketId).emit("someoneAcceptRequest",{sender:acceptorUser,getter:reqSenderUser})

        return res.status(200).json({accept:acceptorUser,whichUser:reqSenderUser.fullname})      
        
    } catch (error) {
        
    }
}

export const rejectRequest = async(req,res)=>{
    const reqSenderId = req.params.userid
    const rejectorId = req.user._id;
    try {
        const reqSenderUser = await User.findById(reqSenderId)
        const rejectorUser = await User.findById(rejectorId)
        if(!reqSenderUser || !rejectorUser) return res.status(402).json({message:"user not found"})

        if(!reqSenderUser.requests.send.includes(rejectorId) || !rejectorUser.requests.receive.includes(reqSenderId)){
            return res.status(400).json({message:"User don't have any request to reject"})
        }
        rejectorUser.requests.receive.splice(rejectorUser.requests.receive.indexOf(reqSenderId),1)
        rejectorUser.save()
        reqSenderUser.requests.send.splice(reqSenderUser.requests.send.indexOf(rejectorId),1)
        reqSenderUser.save()

        const reqSenderUserSocketId = receiverSocketId(reqSenderId);
        io.to(reqSenderUserSocketId).emit("someoneRejectRequest",{sender:rejectorUser,getter:reqSenderUser})

        return res.status(200).json({reject:rejectorUser,whichUser:reqSenderUser})

    } catch (error) {
        
    }
}