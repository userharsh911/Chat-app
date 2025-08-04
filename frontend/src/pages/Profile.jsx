import React, { useEffect, useState } from 'react'
import { Calendar, Mail } from 'lucide-react';
import { FaCamera } from "react-icons/fa";
import useBearStore from '../store/store'
import userImage from '../assets/user.png'
const Profile = () => {
  const [since, setSince] = useState('')
  const [file, setFile] = useState('')
  const [image,setImage] = useState(null)
  const {userAuth,userProfile} = useBearStore(state=>state)
  useEffect(()=>{
    if(file){
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async()=>{
        const base64Image = reader.result
        setImage(base64Image)
        await userProfile(base64Image);

      }
    }
    
  },[file,userProfile])
  console.log(userAuth)
  useEffect(()=>{
    const date = new Date(userAuth?.createdAt)
    console.log("user suer ",userAuth)
    setSince(date.toLocaleDateString())
  },[userAuth])
  return (
    <div className='w-full min-h-screen flex'>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-1 sm:p-6 bg-base-200">
        <div className=" w-full  py-8 px-4 flex items-center">
          <div className="w-5/6 mx-auto  rounded-3xl shadow-xl overflow-hidden flex flex-col">
            {/* Header Section */}
            <div className=" h-40 w-full relative flex-shrink-0">
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="w-40 h-40 rounded-full border-4 border-gray-800 shadow-lg flex items-center justify-center">
                  <div className=" text-5xl">
                    {
                      <img src={image || userAuth?.profilepic || userImage} alt="" className='w-36 h-36 rounded-full' />
                    }
                  </div>
                </div>
              </div>
              <div className='absolute -bottom-28 left-[60%] transform text-4xl'>
                  <label htmlFor="image" className='cursor-pointer text-shadow-base-300'>
                    <FaCamera />
                    <input 
                      type="file" 
                      accept='image/*'
                      name='profilePic'
                      className='h-0 w-0'
                      id='image'
                      onChange={(e)=>setFile(e.target.files[0])}
                    />
                  </label>
                </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pt-24 pb-8 w-full px-8 text-center flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-3">{userAuth?.fullname}</h1>
              
              <div className="flex items-center justify-center w-full mb-8">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="text-base">Since {since}</span>
              </div>

              {/* Contact Info */}
              <div className=" rounded-2xl p-6">
                <div className="flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span className="text-base">{userAuth?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full hidden lg:w-1/2 md:flex items-center flex-col justify-center p-6 bg-base-100'>
        <div className="flex w-10/12 h-2/6 flex-col gap-4 ">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div className="skeleton h-full w-full"></div>
        </div>
      </div>
    </div>
  )
}

export default Profile