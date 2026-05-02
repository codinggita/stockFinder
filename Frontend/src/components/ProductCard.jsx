import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { ShoppingBag, Edit3, ArrowRight } from 'lucide-react';

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative h-[450px] w-full bg-[#080808] overflow-hidden cursor-pointer"
    >
      {/* Product Silhouette / Image */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
          alt={product.name} 
          className="w-full h-full object-contain p-8 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
      </div>

      {/* Floating Info (Initial) */}
      <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-start">
         <div className="bg-white/5 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full">
            <span className="text-white font-black text-sm tracking-tight">{formattedPrice}</span>
         </div>
         <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={18} className="text-white" />
         </div>
      </div>

      {/* Title & Revealed Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
         <div className="mb-4 transition-transform duration-500 group-hover:translate-y-[-60px]">
            <h3 className="text-white font-black text-3xl leading-none uppercase tracking-tighter mb-1">
              {product.name}
            </h3>
            <span className="text-accent text-[9px] font-black uppercase tracking-[0.4em]">
              {product.store?.name || 'Stock Intelligence'}
            </span>
         </div>

         {/* Hidden Actions */}
         <div className="absolute bottom-8 left-8 right-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            {!isSoldOut && !isRetailer && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addToCart({ ...product, quantity: 1 }));
                  toast.success(`${product.name} acquired`);
                }}
                className="w-full h-12 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-sm hover:bg-accent hover:text-white transition-all"
              >
                Acquire Asset
              </button>
            )}
            {isRetailer && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/edit-product/${product._id}`);
                }}
                className="w-full h-12 bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-sm hover:bg-white hover:text-black transition-all"
              >
                Modify Configuration
              </button>
            )}
         </div>
      </div>

      {/* Subtle Grid Pattern (Unique Detail) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Sold Out State */}
      {isSoldOut && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[4px] flex items-center justify-center">
           <div className="border border-white/10 px-6 py-2 bg-black/80">
              <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em]">Offline</span>
           </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;






