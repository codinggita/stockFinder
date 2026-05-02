import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { Plus, Maximize2, ShoppingBag, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';

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

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Permanently remove this asset from inventory?')) return;
    
    try {
      const response = await api.delete(`/stores/my-store/products/${product._id}`);
      if (response.data.success) {
        toast.success('Asset decommissioned');
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to delete asset');
    }
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
        onClick={() => navigate(isRetailer ? `/dashboard/edit-product/${product._id}` : `/product/${product._id}`)}
        className="group relative flex flex-col md:flex-row h-auto md:h-64 w-full bg-surface overflow-hidden cursor-pointer rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all duration-500 border border-borderCustom/10"
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
                <span className="text-[9px] font-black text-accent uppercase tracking-[0.5em]">Registry_Ref_{product._id?.slice(-4)}</span>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-textMain group-hover:text-accent transition-colors">
                   {product.name}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-subtext mt-2 italic">
                   {product.store?.name || 'Authorized Hub'}
                </p>
            </div>
            <div className="text-right">
                <span className="text-xl font-black italic text-textMain tracking-tighter">{formattedPrice}</span>
               <div className="mt-2 flex items-center gap-2 justify-end">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[8px] font-black uppercase text-accent tracking-widest">Live Node</span>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-borderCustom/20">
             <div className="flex gap-10">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-subtext/40 uppercase tracking-widest mb-1">State</span>
                    <span className="text-[10px] font-black uppercase text-textMain/60">Verified</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-subtext/40 uppercase tracking-widest mb-1">Delivery</span>
                    <span className="text-[10px] font-black uppercase text-textMain/60">Instant</span>
                 </div>
             </div>

             {isRetailer && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/edit-product/${product._id}`);
                  }}
                  className="flex items-center gap-3 bg-accent text-white px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-xl"
                >
                   Edit Product
                   <Edit size={14} />
                </button>
             )}
             {!isSoldOut && !isRetailer && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToCart({ ...product, quantity: 1 }));
                    toast.success(`${product.name} secured`);
                  }}
                  className="flex items-center gap-3 bg-textMain text-background px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all shadow-xl"
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
      onClick={() => navigate(isRetailer ? `/dashboard/edit-product/${product._id}` : `/product/${product._id}`)}
      className="group relative aspect-[4/5] w-full bg-surface overflow-hidden cursor-pointer rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all duration-500 border border-borderCustom/10"
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

       {/* Bottom Gradient Overlay: Theme Aware */}
       <div className="absolute inset-0 bg-gradient-to-t from-surface/95 via-surface/40 to-transparent dark:from-black/80 dark:via-black/20 z-10 transition-all duration-700 group-hover:from-surface dark:group-hover:from-black/90 group-hover:via-surface/60 dark:group-hover:via-black/40" />

       {/* HUD Info: Top Registry */}
      <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-accent uppercase tracking-[0.5em]">Ref_0{product._id?.slice(-3)}</span>
            <span className="text-xs font-black uppercase tracking-widest text-textMain">{formattedPrice}</span>
          </div>
          <div className="flex items-center gap-4">
             {isRetailer ? (
                <div className="flex gap-2 relative z-30">
                   <div 
                     onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/edit-product/${product._id}`); }}
                     className="w-10 h-10 rounded-full border border-accent/40 bg-accent/10 backdrop-blur-xl flex items-center justify-center transition-all hover:bg-accent group/edit pointer-events-auto"
                   >
                      <Edit size={14} className="text-accent group-hover/edit:text-white transition-colors" />
                   </div>
                   <div 
                     onClick={handleDelete}
                     className="w-10 h-10 rounded-full border border-red-500/40 bg-red-500/10 backdrop-blur-xl flex items-center justify-center transition-all hover:bg-red-500 group/delete pointer-events-auto"
                   >
                      <Trash2 size={14} className="text-red-500 group-hover/delete:text-white transition-colors" />
                   </div>
                </div>
             ) : (
                <div className="w-10 h-10 rounded-full border border-borderCustom/40 bg-surface/40 backdrop-blur-xl flex items-center justify-center transition-colors pointer-events-auto">
                   <Maximize2 size={14} className="text-textMain/40 group-hover:text-accent transition-colors" />
                </div>
             )}
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
         
         <div className="flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 z-20 relative">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-subtext italic">
                {product.store?.name || 'Authorized Outlet'}
             </span>
            
            {isRetailer && (
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   navigate(`/dashboard/edit-product/${product._id}`);
                 }}
                 className="flex items-center gap-3 bg-accent text-white px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl"
               >
                  Modify Asset
                  <Edit size={14} />
               </button>
            )}
            {!isSoldOut && !isRetailer && (
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   dispatch(addToCart({ ...product, quantity: 1 }));
                   toast.success(`${product.name} captured`);
                 }}
                 className="flex items-center gap-3 bg-textMain text-background px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all shadow-2xl"
               >
                  Secure Hub
                  <Plus size={14} />
               </button>
            )}
         </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-borderCustom/40 rounded-tl-sm pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-borderCustom/40 rounded-tr-sm pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-borderCustom/40 rounded-bl-sm pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-borderCustom/40 rounded-br-sm pointer-events-none"></div>

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










