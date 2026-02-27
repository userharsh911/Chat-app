import jwt from "jsonwebtoken"

const createJSON_token = (userid,res)=>{
    const token = jwt.sign({userid},process.env.SECRET_KEY,{expiresIn:"2d"});
    res.cookie('jwt',token,{
        maxAge: 2*24*60*60*100,
        httpOnly:true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !="developement"
    })
    return token;
}

export default createJSON_token;
// 100 * 60 * 60 * 24 *2(days)