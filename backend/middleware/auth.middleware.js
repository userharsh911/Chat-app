import jwt from "jsonwebtoken"
import User from "../model/user.model.js"
export const protectedRoute = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt
        if(!token) return res.status(400).send({message:"Unauthorized - No valid Token "})
        const tokenVerify = jwt.verify(token,process.env.SECRET_KEY)
        if(!tokenVerify) return res.status(400).json({message:"Unauthorized - invalid Token"})
        
        const user = await User.findById(tokenVerify.userid);
        if(!user) return res.status(400).json({message:"Unauthorized - invalid Token"})
        req.user = user;
        next()
    }catch (error) {
        return res.status(500).json({"message":"internal server error"})
    }

}