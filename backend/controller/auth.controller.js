import User from "../model/user.model.js"
import createJSON_token from "../libs/utils.js"
import bcrypt from "bcryptjs"
import cloudinary from "../libs/cloudinary.js"
// handle Login 🔑 <<<--------------------------------------->>>
export const postLogin = async (req,res)=>{
    const {email, password} = req.body;
    try {
        // console.log("loggin...")
        if(!email || !password){
            return res.status(401).json({message:" -invalid credentials- "})
        }

        const user = await User.findOne({email})
        if(!user) return res.status(402).json({message:" -invalid credentials-"})
        // console.log("email found. ",user)
        
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword) return res.status(402).json({message:" -invalid creadentials-"})
        // console.log("valid password ")

        createJSON_token(user._id,res)
        // req.user = user
        return res.status(200).json(user)
    } catch (error) {
        // console.log(error.message)
        return res.status(500).json("internal server error")
    }
}

// handle SignUp 🔐 <<<-------------------------------------->>>
export const postSignup = async(req,res)=>{
    const {email, password, fullname} = req.body;
    try {
        // console.log("going to create account")
        if(!email || !password || !fullname){
            return res.status(400).json({message:"all fields are required"})
        }
        if(password.length<6) return res.status(400).json({message:"password must atleast contains 6 digits"})
            
        const existUser = await User.findOne({email})
        if(existUser) return res.status(401).json({message:"user already exists by this email-"})
        
        // encypt password 🔐
        const salt = await bcrypt.genSalt(10)
        // console.log("hashing password")
        const hashedPassword = await bcrypt.hash(password,salt);

        if(hashedPassword){
            // console.log("password hashed")
            // create user 👤--------------------------------------
            const user = new User({
                email,
                password:hashedPassword,
                fullname
            })
            if(user){
                // console.log("account created ")
                await user.save()
                return res.status(201).json(user)
            }
        }else{
            // console.log("error while encrypting password ")
            res.status(500).json({message:"try again"})
        }
    } catch (error) {
        return res.status(500).json({message:"invalid credential "+error.message})
    }
}

// handle Logout 🔐🗝️ <<<------------------------------------>>>
export const postLogout = (req,res)=>{
    // console.log("user going to logout ",req.user)
    res.clearCookie("jwt",{
        maxAge: 2*24*60*60*100,
        httpOnly:true,
        sameSite: 'strict',
        secure: process.env.JWT_SECURE !="developement"
    })
    return res.status(200).json({message:"logout successfully"})
}

// handle update profile <<<---------------------------------->>>
export const updateProfile = async(req,res)=>{
    const {profilePic} = req.body;
    const userId = req.user;
    if(!profilePic) return res.status(404).json({message:"image not found"})
    try {
        const uploadResult = await cloudinary.uploader.upload(profilePic)
        if(!uploadResult) return res.status(400).json({message:"image not upload"})

        const user = await User.findByIdAndUpdate(userId,{
            profilepic: uploadResult.secure_url 
        },{new:true});

        if(user) return res.status(200).json(user)
        
    } catch (error) {
        // console.log("error while uploading image ",error)
        return res.status(500).json({message:"internal server error"})
    }
}

export const checkAuth = (req,res)=>{
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        // console.log("Error in chechAuthController ",error)
        return res.status(500).json({message:"Internal server error"})
    }
}