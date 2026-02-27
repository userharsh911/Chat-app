import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageNav from "./MessageNav";
import SendMessages from "./SendMessages";
import useBearStore from "../store/store";
import MessagesToShow from "./MessagesToShow";
import { X, Maximize2 } from "lucide-react";
import useMessages from "../store/message.store";

const Chatbar = () => {
  const { showUserSideBar } = useBearStore((state) => state);
  const { imagePreview, setShowFullImage, setImagePreview } = useMessages((state) => state);

  const closePreview = () => {
    setShowFullImage(false);
    setImagePreview(false);
  };

  return (
    <div
      className={`flex flex-col h-full w-full bg-base-100 overflow-hidden relative transition-all duration-300 ${
        showUserSideBar ? "hidden @md:flex" : "flex"
      }`}
    >
      {/* 1. Header Section */}
      <MessageNav />

      {/* 2. Messages Display Area */}
      <div className="flex-1 overflow-y-auto relative bg-base-200/30">
        <MessagesToShow />
      </div>

      {/* 3. Image Preview Overlay */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col bg-base-300/90 backdrop-blur-md p-4"
          >
            <div className="flex justify-end p-2">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closePreview}
                className="btn btn-circle btn-ghost text-base-content"
              >
                <X size={28} />
              </motion.button>
            </div>

            <motion.div 
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="flex-1 flex items-center justify-center overflow-hidden pb-10"
            >
              <img
                src={imagePreview}
                alt="preview"
                className="max-h-full max-w-full object-contain rounded-xl shadow-2xl cursor-zoom-out border-4 border-base-100"
                onClick={closePreview}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Bottom Input Section */}
      <div className="bg-base-100 border-t border-base-content/5 px-2 py-1">
        <SendMessages />
      </div>
    </div>
  );
};

export default Chatbar;