import React from 'react'
import MessageNav from './MessageNav'
import SendMessages from './SendMessages'
import userImage from "../assets/user.png"
import { useEffect } from 'react'
import useBearStore from '../store/store'
import useMessages from '../store/message.store'
import dateTime from '../constant/dateTime'
import { useRef } from 'react'
import SkeletonOfMessage from './SkeletonOfMessage'

const Chatbar = () => {
    const scrollRef = useRef(null)
    const {getMessages, selectedUser,isMessageGet,messages,subscribeToMessage,unSubscribeFromMessage} = useMessages(state=>state)
    const {userAuth, showUserSideBar} = useBearStore(state=>state)
    useEffect(()=>{
        getMessages(selectedUser._id)
        subscribeToMessage()
        return ()=> unSubscribeFromMessage()
   },[getMessages,selectedUser,subscribeToMessage,unSubscribeFromMessage])
   useEffect(()=>{
     if(!isMessageGet){
       scrollRef.current?.scrollIntoView({ behavior: "auto"});

     }
   },[selectedUser,isMessageGet,messages])

//    console.log("mess mess ",messages)
  if(!isMessageGet)return (
    <div className={` ${showUserSideBar ? 'block' : ''} w-full pb-4 bg-base-content overflow-hidden`}>
        <MessageNav/>
        <div className='w-full h-4/5 bg-base-content overflow-y-scroll text-base-300'>
        {messages?.length==0 ? (
            <div className='w-full h-full flex justify-center items-center'>
                <p className='text-info font-semibold'>No messages yet</p>
            </div>)
        :
            messages?.map((item)=>(
                <div key={item._id} className={`chat ${item?.senderId==userAuth._id ? 'chat-end' : 'chat-start'}`}>
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                        <img
                            alt="not found"
                            src={item?.senderId==userAuth._id ? userAuth.profilepic || userImage : selectedUser.profilepic || userImage }
                        />
                        </div>
                    </div>
                    <div className="chat-header">
                        {item?.senderId==userAuth._id ? userAuth.fullname : selectedUser.fullname}
                    </div>
                    <div className="chat-bubble bg-primary text-primary-content">
                        <img src={item?.image} alt="" className='max-h-40' />
                        <p>{item?.text}</p>
                    </div>
                    <div className="chat-footer opacity-70 ">
                        <time className="text-xs opacity-70 text-base-100">{dateTime(item.createdAt)}</time>
                    </div>
                </div>
            ))
        }
        <div ref={scrollRef}></div>
        </div>
        <SendMessages/>
    </div>
  )
  else return(
    <div className='w-full h-full bg-base-content ps-3 overflow-scroll text-base-300'>
        <SkeletonOfMessage/>
    </div>
  )
}

export default Chatbar