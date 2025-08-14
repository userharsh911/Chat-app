import express from "express"
import { addPeopleToGroup, createGroup, deleteGroup, getGroupInfo, getGroups, removePeopleToGroup, updateGroup } from "../controller/group.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const groupsRouter = express.Router()

groupsRouter.post("/create",protectedRoute,createGroup)
groupsRouter.post("/update/:gpId",protectedRoute,updateGroup)
groupsRouter.get("/getgroup",protectedRoute,getGroups)
groupsRouter.get("/getgroupInfo/:grpId",protectedRoute,getGroupInfo)
groupsRouter.delete("/delgroup/:gpId",protectedRoute,deleteGroup)
groupsRouter.post("/add-people/:gpId",protectedRoute,addPeopleToGroup)
groupsRouter.post("/remove-people/:gpId",protectedRoute,removePeopleToGroup)

export default groupsRouter;