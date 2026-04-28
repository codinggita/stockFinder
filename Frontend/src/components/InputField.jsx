import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = forwardRef(({ label, icon: Icon, error, type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full mb-3 flex flex-col">
      <label className="text-[9px] font-black mb-1 uppercase tracking-widest text-gray-600">
        {label}
      </label>
      <div className="relative group">
        <div className="relative flex items-center rounded-lg border border-white/5 bg-white/[0.03] focus-within:border-primary/40 focus-within:bg-white/[0.05] transition-all">
          {Icon && (
            <div className="pl-3 text-gray-600 group-focus-within:text-primary transition-colors">
              <Icon size={14} />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className="w-full bg-transparent py-2.5 px-3 focus:outline-none text-[12px] font-bold text-white placeholder-gray-700"
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3 text-gray-600 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-[8px] font-black mt-1 uppercase tracking-tight">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
