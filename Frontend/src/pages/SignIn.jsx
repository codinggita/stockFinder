import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import FormWrapper from '../components/FormWrapper';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Work email is required'),
  password: yup.string().required('Password is required'),
});

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success('Successfully authenticated!');
        // navigate('/dashboard'); // Normally redirect here
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper 
      title="Access Platform" 
      subtitle="Authenticate to your retail dashboard."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <InputField
          label="WORK EMAIL"
          placeholder="name@retailer.com"
          type="email"
          icon={Mail}
          error={errors.email}
          {...register('email')}
        />
        
        <div className="mb-6">
          <InputField
            label="PASSWORD"
            placeholder="••••••••"
            type="password"
            icon={ShieldCheck}
            error={errors.password}
            {...register('password')}
          />
          <div className="flex justify-end mt-1">
             <a href="#" className="text-xs text-primary hover:text-white transition-colors">Forgot Password?</a>
          </div>
        </div>
        
        <Button type="submit" isLoading={isLoading} disabled={!isValid}>
          Authenticate &rarr;
        </Button>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            New to the platform? <Link to="/register" className="text-white font-semibold hover:text-primary transition-colors">Create Account</Link>
          </p>
        </div>
      </form>
    </FormWrapper>
  );
};

export default SignIn;
