import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Zap, Wind, ShoppingBag, Music, Sun, Minus, Plus, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const iconMap = { Zap, Wind, ShoppingBag, Music, Sun };

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(8);
  
  const { user } = useSelector(state => state.auth);
  const { myStore } = useSelector(state => state.stores);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/marketplace/products/${id}`);
        setProduct(response.data.product);
        setInventory(response.data.inventory);
        setActiveImage(response.data.product.image);
        if (response.data.product.sizes && response.data.product.sizes.length > 0) {
          setSelectedSize(response.data.product.sizes[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    setActiveImage(null);
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-textMain">
      Loading Technical Data...
    </div>
  );
  if (!product) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-textMain">
      Product Not Found
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-textMain font-sans selection:bg-primary/40">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-subtext hover:text-textMain mb-12 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-surface border border-borderCustom flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Registry Return</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Visuals & Specs */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Hero Image Container */}
            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-surface border border-borderCustom group shadow-2xl">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-primary/5 blur-[120px] animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                </div>

                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src={activeImage || product.image} 
                  alt={product.name}
                  className="relative z-10 w-full h-full object-contain p-16 drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-[2000ms]"
                />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-6 px-4">
                {(product.images?.length > 0 ? product.images : [product.image]).map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveImage(img)}
                      className={`aspect-square rounded-[1.5rem] bg-surface border-2 transition-all duration-500 overflow-hidden cursor-pointer ${activeImage === img ? 'border-accent shadow-[0_0_20px_rgba(198,169,105,0.3)] scale-105' : 'border-borderCustom hover:border-accent/40 opacity-50 hover:opacity-100'}`}
                    >
                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* Technical Specification Section */}
            <div className="space-y-10 pt-10 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-primary" />
                  <h2 className="text-3xl font-black tracking-tighter uppercase">Technical Specification</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {product.technicalSpecs?.map((spec, index) => {
                        const Icon = iconMap[spec.icon] || Zap;
                        return (
                            <div key={index} className="p-8 bg-surface border border-borderCustom rounded-[2rem] space-y-6 hover:border-primary/40 transition-all group/spec">
                                <div className="text-primary group-hover/spec:scale-110 transition-transform">
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <h4 className="text-textMain font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-60">{spec.label}</h4>
                                    <p className="text-textMain font-black text-xs leading-relaxed uppercase tracking-widest">{spec.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>

          {/* Right Column: Details & Interaction */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* Title & Reviews */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-accent tracking-[0.4em] uppercase bg-accent/10 px-3 py-1 rounded-md border border-accent/20 italic">Elite Grade Asset</span>
                    <div className="flex items-center gap-3">
                        <div className="flex text-accent">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                        <span className="text-[9px] text-subtext font-black uppercase tracking-widest">{product.reviewsCount} Verifications</span>
                    </div>
                </div>
                <h1 className="text-6xl font-black tracking-tighter leading-none uppercase italic">{product.name}</h1>
                <p className="text-subtext text-[11px] leading-relaxed font-black uppercase tracking-[0.2em] pt-2 border-l-2 border-borderCustom pl-6">
                    {product.description}
                </p>
            </div>

            {/* Local Inventory Card */}
            <div className="bg-surface border border-borderCustom rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
                <div className="flex justify-between items-center border-b border-borderCustom pb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-textMain opacity-60">Asset Availability</h3>
                    <div className="flex items-center gap-2 text-accent text-[9px] font-black uppercase tracking-widest">
                        <MapPin size={12} />
                        {product.store?.location || 'Ahmedabad Sector'}
                    </div>
                </div>

                <div className="space-y-8">
                    {inventory.map((item, index) => (
                        <div key={index} className="flex justify-between items-center group cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <div>
                                    <h4 className="text-textMain font-black text-sm uppercase tracking-tight group-hover:text-accent transition-colors">{item.store.name}</h4>
                                    <p className="text-[8px] text-subtext font-black uppercase tracking-[0.2em] mt-1.5">Distance: {(index + 1) * 2.4} KM</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-textMain font-black text-xl tracking-tighter">₹{item.price.toLocaleString('en-IN')}</div>
                                <div className="flex items-center justify-end gap-2 mt-2">
                                    <span className={`w-1 h-1 rounded-full ${item.status === 'IN_STOCK' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></span>
                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${item.status === 'IN_STOCK' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Config & Buttons */}
            <div className="space-y-12">
                <div className="flex gap-16 px-2">
                    {/* Quantity */}
                    <div className="space-y-5">
                        <span className="text-[9px] font-black text-subtext uppercase tracking-[0.4em] block">Volume</span>
                        <div className="flex items-center gap-6 bg-surface border border-borderCustom rounded-2xl p-1.5">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-sectionSurface hover:text-accent rounded-xl transition-all border border-transparent hover:border-borderCustom"><Minus size={14}/></button>
                            <span className="text-sm font-black w-6 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-sectionSurface hover:text-accent rounded-xl transition-all border border-transparent hover:border-borderCustom"><Plus size={14}/></button>
                        </div>
                    </div>

                    {/* Size Selector */}
                    {product.sizeType && (product.sizeType === 'Clothing' || product.sizeType === 'Shoes' || (product.sizes && product.sizes.length > 0)) && (
                        <div className="space-y-5 flex-1">
                            <span className="text-[9px] font-black text-subtext uppercase tracking-[0.4em] block">
                                Format {product.sizeType ? `(${product.sizeType})` : ''}
                            </span>
                            <div className="grid grid-cols-4 gap-3">
                                {(() => {
                                    const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
                                    const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12'];
                                    const masterSizes = product.sizeType === 'Clothing' ? CLOTHING_SIZES : product.sizeType === 'Shoes' ? SHOE_SIZES : (product.sizes || []);
                                    
                                    return masterSizes.map(size => {
                                        const isAvailable = product.sizes && product.sizes.includes(size);
                                        return (
                                        <button 
                                          key={size}
                                          disabled={!isAvailable}
                                          onClick={() => isAvailable && setSelectedSize(size)}
                                          className={`py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest
                                            ${!isAvailable 
                                                ? 'bg-surface border-borderCustom text-subtext cursor-not-allowed opacity-30' 
                                                : selectedSize === size 
                                                    ? 'bg-primary border-primary text-white shadow-[0_10px_20px_rgba(99,102,241,0.3)]' 
                                                    : 'bg-surface border-borderCustom text-subtext hover:border-accent/40 hover:text-textMain'}`}
                                        >
                                            {size}
                                        </button>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    {user?.role === 'retailer' && myStore && product.store && (String(product.store._id || product.store) === String(myStore._id)) ? (
                      <button
                        onClick={() => navigate(`/dashboard/edit-product/${id}`)}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02]"
                      >
                          Deploy Modification Protocol
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            dispatch(addToCart({ ...product, quantity }));
                            toast.success(`${product.name} added to cart!`);
                          }}
                          className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02] group"
                        >
                            <ShoppingBag size={18} className="group-hover:rotate-12 transition-transform" />
                            Synchronize to Cart
                        </button>
                        <button 
                          onClick={() => navigate(`/negotiate/${id}`)}
                          className="w-full border-2 border-accent/40 hover:border-accent text-accent py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all transform hover:scale-[1.02] bg-accent/5"
                        >
                            <Zap size={18} />
                            Negotiate Asset Value
                        </button>
                      </>
                    )}
                </div>

                <div className="flex items-center justify-center gap-4 text-subtext bg-surface py-4 rounded-2xl border border-borderCustom">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Authenticity Verified by Luxe Network Registry</span>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
