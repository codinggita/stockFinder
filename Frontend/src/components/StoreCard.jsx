import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreCard = ({ store }) => {
  const navigate = useNavigate();
  const storeImage = store.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800';

  const handleViewDetails = () => {
    navigate(`/store/${store._id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onClick={handleViewDetails}
      className="group relative h-[500px] w-full rounded-[1rem] overflow-hidden cursor-pointer bg-black"
    >
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          src={storeImage} 
          alt={store.name} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
      </div>

      {/* Initial View: Large Title at Bottom */}
      <div className="absolute bottom-12 left-10 right-10 z-10 transition-transform duration-500 group-hover:translate-y-[-160px]">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-accent group-hover:w-20 transition-all duration-700"></div>
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">STOCK Node</span>
         </div>
         <h3 className="text-white font-black text-5xl leading-[0.8] tracking-tighter uppercase mb-2">
           {store.name}
         </h3>
         <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <MapPin size={12} className="text-accent/60" />
            {store.location}
         </div>
      </div>

      {/* Hidden View: Revealed Content */}
      <div className="absolute bottom-12 left-10 right-10 z-20 flex flex-col gap-8 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100">
         
         <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
               <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Coverage</p>
               <p className="text-white font-black text-lg">{store.distance || '2.4'} KM</p>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
               <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Registry</p>
               <div className="flex items-center gap-1.5 text-accent font-black">
                  <Star size={12} fill="currentColor" />
                  <span className="text-lg">{store.rating || '4.5'}</span>
               </div>
            </div>
         </div>

         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${store.status === 'Closed' ? 'bg-red-500' : 'bg-emerald-400 shadow-[0_0_15px_#34d399]'}`}></div>
               <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">{store.status || 'Active Now'}</span>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="flex items-center gap-4 text-white text-[11px] font-black uppercase tracking-[0.4em] group/btn"
            >
              Access Hub
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all">
                 <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </button>
         </div>
      </div>

      {/* Minimal Corner Tag */}
      <div className="absolute top-8 right-8 z-20 opacity-40 group-hover:opacity-100 transition-opacity">
         <Plus size={24} className="text-white group-hover:rotate-90 transition-transform duration-500" />
      </div>
    </motion.div>
  );
};

export default StoreCard;





