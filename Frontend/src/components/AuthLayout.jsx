import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const AuthLayout = ({ children, title, subtitle, image, imageText, reverse = false }) => {
  return (
    <div className="h-screen w-full flex bg-background overflow-hidden font-sans">
      {/* Theme Toggle Overlay */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle className="shadow-2xl backdrop-blur-xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`w-full h-full flex ${reverse ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Visual Experience Side */}
        <div className={`hidden md:flex md:w-1/2 xl:w-[60%] relative h-full overflow-hidden group ${reverse ? 'border-l' : 'border-r'} border-borderCustom`}>
          <img 
            src={image} 
            alt="Auth Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-40 group-hover:scale-105 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent dark:from-background dark:via-background/60" />
          <div className="relative z-10 p-12 lg:p-20 flex flex-col justify-end h-full">
            <div className="mb-12">
              <div className="w-16 h-1.5 bg-accent rounded-full mb-6" />
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-textMain uppercase leading-[0.9]">
                <span className="text-primary italic">Stock</span><br/>Finder
              </h2>
              <p className="text-subtext text-[11px] font-bold uppercase tracking-[0.4em] mt-8 border-l-4 border-accent/40 pl-6 max-w-xs leading-relaxed">
                {imageText || "The ultimate standard in inventory intelligence and retail management."}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content Side */}
        <div className="w-full md:w-1/2 xl:w-[40%] flex flex-col h-full bg-surface relative overflow-y-auto scrollbar-thin">
          <div className="w-full max-w-[420px] mx-auto my-auto py-16 px-10">
            <div className="mb-12">
              <h1 className="text-3xl lg:text-4xl font-black text-textMain tracking-tighter uppercase leading-none">{title}</h1>
              <div className="flex items-center gap-4 mt-5">
                <div className="h-[1px] flex-1 bg-borderCustom" />
                <p className="text-subtext text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.3em] whitespace-nowrap">{subtitle}</p>
                <div className="h-[1px] w-8 bg-accent/40" />
              </div>
            </div>
            
            <div className="flex flex-col">
              {children}
            </div>
            
            <div className="mt-16 pt-8 border-t border-borderCustom flex justify-between items-center text-[10px] text-subtext uppercase tracking-widest font-black">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Encrypted Session
              </span>
              <span>© 2026 STOCK FINDER</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
