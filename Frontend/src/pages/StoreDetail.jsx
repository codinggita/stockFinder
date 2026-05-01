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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/stores')}
          className="flex items-center gap-2 text-subtext hover:text-textMain mb-10 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to All Stores</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Visuals & Map */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Store Hero Image */}
            <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden bg-surface border border-borderCustom group shadow-2xl">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[120px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
                </div>

                <motion.img 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  src={storeImage} 
                  alt={store.name}
                  className="relative z-10 w-full h-full object-cover"
                />

                {/* Status Badge */}
                <div className="absolute top-8 left-8 z-20 flex items-center gap-3 bg-background/60 backdrop-blur-md border border-borderCustom px-5 py-2.5 rounded-2xl">
                   <span className={`w-2.5 h-2.5 rounded-full ${store.status === 'Closed' ? 'bg-red-500' : 'bg-green-500'} shadow-[0_0_15px_rgba(34,197,94,0.5)]`}></span>
                   <span className="text-[10px] font-black uppercase tracking-widest">{store.status || 'Open Now'}</span>
                </div>
            </div>

            {/* Store Description & Highlights */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                    <h2 className="text-3xl font-black tracking-tight">About the Store</h2>
                </div>
                <p className="text-subtext text-base leading-relaxed font-medium max-w-3xl">
                    {store.description || "Experience retail excellence in the heart of Gujarat. Our store offers a curated selection of premium products backed by expert service and authentic craftsmanship."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="p-8 bg-surface/60 backdrop-blur-sm border border-borderCustom rounded-[2.5rem] flex items-start gap-5 hover:border-primary/30 transition-all group">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h4 className="text-textMain font-bold text-sm mb-1">Authentic Gear</h4>
                            <p className="text-subtext text-xs font-medium">100% verified original stock directly from manufacturers.</p>
                        </div>
                    </div>
                    <div className="p-8 bg-surface/60 backdrop-blur-sm border border-borderCustom rounded-[2.5rem] flex items-start gap-5 hover:border-green-500/30 transition-all group">
                        <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                            <ShoppingBag size={28} />
                        </div>
                        <div>
                            <h4 className="text-textMain font-bold text-sm mb-1">In-Store Pickup</h4>
                            <p className="text-subtext text-xs font-medium">Reserve online and collect within 30 minutes at the outlet.</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Header Info */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-primary tracking-[0.25em] uppercase">{store.category || 'Retail Outlet'}</span>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={i <= Math.round(store.rating || 4) ? "currentColor" : "none"} className={i <= Math.round(store.rating || 4) ? "" : "text-subtext"} />)}
                        </div>
                        <span className="text-[10px] text-subtext font-bold">({store.reviewsCount || 0} Reviews)</span>
                    </div>
                </div>
                <h1 className="text-6xl font-black tracking-tighter leading-[0.95]">{store.name}</h1>
                <div className="flex items-center gap-2.5 text-subtext font-medium">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-sm">{store.location}</span>
                </div>
            </div>

            {/* Detailed Info Card */}
            <div className="bg-surface/60 backdrop-blur-xl border border-borderCustom rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16 rounded-full"></div>
                
                <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-subtext border-b border-borderCustom pb-4">Store Intelligence</h3>
                    
                    {/* Owner Info */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-sectionSurface border border-borderCustom rounded-2xl flex items-center justify-center text-subtext shadow-inner">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Store Owner</p>
                            <h4 className="text-textMain font-bold text-lg">{store.ownerName || 'Verified Partner'}</h4>
                        </div>
                    </div>

                    {/* Phone Info */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-sectionSurface border border-borderCustom rounded-2xl flex items-center justify-center text-primary shadow-inner">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Direct Contact</p>
                            <h4 className="text-textMain font-bold text-lg tracking-wider">{store.ownerPhone || '+91 99000 00000'}</h4>
                        </div>
                    </div>

                    {/* Address Info */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-sectionSurface border border-borderCustom rounded-2xl flex items-center justify-center text-subtext shadow-inner">
                            <MapPin size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Full Address</p>
                            <h4 className="text-subtext font-medium text-sm leading-relaxed">{store.fullAddress || "Gujarat, India"}</h4>
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-sectionSurface border border-borderCustom rounded-2xl flex items-center justify-center text-yellow-500 shadow-inner">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Operational Hours</p>
                            <h4 className="text-textMain font-bold text-sm">10:00 AM — 09:30 PM</h4>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                      onClick={() => navigate('/stores', { state: { selectedStoreId: store._id } })}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                    >
                        <Navigation size={18} />
                        Get Directions
                    </button>
                </div>
            </div>

          </div>
        </div>

        {/* Live Inventory Section */}
        <div className="mt-32 space-y-12">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight">Live Inventory</h2>
                    <p className="text-subtext text-sm font-medium">Real-time stock availability at this location</p>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-borderCustom px-4 py-2 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-subtext">Live Sync Active</span>
                </div>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 bg-surface rounded-[3rem] border border-dashed border-borderCustom flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingBag size={48} className="text-subtext" />
                    <p className="text-subtext font-bold uppercase tracking-widest">No products currently listed for this store.</p>
                </div>
            )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-borderCustom bg-background py-12 text-center">
         <p className="text-[10px] font-black text-subtext uppercase tracking-[0.5em]">RETAILBRIDGE INTELLIGENCE SYSTEM • GUJARAT DIVISION</p>
      </footer>
    </div>
  );
};

export default StoreDetail;
