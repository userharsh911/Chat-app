import express from "express"
import { protectedRoute } from "../middleware/auth.middleware.js";
import {getMessages, getAllUsersForSidebar, sendMessage, getUsersByName, getUserByIds} from "../controller/message.controller.js"
const message = express.Router()

message.get('/users',protectedRoute,getAllUsersForSidebar)
message.get('/users/:name',protectedRoute,getUsersByName)
message.get('/users/requests/receive',protectedRoute,getUserByIds)
message.get('/:id',protectedRoute,getMessages)
message.post("/send/:id",protectedRoute,sendMessage)
export default message;