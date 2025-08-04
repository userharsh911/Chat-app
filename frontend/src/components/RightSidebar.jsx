import React from 'react'
import { MessageSquareMore } from 'lucide-react';
import useBearStore from '../store/store';
import { CircleArrowLeft } from 'lucide-react';
const RightSidebar = () => {
  const {setShowUserSideBar, showUserSideBar,userAuth} = useBearStore(state=>state)
  return (
    <div className={`flex ${!showUserSideBar ? 'flex':'hidden @md:flex'} pb-4 w-full flex-col justify-center items-center bg-primary-content text-primary overflow-hidden`}>
        
        <div className='animate-bounce'>
            <MessageSquareMore size={50} />
        </div>
        <div> 
          {
            !userAuth && (
              <p className='text-center'>Welcome to Chat-ON</p>
            )
          }
            <p className='text-center text-lg font-semibold'>{!userAuth ? 'Login' : 'Select a person'} to start chatting</p>
            {
              userAuth && (
                <p className='text-center text-sm'>Click on a user profile from the sidebar to begin</p>
              )
            }

        </div>

        {
          !showUserSideBar ? (
            <div className='@md:hidden block'>
          <button
                onClick={()=>setShowUserSideBar(!showUserSideBar)}
                className='btn btn-primary rounded-4xl mt-6'
            >
                <CircleArrowLeft /> show users
            </button>
        </div>
          ) : null
        }
    </div>
  )
}

export default RightSidebar