import React, { useEffect } from 'react'
import { useRef } from 'react';
import useBearStore from '../store/store';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import useMessages from '../store/message.store';
import { useNavigate } from 'react-router-dom';

const FriendRequest = () => {
    const searchParam = useRef(null);
    const navigate = useNavigate();
    const {searchUserByName,searchedUsers,setSearchedUser,rejectReq,acceptReq,userAuth,sendReq,getUserSendRequest,requestedSentOrReceiveUser} = useBearStore(state=>state)
    const {setSelectedUser} = useMessages(state=>state);
    const searchUser = async () => {
        if (!searchParam.current.value) {
             toast.error("Please enter a search term");
             return
        }
        const val = searchParam.current.value.trim()
        searchParam.current.value = "";
        toast.promise(
            searchUserByName(val),
            {
                loading:"Please wait searching...",
                success:"Done ✅",
                error:"error while searching, Please try again",
            }

        )
    }
    useEffect(()=>{
        getUserSendRequest()
    },[getUserSendRequest])
    useEffect(() => {
        return () => {
            setSearchedUser([]); // Clear the searched users when component unmounts
        };
    }, [setSearchedUser]);
  return (
    <div>
       <h1 className='text-3xl text-center mb-3 font-semibold'>Add friends</h1>
       <div className='flex gap-5 justify-center'>
        <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
                >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" required placeholder="Search" ref={searchParam}/>
        </label>
        <button className='btn btn-success' onClick={searchUser}>Search</button>

       </div>
        {searchedUsers.length  > 0 && requestedSentOrReceiveUser ? (
            <div className='mt-5 bg-base-content px-5 py-3 rounded-lg md:h-[40vh] h[85vh] '>
                <div className='flex justify-end text-base-200 rounded-lg'>
                <X 
                    className='cursor-pointer'
                    onClick={() => {
                        searchParam.current.value = "";
                        setSearchedUser([]); // Clear the searched users
                    }}
                />
            </div>
            <ul className='mt-2 bg-base-100 rounded-lg h-4/5 overflow-y-auto'>
                {searchedUsers.map(user => (
                    <li key={user._id+requestedSentOrReceiveUser[0]} className='flex justify-between items-center p-2 border-b'>
                        <span>{user.fullname}</span>
                        {user.friends.includes(userAuth._id) ? (
                            <button className='btn btn-success'
                                onClick={()=>{
                                    navigate("/");
                                    setSelectedUser(user);
                                }}
                            >Chat</button>
                        ) : <button 
                                className='btn btn-warning'
                                onClick={async() =>{
                                    await sendReq(user._id)
                                    await getUserSendRequest();
                                    setSearchedUser([]); // Clear the searched users after sending request
                                }}
                            >{user.requests.receive.includes(userAuth._id) ? 'Sent' : 'Send Request'}</button>}
                        
                    </li>
                ))}
            </ul>
            </div>
        ) : (
            <p className='mt-5 text-center'>No users found</p>
        )} 


        {
            requestedSentOrReceiveUser.length > 0 && (
                <div className='mt-5 bg-base-content px-5 py-3 rounded-lg md:h-[40vh] h[85vh]'>
                    <h2 className='text-xl text-center mb-3'>Friend Requests</h2>
                    <ul className='bg-base-100 rounded-lg h-4/5 overflow-y-auto'>
                        {requestedSentOrReceiveUser.map(user => (
                            <li key={user._id} className='flex justify-between items-center p-2 border-b'>
                                <span>{user.fullname}</span>
                                <div className='flex gap-2'>
                                    {
                                        user.requests.send.includes(userAuth._id) ?
                                        <>
                                            <button 
                                                className='btn btn-success'
                                                onClick={async() => {
                                                    await acceptReq(user._id);
                                                    await getUserSendRequest()
                                                }}
                                            >Accept</button>
                                            <button
                                                onClick={async()=>{
                                                    await rejectReq(user._id)
                                                    await getUserSendRequest()
                                                }}
                                                className='btn btn-warning'
                                            >
                                                Reject
                                            </button>
                                        </> :
                                            <div 
                                        className='btn btn-warning'
                                    >Requested ✅</div>
                                    }
                                    
                                </div>
                            </li>
                        ))}
                    </ul>   
                </div>
                        )
        }
    </div>
  )
}

export default FriendRequest