import useMessages from "../store/message.store";
import userImage from "../assets/user.png";
import { ImCross } from "react-icons/im";
import useBearStore from "../store/store";
import { Info } from 'lucide-react';
import useGroups from "../store/group.store";
import CreateGroupForm from "./CreateGroupForm";
const MessageNav = () => {
  const { selectedUser, setSelectedUser } = useMessages((state) => state);
  const { selectedGroup, setSelectedGroup, setShowInfo,showInfo } = useGroups((state) => state);
  const { onlineUserIds, userAuth } = useBearStore((state) => state);
  return (
    <label htmlFor="editModal">
      <div className="bg-base-200 w-full flex justify-between px-5 items-center">
        <div className="flex gap-3 items-center pt-3 pb-2">
          <div className="avatar ">
            <div
              className={`${
                onlineUserIds.includes(selectedUser?._id) ? "ring-primary" : ""
              } ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2`}
            >
              <img
                src={
                  selectedUser?.profilepic ||
                  selectedGroup?.profilepic ||
                  userImage
                }
              />
            </div>
          </div>
          <div className="font-semibold capitalize">
            {selectedUser?.fullname || selectedGroup?.groupName} <br />{" "}
            {selectedGroup && (
              <span className="text-sm opacity-75">
                {!selectedGroup&& (onlineUserIds.includes(selectedUser?._id)
                  ? "Online"
                  : "Offline")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-4">
            {selectedGroup && <button
                onClick={()=>setShowInfo(!showInfo)}
                className="cursor-pointer"
            >
                <Info />
            </button>}
          <button
            onClick={() => {
              setSelectedUser(null);
              setSelectedGroup(null);
            }}
            className="cursor-pointer"
          >
            <ImCross />
          </button>
        </div>
        <input type="checkbox" id={selectedGroup?.adminInfo.includes(userAuth._id) && 'editModal'} className="modal-toggle" />
        <div className="modal items-start w-full max-w-5x" role="dialog">
          <div className="$$modal-box z-40 self-center">
            <CreateGroupForm
              groupName={selectedGroup?.groupName}
              onlyAdminCanMessage={selectedGroup?.onlyAdminCanMessage}
              grpId={selectedGroup?._id}
            />
          </div>
          <label
            className="modal-backdrop h-screen w-screen absolute"
            htmlFor="editModal"
          >
            Close
          </label>
        </div>
      </div>
    </label>
  );
};

export default MessageNav;
