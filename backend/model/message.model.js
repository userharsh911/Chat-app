import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required :true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required :true
    },
    text:{
        type:String
    },
    image:{
        type:String
    }
},{timestamps:true})

export default mongoose.model("Messages",messageSchema);    