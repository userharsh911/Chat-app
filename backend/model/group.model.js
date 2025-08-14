import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
    adminInfo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
    groupName:{
        type:String,
        required:true
    },
    onlyAdminCanMessage:Boolean,
    people:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    profilepic:String,
    profilePublic_id:String

    
},{timestamps:true})

export default mongoose.model("Group",groupSchema)