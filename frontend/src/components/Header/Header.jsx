import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { TbLogout } from "react-icons/tb";
import { BiSolidUserDetail } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import { FaUserPen, FaUserGroup } from "react-icons/fa6"; // Group icon for add friends
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { BsChatRightTextFill } from "react-icons/bs";
import { IoSettings } from "react-icons/io5";
import useBearStore from '../../store/store';

const Header = () => {
    const [toggleView, setToggleView] = useState(false);
    const navigate = useNavigate();
    const { userAuth, userLogout } = useBearStore((state) => state);

    const routeLinks = [
        { path: "/login", render: <><BiSolidUserDetail className="text-lg" /> Login</>, active: !userAuth },
        { path: "/signup", render: <><FaUserPlus className="text-lg" /> Signup</>, active: !userAuth },
        { path: "/add-friends", render: <><FaUserGroup className="text-lg" /> Add Friends</>, active: userAuth },
        { path: "/profile", render: <><FaUserPen className="text-lg" /> Profile</>, active: userAuth },
        { path: "/settings", render: <><IoSettings className="text-lg" /> Settings</>, active: true },
    ];

    const logout = async () => {
        await userLogout();
        navigate('/login', { replace: true });
    };

    return (
        <header className='sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur-md border-b border-base-content/5'>
            <nav className='max-w-7xl mx-auto flex justify-between items-center px-6 py-3'>
                
                {/* Logo Section */}
                <NavLink to={'/'} className="group transition-all duration-300">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='flex items-center gap-2 font-bold text-xl text-primary'
                    >
                        <BsChatRightTextFill className="group-hover:rotate-12 transition-transform" />
                        <span className="tracking-tighter">chat-ON</span>
                    </motion.div>
                </NavLink>

                {/* Desktop Menu */}
                <div className='hidden items-center gap-2 sm:flex'>
                    {routeLinks.map((item) => (
                        item.active && (
                            <NavLink 
                                key={item.path}
                                to={item.path} 
                                className={({ isActive }) => `
                                    relative px-4 py-2 flex items-center gap-2 font-medium transition-colors
                                    ${isActive ? "text-primary" : "hover:text-primary/80"}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.render}
                                        {isActive && (
                                            <motion.div 
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        )
                    ))}
                    {userAuth && (
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={logout} 
                            className='ml-4 btn btn-circle btn-ghost btn-sm text-error'
                        >
                            <TbLogout className="text-2xl" />
                        </motion.button>
                    )}
                </div>

                {/* Mobile Hamburger Button */}
                <div className='block sm:hidden'>
                    <button 
                        onClick={() => setToggleView(!toggleView)} 
                        className='btn btn-ghost btn-circle text-2xl'
                    >
                        {toggleView ? <RxCross1 /> : <RxHamburgerMenu />}
                    </button>
                </div>

                {/* Mobile Drawer*/}
                <AnimatePresence>
                    {toggleView && (
                        <>
                            {/* Backdrop Overlay */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setToggleView(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 sm:hidden"
                            />

                            {/* Sidebar Panel */}
                            <motion.div 
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 h-screen w-3/4 bg-base-100 z-50 shadow-2xl p-6 sm:hidden flex flex-col gap-4"
                            >
                                <div className="flex justify-between items-center mb-8 border-b pb-4">
                                    <span className="font-bold text-lg flex items-center gap-2">
                                        <BsChatRightTextFill className="text-primary" /> Navigation
                                    </span>
                                    <button onClick={() => setToggleView(false)} className="btn btn-sm btn-circle btn-ghost">
                                        <RxCross1 />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {routeLinks.map((item, idx) => (
                                        item.active && (
                                            <motion.div
                                                key={item.path}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <NavLink 
                                                    to={item.path} 
                                                    onClick={() => setToggleView(false)} 
                                                    className={({ isActive }) => `
                                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                                        ${isActive ? "bg-primary text-primary-content shadow-lg shadow-primary/20" : "hover:bg-base-200"}
                                                    `}
                                                >
                                                    {item.render}
                                                </NavLink>
                                            </motion.div>
                                        )
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    {userAuth && (
                                        <motion.button 
                                            whileTap={{ scale: 0.95 }}
                                            onClick={logout} 
                                            className='btn btn-error btn-outline w-full gap-2 rounded-xl'
                                        >
                                            <TbLogout /> Logout
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Header;