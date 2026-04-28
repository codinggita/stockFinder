import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ children, isLoading, disabled, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.99 }}
      disabled={disabled || isLoading}
      className={`
        relative w-full py-4 px-6 rounded-xl font-bold text-black
        overflow-hidden group focus:outline-none transition-all duration-300
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed bg-gray-600' : 'bg-white hover:bg-primary shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-primary/40'}
      `}
      {...props}
    >
      <div className="relative flex items-center justify-center gap-3 tracking-widest text-xs uppercase font-black">
        {isLoading ? (
          <Loader2 className="animate-spin text-black" size={18} />
        ) : (
          children
        )}
      </div>
    </motion.button>
  );
};

export default Button;
