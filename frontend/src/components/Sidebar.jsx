import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SquareX, Contact, Users, Plus, UserPlus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useBearStore from "../store/store";
import useMessages from "../store/message.store";
import useGroups from "../store/group.store";
import SidebarSkeleton from "./SidebarSkeleton";
import userImage from "../assets/user.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("friends");
  const {
    allGroups,
    setSelectedGroup,
    getAllGroup,
    setShowInfo,
    selectedGroup,
  } = useGroups();
  const {
    getAllUsers,
    allUser,
    onlineUserIds,
    userAuth,
    showUserSideBar,
    setShowUserSideBar,
  } = useBearStore();
  const { setSelectedUser, selectedUser } = useMessages();

  const [checkOnline, setCheckOnline] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllUsers(), getAllGroup()]).finally(() =>
      setLoading(false),
    );
  }, [getAllUsers, getAllGroup]);

  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 
        @md:relative @md:translate-x-0 @md:flex pb-10

        ${showUserSideBar ? "translate-x-0 w-full sm:w-80" : "-translate-x-full"} 
        @md:w-80 w-80
                transition-transform duration-300 ease-in-out 
        bg-base-100 border-r border-base-content/5 
        flex flex-col h-full shadow-2xl @md:shadow-none
      `}
    >
      {/* 1. Header Section */}
      <div className="p-4 flex items-center justify-between bg-base-200/50">
        <div className="flex items-center gap-2 text-primary">
          <Contact size={24} strokeWidth={2.5} />
          <h1 className="text-xl font-bold tracking-tight">Messages</h1>
        </div>
        <button
          onClick={() => setShowUserSideBar(false)}
          className="@md:hidden btn btn-ghost btn-sm btn-circle"
        >
          <SquareX />
        </button>
      </div>

      {/* 2. Custom Animated Tabs */}
      <div className="px-4 mt-4">
        <div className="relative flex p-1 bg-base-200 rounded-xl">
          <motion.div
            className="absolute h-[85%] bg-base-100 rounded-lg shadow-sm z-0"
            initial={false}
            animate={{
              x: activeTab === "friends" ? "0%" : "96%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <button
            onClick={() => {
              setActiveTab("friends");
              setSelectedGroup(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold z-10 transition-colors ${activeTab === "friends" ? "text-primary" : "text-base-content/50"}`}
          >
            <UserPlus size={16} /> Friends
          </button>
          <button
            onClick={() => {
              setActiveTab("groups");
              setSelectedUser(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold z-10 transition-colors ${activeTab === "groups" ? "text-primary" : "text-base-content/50"}`}
          >
            <Users size={16} /> Groups
          </button>
        </div>
      </div>

      {/* 3. Online Toggle */}
      {activeTab === "friends" && (
        <div className="px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase opacity-50 tracking-wider">
            Online Users
          </span>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={checkOnline}
            onChange={() => setCheckOnline(!checkOnline)}
          />
        </div>
      )}

      {/* 4. List Content */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {loading ? (
            <SidebarSkeleton key="skeleton" />
          ) : (
            <motion.div
              key={activeTab}
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-1"
            >
              {activeTab === "friends" ? (
                // Friends List
                allUser?.length > 0 ? (
                  allUser.map((user) => {
                    const isOnline = onlineUserIds.includes(user._id);
                    if (checkOnline && !isOnline) return null;

                    return (
                      <motion.button
                        variants={itemVariants}
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowInfo(null);
                          setShowUserSideBar(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-base-200 group ${selectedUser?._id === user._id ? "bg-primary/10 ring-1 ring-primary/20" : ""}`}
                      >
                        <div
                          className={`avatar ${isOnline ? "online" : "offline"}`}
                        >
                          <div className="w-12 rounded-full border-2 border-transparent group-hover:border-primary/30 transition-all">
                            <img
                              src={user.profilepic || userImage}
                              alt="avatar"
                            />
                          </div>
                        </div>
                        <div className="text-left overflow-hidden">
                          <p
                            className={`font-bold truncate ${selectedUser?._id === user._id ? "text-primary" : "text-base-content"}`}
                          >
                            {user.fullname}
                          </p>
                          <p className="text-xs opacity-50 truncate">
                            Click to start chatting
                          </p>
                        </div>
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="text-center py-10 px-4">
                    <p className="opacity-50 text-sm mb-4">No friends found</p>
                    <button
                      onClick={() => navigate("/add-friends")}
                      className="btn btn-primary btn-sm rounded-full"
                    >
                      Add Friends
                    </button>
                  </div>
                )
              ) : (
                // Groups List
                allGroups?.map((grp) => (
                  <motion.button
                    variants={itemVariants}
                    key={grp._id}
                    onClick={() => {
                      setSelectedGroup(grp);
                      setShowUserSideBar(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-base-200 ${selectedGroup?._id === grp._id ? "bg-primary/10 ring-1 ring-primary/20" : ""}`}
                  >
                    <div className="avatar">
                      <div className="w-12 rounded-xl">
                        <img src={grp.profilepic || userImage} alt="group" />
                      </div>
                    </div>
                    <div className="text-left overflow-hidden">
                      <p
                        className={`font-bold truncate ${selectedGroup?._id === grp._id ? "text-primary" : "text-base-content"}`}
                      >
                        {grp.groupName}
                      </p>
                      <p className="text-xs opacity-50">
                        {grp.people?.length || 0} Members
                      </p>
                    </div>
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Footer: Create Group */}
      {activeTab === "groups" && (
        <div className="p-4 border-t border-base-content/5">
          <label
            htmlFor="create_group_modal"
            className="btn btn-primary btn-block rounded-xl gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> Create New Group
          </label>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
