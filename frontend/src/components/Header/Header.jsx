import { NavLink, useNavigate, } from 'react-router-dom'
import useBearStore from '../../store/store'
import { TbLogout } from "react-icons/tb";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsChatRightTextFill } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useState } from 'react';
const Header = () => {
    const [toggleView, setToggleView] = useState(false)
    const navigate = useNavigate()
    const {userAuth,userLogout} = useBearStore((state) => state)
    const routeLinks=[
        {
            path:"/login",
            render: <div className='flex items-center gap-1'><BiSolidUserDetail /> Login</div>,
            active:!userAuth,
        },
        {
            path:"/signup",
            render:<div className='flex items-center gap-1'><FaUserPlus /> Signup</div>,
            active:!userAuth,
        },
        {
            path:"/profile",
            render:<div className='flex items-center gap-1'><FaUserPen /> Profile</div>,
            active:userAuth,
        },
        {
            path:"/settings",
            render:<div className='flex items-center gap-1'><IoSettings /> Settings</div>,
            active:true,
        },
    ]

    const logout = async()=>{
        await userLogout()
        navigate('/login',{ replace: true })
    }
  return (
    <nav className='flex justify-between relative gap-9 z-20 items-center bg-base-300 px-4 py-2'>
        <NavLink to={'/'} className={({isActive})=>isActive ? "border-b-4 border-e-base-200 px-4 rounded-2xl" : "px-4"}>
            <div className='flex items-center gap-1 font-semibold'>
                <BsChatRightTextFill /> chat-ON 
            </div>
        </NavLink>
        <div className='hidden items-center gap-3 sm:flex'>
            {
                routeLinks.map(item=>(
                    item.active && (
                        <NavLink to={item.path} className={({isActive})=>isActive ? "border-b-4 border-e-base-200 px-4 rounded-2xl py-1" : "px-4 py-1"} key={item.path}>
                            {item.render}
                        </NavLink>
                    )
                ))
            }
            {
                userAuth && (
                    <button onClick={logout} className='text-xl self-center bg-base-200 p-3 cursor-pointer rounded-full'>
                        <TbLogout />
                    </button>
                )
            }
        </div>
        <div className='block sm:hidden '>
            <button onClick={()=>setToggleView((val)=>!val)} className='cursor-pointer text-3xl'>
                {
                    toggleView ? <RxCross1 /> : <RxHamburgerMenu />
                }
            </button>
        </div>
        <div className={`flex flex-col gap-6 py-10 fixed duration-200 ${toggleView ? 'left-0' : 'left-[-100%]'} top-0  bg-success-content w-3/4 h-[100vh] items-center gap-3 sm:hidden`}>
            <NavLink to={'/'} className={({isActive})=>isActive ? "border-b-4 border-e-base-200 px-4 rounded-2xl" : "px-4"}>
                <div className='flex items-center gap-1 font-semibold'>
                    <BsChatRightTextFill /> chat-ON 
                </div>
            </NavLink>
            {
                routeLinks.map(item=>(
                    item.active && (
                        <NavLink to={item.path} onClick={()=>setToggleView((val)=>!val)} className={({isActive})=>isActive ? "border-b-4 border-violet-400 px-4 rounded-2xl py-2 w-5/6" : "px-4 py-2 w-full"} key={item.path}>
                            {item.render}
                        </NavLink>
                    )
                ))
            }
            {
                userAuth && (
                    <button onClick={()=>{
                        logout();
                        setToggleView((val)=>!val)
                    }} className='text-xl self-center bg-base-200 p-3 cursor-pointer rounded-full'>
                        <TbLogout />
                    </button>
                )
            }
        </div>
    </nav>
  )
}

export default Header