import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const getStockBadge = (status) => {
  switch (status) {
    case 'IN_STOCK':
      return { color: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-500', label: 'In Stock' };
    case 'LOW_STOCK':
      return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500', label: 'Low Stock' };
    case 'OUT_OF_STOCK':
      return { color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500', label: 'Out of Stock' };
    case 'PRE_ORDER':
      return { color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500', label: 'Pre-order' };
    case 'EXCLUSIVE':
      return { color: 'text-purple-400', bg: 'bg-purple-500/10', dot: 'bg-purple-500', label: 'Exclusive' };
    default:
      return { color: 'text-gray-400', bg: 'bg-gray-500/10', dot: 'bg-gray-500', label: 'Unknown' };
  }
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
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
      whileHover={{ y: -8 }}
      className="bg-[#111827]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10 group cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-[#0f172a]">
        <motion.img 
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />

        {/* Best Deal Badge */}
        {!isSoldOut && product.price < 50000 && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-400 text-[10px] font-bold">
             <span className="w-3 h-3 flex items-center justify-center bg-blue-500 rounded-full text-[8px] text-white">★</span>
             Best Deal
          </div>
        )}

        {/* Stock Badge Overlay */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
          <span className={`text-[10px] font-bold ${badge.color}`}>{badge.label}</span>
        </div>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 z-40 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <div className="border border-white/20 px-6 py-2 rotate-[-10deg]">
              <span className="text-white/40 text-sm font-black uppercase tracking-[0.3em]">Sold Out</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-bold text-xl leading-tight group-hover:text-primary transition-colors tracking-tight line-clamp-1">{product.name}</h3>
          <div className={`w-2 h-2 rounded-full mt-2 ${badge.dot}`}></div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-[11px] font-medium uppercase tracking-wider mb-6">
          <span className="flex items-center gap-1">
             <span className="text-lg leading-none">🏢</span> {product.store?.name || 'Luxe Retail'}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-700"></span>
          <span>{product.distance ? `${product.distance} KM` : 'Nearby'}</span>
        </div>
        
        <div className="mt-auto flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Starting From</p>
            <div className="text-white text-2xl font-black tracking-tighter">{formattedPrice}</div>
          </div>
          
          <button 
            onClick={(e) => {
               e.stopPropagation();
               navigate(`/product/${product._id}`);
            }}
            className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              isSoldOut 
                ? 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed' 
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
            }`}
          >
            {isSoldOut ? 'Out of Stock' : 'View Details'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
