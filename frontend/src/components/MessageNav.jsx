import React from 'react'
import useMessages from '../store/message.store'
import userImage from "/user.png"
import { ImCross } from "react-icons/im";
import useBearStore from '../store/store';
const MessageNav = () => {
    const {selectedUser,setSelectedUser} = useMessages(state=>state)
    const {onlineUserIds} = useBearStore(state=>state)
  return (
    <div className='bg-base-200 w-full flex justify-between px-5 items-center'>
        <div className='flex gap-3 items-center pt-3 pb-2'>
            <div className="avatar ">
                <div className={`${onlineUserIds.includes(selectedUser._id) ? "ring-primary" : ''} ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2`}>
                    <img src={selectedUser?.profilepic || userImage} />
                </div>
            </div>
            <div className='font-semibold capitalize'>
                {selectedUser?.fullname} is <span>{onlineUserIds.includes(selectedUser._id) ? 'Online' : 'Offline'}</span>
            </div>
        </div>
        <div>
            <button
                onClick={()=>setSelectedUser(null)}
                className='cursor-pointer'
            >
                <ImCross />
            </button>
        </div>
    </div>
  )
}

export default MessageNav