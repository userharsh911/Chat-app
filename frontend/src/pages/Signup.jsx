import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import useBearStore from '../store/store';
import toast from 'react-hot-toast';
import SignupSkeleton from '../components/SignupSkeleton';

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { userSignup, userLogin } = useBearStore(state => state);
  const [loading, setLoading] = useState(false);
  const password = watch("password");

  const signup = async (data) => {
    setLoading(true);
    const { fullname, password, email } = data;
    const responseData = await userSignup({ fullname, password, email });

    if (responseData) {
      const loggedUser = await userLogin({ email, password });
      if (loggedUser) {
        toast.success(`Welcome ${fullname}`);
        navigate("/");
      } else {
        toast.success('Account created successfully');
        navigate('/login');
      }
    }
    setLoading(false);
  };

  const validateErrors = () => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0].message;
      toast.error(firstError);
    }
  };

  return (
    <div className='w-full h-full flex'>
      {/* Left Side: Form */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Icon Section */}
          <div className='text-center'>
            <motion.div 
              whileHover={{ rotate: 15 }}
              className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4'
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
            <p className="text-base-content/60 mt-2">Get started with your free account</p>
          </div>

          <form onSubmit={handleSubmit(signup)} className="space-y-5">
            {/* Full Name */}
            <div className="form-control">
              <label className="label text-sm font-medium">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  {...register('fullname', {
                    required: "Full name is required",
                    pattern: { value: /^[A-Za-z]+(?: [A-Za-z]+)*$/, message: "Enter a valid name" }
                  })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label text-sm font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  {...register('email', {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                  })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label text-sm font-medium">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  {...register('password', {
                    required: "Password is required",
                    minLength: { value: 8, message: "Must be at least 8 characters" }
                  })}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  {...register('confirm_password', {
                    required: 'Please confirm password',
                    validate: (value) => value === password || "Passwords do not match"
                  })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`btn btn-primary w-full shadow-lg transition-all ${loading ? 'opacity-80' : ''}`}
              disabled={loading}
              onClick={validateErrors}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : 'Sign Up'}
            </motion.button>
          </form>

          <p className="text-center text-base-content/60 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className='link link-primary font-semibold no-underline hover:underline'
            >
              Login
            </button>
          </p>
        </div>
      </motion.div>

      {/* Right Side */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='hidden lg:flex w-1/2 items-center flex-col justify-center p-12 overflow-hidden'
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-md"
        >
          <SignupSkeleton />
        </motion.div>
        
        <div className="text-center mt-12 max-w-sm">
          <h3 className="text-2xl font-bold mb-2">Join our community</h3>
          <p className="text-base-content/60">
            Connect with friends, share moments, and stay in touch with the people who matter most.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;