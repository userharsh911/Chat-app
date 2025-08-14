import toast from "react-hot-toast";
import axiosApi from "../api/axiosApi";
import { create } from "zustand";

const useGroups = create((set,get)=>({
    selectedGroup:null,
    selectedGroupInfo:null,
    showInfo:false,
    allGroups:[],
    setSelectedGroup:(val)=>set({selectedGroup:val}),
    setShowInfo:(val)=>set({showInfo:val}),
    setAllGroup:(val)=>set({allGroups:[...get().allGroups,val]}),
    getAllGroup:async()=>{
        try {
            const res = await axiosApi.get("/groups/getgroup")
            set({allGroups:res.data})
            return res.data;
        } catch (error) {
            toast.error(`${error.response.data.message}`)
            // console.log("error while getting groups ",error)
        }
    },

    createGroupToDB: async(data)=>{
        try {
            const res = await axiosApi.post("/groups/create",data)
            set({allGroups:[...get().allGroups,res.data]});
            // toast.success("group created succesfully")
            return res.data
        } catch (error) {
            toast.error(`${error.response.data.message}`)
            // console.log("error while creating group ",error.message)
        }
    },

    updateGroupToDB: async(data,id)=>{
        try {
            const res = await axiosApi.post(`/groups/update/${id}`,data)
            const dataval = await get().getAllGroup()
            set({allGroups:dataval});
            set({selectedGroup:res.data});
            return res.data
        } catch (error) {
            toast.error(`${error.response.data.message}`)
            // console.log("error while creating group ",error.message)
        }
    },

    getSelectedGroupInfo:async(id)=>{
        try {
            const res = await axiosApi.get(`/groups/getgroupInfo/${id}`)
            set({selectedGroupInfo:res.data})
            return res.data
        } catch (error) {
            toast.error(`${error.response.data.message}`)
            // console.log("error while getting detailed group ",error.message)
        }

    },

    removeMemberToGroup:async(removeUserId)=>{
        try {
            const res = await axiosApi.post( `/groups/remove-people/${get().selectedGroup._id}`,{removeUserId:removeUserId});
            set({selectedGroup:res.data});
            return res.data;
        } catch (error) {
            toast.error(`${error.response.data.message}`)
            // console.log("error while removing member to group ",error.message);
        }
    },
    addMemberToGroup:async(addUserId)=>{
        try {
            const res = await axiosApi.post( `/groups/add-people/${get().selectedGroup._id}`,{addUserId:addUserId});
            set({selectedGroup:res.data});
            return res.data;
        } catch (error) {
            toast.error(`${error.response.data.message}`)
            // console.log("error while removing member to group ",error.message);
        }
    },

    delGroup:async()=>{
        try {
            const res = await axiosApi.delete(`/groups/delgroup/${get().selectedGroup._id}`)
            await get().getAllGroup();
            set({selectedGroup:null})
            return res.data;
        } catch (error) {
            toast.error(`${error.response.data.message}`)
            // console.log("error while deleting group ",error.message);
        }
    }

}))

export default useGroups;