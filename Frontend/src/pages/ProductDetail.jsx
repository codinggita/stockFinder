import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Zap, Wind, ShoppingBag, Music, Sun, Minus, Plus, ShieldCheck, ExternalLink, Command, Cpu, Box, Activity } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [activeImage, setActiveImage] = useState(null);
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/marketplace/products/${id}`);
        setProduct(response.data.product);
        setInventory(response.data.inventory);
        setActiveImage(response.data.product.image);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-t-2 border-accent rounded-full"
      />
    </div>
  );

  if (!product) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-black">ASSET_NOT_FOUND</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-accent/40">
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] mt-20 flex relative">
        
        {/* LEFT COMMAND PILLAR (300px) */}
        <div className="w-[400px] sticky top-20 h-[calc(100vh-80px)] border-r border-white/5 bg-black/40 backdrop-blur-3xl p-12 flex flex-col justify-between relative z-20 overflow-y-auto no-scrollbar">
          
          <div className="space-y-16">
            {/* Back Access */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-4 group opacity-40 hover:opacity-100 transition-all"
            >
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black">
                <ArrowLeft size={12} />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase">Return_Archive</span>
            </button>

            {/* Asset Identity */}
            <div className="space-y-4">
              <span className="text-[9px] font-black text-accent uppercase tracking-[0.5em] block">Asset_Classification</span>
              <h1 className="text-5xl font-black italic uppercase leading-none tracking-tighter">
                {product.name.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
              <div className="flex text-accent gap-1 pt-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
              </div>
            </div>

            {/* Technical Navigation */}
            <div className="space-y-8 pt-8 border-t border-white/5">
              {[
                { id: 'specs', label: 'Tech_Matrix', icon: Cpu },
                { id: 'inventory', label: 'Stock_Registry', icon: Box },
                { id: 'valuation', label: 'Market_Pulse', icon: Activity },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between group transition-all ${activeTab === tab.id ? 'text-accent' : 'text-white/20 hover:text-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon size={14} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">{tab.label}</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-transparent'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Procurement Footer */}
          <div className="space-y-8 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[40px] font-black italic tracking-tighter text-white">₹{inventory[0]?.price.toLocaleString('en-IN')}</span>
              <div className="flex items-center gap-6 bg-white/5 p-2 px-4 rounded-xl border border-white/10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/40 hover:text-white"><Minus size={14} /></button>
                <span className="text-sm font-black italic">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-white/40 hover:text-white"><Plus size={14} /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  dispatch(addToCart({ ...product, quantity }));
                  toast.success('SYNCED TO CART');
                }}
                className="bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-all shadow-xl shadow-white/5"
              >
                Sync_Cart
              </button>
              <button 
                onClick={() => navigate(`/negotiate/${id}`)}
                className="border border-white/20 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:border-accent hover:text-accent italic transition-all"
              >
                Negotiate
              </button>
            </div>
          </div>

        </div>

        {/* MAIN EXHIBITION STAGE */}
        <div className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] overflow-hidden">
          
          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
            <span className="text-[40vw] font-black italic uppercase leading-none tracking-tighter translate-y-20">ASSET</span>
          </div>

          {/* The Asset Showcase */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeImage || product.image}
                initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: -15 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full animate-pulse" />
                <img 
                  src={activeImage || product.image} 
                  className="max-w-[70%] max-h-[70%] object-contain drop-shadow-[0_80px_120px_rgba(0,0,0,0.8)]"
                  alt={product.name}
                />
              </motion.div>
            </AnimatePresence>

            {/* VERTICAL ASSET REEL (Far Right) */}
            <div className="absolute right-12 bottom-12 flex flex-col gap-6 z-40">
              {(product.images?.length > 0 ? product.images : [product.image]).map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className="group relative flex items-center gap-4"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[7px] font-black text-white/20 uppercase tracking-widest group-hover:text-accent transition-colors">Asset</span>
                    <span className="text-[9px] font-black text-white/10 group-hover:text-white transition-colors">0{i + 1}</span>
                  </div>
                  <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-500 ${activeImage === img ? 'border-accent scale-110 shadow-2xl' : 'border-white/5 opacity-30 hover:opacity-100 hover:scale-105'}`}>
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Overlay (Floating Right) */}
          <div className="absolute top-12 right-12 w-[350px] space-y-6 z-30">
            <AnimatePresence mode="wait">
              {activeTab === 'specs' && (
                <motion.div 
                  key="specs"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-black/80 border border-white/10 backdrop-blur-3xl p-8 rounded-[2rem] shadow-2xl"
                >
                  <span className="text-[9px] font-black text-accent uppercase tracking-[0.5em] block mb-6 italic">//_Technical_Matrix</span>
                  <div className="space-y-4">
                    {product.technicalSpecs?.map((spec, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{spec.label}</span>
                        <span className="text-xs font-black uppercase italic">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </main>
    </div>
  );
};

export default ProductDetail;
