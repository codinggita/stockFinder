import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Zap, Wind, ShoppingBag, Music, Sun, Minus, Plus, ShieldCheck, ExternalLink, Command, Cpu, Box, Activity } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

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
  const [negotiation, setNegotiation] = useState(null);
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRes = await api.get(`/marketplace/products/${id}`);
        setProduct(productRes.data.product);
        setInventory(productRes.data.inventory);
        setActiveImage(productRes.data.product.image);

        // Check for accepted negotiation if logged in
        if (user) {
          const negRes = await api.get(`/negotiations/check/${id}`);
          if (negRes.data.success && negRes.data.negotiation) {
            setNegotiation(negRes.data.negotiation);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

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
    <div className="min-h-screen bg-background text-textMain font-sans selection:bg-accent/40">
      <Navbar />
      <SEO 
        title={product.name}
        description={`${product.name} - ₹${product.price.toLocaleString()} in ${product.category}. ${product.description}`}
        image={product.image}
        url={`/product/${id}`}
        type="product"
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.image,
          "description": product.description,
          "brand": {
            "@type": "Brand",
            "name": product.store?.name || "STOCK FINDER"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://stockfinder-dhruva.netlify.app/product/${id}`,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": product.store?.name || "STOCK FINDER"
            }
          }
        }}
      />

      <main className="min-h-[calc(100vh-80px)] mt-20 flex relative">
        
        {/* LEFT COMMAND PILLAR (300px) */}
        <div className="w-[400px] sticky top-20 h-[calc(100vh-80px)] border-r border-borderCustom/20 bg-surface shadow-premium p-12 flex flex-col justify-between relative z-20 overflow-y-auto no-scrollbar">
          
          <div className="space-y-16">
            {/* Back Access */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-4 group opacity-40 hover:opacity-100 transition-all"
            >
              <div className="w-8 h-8 rounded-full border border-borderCustom flex items-center justify-center group-hover:bg-textMain group-hover:text-background">
                <ArrowLeft size={12} />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-subtext/60">Return_Archive</span>
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

            {/* Technical Description */}
            <div className="space-y-4 pt-8 border-t border-borderCustom/20">
               <span className="text-[9px] font-black text-subtext/40 uppercase tracking-[0.5em] block">Asset_Brief</span>
               <p className="text-[11px] text-subtext leading-relaxed font-medium">
                  {product.description || "High-fidelity architectural asset synchronized from the global registry. Optimized for technical performance and aesthetic excellence."}
               </p>
            </div>

            {/* Technical Matrix (Always Visible) */}
            <div className="space-y-6 pt-8 border-t border-borderCustom/20">
              <span className="text-[9px] font-black text-subtext/40 uppercase tracking-[0.5em] block">Technical_Matrix</span>
              <div className="grid grid-cols-1 gap-3">
                {product.technicalSpecs?.map((spec, i) => (
                   <div key={i} className="bg-sectionSurface/50 border border-borderCustom/20 p-4 rounded-xl flex justify-between items-center group hover:border-accent/30 transition-all shadow-sm">
                      <span className="text-[8px] font-black text-subtext/40 uppercase tracking-widest">{spec.label}</span>
                      <span className="text-[10px] font-black uppercase italic text-textMain">{spec.value}</span>
                   </div>
                ))}
              </div>
            </div>
          </div>

          {/* Procurement Footer */}
          <div className="space-y-8 pt-12 border-t border-borderCustom/20">
            <div className="flex flex-col gap-2">
              {negotiation ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-1 italic">Negotiated_Price_Activated</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[40px] font-black italic tracking-tighter text-textMain">₹{negotiation.negotiatedPrice.toLocaleString('en-IN')}</span>
                    <span className="text-lg font-bold text-subtext/30 line-through tracking-tighter italic">₹{inventory[0]?.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ) : (
                <span className="text-[40px] font-black italic tracking-tighter text-textMain">₹{inventory[0]?.price.toLocaleString('en-IN')}</span>
              )}
              
              <div className="flex items-center gap-6 bg-sectionSurface/50 p-2 px-4 rounded-xl border border-borderCustom/40 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-subtext/40 hover:text-textMain"><Minus size={14} /></button>
                <span className="text-sm font-black italic text-textMain">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-subtext/40 hover:text-textMain"><Plus size={14} /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {user?.role === 'retailer' ? (
                <button 
                  onClick={() => navigate(`/dashboard/edit-product/${id}`)}
                  className="col-span-2 bg-accent text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <Command size={14} />
                  Edit_Product_Parameters
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      dispatch(addToCart({ 
                        ...product, 
                        quantity, 
                        negotiatedPrice: negotiation?.negotiatedPrice 
                      }));
                      toast.success(negotiation ? 'NEGOTIATED ASSET SYNCED' : 'SYNCED TO CART');
                    }}
                    className="bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-all shadow-xl shadow-white/5"
                  >
                    Sync_Cart
                  </button>
                  <button 
                    onClick={() => navigate(`/negotiate/${id}`)}
                    className={`border py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic transition-all ${negotiation ? 'border-accent text-accent bg-accent/5 cursor-default' : 'border-white/20 hover:border-accent hover:text-accent'}`}
                    disabled={!!negotiation}
                  >
                    {negotiation ? 'Deal_Accepted' : 'Negotiate'}
                  </button>
                </>
              )}
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
                    <span className="text-[7px] font-black text-subtext/40 uppercase tracking-widest group-hover:text-accent transition-colors">Asset</span>
                    <span className="text-[9px] font-black text-subtext/20 group-hover:text-textMain transition-colors">0{i + 1}</span>
                  </div>
                  <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-500 shadow-premium ${activeImage === img ? 'border-accent scale-110' : 'border-borderCustom/20 opacity-30 hover:opacity-100 hover:scale-105'}`}>
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
