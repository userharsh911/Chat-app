import React from 'react';
import { motion } from 'framer-motion';
import daisyThemes from '../constant';
import useTheme from '../store/userTheme';
import DummyChat from '../DummyChat/DummyChat';

const Settings = () => {
  const { changeTheme, theme } = useTheme((state) => state);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto pb-10"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-base-content">Choose Theme</h1>
        <p className="text-sm text-base-content/70">
          Customize your chat interface to match your vibe.
        </p>
      </div>

      {/* Theme Selection Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4"
      >
        {daisyThemes?.map((t) => (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeTheme(t)}
            key={t}
            className={`flex flex-col items-center gap-3 p-3 rounded-2xl transition-colors duration-200 outline-none
              ${
                theme === t
                  ? 'bg-base-200 ring-2 ring-primary shadow-md'
                  : 'bg-base-100 hover:bg-base-200/50 hover:shadow-sm border border-base-content/10'
              }
            `}
          >
            <div 
              className="flex gap-1 h-12 w-full p-2 rounded-xl shadow-sm border border-base-content/10" 
              data-theme={t}
              style={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))' }} // Ensures the mini box takes the theme's base-100
            >
              <div className="h-full w-full rounded-md bg-primary"></div>
              <div className="h-full w-full rounded-md bg-secondary"></div>
              <div className="h-full w-full rounded-md bg-accent"></div>
              <div className="h-full w-full rounded-md bg-neutral"></div>
            </div>
            
            <span className={`text-xs font-medium capitalize ${theme === t ? 'text-primary' : 'text-base-content/80'}`}>
              {t}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Preview Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 w-full max-w-4xl mx-auto"
      >
        <div className="bg-base-200/50 backdrop-blur-sm rounded-3xl p-6 border border-base-content/5 shadow-xl">
          <h2 className="text-center text-2xl font-semibold mb-6 text-base-content">
            Live Preview
          </h2>
          <div className="bg-base-100 rounded-2xl overflow-hidden shadow-sm border border-base-content/10">
            <DummyChat />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;