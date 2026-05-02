import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { Plus, ShoppingBag, Edit3 } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isRetailer = user?.role === 'retailer';
  const isSoldOut = product.status === 'OUT_OF_STOCK';
  
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative aspect-[3/4] w-full bg-black overflow-hidden cursor-pointer rounded-2xl"
    >
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-[1s] group-hover:scale-110 group-hover:blur-[2px]"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-500"></div>
      </div>

      {/* Large Outlined Title (Centered) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 pointer-events-none">
         <h3 className="text-outline text-5xl md:text-6xl font-black uppercase text-center leading-[0.8] tracking-tighter break-words max-w-full drop-shadow-2xl">
           {product.name}
         </h3>
         <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 flex flex-col items-center">
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.6em] mb-2">{product.store?.name || 'Stock Intelligence'}</span>
            <div className="w-12 h-[1px] bg-accent/40" />
         </div>
      </div>

      {/* Top Left: Price Tag */}
      <div className="absolute top-6 left-6 z-20">
         <div className="px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-sm">
            <span className="text-white font-black text-xs tracking-tighter">{formattedPrice}</span>
         </div>
      </div>

      {/* Bottom Actions: Revealed on Hover */}
      <div className="absolute bottom-8 left-8 right-8 z-20 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
         {!isSoldOut && !isRetailer && (
           <button 
             onClick={(e) => {
               e.stopPropagation();
               dispatch(addToCart({ ...product, quantity: 1 }));
               toast.success(`${product.name} secured`);
             }}
             className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.4em] group/btn"
           >
             Secure
             <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all">
                <Plus size={18} />
             </div>
           </button>
         )}
         
         {isRetailer && (
           <button 
             onClick={(e) => {
               e.stopPropagation();
               navigate(`/dashboard/edit-product/${product._id}`);
             }}
             className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.4em] group/btn"
           >
             Modify
             <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:border-accent transition-all">
                <Edit3 size={16} />
             </div>
           </button>
         )}

         <div className="text-white/40 group-hover:text-white transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
         </div>
      </div>

      {/* Unique Detail: Serial Number Badge */}
      <div className="absolute top-6 right-6 z-20 opacity-20 group-hover:opacity-40 transition-opacity">
         <span className="text-[7px] font-black text-white vertical-text tracking-[0.5em]">SN-2026-LX</span>
      </div>

      {/* Sold Out Overlay */}
      {isSoldOut && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-[4px] flex items-center justify-center">
           <span className="text-white/20 text-[10px] font-black uppercase tracking-[1em] -rotate-12">Archived</span>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;










