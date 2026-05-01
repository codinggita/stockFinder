import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Store, Phone, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreCard = ({ store }) => {
  const navigate = useNavigate();
  const storeImage = store.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800';

  const handleViewDetails = () => {
    navigate(`/store/${store._id}`);
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={handleViewDetails}
      className="bg-cardBg backdrop-blur-3xl border border-borderCustom rounded-[2.5rem] p-8 shadow-premium transition-all hover:border-accent/40 group cursor-pointer flex flex-col"
    >
      <div>
        <div className="flex justify-between items-start mb-3 px-1">
          <h3 className="text-textMain font-black text-2xl leading-none tracking-tighter group-hover:text-accent transition-colors uppercase">{store.name}</h3>
          <div className="bg-accent/10 border border-accent/20 text-accent text-[9px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase shadow-xl">
            {store.distance || '2.4'} KM
          </div>
        </div>
        <p className="text-subtext text-[10px] mb-8 font-black uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
          <MapPin size={12} className="text-accent/60" />
          {store.location}
        </p>
        
        {/* Store Image Container */}
        <div className="relative h-56 bg-sectionSurface rounded-[2rem] mb-8 flex items-center justify-center overflow-hidden border border-borderCustom group/img shadow-inner">
            <motion.img 
              src={storeImage} 
              alt={store.name} 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full object-cover opacity-90 dark:opacity-60 group-hover/img:opacity-100 transition-opacity" 
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-100 dark:from-dark/80 transition-opacity"></div>
            
            {/* Center Action */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-500 transform scale-90 group-hover/img:scale-100">
              <div className="px-6 py-2 bg-accent text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl">
                  Entry Point
              </div>
            </div>
        </div>
      </div>

      <div className="mt-auto px-1">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3 text-[9px] uppercase font-black tracking-[0.3em]">
             <span className={`w-2 h-2 rounded-full ${store.status === 'Closed' ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse'}`}></span>
             <span className={store.status === 'Closed' ? 'text-red-400' : 'text-emerald-500'}>{store.status || 'Active Now'}</span>
             <span className="text-borderCustom">/</span>
             <span className="text-subtext">Updated Real-Time</span>
           </div>
           
           {store.rating && (
             <div className="flex items-center gap-1.5 text-accent font-black text-[11px] bg-accent/5 px-2 py-1 rounded-md border border-accent/10">
                <Star size={10} fill="currentColor" />
                <span>{store.rating}</span>
             </div>
           )}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          className="w-full py-4 rounded-2xl border border-borderCustom bg-surface/40 text-[10px] font-black tracking-[0.3em] text-subtext uppercase hover:text-textMain hover:border-accent/50 hover:bg-accent/5 transition-all flex items-center justify-center gap-3 group/btn"
        >
          Access Terminal
          <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform text-accent" />
        </button>
      </div>
    </motion.div>
  );
};

export default StoreCard;
