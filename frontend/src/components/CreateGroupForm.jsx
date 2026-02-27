import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useBearStore from "../store/store";
import userImage from "../assets/user.png";
import { onlyDate } from "../constant/dateTime";
import base64ImageConvert from "../constant/filereader";
import useGroups from "../store/group.store";
import toast from "react-hot-toast";
import {
  Users,
  Camera,
  Check,
  ShieldCheck,
  UserPlus,
  SquareX,
} from "lucide-react";

const CreateGroupForm = (editVal) => {
  const { createGroupToDB, updateGroupToDB } = useGroups((state) => state);
  const { allUser } = useBearStore((state) => state);

  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [profilepic, setProfilepic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [onlyAdminCanMessage, setOnlyAdminCanMessage] = useState(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setGroupName(editVal?.groupName || "");
    setOnlyAdminCanMessage(editVal?.onlyAdminCanMessage || false);
  }, [editVal]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilepic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const togglePerson = (userId) => {
    setPeople((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const createGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    let image = null;
    if (profilepic) {
      image = await base64ImageConvert(profilepic);
    }

    const action = editVal?.groupName
      ? updateGroupToDB(
          { groupName, onlyAdminCanMessage, profilepic: image },
          editVal?.grpId,
        )
      : createGroupToDB({
          groupName,
          onlyAdminCanMessage,
          people,
          profilepic: image,
        });

    toast.promise(action, {
      loading: editVal?.groupName
        ? "Updating group..."
        : "Creating your group...",
      success: editVal?.groupName ? "Group updated! 🎉" : "Group created! 🚀",
      error: "Something went wrong. Please try again.",
    });

    action
      .then(() => {
        setLoading(false);
        const modalId = editVal?.groupName ? "editModal" : "my_modal_7";
        document.getElementById(modalId)?.click();
      })
      .catch(() => setLoading(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-1"
    >
      <form onSubmit={createGroup} className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {editVal?.groupName ? (
              <ShieldCheck size={24} />
            ) : (
              <UserPlus size={24} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-base-content">
              {editVal?.groupName ? "Edit Group Details" : "Create New Group"}
            </h2>
            <p className="text-xs opacity-50">Set up your conversation space</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Details */}
          <div className="space-y-4">
            {/* Profile Upload */}
            <div className="flex flex-col items-center gap-3 p-4 bg-base-200/50 rounded-2xl border border-dashed border-base-content/20">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20">
                  <img
                    src={previewUrl || editVal?.profilepic || userImage}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <Camera className="text-white" size={20} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <span className="text-xs font-semibold opacity-60">
                Upload Group Icon
              </span>
            </div>

            {/* Inputs */}
            <div className="form-control">
              <label className="label-text mb-2 px-1 font-semibold">
                Group Name
              </label>
              <input
                type="text"
                className="input input-bordered focus:input-primary w-full rounded-xl transition-all"
                placeholder="e.g. Project Avengers"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            <label className="flex items-center gap-3 p-3 bg-base-200 rounded-xl cursor-pointer hover:bg-base-300 transition-colors">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={onlyAdminCanMessage}
                onChange={() => setOnlyAdminCanMessage(!onlyAdminCanMessage)}
              />
              <span className="text-sm font-medium">
                Only admins can send messages
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block rounded-xl shadow-lg shadow-primary/20"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : editVal?.groupName ? (
                "Save Changes"
              ) : (
                "Create Group"
              )}
            </button>
          </div>

          {/* Right Column: Member Selection */}
          {!editVal?.groupName && (
            <div className="flex flex-col h-[400px]">
              <label className="label-text mb-2 px-1 font-semibold flex items-center gap-2">
                <Users size={16} /> Select Members ({people.length})
              </label>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {allUser?.map((user) => (
                  <motion.div
                    layout
                    whileHover={{ x: 5 }}
                    key={user._id}
                    onClick={() => togglePerson(user._id)}
                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer border transition-all ${
                      people.includes(user._id)
                        ? "bg-primary/10 border-primary/30"
                        : "bg-base-200/50 border-transparent hover:border-base-content/10"
                    }`}
                  >
                    <div className="relative">
                      <img
                        className="size-10 rounded-full object-cover"
                        src={user.profilepic || userImage}
                        alt={user.fullname}
                      />
                      {people.includes(user._id) && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-content rounded-full p-0.5">
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate">
                        {user.fullname}
                      </p>
                      <p className="text-[10px] opacity-50 uppercase tracking-tighter">
                        Joined {onlyDate(user.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default CreateGroupForm;
