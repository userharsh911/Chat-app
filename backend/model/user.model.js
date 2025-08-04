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
    profilepic:{
        type:String
    },
    
},{timestamps:true})

export default mongoose.model("User",userSchema);