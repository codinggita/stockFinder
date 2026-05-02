import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Star, MapPin, Phone, User, Info, 
  Store, ShoppingBag, Clock, ShieldCheck, ExternalLink,
  Navigation
} from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [storeRes, productsRes] = await Promise.all([
          api.get(`/marketplace/stores/${id}`),
          api.get(`/marketplace/stores/${id}/products`)
        ]);
        setStore(storeRes.data.store);
        setProducts(productsRes.data.products);
      } catch (err) {
        console.error('Failed to fetch store data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-textMain">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Syncing Store Data...</p>
      </div>
    </div>
  );

  if (!store) return <div className="min-h-screen bg-background flex items-center justify-center text-textMain font-black uppercase tracking-widest">Store Not Found</div>;

  const storeImage = store.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="min-h-screen bg-background text-textMain font-sans selection:bg-primary/40">
      <Navbar />
      
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-32 pb-40">
        
        {/* Header Architectural Section */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 mb-40">
          
          {/* Left: The Narrative Hub */}
          <div className="w-full lg:w-[45%] flex flex-col justify-end space-y-12">
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <button onClick={() => navigate('/stores')} className="text-accent hover:scale-110 transition-transform">
                      <ArrowLeft size={28} />
                   </button>
                   <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">Registry_Ref_ID_{id.slice(-6).toUpperCase()}</span>
                </div>
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter italic leading-[0.85]">
                  {store.name}
                </h1>
             </div>

             <div className="space-y-8 max-w-xl">
                <p className="text-xl text-white/50 font-medium leading-relaxed italic">
                   "{store.description || "A master-tier distribution node within the Gujarat luxury network. This facility handles the verification and dispersal of high-value assets with absolute precision."}"
                </p>
                <div className="flex items-center gap-4 text-accent font-black uppercase tracking-widest text-[11px] italic">
                   <MapPin size={18} />
                   {store.location}
                </div>
             </div>
          </div>

          {/* Right: The Visual Monolith */}
          <div className="w-full lg:w-[55%] relative group">
             <div className="relative aspect-[16/10] rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  src={storeImage} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-[2s]"
                  alt={store.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* HUD Data Overlays */}
                <div className="absolute top-10 left-10 p-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem]">
                   <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2">Network_Status</p>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Live Hub</span>
                   </div>
                </div>

                <div className="absolute bottom-10 right-10 p-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem]">
                   <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2">Quality_Score</p>
                   <div className="flex items-center gap-2 text-accent">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-black italic">{store.rating || '4.9'}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* The Intelligence Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mb-48 bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden">
           <div className="p-12 border-r border-white/5 hover:bg-white/[0.02] transition-colors group">
              <User size={24} className="text-white/20 mb-6 group-hover:text-accent" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Lead_Registry</p>
              <h4 className="text-lg font-black text-white italic">{store.ownerName || 'Verified Partner'}</h4>
           </div>
           <div className="p-12 border-r border-white/5 hover:bg-white/[0.02] transition-colors group">
              <Phone size={24} className="text-white/20 mb-6 group-hover:text-accent" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Comms_Protocol</p>
              <h4 className="text-lg font-black text-white italic tracking-widest">{store.ownerPhone || 'Secure_Link'}</h4>
           </div>
           <div className="p-12 border-r border-white/5 hover:bg-white/[0.02] transition-colors group">
              <Clock size={24} className="text-white/20 mb-6 group-hover:text-accent" />
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Operational_Window</p>
              <h4 className="text-lg font-black text-white italic">10:00 — 21:30</h4>
           </div>
           <div className="p-12 hover:bg-white/[0.02] transition-colors group relative overflow-hidden">
              <div className="relative z-10">
                 <MapPin size={24} className="text-white/20 mb-6 group-hover:text-accent" />
                 <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Spatial_Address</p>
                 <h4 className="text-xs font-black text-white/60 leading-relaxed italic">{store.fullAddress || "Gujarat Hub, India"}</h4>
              </div>
              <button 
                onClick={() => navigate('/stores', { state: { selectedStoreId: store._id } })}
                className="absolute bottom-6 right-6 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all"
              >
                 <Navigation size={18} />
              </button>
           </div>
        </div>

        {/* Live Inventory Section */}
        <div className="space-y-20">
           <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                 <span className="text-[10px] font-black text-accent uppercase tracking-[0.6em] block">Asset Manifest</span>
                 <h2 className="text-6xl lg:text-7xl font-black uppercase italic tracking-tighter">Live Inventory</h2>
              </div>
              <div className="flex items-center gap-6 px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                 Currently Displaying {products.length} Assets Online
              </div>
           </div>

           {products.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                   {products.map((product) => (
                       <ProductCard key={product._id} product={product} />
                   ))}
               </div>
           ) : (
               <div className="py-40 bg-white/[0.02] rounded-[4rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                   <ShoppingBag size={64} className="text-white/5 mb-8" />
                   <p className="text-xs font-black uppercase tracking-[0.8em] text-white/20">Registry manifest offline</p>
               </div>
           )}
        </div>
      </main>

      {/* Registry Footer */}
      <footer className="border-t border-white/5 bg-black py-24">
         <div className="max-w-[1600px] mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-12 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.8em]">Luxe_Retail_Protocol • Regional_Division_Gujarat</p>
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Protocol_Reference: {id.toUpperCase()}</p>
         </div>
      </footer>
    </div>
  );
};

export default StoreDetail;
