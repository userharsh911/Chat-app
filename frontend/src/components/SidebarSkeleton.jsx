import React from 'react';
import { motion } from 'framer-motion';

const SidebarSkeleton = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full px-2"
    >
      {arr.map((i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="w-full flex items-center gap-4 mb-6 mt-2 p-2"
        >
          {/* Avatar Skeleton with pulse shine */}
          <div className="relative shrink-0">
            <div className="skeleton h-12 w-12 rounded-full ring-2 ring-base-content/5"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-base-300 rounded-full border-2 border-base-100"></div>
          </div>

          {/* Text Skeletons */}
          <div className="flex flex-col gap-3 w-full">
            {/* Name placeholder */}
            <div className="skeleton h-3 w-24 rounded-lg opacity-80"></div>
            
            {/* Subtext placeholder */}
            <div className="skeleton h-2 w-full max-w-[140px] rounded-lg opacity-40"></div>
          </div>

          {/* Optional: Side dot */}
          <div className="skeleton h-2 w-6 rounded-full opacity-20 ml-auto mr-2"></div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SidebarSkeleton;