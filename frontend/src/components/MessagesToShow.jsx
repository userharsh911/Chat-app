import React from "react";
import { useRef } from "react";
import useMessages from "../store/message.store";
import dateTime from "../constant/dateTime";
import { Minimize2 } from "lucide-react";
import userImage from "../assets/user.png";
import { useEffect } from "react";
import SkeletonOfMessage from "./SkeletonOfMessage";
import useBearStore from "../store/store";
import useGroups from "../store/group.store";
import GroupInformation from "./GroupInformation";
const MessagesToShow = () => {
  const scrollRef = useRef(null);
  const {
    getMessages,
    selectedUser,
    setImagePreview,
    isMessageGet,
    messages,
    setShowFullImage,
    subscribeToMessage,
    unSubscribeFromMessage,
  } = useMessages((state) => state);

  const { userAuth } = useBearStore((state) => state);
  const { selectedGroup,showInfo } = useGroups((state) => state);
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
    if (selectedGroup) {
      getMessages(selectedGroup._id);
    }

    subscribeToMessage();
    return () => unSubscribeFromMessage();
  }, [
    getMessages,
    selectedUser,
    subscribeToMessage,
    unSubscribeFromMessage,
    selectedGroup,
  ]);
  useEffect(() => {
    if (!isMessageGet) {
      scrollRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedUser, isMessageGet, messages]);
  return (
    <>
      {!isMessageGet ? (
        <div className="flex w-full h-4/5">
          <div className={` ${showInfo ? 'sm:w-1/2 w-0' : 'w-full'} h-full bg-base-content overflow-y-scroll text-base-300`}>
            {messages?.length == 0 ? (
              <div className="w-full h-full flex justify-center items-center">
                <p className="text-info font-semibold">No messages yet</p>
              </div>
            ) : (
              messages?.map((item) => (
                <div
                  key={item._id}
                  className={`chat ${
                    item?.senderId._id == userAuth._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="not found"
                        src={item?.senderId.profilepic || userImage}
                      />
                    </div>
                  </div>
                  <div className="chat-header">{item?.senderId?.fullname}</div>
                  <div className="chat-bubble bg-primary max-w-50 text-primary-content">
                    <img
                      onClick={() => {
                        setShowFullImage(true);
                        setImagePreview(item?.image);
                      }}
                      src={item?.image}
                      alt=""
                      className={`${
                        item?.image ? "block" : "hidden"
                      } cursor-zoom-in`}
                    />
                    <p>{item?.text}</p>
                  </div>
                  <div className="chat-footer opacity-70 ">
                    <time className="text-xs opacity-70 text-base-100">
                      {dateTime(item.createdAt)}
                    </time>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef}></div>
          </div>
          <div className={`${showInfo ? 'block sm:w-1/2' : 'hidden'} h-full w-full`}>
            <GroupInformation/>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-base-content ps-3 overflow-scroll text-base-300">
          <SkeletonOfMessage />
        </div>
      )}
    </>
  );
};

export default MessagesToShow;
