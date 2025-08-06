import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import { useForm } from 'react-hook-form'
import useBearStore from '../store/store'
import { useNavigate } from 'react-router-dom'
import SignupSkeleton from '../components/SignupSkeleton';
const Login = () => {
  const {register,handleSubmit} = useForm();
  const [loading, setLoader] = useState(false)
  const [showPass,setShowPass] = useState(false)
  const navigate = useNavigate()
  const {userLogin} = useBearStore((state) => state);
  const login = async(data) => {
    setLoader(true)
    const userData = await userLogin(data);
    if(userData){
      toast(`welcome back ${userData.fullname}`,{
        icon:"🙌",
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration:2000,
      })
      navigate('/')
    }
    // console.log("User logged in:", userData);
    setLoader(false)
  };
  return (
    <div className='w-full min-h-screen flex'>
      <div className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center p-1 sm:p-6">
        <div className='w-5/6 bg-base-100 rounded-xl pb-3 shadow-2xl '>
          <h1 className="text-3xl font-bold text-center mt-10 ">
            Welcome Back
          </h1>
          <p className='text-center mt-2'>sign in into your account</p>
          <form onSubmit={handleSubmit(login)} className="max-w-md mx-auto mt-6 p-4 rounded ">
            <div className="form-control flex flex-col gap-3 mt-5">
              <label className="label">
                <span className="label-text">Email</span>
              </label> 
              <div className='mx-auto form-control max-w-xs w-full'>
                <input 
                type="text"
                placeholder="example@mail.com"
                className="input input-bordered"
                {...register('email')}
              />
              </div>
            </div>
                
            <div className="form-control w-full flex flex-col gap-3 mt-5">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative w-full mx-auto form-control max-w-xs ">
              <input 
                type={showPass ? 'text' : 'password'} 
                id="password" 
                className="input input-bordered w-full pr-10" 
                placeholder="Enter your password" 
                required
                {...register('password')} 
              />
              <button type="button" 
                onClick={()=>setShowPass((val)=>!val)} 
                className="absolute inset-y-0 right-0 z-10 flex items-center px-3">
                  {!showPass ? <LuEyeClosed /> : <LuEye />}                
              </button>
            </div>
            </div>

            <button type="submit" className="w-full btn btn-primary mt-8 p-2 rounded cursor-pointer transition duration-200" disabled={loading}>{loading ? 'Logging...' : 'Login'}</button>
            {
                loading && (
                        <div className="flex items-center justify-center mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                        </div>
                    )
                }
          </form>
          <p className='text-center '>Don't have an account <button className='text-blue-500 hover:text-blue-600 cursor-pointer' onClick={()=>navigate('/signup')}>Signup</button></p>
        </div>
      </div>
      <div className='w-full hidden lg:w-1/2 bg-gray-950 md:flex items-center flex-col justify-center p-6'>
        <SignupSkeleton />
          <p className="text-center text-transparent mt-5 bg-clip-text bg-gradient-to-r from-secondary to-primary font-semibold">
            <span className='text-yellow-400'>🔑</span> Login to unlock your personalized experience
          </p>
      </div>
    </div>
  )
}

export default Login