import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Mail, Camera, ShieldCheck, Award, Settings, Bell } from 'lucide-react';
import useBearStore from '../store/store';
import userImage from '../assets/user.png';
import useGroups from '../store/group.store';

const Profile = () => {
  const [since, setSince] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userAuth, userProfile, allUser } = useBearStore(state => state);
  const { allGroups } = useGroups(state => state);

  const updateProfilePic = (file) => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;
        setImage(base64Image);
        await userProfile(base64Image);
        setLoading(false);
      };
    }
  };

  useEffect(() => {
    if (userAuth?.createdAt) {
      const date = new Date(userAuth.createdAt);
      setSince(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    }
  }, [userAuth]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden">
      
      {/* 1. Left Section*/}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 flex h-full items-center justify-center p-4 sm:p-12 relative"
      >
        <div className="w-full max-w-md bg-base-100 rounded-[3rem] shadow-2xl shadow-primary/5 border border-base-content/5 overflow-hidden relative">
          
          {/* Banner / Header Gradient */}
          <div className="h-44 w-full bg-gradient-to-br from-primary via-secondary to-accent relative">
             <div className="absolute inset-0 opacity-20" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L15 0h30L30 30z' fill='%23ffffff'/%3E%3C/svg%3E")`}}></div>
          </div>

          {/* Avatar Section */}
          <div className="relative -mt-20 flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="w-40 h-40 rounded-full border-[6px] border-base-100 shadow-xl overflow-hidden bg-base-300">
                <img 
                  src={image || userAuth?.profilepic || userImage} 
                  alt="Profile" 
                  className={`w-full h-full object-cover transition-all duration-500 ${loading ? 'blur-sm opacity-50' : ''}`} 
                />
              </div>

              {/* Camera Action Overlay */}
              <label 
                htmlFor="image-upload" 
                className={`absolute bottom-2 right-2 p-3 bg-primary text-primary-content rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform ${loading ? 'animate-pulse' : ''}`}
              >
                <Camera size={20} />
                <input 
                  id="image-upload"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => updateProfilePic(e.target.files[0])}
                  disabled={loading}
                />
              </label>
            </motion.div>
          </div>

          {/* User Details */}
          <div className="pt-6 pb-12 px-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-3xl font-black tracking-tight">{userAuth?.fullname}</h1>
                <ShieldCheck className="text-primary" size={24} />
              </div>
              <div className="grid grid-cols-1 gap-3 mt-5">
                <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-content/5">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl"><Mail size={20}/></div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Email Address</p>
                    <p className="text-sm font-semibold">{userAuth?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-2xl border border-base-content/5">
                  <div className="p-2 bg-secondary/10 text-secondary rounded-xl"><Calendar size={20}/></div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Member Since</p>
                    <p className="text-sm font-semibold">{since}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 2. Right Section: Account Stats & Activity */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full h-full lg:w-1/2 p-6 sm:p-12 flex flex-col justify-center"
      >
        <div className="max-w-xl mx-auto w-full space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Award className="text-primary" /> Account Overview
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Groups In', val: allGroups?.length || 0, icon: <Bell size={16}/>, color: 'primary' },
                { label: 'Friends', val: allUser?.length || 0, icon: <Award size={16}/>, color: 'secondary' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-[2rem] bg-base-200 border border-base-content/5"
                >
                  <div className={`w-8 h-8 rounded-lg bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-4`}>
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-black">{stat.val}</p>
                  <p className="text-xs opacity-50 font-bold uppercase tracking-tighter">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold opacity-60 flex items-center gap-2">
              <Settings size={18} /> Developer
            </h3>
            <div className="p-6 rounded-[2rem] border-2 border-dashed border-base-content/10 flex flex-col items-center justify-center text-center">
              <p className="text-sm opacity-50 mb-4">
                For more settings and preferences, please visit the developer's portfolio.
              </p>
              <a href='https://userharsh911.tech' target='_blank' className="btn btn-primary btn-wide rounded-2xl shadow-lg shadow-primary/20">View Developer</a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;