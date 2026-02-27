import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Users } from 'lucide-react';
import useMessages from "../store/message.store";
import useBearStore from "../store/store";
import useGroups from "../store/group.store";
import userImage from "../assets/user.png";

const MessageNav = () => {
  const { selectedUser, setSelectedUser } = useMessages((state) => state);
  const { selectedGroup, setSelectedGroup, setShowInfo, showInfo } = useGroups((state) => state);
  const { onlineUserIds, userAuth } = useBearStore((state) => state);

  const isOnline = onlineUserIds.includes(selectedUser?._id);
  const isAdmin = selectedGroup?.adminInfo.includes(userAuth._id);

  return (
    <div className="sticky top-0 z-30 w-full bg-base-100/80 backdrop-blur-md border-b border-base-content/5 px-4 py-2">
      <div className="flex justify-between items-center">
        
        {/* Left Side: Avatar & Info */}
        <div className="flex gap-3 items-center">
          <motion.div 
            key={selectedUser?._id || selectedGroup?._id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className={`avatar ${isOnline ? 'online' : ''}`}>
              <div className="w-11 rounded-full ring ring-primary/20 ring-offset-base-100 ring-offset-1">
                <img
                  src={selectedUser?.profilepic || selectedGroup?.profilepic || userImage}
                  alt="profile"
                />
              </div>
            </div>
            {/* Status Pulse for Online Users */}
            {isOnline && (
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-base-100 animate-pulse" />
            )}
          </motion.div>

          <div className="flex flex-col">
            <motion.h3 
              key={selectedUser?.fullname || selectedGroup?.groupName}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-bold text-base-content capitalize leading-tight"
            >
              {selectedUser?.fullname || selectedGroup?.groupName}
            </motion.h3>
            
            <p className="text-xs font-medium">
              {selectedGroup ? (
                <span className="text-primary flex items-center gap-1">
                  <Users size={12} /> {selectedGroup.people.length} Members
                </span>
              ) : (
                <span className={isOnline ? "text-green-500" : "text-base-content/50"}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {selectedGroup && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-full transition-colors ${showInfo ? 'bg-primary text-primary-content' : 'hover:bg-base-content/10 text-base-content/70'}`}
              >
                <Info size={22} />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedUser(null);
              setSelectedGroup(null);
            }}
            className="p-2 rounded-full hover:bg-error/10 text-error/70 transition-colors"
          >
            <X size={22} />
          </motion.button>
          
          {/* Admin Edit Modal Trigger */}
          {isAdmin && (
            <label 
              htmlFor="editModal" 
              className="btn btn-ghost btn-xs text-primary hover:bg-primary/10"
            >
              Edit Group
            </label>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default MessageNav;