import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const getStockBadge = (status) => {
  switch (status) {
    case 'IN_STOCK':
      return { color: 'text-green-400', bg: 'bg-green-500/10', dot: 'bg-green-500', label: 'IN STOCK' };
    case 'LOW_STOCK':
      return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500', label: 'LOW STOCK' };
    case 'OUT_OF_STOCK':
      return { color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500', label: 'OUT OF STOCK' };
    default:
      return { color: 'text-gray-400', bg: 'bg-gray-500/10', dot: 'bg-gray-500', label: 'UNKNOWN' };
  }
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const badge = getStockBadge(product.status);
  
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-[#111827]/40 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden transition-all hover:border-primary/40 group cursor-pointer flex flex-col h-full shadow-2xl"
    >
      <div className="relative aspect-square overflow-hidden bg-[#0f172a]">
        <motion.img 
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
          alt={product.name} 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full object-cover transition-transform" 
        />

        {/* Stock Badge */}
        <div className={`absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 ${badge.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
          <span className={`text-[9px] font-black tracking-widest ${badge.color}`}>{badge.label}</span>
        </div>
      </div>

      <div className="px-8 pb-8 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-[10px] uppercase font-black tracking-[0.25em] text-gray-600 mb-2">{product.category}</p>
          <h3 className="text-white font-bold text-xl mb-1 leading-tight group-hover:text-primary transition-colors tracking-tight">{product.name}</h3>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="text-white text-2xl font-black tracking-tighter">{formattedPrice}</div>
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <span className="text-xl leading-none">›</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
