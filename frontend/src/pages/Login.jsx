import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import useBearStore from '../store/store';
import SignupSkeleton from '../components/SignupSkeleton';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoader] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { userLogin } = useBearStore((state) => state);

  const login = async (data) => {
    setLoader(true);
    const userData = await userLogin(data);
    if (userData) {
      toast(`Welcome back, ${userData.fullname}`, {
        icon: "🙌",
        style: {
          borderRadius: '12px',
          background: 'var(--fallback-n,oklch(var(--n)/1))',
          color: 'var(--fallback-nc,oklch(var(--nc)/1))',
        },
        duration: 3000,
      });
      navigate('/');
    }
    setLoader(false);
  };

  return (
    <div className='w-full h-full flex'>
      {/* Left Side */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <LogIn className="w-7 h-7 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-base-content/60 mt-2">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit(login)} className="space-y-6">
            {/* Email Field */}
            <div className="form-control">
              <label className="label text-sm font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  {...register('email', { required: true })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label text-sm font-medium">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  className="input input-bordered w-full pl-10 pr-10 focus:input-primary transition-all duration-200" 
                  {...register('password', { required: true })} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit" 
              className="btn btn-primary w-full shadow-lg" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Logging in...
                </>
              ) : 'Login'}
            </motion.button>
          </form>

          {/* Bottom Link */}
          <p className="text-center text-sm text-base-content/60">
            Don't have an account?{' '}
            <button 
              className="link link-primary font-semibold no-underline hover:underline" 
              onClick={() => navigate('/signup')}
            >
              Sign up free
            </button>
          </p>
        </div>
      </motion.div>

      {/* Right Side*/}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='hidden lg:flex w-1/2 items-center flex-col justify-center p-12 relative overflow-hidden'
      >
        <motion.div
          animate={{ 
            y: [0, -15, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-md z-10"
        >
          <SignupSkeleton />
        </motion.div>

        <div className="text-center mt-12 z-10">
          <h2 className="text-2xl font-bold mb-2">Connect with your world</h2>
          <p className="text-base-content/60 max-w-xs mx-auto">
            Experience the fastest and most secure way to chat with your friends and colleagues.
          </p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      </motion.div>
    </div>
  );
};

export default Login;