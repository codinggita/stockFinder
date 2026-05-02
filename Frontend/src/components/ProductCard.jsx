import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { Plus, Maximize2, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isRetailer = user?.role === 'retailer';
  const isSoldOut = product.status === 'OUT_OF_STOCK';
  const cardRef = useRef(null);

  // Motion values for the lens effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const lensX = useSpring(mouseX, springConfig);
  const lensY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  if (viewMode === 'list') {
    return (
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        onClick={() => navigate(`/product/${product._id}`)}
        className="group relative flex flex-col md:flex-row h-auto md:h-64 w-full bg-[#050505] overflow-hidden cursor-pointer rounded-[2.5rem] border border-white/5"
      >
        {/* Left Section: Image with Lens Effect */}
        <div className="relative w-full md:w-80 h-64 md:h-full overflow-hidden flex-shrink-0">
          {/* Background Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
              className="w-full h-full object-cover grayscale brightness-50 blur-[2px] transition-all duration-700 group-hover:scale-105"
              alt={product.name}
            />
          </div>

          {/* The Lens */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              clipPath: useTransform(
                [lensX, lensY],
                ([x, y]) => `circle(80px at ${x}px ${y}px)`
              )
            }}
          >
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
              className="w-full h-full object-cover scale-[1.5] transition-transform duration-0"
              style={{
                transformOrigin: useTransform(
                  [lensX, lensY],
                  ([x, y]) => `${x}px ${y}px`
                )
              }}
              alt="Lens View"
            />
          </motion.div>
          {isSoldOut && (
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Archived</span>
            </div>
          )}
        </div>

        {/* Right Section: Details */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between relative">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
               <span className="text-[9px] font-black text-accent uppercase tracking-[0.5em] opacity-40">Registry_Ref_{product._id?.slice(-4)}</span>
               <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white group-hover:text-accent transition-colors">
                  {product.name}
               </h3>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-2 italic">
                  {product.store?.name || 'Authorized Hub'}
               </p>
            </div>
            <div className="text-right">
               <span className="text-xl font-black italic text-white tracking-tighter">{formattedPrice}</span>
               <div className="mt-2 flex items-center gap-2 justify-end">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[8px] font-black uppercase text-accent tracking-widest">Live Node</span>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
             <div className="flex gap-10">
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">State</span>
                   <span className="text-[10px] font-black uppercase text-white/60">Verified</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Delivery</span>
                   <span className="text-[10px] font-black uppercase text-white/60">Instant</span>
                </div>
             </div>

             {!isSoldOut && !isRetailer && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToCart({ ...product, quantity: 1 }));
                    toast.success(`${product.name} secured`);
                  }}
                  className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all shadow-xl"
                >
                   Secure Asset
                   <Plus size={14} />
                </button>
             )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative aspect-[4/5] w-full bg-[#050505] overflow-hidden cursor-pointer rounded-[2.5rem] border border-white/5"
    >
      {/* Background Layer: Grayscale & Blurred */}
      <div className="absolute inset-0 z-0">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
          className="w-full h-full object-cover grayscale brightness-50 blur-[2px] transition-all duration-700 group-hover:scale-105"
          alt={product.name}
        />
      </div>

      {/* The Lens: Colored & Sharp (Revealed on Hover) */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          clipPath: useTransform(
            [lensX, lensY],
            ([x, y]) => `circle(120px at ${x}px ${y}px)`
          )
        }}
      >
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
          className="w-full h-full object-cover scale-[1.2] transition-transform duration-0"
          style={{
            transformOrigin: useTransform(
              [lensX, lensY],
              ([x, y]) => `${x}px ${y}px`
            )
          }}
          alt="Lens View"
        />
        {/* Lens Rim Glow */}
        <motion.div 
          className="absolute w-[240px] h-[240px] border border-accent/30 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.2)]"
          style={{
            left: lensX,
            top: lensY,
            x: '-50%',
            y: '-50%'
          }}
        />
      </motion.div>

      {/* HUD Info: Top Registry */}
      <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-start pointer-events-none">
         <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-accent uppercase tracking-[0.5em] opacity-40">Ref_0{product._id?.slice(-3)}</span>
            <span className="text-xs font-black uppercase tracking-widest">{formattedPrice}</span>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-white/10 backdrop-blur-xl flex items-center justify-center group-hover:border-accent/40 transition-colors">
               <Maximize2 size={14} className="text-white/40 group-hover:text-accent transition-colors" />
            </div>
         </div>
      </div>

      {/* Minimalist Bottom Info */}
      <div className="absolute bottom-10 left-10 right-10 z-20 flex flex-col gap-6">
         <div className="flex flex-col">
            <div className="w-8 h-[1px] bg-accent/60 mb-4 transition-all duration-700 group-hover:w-full" />
            <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none group-hover:text-accent transition-colors">
               {product.name}
            </h3>
         </div>
         
         <div className="flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">
               {product.store?.name || 'Authorized Outlet'}
            </span>
            
            {!isSoldOut && !isRetailer && (
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   dispatch(addToCart({ ...product, quantity: 1 }));
                   toast.success(`${product.name} captured`);
                 }}
                 className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all shadow-2xl"
               >
                  Secure Hub
                  <Plus size={14} />
               </button>
            )}
         </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/20 rounded-tl-sm pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/20 rounded-tr-sm pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/20 rounded-bl-sm pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/20 rounded-br-sm pointer-events-none"></div>

      {/* Sold Out Overlay */}
      {isSoldOut && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <ShoppingBag size={40} className="text-white/10" />
              <span className="text-white/20 text-[10px] font-black uppercase tracking-[1em] italic">Decommissioned</span>
           </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;










