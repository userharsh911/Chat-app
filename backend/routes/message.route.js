import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js";
import {getMessages, getAllUsersForSidebar, sendMessage} from "../controller/message.controller.js"
const message = express.Router()

message.get('/users',protectedRoute,getAllUsersForSidebar)
message.get('/:id',protectedRoute,getMessages)
message.post("/send/:id",protectedRoute,sendMessage)
export default message;