import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import useBearStore from './store/store'
import Loader from './components/Loader/Loader'
import { Toaster } from 'react-hot-toast'
import useTheme from './store/userTheme'
const App = () => {
  const {ischeckAuth,loader} = useBearStore((state)=>state)
  const {changeTheme,theme} = useTheme((state)=>state)
  useEffect(()=>{
    ischeckAuth();
  },[ischeckAuth])
  useEffect(()=>{
    document.getElementsByTagName('html')[0].setAttribute('data-theme',theme)
  },[changeTheme,theme])
  return (
    <div className="min-h-screen flex relative w-full flex-col">
      <div>
        <Toaster/>
      </div>
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loader Overlay */}
        {loader && (
          <div className="absolute inset-0 z-50">
            <Loader />
          </div>
        )}
        
        {/* Main Content */}
        <main className={`transition-all w-full lg:w-5/6 mx-auto px-1 py-6  duration-300 ${loader ? 'blur-[2px] pointer-events-none' : ''}`}>
          <Outlet/>
        </main>
      </div>
      
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}

export default App