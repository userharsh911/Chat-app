import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMessages from "../store/message.store";
import dateTime from "../constant/dateTime";
import userImage from "../assets/user.png";
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
  const { selectedGroup, showInfo } = useGroups((state) => state);

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
    if (selectedGroup) getMessages(selectedGroup._id);

    subscribeToMessage();
    return () => unSubscribeFromMessage();
  }, [getMessages, selectedUser, selectedGroup, subscribeToMessage, unSubscribeFromMessage]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, isMessageGet]);

  const bubbleVariants = {
    initial: (isMe) => ({
      opacity: 0,
      scale: 0.8,
      x: isMe ? 20 : -20,
    }),
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  return (
    <div className="flex w-full h-full bg-base-100 overflow-hidden relative">
      <div className={`flex flex-col h-full transition-all duration-500 ease-in-out ${showInfo ? 'sm:w-1/2 w-0 overflow-hidden' : 'w-full'}`}>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-base-content/5">
          {!isMessageGet ? (
            <AnimatePresence mode="popLayout">
              {messages?.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="h-full flex flex-col justify-center items-center opacity-40"
                >
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Say hello to start the conversation!</p>
                </motion.div>
              ) : (
                messages.map((item, index) => {
                  const isMe = item?.senderId._id === userAuth._id;
                  return (
                    <motion.div
                      key={item._id}
                      custom={isMe}
                      variants={bubbleVariants}
                      initial="initial"
                      animate="animate"
                      layout
                      className={`chat ${isMe ? "chat-end" : "chat-start"}`}
                    >
                      <div className="chat-image avatar">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                        >
                          <img alt="avatar" src={item?.senderId.profilepic || userImage} />
                        </motion.div>
                      </div>
                      
                      <div className="chat-header mb-1 text-xs font-semibold opacity-50 px-1">
                        {item?.senderId?.fullname}
                      </div>

                      <div className={`chat-bubble shadow-md w-20 md:w-56 ${
                        isMe 
                        ? "bg-primary text-primary-content" 
                        : "bg-base-200 text-base-content"
                      }`}>
                        {item?.image && (
                          <motion.img
                            whileHover={{ opacity: 0.9 }}
                            onClick={() => {
                              setShowFullImage(true);
                              setImagePreview(item?.image);
                            }}
                            src={item?.image}
                            alt="attachment"
                            className="rounded-lg  mb-2 max-w-full cursor-zoom-in border border-black/10"
                          />
                        )}
                        <p className="text-sm sm:text-base leading-relaxed">{item?.text}</p>
                      </div>

                      <div className="chat-footer mt-1">
                        <time className="text-[10px] opacity-50 uppercase font-bold">
                          {dateTime(item.createdAt)}
                        </time>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          ) : (
            <SkeletonOfMessage />
          )}
          <div ref={scrollRef} className="h-2" />
        </div>
      </div>

      {/* Side Information Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full sm:w-1/2 bg-base-100 border-l border-base-content/10 z-10 shadow-2xl"
          >
            <GroupInformation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesToShow;