import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ children, isLoading, disabled, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`
        relative w-full py-3.5 px-4 rounded-lg font-medium text-white shadow-glow
        overflow-hidden group focus:outline-none
        ${disabled || isLoading ? 'opacity-70 cursor-not-allowed bg-blue-800' : 'bg-primary'}
      `}
      {...props}
    >
      {/* Background gradient that animates on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${disabled || isLoading ? 'hidden' : ''}`} />
      
      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          children
        )}
      </div>
    </motion.button>
  );
};

export default Button;
