import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const InputField = forwardRef(({ label, icon: Icon, error, type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col mb-4 relative">
      <label className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        {/* Glow effect on focus behind the input */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-400 rounded-lg opacity-0 group-focus-within:opacity-30 blur transition duration-300"></div>
        
        <div className="relative flex items-center bg-navy/80 border border-border rounded-lg overflow-hidden shadow-inner-glow transition-all duration-300 focus-within:border-primary/50">
          {Icon && (
            <div className="pl-3 text-gray-400">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`w-full bg-transparent text-white placeholder-gray-500 py-3 ${Icon ? 'px-3' : 'px-4'} focus:outline-none`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3 text-gray-400 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-red-400 text-xs mt-1.5 ml-1"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
