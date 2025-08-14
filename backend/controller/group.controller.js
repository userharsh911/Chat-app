import Group from "../model/group.model.js";
import cloudinary from "../libs/cloudinary.js"
import {io,receiverSocketId} from "../libs/socket.js"

export const createGroup = async (req,res)=>{
    const {groupName,onlyAdminCanMessage,people,profilepic} = req.body;
    const user = req.user;
    try {
        if(!groupName) return res.status(400).json({message:"-Invalid credentials"});
        let image;
        if(profilepic){
            image = await cloudinary.uploader.upload(profilepic);
        }
        const group = await new Group({
            adminInfo:[user._id],
            groupName,
            onlyAdminCanMessage,
            people,
            profilepic:image?.secure_url || "",
            profilePublic_id : image?.public_id || ""
        });
        if(!group) return res.status(422).json({message:"Unprocessable Entity -Validation error"});
        await group.save();
        people?.map((userid)=>{
            const socketId = receiverSocketId(userid);
            io.to(socketId).emit("someoneAddYouToGroup",{grpId:group._id});
        })

        return res.status(201).json(group);

    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

export const addPeopleToGroup = async(req,res)=>{
    const {addUserId} = req.body;
    const {gpId} = req.params;
    const user = req.user;
    try {
        if(!addUserId || !gpId){
            return res.status(400).json({message:"-Invalid input - Try again"});
        }
        // if(!user.friends.includes(addUserId)){
        //     return res.status(403).json({message:"Access Denied - User not in your Friend List"})
        // }
        const grp = await Group.findById(gpId);
        if(!grp) return res.status(402).json({message:"Group not found"});

        if(!grp.adminInfo.includes(user._id)){
            return res.status(401).json({message:"Unauthorized -Permissions not allowed"});
        }
        if(grp.people.includes(addUserId)) return res.status(403).json({message:"Access Denied"});

        grp.people.push(...addUserId)
        const updatedGroup = await grp.save();

        addUserId?.map((userid)=>{
            const socketId = receiverSocketId(userid)
            io.to(socketId).emit("someoneAddYouToGroup",{group:updatedGroup});
        })

        return res.status(200).json(updatedGroup);
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const removePeopleToGroup = async(req,res)=>{
    const {removeUserId} = req.body;
    const {gpId} = req.params;
    const user = req.user;
    try {
        if(!removeUserId || !gpId){
            return res.status(400).json({message:"-Invalid input - Try again"})
        }
        const grp = await Group.findById(gpId);
        if(!grp) return res.status(402).json({message:"Group not found"})

        if(!grp.adminInfo.includes(user._id)){
            return res.status(401).json({message:"Unauthorized -Permissions not allowed"})
        }
        if(!grp.people.includes(removeUserId)){
            return res.status(402).json({message:"Not Found"})
        }
        grp.people.splice(grp.people.indexOf(removeUserId),1)
        const updatedGroup = await grp.save();

        const socketId = receiverSocketId(removeUserId)
        io.to(socketId).emit("removeToGroup",{group:updatedGroup})

        return res.status(200).json(updatedGroup);
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const updateGroup = async(req,res)=>{
    const {groupName, onlyAdminCanMessage,profilepic} = req.body;
    const {gpId} = req.params;
    const user = req.user;
    try {
        let image;
        if(!gpId) return res.status(422).json({message:"Invalid input"});
        const checkGroup = await Group.findById(gpId);
        if(profilepic){
            if(checkGroup.profilePublic_id){
                await cloudinary.uploader.destroy(checkGroup.profilePublic_id)
            }
            image = await cloudinary.uploader.upload(profilepic)
        }
        const group = await Group.findOneAndUpdate({
            $and:[
                {_id:gpId},
                {adminInfo:user._id}
            ]
        },{
            groupName,
            onlyAdminCanMessage,
            profilepic:image?.secure_url,
            profilePublic_id:image?.public_id
        },{new:true})

        if(!group) return res.status(402).json({message:"Not found"});
        group.people?.map(userid=>{
            const socketId = receiverSocketId(userid)
            io.to(socketId).emit("updatedGroup",{group})
        })

        return res.status(200).json(group);

    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getGroups = async(req,res)=>{
    const user = req.user;
    try {
        const groups = await Group.find({
            $or:[
                {people:user._id},
                {adminInfo:user._id}
            ]
        })
        if(!groups) return res.status(402).json({message:"Not found"});
        return res.status(200).json(groups);
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}
export const getGroupInfo = async(req,res)=>{
    const grpId = req.params.grpId;
    try {
        const group = await Group.findById(grpId).populate("adminInfo").populate("people")
        if(!group) return res.status(402).json({message:"Not found"});
        return res.status(200).json(group);
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const deleteGroup = async(req,res)=>{
    const user = req.user;
    const {gpId} = req.params;
    try {
        const deletedGroup = await Group.findOneAndDelete({
            $and:[
                {_id:gpId},
                {adminInfo:user._id}
            ]
        });
        if(!deletedGroup){
            return res.status(402).json({message:"Not found"});
        }

        deletedGroup.people?.map(userid=>{
            const socketId = receiverSocketId(userid)
            io.to(socketId).emit("deleteGroup",{group:deletedGroup})
        })

        return res.status(200).json(deletedGroup);

    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}



