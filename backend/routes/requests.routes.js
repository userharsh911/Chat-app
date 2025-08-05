import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { acceptRequest, rejectRequest, sendRequest } from "../controller/userRequest.controller.js"

const userRequest = express.Router()
userRequest.post('/send/:userid',protectedRoute,sendRequest)
userRequest.put('/accept/:userid',protectedRoute,acceptRequest)
userRequest.put('/reject/:userid',protectedRoute,rejectRequest)


export default userRequest