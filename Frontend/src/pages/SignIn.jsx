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
import loginBg from '../assets/login_bg.png';

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
        dispatch({ type: 'stores/clearMyStore' }); // Clear any stale store state
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
      image={loginBg}
      reverse={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Pill Selection */}
        <div className="bg-sectionSurface p-1.5 rounded-2xl border border-borderCustom flex gap-1.5">
          {['customer', 'retailer'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                role === r 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-primary/20' 
                  : 'bg-transparent text-subtext hover:text-textMain'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <InputField
            label="Email Identity"
            placeholder="name@nexus.com"
            type="email"
            icon={Mail}
            error={errors.email}
            {...register('email')}
          />
          <InputField
            label="Security Protocol"
            placeholder="••••••••"
            type="password"
            icon={ShieldCheck}
            error={errors.password}
            {...register('password')}
          />
        </div>
        
        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} disabled={!isValid}>
            Authorize Access
          </Button>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-[10px] text-subtext font-bold uppercase tracking-[0.2em]">
            New Entity? <Link to="/register" className="text-accent hover:text-accent/80 transition-colors ml-2 underline underline-offset-4 decoration-accent/30">Initialize Profile</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
