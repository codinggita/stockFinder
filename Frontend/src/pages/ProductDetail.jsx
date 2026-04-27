import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Zap, Wind, ShoppingBag, Music, Sun, Minus, Plus, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const iconMap = { Zap, Wind, ShoppingBag, Music, Sun };

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(8);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/marketplace/products/${id}`);
        setProduct(response.data.product);
        setInventory(response.data.inventory);
        // Ensure the main image from the marketplace is the first one shown
        setActiveImage(response.data.product.image);
        // Set default size if available
        if (response.data.product.sizes && response.data.product.sizes.length > 0) {
          setSelectedSize(response.data.product.sizes[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    // Reset state when switching products
    setLoading(true);
    setActiveImage(null);
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading Technical Data...</div>;
  if (!product) return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Visuals & Specs */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Hero Image with "Smoke" Effect Backdrop */}
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-[#0f172a] border border-white/5 group">
                {/* Abstract smoke/glow background from design */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                </div>

                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={activeImage || product.image} 
                  alt={product.name}
                  className="relative z-10 w-full h-full object-contain p-12 drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                />

                {/* Navigation inside image if needed, but photo shows a clean display */}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
                {(product.images?.length > 0 ? product.images : [product.image]).map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveImage(img)}
                      className={`aspect-square rounded-2xl bg-[#0f172a] border ${activeImage === img ? 'border-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-white/5'} p-4 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all`}
                    >
                        <img src={img} alt={`View ${i + 1}`} className={`w-full h-full object-contain ${activeImage === img ? 'opacity-100' : 'opacity-40'}`} />
                    </div>
                ))}
            </div>

            {/* Technical Intelligence Section */}
            <div className="space-y-8 pt-8">
                <h2 className="text-3xl font-bold tracking-tight">Technical Intelligence</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {product.technicalSpecs.map((spec, index) => {
                        const Icon = iconMap[spec.icon] || Zap;
                        return (
                            <div key={index} className="p-8 bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 rounded-3xl space-y-4 hover:border-primary/20 transition-all">
                                <div className="text-primary">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-2">{spec.label}</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed font-medium">{spec.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>

          {/* Right Column: Details & Interaction */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Title & Reviews */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Limited Edition</span>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold">({product.reviewsCount} Reviews)</span>
                    </div>
                </div>
                <h1 className="text-5xl font-black tracking-tighter leading-none">{product.name}</h1>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                    {product.description}
                </p>
            </div>

            {/* Local Inventory Card */}
            <div className="bg-[#0f172a]/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Local Inventory</h3>
                    <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold">
                        <MapPin size={14} />
                        Mumbai, MH
                    </div>
                </div>

                <div className="space-y-6">
                    {inventory.map((item, index) => (
                        <div key={index} className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <h4 className="text-white font-bold text-sm group-hover:text-primary transition-colors">{item.store.name}</h4>
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter mt-1">{(index + 1) * 2.4} KM AWAY</p>
                            </div>
                            <div className="text-right">
                                <div className="text-white font-black text-base">₹{item.price.toLocaleString('en-IN')}</div>
                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                    <span className={`w-1 h-1 rounded-full ${item.status === 'IN_STOCK' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    <span className={`text-[9px] font-black tracking-tighter ${item.status === 'IN_STOCK' ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Config & Buttons */}
            <div className="space-y-8">
                <div className="flex gap-12">
                    {/* Quantity */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Quantity</span>
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-1">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"><Minus size={14}/></button>
                            <span className="text-sm font-black w-4 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"><Plus size={14}/></button>
                        </div>
                    </div>

                    {/* Size Selector */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-4 flex-1">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                Available Size {product.sizeType ? `(${product.sizeType})` : ''}
                            </span>
                            <div className="grid grid-cols-4 gap-2">
                                {product.sizes.map(size => (
                                    <button 
                                      key={size}
                                      onClick={() => setSelectedSize(size)}
                                      className={`py-3 rounded-xl text-xs font-black transition-all border ${selectedSize === size ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]">
                        <ShoppingBag size={18} />
                        Add to Cart
                    </button>
                    <button className="flex-1 border-2 border-yellow-500/50 hover:border-yellow-500 text-yellow-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]">
                        <Zap size={18} />
                        Negotiate Price
                    </button>
                </div>

                <div className="flex items-center justify-center gap-3 text-gray-500">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Guaranteed Authentic & 7-Day Easy Returns</span>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
