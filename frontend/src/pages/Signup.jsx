import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
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
    if (errors) {
      if (errors.fullname) toast.error(errors.fullname.message);
      else if (errors.email) toast.error(errors.email.message);
      else if (errors.password) toast.error(errors.password.message);
      else if (errors.confirm_password) toast.error(errors.confirm_password.message);
    }
  };

  return (
    <div className='w-full min-h-screen flex'>
      <div className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center p-1 sm:p-6">
        <div className="flex flex-col justify-center w-full max-w-md">
          <div className="mx-auto bg-base-100 p-6 rounded-xl shadow-2xl w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Create Your Account</h2>

            <form onSubmit={handleSubmit(signup)} className="space-y-4">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full"
                  {...register('fullname', {
                    required: { value: true, message: "Full name can't be empty" },
                    pattern: {
                      value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                      message: "Enter a valid full name (First and Last name)",
                    },
                  })}
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="example@mail.com"
                  className="input input-bordered w-full"
                  {...register('email', {
                    required: { value: true, message: "Email address can't be empty" },
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address"
                    }
                  })}
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full"
                  {...register('password', {
                    required: { value: true, message: "Password can't be empty" },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must be 8+ chars, include uppercase, lowercase, number & special character"
                    }
                  })}
                />
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full"
                  {...register('confirm_password', {
                    required: { value: true, message: 'Confirm your password' },
                    validate: (value) => value === password || "Passwords do not match"
                  })}
                />
              </div>

              {/* Submit Button */}
              <div className="form-control">
                <button
                  className="btn btn-primary w-full"
                  disabled={loading}
                  onClick={validateErrors}>
                  {loading ? 'Signing...' : 'Sign Up'}
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              )}
            </form>

            {/* Already have account */}
            <p className="text-center mt-4 text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className='text-blue-500 hover:text-blue-600 cursor-pointer'
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className='w-full hidden lg:w-1/2 bg-gray-950 md:flex items-center flex-col justify-center p-6'>
        <SignupSkeleton />
        <p className="text-center mt-5 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold text-lg">
          Create an account & join our amazing community <span className='text-yellow-400'>✨</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
