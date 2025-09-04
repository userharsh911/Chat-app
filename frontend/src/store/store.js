import {create} from "zustand"
import axiosApi from "../api/axiosApi";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import useMessages from "./message.store";
import Group from "./group.store";
const BASE_URL = import.meta.env.MODE=="development" ? "http://localhost:3002" : "/";

const useBearStore = create((set,get)=>({
    userAuth:false,
    loader:true,
    allUser: null,
    onlineUserIds: [],
    searchedUsers:[],
    requestedSentOrReceiveUser:[],
    showUserSideBar: true,
    socket: null,
    setSearchedUser:(val)=>set({searchedUsers:val}),
    setShowUserSideBar:(val)=>set({showUserSideBar:val}),
    ischeckAuth:async()=>{
        try {
            const res = await axiosApi.get('/auth/check')
            set({userAuth:res.data})
            get().connectSocket();
            return res.data
        } catch (error) {
            // console.log("error while fetching data to check auth ",error)
            toast.error(error.response.data.message,{
                duration: 1000,
            })
            set({userAuth:false})
            // return error.response.data.message
        }
        finally{
            set({loader:false})
        }
    },

    userSignup:async (value)=>{
        try {
            const response = await axiosApi.post('/auth/signup',value)
            set({isSignedUp:true})
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message)
            return null;
        }
    },

    userLogin:async(value)=>{
        try {
            // set({socket:io("http://localhost:3002")})
            const response = await axiosApi.post('/auth/login',value)
            set({userAuth:response.data})
            get().connectSocket();
            return response.data
        } catch (error) {
            toast.error(error.response.data.message)
            // console.log("error while logging in axios ",error)
            return null
        }
            
    },

    userLogout: async ()=>{
        set({loader:true})
        try {
            await axiosApi.post('/auth/logout')
            set({userAuth:false})
            get().disconnectSocket();
            toast("See ya again",{
                icon:'👋 ',
                duration:1000
            })
        } catch (error) {
            toast.error(error.response.data.message)
            // console.log("error while logout in axios ",error)
            return false
        }
        finally{
            set({loader:false})
        }
    },
    userProfile:async (profilePic)=>{
        try {
            const updatedUser = axiosApi.put("/auth/update-profile",{profilePic})
            .then(res=>{
                set({userAuth:res.data})
            })
            toast.promise(updatedUser, {
                loading: 'do not close saving...',
                success: 'saved successful 👌',
                error: 'Something went wrong 🤯',
            });
            return updatedUser;
        } catch (error) {
            // console.log("error while uploading image by axios ",error)
            toast.error(error.response.data.message)
        }
    },

    getAllUsers: async()=>{
        try {
            const res = await axiosApi.get("/messages/users")
            // console.log(res)
            set({allUser:res.data})
        } catch (error) {
            // console.log("error while fetching all users ",error.message)
            toast.error(error.response.data.message)
        }
    },

    searchUserByName:async(name)=>{
        try {
            const res = await axiosApi.get(`/messages/users/${name}`)
            set({searchedUsers:res.data})
            return res.data
        } catch (error) {
            // console.log("error while searching users : ",error.message)
            toast.error(error.response.data.message)
        }

    },

    getUserSendRequest:async()=>{
        try {
            const res = await axiosApi.get('/messages/users/requests/receive');
            set({requestedSentOrReceiveUser:res.data})
            return res.data
        } catch (error) {
            // console.log("error while getting",error.message)
            toast.error(error.response.data.message)
        }
    },

    sendReq:async(userid)=>{
        try {
            const res = await axiosApi.post(`/requests/send/${userid}`);
            set({userAuth:res.data.user})
            toast.success(`friend request send to ${res.data.sendTo}`)
        } catch (error) {
            // console.log("error while sending request ",error.message)
            toast.error(error.response.data.message)
        }
    },
    
    acceptReq:async (id)=>{
        try {
            const res = await axiosApi.put(`/requests/accept/${id}`)
            set({userAuth:res.data.accept})
            toast.success(`You accepted ${res.data.whichUser} friend request`)
        } catch (error) {
            // console.log("error accepting friend request ",error.message)
            toast.error(error.response.data.message)
        }
    },
    rejectReq:async (id)=>{
        try {
            const res = await axiosApi.put(`/requests/reject/${id}`)
            set({userAuth:res.data.reject})
            toast.error(`You rejected ${res.data.whichUser.fullname} friend request`)
        } catch (error) {
            // console.log("error accepting friend request ",error.message)
            toast.error(error.response.data.message)
        }
    },

    connectSocket:()=>{
        const {userAuth} = get()
        if(!userAuth || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query:{
                userId:userAuth._id,
            }
        })
        socket.connect();
        set({socket:socket})

        socket.on('onlineUsers',(userIds)=>{
            set({onlineUserIds:userIds})
            // console.log("online users ",get().onlineUserIds)
        })
        socket.on("someoneSendMessage",async({sender,getter})=>{
            console.log("I'm calling")
            set({userAuth:getter})
            const res = await get().getUserSendRequest()
            set({requestedSentOrReceiveUser:res})
            toast.success(`${sender.fullname} sends you friend request`)
        })
        socket.on("someoneAcceptRequest",async({sender,getter})=>{
            set({userAuth:getter})
            const res = await get().getUserSendRequest()
            set({requestedSentOrReceiveUser:res})
            
            toast.success(`${sender.fullname} accepts your friend request`)
        })
        socket.on("someoneRejectRequest",async({sender,getter})=>{
            set({userAuth:getter})
            const res = await get().getUserSendRequest()
            set({requestedSentOrReceiveUser:res})
            
            toast.error(`${sender.fullname} rejects your friend request`)
        })
        socket.on("updateNotification",({newMessage,sendUser})=>{
            const selectedUserId = useMessages.getState().selectedUser?._id;
            console.log("noti ",newMessage)
            if(newMessage.senderId._id!=selectedUserId ){
                toast(`${sendUser.fullname} sends you a message.`, {
                    icon: '😀',
                });
            }
            
        })
        socket.on("grpMessageNotify",({newMessage,sendUser})=>{
            const grp = Group.getState().selectedGroup;
            if(newMessage.recieverId!=grp?._id ){
                toast(`${sendUser.fullname} sends a message in group.`, {
                    icon: '😀',
                });
            }
            
        })

        socket.on("groupMessage",({newMessage})=>{
            const grp = Group.getState().selectedGroup;
            if(newMessage.recieverId==grp?._id){
                useMessages.getState().setMessage(newMessage)
            }
        })

        socket.on("someoneAddYouToGroup",async({group})=>{
            toast.success(`You added in a Group(${group.groupName})`)
            const setAllGroup = Group.getState().setAllGroup;
            setAllGroup(group)
            socket.emit("joinRoom",group._id);

        })
        socket.on("removeToGroup",async({group})=>{
            const setGroup = Group.getState().setSelectedGroup;
            const selectedGroup = Group.getState().selectedGroup;
            if(group._id==selectedGroup?._id){
                setGroup(null);
            }
            await Group.getState().getAllGroup();
            toast.success(`You were removed from ${group.groupName} by admin`)
        })
        socket.on("updatedGroup",async({group})=>{
            const setGroup = Group.getState().setSelectedGroup;
            await Group.getState().getAllGroup();
            setGroup(group)
            toast.success(`${group.groupName} is updated by admin`)

        })
        socket.on("deleteGroup",async({group})=>{
            const setGroup = Group.getState().setSelectedGroup;
            setGroup(null)
            await Group.getState().getAllGroup();
            toast.success(`${group.groupName} has been deleted by admin`)
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }
    
    

}))

export default useBearStore;