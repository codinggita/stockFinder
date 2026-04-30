import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';

import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';
import authBg from '../assets/auth_bg.png';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
        role 
      });
      
      if (response.data.success) {
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }));
        toast.success(`Access Authorized.`);
        
        if (response.data.user.role === 'retailer') {
          navigate('/dashboard');
        } else {
          navigate('/marketplace');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Login" 
      subtitle="Enter secure gateway"
      image={authBg}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Pill Selection */}
        <div>
          <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-2">Role</p>
          <div className="flex gap-2">
            {['customer', 'retailer'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                  role === r 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-gray-600 border-white/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <InputField
            label="Email"
            placeholder="email@example.com"
            type="email"
            icon={Mail}
            error={errors.email}
            {...register('email')}
          />
          <InputField
            label="Password"
            placeholder="••••••••"
            type="password"
            icon={ShieldCheck}
            error={errors.password}
            {...register('password')}
          />
        </div>
        
        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} disabled={!isValid}>
            Sign In &rarr;
          </Button>
        </div>
        
        <div className="text-center pt-4">
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
            New user? <Link to="/register" className="text-primary hover:underline">Create Account Now</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
