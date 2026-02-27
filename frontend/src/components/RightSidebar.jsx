import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareMore, CircleArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useBearStore from '../store/store';

const RightSidebar = () => {
  const navigate = useNavigate();
  const { setShowUserSideBar, showUserSideBar, userAuth } = useBearStore(state => state);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`flex h-full w-full flex-col justify-center items-center bg-base-100 relative overflow-hidden p-6 ${
        (!showUserSideBar || !userAuth) ? 'flex' : 'hidden @md:flex'
      }`}
    >
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" />

      {/* Main Animated Icon */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative mb-8 p-8 bg-primary/10 rounded-3xl text-primary"
      >
        <MessageSquareMore size={80} strokeWidth={1.5} />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-2 right-2 text-secondary"
        >
          <Sparkles size={24} />
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <div className="flex flex-col items-center max-w-sm text-center z-10">
        <motion.div variants={itemVariants}>
          {!userAuth ? (
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to Chat-ON
            </h1>
          ) : (
            <h2 className="text-3xl font-bold mb-2">Ready to Connect?</h2>
          )}
        </motion.div>

        <motion.p variants={itemVariants} className="text-base-content/60 text-lg mb-8">
          {!userAuth 
            ? "Log in to join the conversation and connect with friends across the globe." 
            : "Select a contact from the sidebar to start a secure, end-to-end encrypted chat."}
        </motion.p>

        {/* Action Button */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {!userAuth ? (
            <button 
              className="btn btn-primary px-10 rounded-full shadow-lg shadow-primary/20 font-bold" 
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          ) : (
            !showUserSideBar && (
              <button
                onClick={() => setShowUserSideBar(true)}
                className="btn btn-outline btn-primary rounded-full gap-2 px-8 @md:hidden"
              >
                <CircleArrowLeft size={20} /> View All Contacts
              </button>
            )
          )}
        </motion.div>
      </div>

      {/* Trust Badge / Footer */}
      <motion.div 
        variants={itemVariants}
        className="absolute bottom-10 flex items-center gap-2 text-xs text-base-content/40 uppercase tracking-widest font-semibold"
      >
        <ShieldCheck size={16} />
        Secure & Encrypted
      </motion.div>
    </motion.div>
  );
};

export default RightSidebar;