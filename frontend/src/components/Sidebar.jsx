import React, { useEffect } from "react";
import useBearStore from "../store/store";
import userImage from "../assets/user.png";
import useMessages from "../store/message.store";
import { useState } from "react";
import { SquareX } from "lucide-react";
import { Contact } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarSkeleton from "./SidebarSkeleton";
import useGroups from "../store/group.store";
import CreateGroupForm from "./CreateGroupForm";
const Sidebar = () => {
  const {
    allGroups,
    setSelectedGroup,
    getAllGroup,
    setShowInfo
  } = useGroups(state=>state)
  const {
    getAllUsers,
    allUser,
    onlineUserIds,
    userAuth,
    showUserSideBar,
    setShowUserSideBar,
  } = useBearStore((state) => state);
  
  const { setSelectedUser } = useMessages((state) => state);
  const [checkOnline, setCheckOnline] = useState(false);
  const [actualOnline, setActualOnline] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllUsers().then(() => {
      setLoading(false);
    });
  }, [getAllUsers, onlineUserIds]);

  useEffect(() => {
    onlineUserIds?.length > 0 &&
      setActualOnline(
        onlineUserIds.filter((id) => userAuth.friends.includes(id))
      );
  }, [onlineUserIds, userAuth]);

  useEffect(() => {
    setLoading(true);
    getAllGroup().then(() => {
      setLoading(false);
    });
  }, [getAllGroup]);

  return (
    <aside
      className={`overflow-hidden ${
        showUserSideBar
          ? "@md:w-2/5 w-full px-3"
          : "hidden @md:w-2/5 @md:block px-3"
      } h-full bg-neutral rounded-lg shadow-lg`}
    >
      <div className="flex gap-3 py-3 text-xl items-center text-neutral-content">
        <div>
          <Contact />
        </div>
        <p className="font-semibold ">Contacts</p>
      </div>
      <div className="mb-2 h-[85%]">
        <div className="w-full @md:hidden block">
          <div
            onClick={() => setShowUserSideBar(!showUserSideBar)}
            className=" pt-2 w-full flex flex-col"
          >
            <div>
              <SquareX className="float-end text-neutral-content" />
            </div>
          </div>
        </div>
        {/* name of each tab group should be unique */}
        <div className="tabs tabs-lift h-[95%]">
          <label className="tab  font-bold opacity-100" onClick={()=>setSelectedGroup(null)}>
            <input type="radio" name="my_tabs_4" defaultChecked/>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4 me-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
            Friends
          </label>
          <div className="tab-content bg-base-100 h-full">
            <div className="w-full pt-2 flex justify-between">
              <label
                htmlFor="onlineuser"
                className="flex gap-2.5 cursor-pointer ps-4 pb-4"
              >
                <input
                  type="checkbox"
                  id="onlineuser"
                  className="toggle toggle-neutral text-neutral-500 bg-neutral-content"
                  onClick={() => setCheckOnline((val) => !val)}
                />
                <p className=" font-semibold flex gap-1 text-base-content ">
                  Online <span className="">({actualOnline.length}) </span>
                </p>
              </label>
            </div>
            {checkOnline && actualOnline?.length < 1 && (
              <div className="w-full text-center text-base-content pb-3 opacity-65 font-semibold mt-2">
                <p className="">No online user at this time</p>
              </div>
            )}
            {allUser?.length < 1 && (
              <div className="w-full text-center text-neutral-content opacity-65 font-semibold mt-2">
                <p className="py-3 text-neutral-content opacity-65">
                  You have no friends yet Add people to chat
                </p>
                <button
                  className="btn btn-info"
                  onClick={() => navigate("/add-friends")}
                >
                  Add friends
                </button>
              </div>
            )}
            <div className="overflow-y-auto h-[85%]">
              <div className="flex flex-col gap-4 ">
                {allUser?.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => {
                      setShowInfo(null)
                      setSelectedUser(user);
                      setShowUserSideBar(false);
                    }}
                    className={`${
                      (checkOnline &&
                        (actualOnline?.includes(user._id)
                          ? "flex"
                          : "hidden")) ||
                      "flex"
                    } w-full cursor-pointer bg-base-100 card-xs shadow-sm px-4 py-2`}
                    // onClick={()=>}
                  >
                    <div
                      className={`avatar ${
                        actualOnline?.includes(user._id)
                          ? "avatar-online"
                          : "avatar-offline"
                      }`}
                    >
                      <div className="w-10 rounded-full border-2">
                        <img src={user.profilepic || userImage} />
                      </div>
                    </div>
                    <div className=" @md:hidden @xl:block">
                      <div className="card-body">
                        <h2 className="card-title text-base-content text-pretty">
                          {user.fullname}
                        </h2>
                      </div>
                    </div>
                  </button>
                ))}
                {loading && (
                  <div className="ps-4">
                    <SidebarSkeleton />
                  </div>
                )}
              </div>
            </div>
          </div>

          <label className="tab font-bold opacity-100" onClick={()=>setSelectedUser(null)}>
            <input type="radio" name="my_tabs_4" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4 me-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
              />
            </svg>
            Groups
          </label>
          <div className="tab-content bg-base-100 h-full">
            {allGroups?.length < 1 && (
              <div className="w-full text-center text-neutral-content opacity-65 font-semibold mt-2">
                <p className="py-3 text-neutral-content opacity-65">
                  You have no Groups yet
                </p>
              </div>
            )}
                
            <div className="overflow-y-auto h-[85%]">
              <div className="flex flex-col gap-4 ">
                {allGroups?.map((grp) => (
                  <button
                    key={grp._id}
                    onClick={() => {
                      setSelectedGroup(grp);
                      setShowUserSideBar(false);
                    }}
                    className={`w-full flex cursor-pointer card-xs shadow-sm px-4 py-2`}
                    // onClick={()=>}
                  >
                    <div className={``}>
                      <div className="w-10 h-10 rounded-full overflow-hidden object-center avatar border-2">
                        <img src={grp.profilepic || userImage}/>
                      </div>
                    </div>
                    <div className=" @md:hidden @xl:block">
                      <div className="card-body">
                        <h2 className="card-title text-base-content text-pretty">
                          {grp.groupName}
                        </h2>
                      </div>
                    </div>
                  </button>
                ))}
                {loading && (
                  <div className="ps-4">
                    <SidebarSkeleton />
                  </div>
                )}
              </div>
            </div>
            <div className="ms-3">
              {/* The button to open modal */}
              <label htmlFor="my_modal_7" className="btn">create Groups</label>

              {/* Put this part before </body> tag */}
              <input type="checkbox" id="my_modal_7" className="modal-toggle" />
              <div className="modal items-start w-full max-w-5x" role="dialog">
                <div className="$$modal-box z-40 self-center">
                  <CreateGroupForm/>
                </div>
                <label className="modal-backdrop h-screen w-screen absolute" htmlFor="my_modal_7">Close</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
