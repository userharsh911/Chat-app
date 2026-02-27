import React from 'react';
import { motion } from 'framer-motion';

const SkeletonOfMessage = () => {
  const arr = [1, 2, 3, 4, 5, 6];

  const containerVariants = {
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 p-4 overflow-hidden"
    >
      {arr.map((i) => {
        const isMe = i % 2 !== 0;

        return (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`chat ${isMe ? "chat-end" : "chat-start"} w-full`}
          >
            {/* Avatar Skeleton */}
            <div className="chat-image avatar">
              <div className="skeleton w-10 h-10 rounded-full shrink-0 border-2 border-base-200"></div>
            </div>

            {/* Header (Name/Time) */}
            <div className="chat-header mb-1 flex gap-2 items-center">
              <div className="skeleton h-2 w-16 rounded-full opacity-50"></div>
              <div className="skeleton h-2 w-10 rounded-full opacity-30"></div>
            </div>

            {/* Message Bubble Skeleton */}
            <div 
              className={`chat-bubble bg-transparent p-0 shadow-none`}
            >
              <div 
                className={`skeleton h-12 rounded-2xl ${
                  isMe 
                    ? "w-48 sm:w-64 bg-primary/10 rounded-tr-none" 
                    : "w-40 sm:w-56 bg-base-300/50 rounded-tl-none"
                }`}
              ></div>
            </div>

            {/* Footer (Status/Seen) */}
            <div className="chat-footer opacity-50 mt-1">
              <div className="skeleton h-2 w-8 rounded-full"></div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SkeletonOfMessage;