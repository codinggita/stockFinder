import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';
import registerBg from '../assets/register_bg.png';
import SEO from '../components/SEO';

const schema = yup.object().shape({
  name: yup.string().required('Required').min(3, 'Too short'),
  email: yup.string().email('Invalid').required('Required'),
  password: yup.string().required('Required').min(8, 'Min 8 chars'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mismatch').required('Required'),
  agreeTerms: yup.boolean().oneOf([true], 'Must agree'),
});

const calculateStrength = (password) => {
  if (!password) return { label: '', percent: 0, color: 'bg-white/5' };
  let score = 0;
  if (password.length > 7) score += 1;
  if (password.match(/(?=.*[A-Z])/)) score += 1;
  if (password.match(/(?=.*[0-9])/)) score += 1;
  if (password.match(/(?=.*[!@#$%^&*])/)) score += 1;
  return { 
    label: score < 2 ? 'WEAK' : score < 4 ? 'GOOD' : 'SECURE', 
    percent: score * 25, 
    color: 'bg-primary' 
  };
};

const CreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('customer');
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
        password: data.password,
        role
      });
      if (response.data.success) {
        toast.success('Account Ready.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Sign Up" 
      subtitle="Create your identity"
      image={registerBg}
      reverse={true}
    >
      <SEO title="Register" robots="noindex, nofollow" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-sectionSurface p-1.5 rounded-2xl border border-borderCustom flex gap-1.5 mb-4">
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

        <div className="grid grid-cols-1 gap-1">
          <InputField label="Identity Name" icon={User} error={errors.name} placeholder="Full Name" {...register('name')} />
          <InputField label="Nexus Email" icon={Mail} error={errors.email} placeholder="nexus@example.com" {...register('email')} />
          
          <div className="relative group">
            <InputField label="Security Key" type="password" icon={ShieldCheck} error={errors.password} placeholder="Minimum 8 characters" {...register('password')} />
            <div className="flex justify-between items-center px-1 h-[3px] mb-4 gap-1">
              {[25, 50, 75, 100].map((t) => (
                <div key={t} className={`flex-1 rounded-full transition-all duration-500 ${strength.percent >= t ? 'bg-accent shadow-[0_0_10px_rgba(198,169,105,0.5)]' : 'bg-borderCustom'}`} />
              ))}
            </div>
            <div className="absolute right-0 top-0 text-[8px] font-black tracking-widest text-accent/80 uppercase">
              {strength.label && `Security: ${strength.label}`}
            </div>
          </div>
          
          <InputField label="Verify Protocol" type="password" icon={ShieldCheck} error={errors.confirmPassword} placeholder="Confirm Security Key" {...register('confirmPassword')} />
        </div>
        
        <div className="flex items-center gap-3 py-2">
          <div className="relative flex items-center justify-center">
            <input 
              id="terms" 
              type="checkbox" 
              className="peer w-4 h-4 rounded-md bg-surface border border-borderCustom text-primary focus:ring-primary/20 transition-all cursor-pointer appearance-none checked:bg-primary checked:border-primary" 
              {...register('agreeTerms')} 
            />
            <div className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
          <label htmlFor="terms" className="text-[10px] text-subtext font-bold uppercase tracking-widest cursor-pointer hover:text-gray-400 transition-colors">Accept Registry Protocols</label>
        </div>
        
        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} disabled={!isValid}>Initialize Profile</Button>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-[10px] text-subtext font-bold uppercase tracking-[0.2em]">
            Already Synchronized? <Link to="/login" className="text-accent hover:text-accent/80 transition-colors ml-2 underline underline-offset-4 decoration-accent/30">Resume Access</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default CreateAccount;
