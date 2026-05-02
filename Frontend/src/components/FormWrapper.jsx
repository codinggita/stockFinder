import React from 'react';
import { motion } from 'framer-motion';

const FormWrapper = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Header Outside Card (like Luxe Retail) */}
        <div className="text-center mb-8">
          <h2 className="text-white text-xl font-bold tracking-[0.2em] uppercase mb-1">
            STOCK FINDER
          </h2>
          <p className="text-primary/80 text-xs font-semibold uppercase tracking-widest">
            Smart Analytics & Global Sourcing
          </p>
        </div>

        {/* The Card */}
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-md bg-[#111827]/80 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {/* Subtle neon top border glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
              <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
            {children}
          </div>
          
          {/* Footer details */}
          <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              System Secure
            </div>
            <div>V2.4.0 Encrypted</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FormWrapper;
