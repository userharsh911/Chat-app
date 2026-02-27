import React from 'react';
import { motion } from 'framer-motion';
import { Send, MoreVertical, ShieldCheck, CheckCheck } from 'lucide-react';

const DummyChat = () => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.4, delayChildren: 0.2 } 
    }
  };

  const bubbleVariants = {
    initial: { opacity: 0, scale: 0.8, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-sm mx-auto rounded-3xl shadow-2xl overflow-hidden bg-base-100 border border-base-content/5 relative group"
    >
      {/* 1. Header: */}
      <div className="px-5 py-4 flex items-center justify-between bg-base-100/80 backdrop-blur-md border-b border-base-content/5 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format" 
              alt="John Doe" 
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-primary/20"
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-base-100 animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-sm tracking-tight">John Doe</h3>
              <ShieldCheck size={14} className="text-primary" />
            </div>
            <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wider">Online</p>
          </div>
        </div>
        <button className="btn btn-ghost btn-xs btn-circle opacity-50">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* 2. Messages: Pattern Background */}
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="px-4 py-8 space-y-6 bg-base-200/30 min-h-[300px] relative overflow-hidden"
      >
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />

        {/* Incoming message */}
        <motion.div variants={bubbleVariants} className="flex justify-start">
          <div className="bg-base-100 px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm border border-base-content/5">
            <p className="text-sm leading-relaxed">
              How are you doing? Just wanted to check in and see how the project is coming along.
            </p>
            <span className="text-[10px] opacity-40 mt-1.5 block">12:30 PM</span>
          </div>
        </motion.div>

        {/* Outgoing message */}
        <motion.div variants={bubbleVariants} className="flex justify-end">
          <div className="bg-primary px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg shadow-primary/20">
            <p className="text-sm text-primary-content leading-relaxed font-medium">
              I'm doing great, thanks for asking! The project is progressing well.
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[10px] text-primary-content/70">12:32 PM</span>
              <CheckCheck size={12} className="text-primary-content/80" />
            </div>
          </div>
        </motion.div>

        {/* System Message */}
        <motion.div variants={bubbleVariants} className="text-center">
            <span className="bg-base-content/5 text-[10px] px-3 py-1 rounded-full opacity-50 font-medium">Encryption Active</span>
        </motion.div>
      </motion.div>

      {/* 3. Input Area: */}
      <div className="px-4 py-4 bg-base-100 border-t border-base-content/5">
        <div className="flex items-center bg-base-200/50 rounded-2xl px-4 py-1.5 border border-base-content/5">
          <input
            type="text"
            value="Exploring possibilities..."
            readOnly
            className="flex-1 bg-transparent py-2 text-sm outline-none opacity-60 cursor-default"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-primary rounded-xl text-primary-content shadow-md shadow-primary/30"
          >
            <Send size={16} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DummyChat;