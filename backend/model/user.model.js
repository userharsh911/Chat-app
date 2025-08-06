import mongoose  from "mongoose";

const userSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    requests:{
        receive:[{
            type:mongoose.Schema.Types.ObjectId
        }],
        send:[{
            type:mongoose.Schema.Types.ObjectId
        }]
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
    }],
    profilepic:{
        type:String
    },
    profilePublicId:String,
    
},{timestamps:true})

export default mongoose.model("User",userSchema);