import {create} from "zustand"
import axiosApi from "../api/axiosApi";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE=="development" ? "http://localhost:3002" : "/";

const useBearStore = create((set,get)=>({
    userAuth:false,
    loader:true,
    allUser: null,
    onlineUserIds: [],
    showUserSideBar: true,
    socket: null,

    setShowUserSideBar:(val)=>set({showUserSideBar:val}),
    ischeckAuth:async()=>{
        try {
            const res = await axiosApi.get('/auth/check')
            set({userAuth:res.data})
            get().connectSocket();
            return res.data
        } catch (error) {
            console.log("error while fetching data to check auth ",error)
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
            console.log("error while logging in axios ",error)
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
            console.log("error while logout in axios ",error)
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
            console.log("error while uploading image by axios ",error)
            toast.error(error.response.data.message)
        }
    },

    getAllUsers: async()=>{
        try {
            const res = await axiosApi.get("/messages/users")
            console.log(res)
            set({allUser:res.data})
        } catch (error) {
            console.log("error while fetching all users ",error.message)
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
            console.log("online users ",get().onlineUserIds)
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }
    
    

}))

export default useBearStore;