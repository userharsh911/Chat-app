import React, { useEffect } from 'react'
import useBearStore from '../store/store'
import userImage from "../assets/user.png"
import useMessages from '../store/message.store'
import { useState } from 'react'
import { SquareX } from 'lucide-react';
import { Contact } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import SkeletonOfMessage from './SkeletonOfMessage'
import SidebarSkeleton from './SidebarSkeleton'
const Sidebar = () => {
    const {getAllUsers,allUser,onlineUserIds,userAuth,showUserSideBar,setShowUserSideBar} = useBearStore(state=>state)
    const {setSelectedUser} = useMessages(state=>state)
    const [checkOnline, setCheckOnline] = useState(false)
    const [actualOnline,setActualOnline] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        setLoading(true)
        getAllUsers().then(()=>{
            setLoading(false)
        })
    },[getAllUsers,onlineUserIds])

    useEffect(()=>{
        onlineUserIds?.length > 0 && setActualOnline(onlineUserIds.filter(id => userAuth.friends.includes(id)))
    },[onlineUserIds, userAuth])

    // console.log('online users ',onlineUserIds)


  return (
    <aside className={`overflow-hidden ${showUserSideBar ? '@md:w-2/5 w-full px-3' : 'hidden @md:w-2/5 @md:block px-3'} h-full bg-neutral rounded-lg shadow-lg`}>
        <div className='flex gap-3 pt-3 text-xl items-center text-neutral-content'>
            <div><Contact /></div>
            <p className='font-semibold '>Contacts</p>
        </div>
        <div className='mb-2'>
            <div className='w-full @md:hidden block'>
            <div
                onClick={()=>setShowUserSideBar(!showUserSideBar)}
                className=' pt-2 w-full flex flex-col'
            >
                <div><SquareX className='float-end text-neutral-content' /></div>
            </div>
        </div>
        <div className='w-full pt-2 flex justify-between'>
            <label htmlFor="onlineuser" className='flex gap-2.5 cursor-pointer'>
                <input 
                    type="checkbox" 
                    id="onlineuser"
                    className="toggle toggle-neutral text-neutral-500 bg-neutral-content" 
                    onClick={()=>setCheckOnline(val=>!val)}
                />
                <p className=' font-semibold flex gap-1 text-neutral-content '>Online <span className=''>({actualOnline.length}) </span></p>
            </label>
            
        </div> 
        {
            checkOnline && (
                actualOnline?.length<1 && (
                <div className='w-full text-center text-neutral-content opacity-65 font-semibold mt-2'>
                    <p className=''>No online user at this time</p>
                </div>
            )
            )
        }
        {
                allUser?.length< 1 && (
                    <div className='w-full text-center text-neutral-content opacity-65 font-semibold mt-2'>
                        <p className='py-3 text-neutral-content opacity-65'>You have no friends yet Add people to chat</p>
                        <button className='btn btn-info' onClick={()=>navigate('/add-friends')}>Add friends</button>
                    </div>
                )
            }
        </div>
        <div className='overflow-y-auto h-[85%] '>
            <div className='flex flex-col gap-4 '>
            {
                allUser?.map(user=>(
                    <button 
                        key={user.email} 
                        onClick={()=>{
                            setSelectedUser(user)
                            setShowUserSideBar(false)
                        }}
                        className={`${checkOnline && (onlineUserIds?.includes(user._id) ? 'flex' : 'hidden') || 'flex'} w-full cursor-pointer bg-base-100 card-xs shadow-sm px-4 py-2`}
                        // onClick={()=>}
                    >
                        <div className={`avatar ${onlineUserIds?.includes(user._id) ? 'avatar-online':'avatar-offline'}`}>
                            <div className="w-10 rounded-full border-2">
                                <img src={user.profilepic || userImage} />
                            </div>
                        </div>
                        <div className=" @md:hidden @xl:block">
                            <div className="card-body">
                                <h2 className="card-title text-base-content text-pretty">{user.fullname}</h2>
                            </div>
                        </div>
                    </button>
                ))
            }
            {
                loading && (
                    <div>
                        <SidebarSkeleton/>
                    </div>
                )
            }
            
            </div>
        </div>
        <div className='h-7'></div>
    </aside>
  )
}

export default Sidebar