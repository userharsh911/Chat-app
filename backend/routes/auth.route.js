import express from "express"
import { checkAuth, postLogin, postLogout, postSignup, updateProfile } from "../controller/auth.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js"
const authRouter = express.Router()

authRouter.post('/login',postLogin)
authRouter.post('/signup',postSignup)
authRouter.post('/logout',postLogout)
authRouter.put('/update-profile',protectedRoute,updateProfile)
authRouter.get('/check',protectedRoute,checkAuth)
export default authRouter