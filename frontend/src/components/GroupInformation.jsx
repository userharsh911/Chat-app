import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useGroups from "../store/group.store";
import userImage from "../assets/user.png";
import { onlyDate } from "../constant/dateTime";
import useBearStore from "../store/store";
import { UserRoundPlus, Trash2, ShieldCheck, X, UserMinus, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const GroupInformation = () => {
  const { handleSubmit, register, reset } = useForm();
  const {
    getSelectedGroupInfo,
    selectedGroup,
    selectedGroupInfo,
    removeMemberToGroup,
    addMemberToGroup,
    delGroup,
  } = useGroups((state) => state);
  
  const { allUser, userAuth } = useBearStore((state) => state);
  const isAdmin = selectedGroup?.adminInfo.includes(userAuth._id);

  useEffect(() => {
    if (selectedGroup) {
      getSelectedGroupInfo(selectedGroup?._id);
    }
  }, [getSelectedGroupInfo, selectedGroup]);

  const removePeople = async (id) => {
    toast.promise(removeMemberToGroup(id), {
      loading: "Removing member...",
      success: "Member removed! 👋",
      error: "Could not remove member.",
    });
  };

  const addPerson = async (data) => {
    if (data.people?.length > 0) {
      toast.promise(addMemberToGroup(data.people), {
        loading: "Adding members...",
        success: "Members added! 🎉",
        error: "Failed to add members.",
      });
      reset();
      document.getElementById("add_people").checked = false; 
    }
  };

  const deleteGroup = async () => {
    if (window.confirm("Are you sure you want to delete this group? This cannot be undone.")) {
      toast.promise(delGroup(), {
        loading: "Deleting group...",
        success: "Group deleted successfully!",
        error: "Error deleting group.",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full bg-base-100"
    >
      {/* 1. Header Section */}
      <div className="p-6 border-b border-base-content/5 bg-base-200/30">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-primary/10 shadow-xl">
              <img src={selectedGroup?.profilepic || userImage} className="w-full h-full object-cover" alt="group" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-content p-1.5 rounded-xl shadow-lg">
              <Info size={16} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-base-content">{selectedGroup?.groupName}</h2>
            <p className="text-xs opacity-50 font-medium uppercase tracking-widest mt-1">
              {selectedGroupInfo?.people?.length + selectedGroupInfo?.adminInfo?.length || 0} Members
            </p>
          </div>
        </div>
      </div>

      {/* 2. Members List Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <h3 className="text-xs font-bold opacity-40 uppercase tracking-tighter mb-4 ml-2">Members</h3>
        
        <div className="space-y-2">
          {/* Admins */}
          {selectedGroupInfo?.adminInfo?.map((user) => (
            <div key={user._id} className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
              <img src={user.profilepic || userImage} className="w-10 h-10 rounded-full object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.fullname}</p>
                <div className="flex items-center gap-1 text-[10px] text-primary font-bold uppercase">
                  <ShieldCheck size={12} /> Admin
                </div>
              </div>
            </div>
          ))}

          {/* Regular Members */}
          <AnimatePresence>
            {selectedGroupInfo?.people?.map((user) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={user._id} 
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-base-200 transition-colors group"
              >
                <img src={user.profilepic || userImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.fullname}</p>
                  <p className="text-[10px] opacity-40 italic">Member</p>
                </div>
                
                {isAdmin && user._id !== userAuth._id && (
                  <button
                    onClick={() => removePeople(user._id)}
                    className="btn btn-ghost btn-xs btn-circle text-error opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <UserMinus size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Admin Actions Section */}
      {isAdmin && (
        <div className="p-4 border-t border-base-content/5 space-y-2 bg-base-200/20">
          <label htmlFor="add_people" className="btn btn-primary btn-block rounded-xl gap-2 shadow-lg shadow-primary/20">
            <UserRoundPlus size={18} /> Add Members
          </label>
          <button onClick={deleteGroup} className="btn btn-ghost btn-block btn-sm text-error/60 hover:text-error hover:bg-error/10 gap-2">
            <Trash2 size={16} /> Delete Group
          </button>
        </div>
      )}

      {/* 4. Add Members Modal */}
      <input type="checkbox" id="add_people" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box p-0 overflow-hidden rounded-2xl border border-base-content/10">
          <div className="p-4 border-b border-base-content/5 bg-base-200/50 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><UserRoundPlus size={18}/> Invite Friends</h3>
            <label htmlFor="add_people" className="btn btn-sm btn-circle btn-ghost"><X size={18}/></label>
          </div>
          
          <form onSubmit={handleSubmit(addPerson)} className="p-4">
            <div className="h-[40vh] overflow-y-auto space-y-1 mb-4 pr-2 custom-scrollbar">
              {allUser?.filter(u => !selectedGroup?.people.includes(u._id)).map((user) => (
                <label key={user._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 cursor-pointer transition-all border border-transparent has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
                  <img src={user.profilepic || userImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{user.fullname}</p>
                    <p className="text-[10px] opacity-50 uppercase tracking-tighter">Joined {onlyDate(user.createdAt)}</p>
                  </div>
                  <input
                    type="checkbox"
                    value={user._id}
                    className="checkbox checkbox-primary rounded-lg"
                    {...register("people")}
                  />
                </label>
              ))}
            </div>
            <button className="btn btn-primary btn-block rounded-xl shadow-lg shadow-primary/20" type="submit">
              Confirm Addition
            </button>
          </form>
        </div>
        <label className="modal-backdrop bg-black/40 backdrop-blur-sm" htmlFor="add_people">Close</label>
      </div>
    </motion.div>
  );
};

export default GroupInformation;