import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header/Header';
import useBearStore from './store/store';
import Loader from './components/Loader/Loader';
import { Toaster } from 'react-hot-toast';
import useTheme from './store/userTheme';

const App = () => {
  const { ischeckAuth, loader } = useBearStore((state) => state);
  const { changeTheme, theme } = useTheme((state) => state);

  useEffect(() => {
    ischeckAuth();
  }, [ischeckAuth]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen overflow-hidden flex relative w-full flex-col bg-base-100 text-base-content transition-colors duration-300">
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        
        {/* Loader Overlay*/}
        <AnimatePresence>
          {loader && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-base-100/40"
            >
              <Loader />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`transition-all flex-1 w-full lg:w-5/6 mx-auto px-4 py-6 duration-300 z-10 ${loader ? 'blur-[4px] pointer-events-none' : ''}`}
        >
          <Outlet/>
        </motion.main>
      </div>
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Primary Blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-20 dark:opacity-10"
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-secondary rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10"
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] left-[30%] w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-[90px] opacity-15 dark:opacity-5"
        />
      </div>
    </div>
  );
}

export default App;