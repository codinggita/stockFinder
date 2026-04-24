import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import FormWrapper from '../components/FormWrapper';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';

const schema = yup.object().shape({
  name: yup.string().required('Full name is required').min(3, 'Name must be at least 3 characters'),
  email: yup.string().email('Invalid email address').required('Work email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[A-Z])/, 'Must contain at least 1 uppercase letter')
    .matches(/(?=.*[0-9])/, 'Must contain at least 1 number')
    .matches(/(?=.*[!@#$%^&*])/, 'Must contain at least 1 special character'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  agreeTerms: yup.boolean().oneOf([true], 'You must agree to the terms'),
});

const calculateStrength = (password) => {
  if (!password) return { label: '', percent: 0, color: 'bg-gray-700' };
  let score = 0;
  if (password.length > 7) score += 1;
  if (password.match(/(?=.*[A-Z])/)) score += 1;
  if (password.match(/(?=.*[0-9])/)) score += 1;
  if (password.match(/(?=.*[!@#$%^&*])/)) score += 1;
  
  if (score < 2) return { label: 'WEAK', percent: 33, color: 'bg-red-500' };
  if (score < 4) return { label: 'MEDIUM', percent: 66, color: 'bg-yellow-500' };
  return { label: 'SECURE', percent: 100, color: 'bg-green-500' };
};

const CreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const passwordValue = watch('password');
  const strength = calculateStrength(passwordValue);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success('Account initialized successfully!');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper 
      title="Create Account" 
      subtitle="Access the next generation of retail intelligence."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="FULL NAME"
          placeholder="Enter your full name"
          icon={User}
          error={errors.name}
          {...register('name')}
        />
        
        <InputField
          label="WORK EMAIL"
          placeholder="name@retailer.com"
          type="email"
          icon={Mail}
          error={errors.email}
          {...register('email')}
        />
        
        <div className="mb-4">
          <InputField
            label="PASSWORD"
            placeholder="••••••••"
            type="password"
            icon={ShieldCheck}
            error={errors.password}
            {...register('password')}
          />
          {/* Password Strength Indicator */}
          <div className="mt-2">
            <div className="flex justify-between text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              <span>Password Strength</span>
              <span className={strength.percent === 100 ? 'text-green-500' : ''}>{strength.label}</span>
            </div>
            <div className="flex gap-1 h-1">
              {[33, 66, 100].map((threshold) => (
                <div 
                  key={threshold} 
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    strength.percent >= threshold ? strength.color : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <InputField
          label="CONFIRM PASSWORD"
          placeholder="••••••••"
          type="password"
          icon={ShieldCheck}
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />
        
        <div className="flex items-start mt-2 mb-6">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary focus:ring-offset-gray-900"
              {...register('agreeTerms')}
            />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="terms" className="text-gray-400">
              I agree to the <a href="#" className="text-white hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="text-white hover:text-primary transition-colors">Privacy Protocol</a>.
            </label>
            {errors.agreeTerms && (
              <p className="text-red-400 text-xs mt-1">{errors.agreeTerms.message}</p>
            )}
          </div>
        </div>
        
        <Button type="submit" isLoading={isLoading} disabled={!isValid}>
          Initialize Account &rarr;
        </Button>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Already a registered retailer? <Link to="/login" className="text-white font-semibold hover:text-primary transition-colors">Sign In</Link>
          </p>
        </div>
      </form>
    </FormWrapper>
  );
};

export default CreateAccount;
