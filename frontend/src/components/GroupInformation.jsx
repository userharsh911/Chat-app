import React, { useEffect } from "react";
import useGroups from "../store/group.store";
import userImage from "../assets/user.png";
import { onlyDate } from "../constant/dateTime";
import useBearStore from "../store/store";
import { UserRoundPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
const GroupInformation = () => {
    
  const { handleSubmit, register } = useForm();
  const {
    getSelectedGroupInfo,
    selectedGroup,
    selectedGroupInfo,
    removeMemberToGroup,
    addMemberToGroup,
    delGroup,
  } = useGroups((state) => state);
  const { allUser, userAuth } = useBearStore((state) => state);
  useEffect(() => {
    if(selectedGroup){
        getSelectedGroupInfo(selectedGroup?._id)
    }
    // return ()=> unsubscribe()
  }, [getSelectedGroupInfo, selectedGroup]);

  const removePeople = async (id) => {
    toast.promise(
        removeMemberToGroup(id),
        {
          loading: "Removing..., Do not Close",
          success: "Removed successfully!",
          error: "Something went wrong!"
        }
    )
  };

  const addPerson = async (data) => {
    if(data.people.length>0){
        toast.promise(
            addMemberToGroup(data.people),
            {
          loading: "Adding..., Do not Close",
          success: "Added successfully!",
          error: "Something went wrong!"
        }
        )
        
    }
  };
  const deleteGroup = async()=>{
    toast.promise(
            delGroup(),
            {
          loading: "Deleting..., Do not Close",
          success: "Group Deleted successfully!",
          error: "Something went wrong!"
        }
        )
  }
  return (
    <div className="p-3 h-full">
      <ul className="list bg-base-100 rounded-box shadow-md h-[90%] overflow-y-auto">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Peoples in group
        </li>

        {selectedGroupInfo?.adminInfo?.map((user) => (
          <li className="list-row" key={user._id}>
            <div className="avatar h-10 w-10 rounded-full overflow-hidden">
              <img src={user.profilepic || userImage} />
            </div>
            <div>
              <div>{user.fullname}</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Admin
              </div>
            </div>
          </li>
        ))}
        {selectedGroupInfo?.people?.map((user) => (
          <li className="list-row" key={user._id}>
            <div className="avatar h-10 w-10 rounded-full overflow-hidden">
              <img src={user.profilepic || userImage} />
            </div>
            <div>
              <div>{user.fullname}</div>
              {/* <div className="text-xs uppercase font-semibold opacity-60">Remaining Reason</div> */}
            </div>
            {selectedGroup?.adminInfo.includes(userAuth._id) && <button
              className="btn bg-base-content text-base-100 btn-ghost"
              onClick={() => removePeople(user._id)}
            >
              remove
            </button>}
          </li>
        ))}
      </ul>
      {selectedGroup?.adminInfo.includes(userAuth._id) && <div className="flex justify-center items-center gap-3 ">
        <label className="btn mt-2 text-lg font-semibold" htmlFor="add_people">
            <UserRoundPlus /> Members
        </label>
        <button className="btn mt-2" onClick={deleteGroup}>
            Delete Group
        </button>
      </div>}
      <input type="checkbox" id="add_people" className="modal-toggle" />
      <div className="modal items-start w-full max-w-5x" role="dialog">
        <div className="modal-box z-40 self-center">
          <form onSubmit={handleSubmit(addPerson)}>
            <ul
              className={`list bg-base-100 rounded-box shadow-md h-[40vh] overflow-y-auto px-3 pb-3`}
            >
              <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                Add peoples
              </li>
              {allUser?.map((user) => (
                <li
                  className={` ${
                    selectedGroup?.people.includes(user._id) && "hidden"
                  } list-row`}
                  key={user._id}
                >
                  <div className="avatar rounded-full w-10 h-10 overflow-hidden">
                    <img src={`${user.profilepic || userImage}`} />
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
                      className="checkbox checkbox-neutral"
                      {...register("people")}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn w-full mt-3" type="submit">
              Add
            </button>
          </form>
        </div>
        <label
          className="modal-backdrop h-screen w-screen absolute"
          htmlFor="add_people"
        >
          Close
        </label>
      </div>
    </div>
  );
};

export default GroupInformation;
