import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useBearStore from '../store/store';
import toast from 'react-hot-toast';
import { X, Search, UserPlus, MessageCircle, UserCheck, UserX, Clock } from 'lucide-react';
import useMessages from '../store/message.store';
import { useNavigate } from 'react-router-dom';
import userImage from "../assets/user.png";

const FriendRequest = () => {
  const searchParam = useRef(null);
  const navigate = useNavigate();
  const { 
    searchUserByName, searchedUsers, setSearchedUser, 
    rejectReq, acceptReq, userAuth, sendReq, 
    getUserSendRequest, requestedSentOrReceiveUser 
  } = useBearStore(state => state);
  const { setSelectedUser } = useMessages(state => state);

  const searchUser = async (e) => {
    e?.preventDefault();
    if (!searchParam.current.value) {
      toast.error("Please enter a name to search");
      return;
    }
    const val = searchParam.current.value.trim();
    
    toast.promise(searchUserByName(val), {
      loading: "Finding users...",
      success: "Search completed!",
      error: "User not found",
    });
  };

  useEffect(() => {
    getUserSendRequest();
    return () => {
        if(setSearchedUser) setSearchedUser([]);
    };
  }, [getUserSendRequest, setSearchedUser]);

  return (
    <div className="max-w-4xl mx-auto p-4 h-full">
      {/* Search Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Expand Your Circle
        </h1>
        <p className="opacity-50 mb-8">Search for friends and start conversations</p>
        
        <form onSubmit={searchUser} className="relative max-w-lg mx-auto flex gap-2 px-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
            <input 
              type="text" 
              placeholder="Enter friend's name..." 
              ref={searchParam}
              className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 focus:border-primary transition-all"
            />
          </div>
          <button type="submit" className="btn btn-primary rounded-2xl px-6">Search</button>
        </form>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Search Results */}
        <div className="flex flex-col h-full gap-4">
          <h2 className="flex items-center gap-2 font-bold text-lg opacity-70 ml-2">
            <Search size={18} /> Results
          </h2>
          
          <div className="bg-base-200/50 rounded-3xl p-4 min-h-[350px] border border-base-content/5 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <AnimatePresence mode='wait'>
              {searchedUsers && searchedUsers.length > 0 ? (
                <motion.div 
                  key="results-list"
                  initial="hidden" 
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-3"
                >
                  <div className="flex justify-end mb-2">
                    <button onClick={() => {searchParam.current.value = ""; setSearchedUser([]);}} className="btn btn-ghost btn-xs btn-circle"><X size={16}/></button>
                  </div>
                  {searchedUsers.map((user) => (
                    <UserCard 
                      key={user._id}
                      user={user}
                      isFriend={user.friends?.includes(userAuth._id)}
                      isSent={user.requests?.receive?.includes(userAuth._id)}
                      onChat={() => { setSelectedUser(user); navigate("/"); }}
                      onAdd={async () => { await sendReq(user._id); await getUserSendRequest(); }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center h-64 opacity-30"
                >
                   <UserPlus size={48} strokeWidth={1} />
                   <p className="mt-2 text-sm">No users to display</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Requests Section */}
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 font-bold text-lg opacity-70 ml-2">
            <Clock size={18} /> Requests
          </h2>
          <div className="bg-base-200/50 rounded-3xl p-4 min-h-[350px] border border-base-content/5 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <AnimatePresence>
              {requestedSentOrReceiveUser && requestedSentOrReceiveUser.length > 0 ? (
                <div className="space-y-3">
                  {requestedSentOrReceiveUser.map(user => {
                    const isIncoming = user.requests?.send?.includes(userAuth._id);
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={user._id} 
                        className="flex items-center gap-3 p-3 bg-base-100 rounded-2xl shadow-sm border border-base-content/5"
                      >
                        <img src={user.profilepic || userImage} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{user.fullname}</p>
                          <p className="text-[10px] opacity-50 uppercase">{isIncoming ? "Incoming" : "Outgoing"}</p>
                        </div>
                        <div className="flex gap-1">
                          {isIncoming ? (
                            <>
                              <button onClick={() => acceptReq(user._id).then(getUserSendRequest)} className="btn btn-success btn-sm btn-square rounded-lg"><UserCheck size={16}/></button>
                              <button onClick={() => rejectReq(user._id).then(getUserSendRequest)} className="btn btn-ghost btn-sm btn-square text-error"><UserX size={16}/></button>
                            </>
                          ) : (
                            <div className="badge badge-warning badge-sm py-3 px-3 rounded-lg font-bold">Sent</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 opacity-30">
                   <Clock size={48} strokeWidth={1} />
                   <p className="mt-2 text-sm">Clear as a whistle</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserCard = ({ user, isFriend, isSent, onChat, onAdd }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 }
    }}
    className="flex items-center gap-3 p-3 bg-base-100 rounded-2xl border border-base-content/5 shadow-sm"
  >
    <div className="avatar">
      <div className="w-11 h-11 rounded-xl">
        <img src={user.profilepic || userImage} alt={user.fullname} />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold truncate">{user.fullname}</h4>
      <p className="text-[10px] opacity-40 italic">Global User</p>
    </div>
    {isFriend ? (
      <button onClick={onChat} className="btn btn-primary btn-sm rounded-xl px-4">
        Chat
      </button>
    ) : (
      <button 
        disabled={isSent}
        onClick={onAdd} 
        className={`btn btn-sm rounded-xl px-4 ${isSent ? 'btn-ghost text-primary' : 'btn-secondary'}`}
      >
        {isSent ? 'Sent' : 'Add'}
      </button>
    )}
  </motion.div>
);

export default FriendRequest;