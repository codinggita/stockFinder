import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle, image, imageText }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[95%] max-w-4xl h-[600px] flex rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl"
      >
        {/* Left Side: Photo Type */}
        <div className="hidden md:flex md:w-1/2 relative h-full">
          <img 
            src={image} 
            alt="Auth Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="relative z-10 p-10 flex flex-col justify-end h-full">
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase">
              <span className="text-primary">Stock</span>Finder
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
              {imageText || "Premium Inventory Intelligence"}
            </p>
          </div>
        </div>

        {/* Right Side: Form Content - NO SCROLLBAR */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-[#0d0d0d] relative overflow-hidden">
          <div className="w-full max-w-[320px] mx-auto my-auto py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{title}</h1>
              <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-1">{subtitle}</p>
            </div>
            
            <div className="flex flex-col">
              {children}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] text-gray-700 uppercase tracking-widest font-black">
              <span>Secure Session</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
