import { create } from "zustand";
import axiosApi from "../api/axiosApi";
import toast from "react-hot-toast";
import useBearStore from "./store";
import useGroups from "./group.store";
const useMessages = create((set,get)=>({
    messages: [],
    selectedUser:null,
    showFullImage:false,
    imagePreview:null,
    isMessageSent : false,
    isMessageGet:false,
    setSelectedUser:(user)=>{
        set({selectedUser:user})
    },
    setImagePreview:(url)=>{
        set({imagePreview:url})
    },
    setShowFullImage:(val)=>{
        set({showFullImage:val})
    },
    getMessages:async(id)=>{
        // console.log('call')
        set({isMessageGet:true})
        try {
            const res = await axiosApi.get(`/messages/${id}`)
            set({messages:res.data.message})
            // console.log("mila res ",res.data.message)
            return res.data;
        } catch (error) {
            // console.log("error while getting messages ",error.message)
            toast.error(error.response.data.message)
        }finally{
            set({isMessageGet:false})
        }
    },
    sendMessages: async(data)=>{
        set({isMessageSent:true})
        try {
            const {selectedUser,messages} = get()
            const grp = useGroups.getState().selectedGroup;
            const res = await axiosApi.post(`/messages/send/${selectedUser?._id || grp?._id}`,data)
            set({messages:[...messages,res.data.message]})
            return res.data;
        } catch (error) {
            // console.log("error while sending messages ",error)
            toast.error(error.response.data.message)
        }
        finally{
            set({isMessageSent:false})
        }
    },
    setMessage:(valObj)=>{
        set({messages:[...get().messages,valObj]})
    },

    subscribeToMessage:()=>{
        const {selectedUser} = get()
        if(!selectedUser) return;
        const socket = useBearStore.getState().socket;
        socket.on("updateMessage",({newMessage})=>{
            console.log("updated ",newMessage)
            if(newMessage.senderId._id==get().selectedUser?._id){
                console.log("hnhn")
                set({messages:[...get().messages,newMessage]})
            }
        })
        
    },

    unSubscribeFromMessage:()=>{
        const socket = useBearStore.getState().socket;
        socket.off('updateMessage')

    }
}))

export default useMessages;