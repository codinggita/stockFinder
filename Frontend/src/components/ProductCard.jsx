import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const getStockBadge = (status) => {
  switch (status) {
    case 'IN_STOCK':
      return { color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20', dot: 'bg-green-500', label: 'In Stock' };
    case 'LOW_STOCK':
      return { color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-500', label: 'Low Stock' };
    case 'OUT_OF_STOCK':
      return { color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500', label: 'Out of Stock' };
    case 'PRE_ORDER':
      return { color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-500', label: 'Pre-order' };
    case 'EXCLUSIVE':
      return { color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20', dot: 'bg-purple-500', label: 'Exclusive' };
    default:
      return { color: 'text-subtext', bg: 'bg-surface border-borderCustom', dot: 'bg-gray-400', label: 'Unknown' };
  }
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isRetailer = user?.role === 'retailer';
  const badge = getStockBadge(product.status);
  const isSoldOut = product.status === 'OUT_OF_STOCK';
  
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-cardBg backdrop-blur-3xl border border-borderCustom rounded-[2rem] overflow-hidden transition-all hover:border-primary/40 group cursor-pointer flex flex-col h-full shadow-premium"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-sectionSurface">
        <motion.img 
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110 opacity-90 dark:opacity-70 group-hover:opacity-100" 
        />
        
        {/* Light mode gradient (bottom fade) */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-100 dark:opacity-0 transition-opacity pointer-events-none"></div>
        {/* Dark mode gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 dark:opacity-100 transition-opacity pointer-events-none"></div>

        {/* Status Badge */}
        <div className={`absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-md ${badge.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${badge.color}`}>{badge.label}</span>
        </div>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 z-40 bg-background/70 dark:bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="border border-borderCustom px-8 py-3 rotate-[-5deg] bg-surface/60">
              <span className="text-subtext text-xs font-black uppercase tracking-[0.5em]">Manifest Empty</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="p-6 flex-1 flex flex-col bg-cardBg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-textMain font-black text-lg leading-tight group-hover:text-primary transition-colors tracking-tighter uppercase line-clamp-1 flex-1 min-w-0 pr-2">{product.name}</h3>
        </div>
        
        <div className="flex items-center gap-3 text-subtext text-[9px] font-black uppercase tracking-[0.2em] mb-auto">
          <span className="flex items-center gap-1.5 truncate">
            <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
            {product.store?.name || 'Luxe Retail'}
          </span>
          <span className="text-borderCustom">|</span>
          <span className="flex-shrink-0 text-accent/80">{product.distance ? `${product.distance} KM` : 'Nearby'}</span>
        </div>
        
        <div className="mt-5 pt-5 border-t border-borderCustom flex items-end justify-between">
          <div>
            <p className="text-[9px] font-black text-subtext uppercase tracking-[0.3em] mb-1.5">Starting Entry</p>
            <div className="text-textMain text-2xl font-black tracking-tighter italic">{formattedPrice}</div>
          </div>
          
          {!isSoldOut && !isRetailer && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addToCart({ ...product, quantity: 1 }));
                toast.success(`${product.name} added to cart!`);
              }}
              className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center transition-all hover:scale-110 shadow-[0_10px_20px_rgba(99,102,241,0.25)] hover:shadow-primary/40 flex-shrink-0 group/btn"
              title="Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:rotate-12 transition-transform"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </button>
          )}
          {isRetailer && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/edit-product/${product._id}`);
              }}
              className="px-5 h-11 rounded-2xl bg-sectionSurface border border-borderCustom hover:border-primary/50 text-textMain font-black text-[10px] uppercase tracking-widest flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
              title="Edit Product"
            >
              Update
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
