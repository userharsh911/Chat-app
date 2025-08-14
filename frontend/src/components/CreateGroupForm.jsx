import React, { useEffect, useState } from "react";
import useBearStore from "../store/store";
import userImage from "../assets/user.png";
import { onlyDate } from "../constant/dateTime";
import base64ImageConvert from "../constant/filereader";
import useGroups from "../store/group.store";
import toast from "react-hot-toast";
const CreateGroupForm = (editVal) => {
  const { createGroupToDB, updateGroupToDB } = useGroups((state) => state);
  const [loading, setLoading] = useState(false);
  const { allUser } = useBearStore((state) => state);
  const [groupName,setGroupName] = useState('')
  const [profilepic,setProfilepic] = useState(false)
  const [onlyAdminCanMessage,setOnlyAdminCanMessage] = useState(false)
  const [people,setPeople] = useState([])

  useEffect(()=>{
    setGroupName(editVal?.groupName||'')
    setOnlyAdminCanMessage(editVal?.onlyAdminCanMessage||false)

  },[editVal])

  const createGroup = async (e) => {
    e.preventDefault()
    setLoading(true);
    let image;
    if (profilepic?.name) {
      image = await base64ImageConvert(profilepic);
    }
    if (editVal?.groupName) {
        toast.promise(
            updateGroupToDB({ groupName, onlyAdminCanMessage, profilepic: image }, editVal?.grpId),
            {
                loading: "Updating..., Do not Close",
                success: "Updated successfully!",
                error: "Something went wrong!"
            }

        )
      document.getElementById("editModal").click();
    } else {
        toast.promise(
            await createGroupToDB({ groupName, onlyAdminCanMessage, people, profilepic: image }),
            {
                loading: "Creating..., Do not Close",
                success: "Created successfully!",
                error: "Something went wrong!"
            }
        )
      document.getElementById("my_modal_7").click();
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col" onSubmit={(e) => createGroup(e)}>
      <fieldset className="fieldset sm:flex bg-base-200 border-base-300 rounded-box mx-auto border p-4">
        <legend className="fieldset-legend text-xl bg-base-200 rounded-xl px-4">
          Group Info
        </legend>
        <div className="flex flex-col gap-3">
          <label className="label">Group Name*</label>
          <input
            type="text"
            name="groupName"
            className="input"
            placeholder="group"
            value={groupName}
            onChange={(e)=>setGroupName(e.target.value)}
          />

          <label className="label mt-3">Profile</label>
          <input
            type="file"
            name="profilepic"
            className="file-input file-input-neutral"
            onChange={(e)=>setProfilepic(e.target.files[0])}
          />

          <label className="label mt-3">
            Only admin can message (optional)
          </label>
          <label className="toggle text-base-content">
            <input type="checkbox" name="onlyAdminCanMessage" checked={onlyAdminCanMessage} onChange={()=>setOnlyAdminCanMessage(val=>!val)} />
            <svg
              aria-label="enabled"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="4"
                fill="none"
                stroke="currentColor"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </g>
            </svg>
            <svg
              aria-label="disabled"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </label>
        </div>
        <ul
          className={`list ${
            editVal?.groupName && "hidden"
          } bg-base-100 rounded-box shadow-md h-[40vh] overflow-y-auto`}
        >
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            Select Members
          </li>
          {allUser?.map((user) => (
            <li className="list-row" key={user._id}>
              <div>
                <img
                  className="size-10 rounded-box"
                  src={`${user.profilepic || userImage}`}
                />
              </div>
              <div>
                <div>{user.fullname}</div>
                <div className="text-xs font-semibold opacity-60">
                  joined at {onlyDate(user.createdAt)}
                </div>
              </div>
              <div className="btn btn-square btn-ghost">
                <input
                  type="checkbox"
                  name="people"
                  value={user._id}
                  onChange={(e)=>setPeople(val=>[...val,e.target.value])}
                  className="checkbox checkbox-neutral"
                />
              </div>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral mt-4 self-end"
        >
          {editVal?.groupName ? "edit" : "create"}
          {loading ? "..." : ""}
        </button>
        {loading && (
          <div className="flex items-center justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}
      </fieldset>
    </form>
  );
};

export default CreateGroupForm;
