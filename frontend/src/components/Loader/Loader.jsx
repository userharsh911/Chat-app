import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-[9999] bg-base-100/60 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        
        {/* 1. Outer Glowing Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-t-2 border-r-2 border-primary rounded-full absolute opacity-20 blur-[2px]"
        />

        {/* 2. Main Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 border-4 border-transparent border-t-primary border-b-secondary rounded-full shadow-[0_0_15px_rgba(var(--p),0.5)]"
        />

        {/* 3. Reverse Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-transparent border-l-accent border-r-accent rounded-full absolute"
        />

        {/* 4. Center Pulsing Core */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_white]"
        />
      </div>

      {/* 5. Animated Loading Text */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-bold tracking-[0.3em] text-base-content/80 uppercase"
        >
          Connecting
        </motion.h2>
        
        {/* Animated Dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -6, 0],
                backgroundColor: ["#570df8", "#f000b8", "#570df8"], // Primary to Secondary
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
    </div>
  );
}