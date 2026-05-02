import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../redux/productSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, ArrowLeft, ArrowRight, X, Package, Tag, IndianRupee, Image as ImageIcon, AlignLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { myStore } = useSelector((state) => state.stores);
  
  const [priceRange, setPriceRange] = useState(150000);
  const [maxDistance, setMaxDistance] = useState('Anywhere');
  const [availability, setAvailability] = useState(
    user?.role === 'retailer' 
      ? ['In Stock', 'Pre-order', 'Exclusive Access', 'Out of Stock'] 
      : ['In Stock']
  );
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    sizeType: '',
    sizes: []
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const imageUrls = [formData.image1, formData.image2, formData.image3, formData.image4].filter(url => url && url.trim() !== '');
      const response = await api.post('/stores/my-store/products', {
        ...formData,
        price: Number(formData.price),
        image: imageUrls[0] || '',
        images: imageUrls
      });
      if (response.data.success) {
        toast.success('Product added successfully!');
        setShowAddModal(false);
        setFormData({ name: '', category: '', price: '', description: '', image1: '', image2: '', image3: '', image4: '', sizeType: '', sizes: [] });
        fetchFilteredProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchFilteredProducts = () => {
    const filters = {
      maxPrice: priceRange,
      status: availability.join(','),
      lat: 23.0225,
      lng: 72.5714,
      radius: maxDistance
    };
    if (user?.role === 'retailer' && myStore?._id) {
      filters.storeId = myStore._id;
    }
    dispatch(fetchProducts(filters));
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchFilteredProducts();
  }, [dispatch, availability, maxDistance, priceRange, user, myStore]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchFilteredProducts();
  };

  const toggleAvailability = (type) => {
    setAvailability(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const distanceOptions = ['Under 5 KM', 'Under 15 KM', 'Under 30 KM', 'Anywhere'];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent/40">
      <Navbar />
      
      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full flex gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-80 flex-shrink-0 hidden lg:block relative z-10">
          <div className="sticky top-32 h-[calc(100vh-10rem)] flex flex-col">
            
            <div className="flex-1 bg-surface shadow-premium border border-borderCustom/20 rounded-[2.5rem] p-10 pb-20 relative overflow-hidden overflow-y-auto scrollbar-hide">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-scan z-20"></div>
              
              <div className="flex flex-col gap-2 mb-12">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] italic">Registry_01</span>
                    <div className="flex-1 h-[1px] bg-borderCustom/10" />
                 </div>
                  <h2 className="text-3xl font-black text-textMain italic tracking-tighter uppercase leading-none">Refine<br/>Registry</h2>
              </div>

              {/* Price Calibration */}
              <div className="space-y-8 mb-16">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-subtext/60 uppercase tracking-[0.4em]">Price_Calibration</p>
                  <span className="text-sm font-black text-accent italic">₹{priceRange.toLocaleString()}</span>
                </div>
                <div className="relative pt-2">
                   <input 
                     type="range" 
                     min="0" 
                     max="150000" 
                     step="5000"
                     value={priceRange}
                     onChange={(e) => setPriceRange(Number(e.target.value))}
                     className="w-full h-[1px] bg-sectionSurface appearance-none cursor-pointer accent-accent rounded-full"
                   />
                   <div className="flex justify-between mt-4 text-[8px] font-black text-subtext/20 uppercase tracking-widest">
                      <span>Min_0</span>
                      <span>Max_150K</span>
                   </div>
                </div>
              </div>

              {/* Range Targeting */}
              <div className="space-y-6 mb-16">
                <p className="text-[10px] font-black text-subtext/60 uppercase tracking-[0.5em]">Spatial_Targeting</p>
                <div className="grid grid-cols-1 gap-3">
                  {distanceOptions.map((dist, i) => (
                    <button 
                      key={dist}
                      onClick={() => setMaxDistance(dist)}
                      className={`relative flex items-center justify-between p-4 rounded-2xl transition-all ${
                        maxDistance === dist 
                          ? 'bg-textMain text-background translate-x-2 shadow-xl' 
                          : 'bg-sectionSurface/40 border border-borderCustom/20 text-subtext hover:bg-sectionSurface hover:border-accent/40'
                      }`}
                    >
                       <span className="text-[10px] font-black uppercase tracking-widest">{dist}</span>
                       <div className={`w-1.5 h-1.5 rounded-full ${maxDistance === dist ? 'bg-accent shadow-[0_0_10px_rgba(194,163,120,1)]' : 'bg-borderCustom/20'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Switches */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-subtext/60 uppercase tracking-[0.5em]">Asset_Lifecycle</p>
                <div className="flex flex-col gap-4">
                  {['In Stock', 'Out of Stock', 'Pre-order', 'Exclusive Access'].map(item => (
                    <div 
                      key={item} 
                      onClick={() => toggleAvailability(item)}
                      className="flex items-center justify-between group cursor-pointer"
                    >
                       <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${availability.includes(item) ? 'text-textMain' : 'text-subtext/40'}`}>
                          {item}
                       </span>
                       <div className={`w-10 h-5 rounded-full border transition-all relative ${availability.includes(item) ? 'bg-accent/20 border-accent' : 'bg-sectionSurface border-borderCustom/20'}`}>
                          <motion.div 
                            animate={{ x: availability.includes(item) ? 20 : 0 }}
                            className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full ${availability.includes(item) ? 'bg-textMain shadow-[0_0_10px_rgba(45,41,38,0.3)]' : 'bg-subtext/20'}`}
                          />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 px-10 flex justify-between items-center pointer-events-none z-30">
               <div className="text-[8px] font-black text-subtext/20 uppercase tracking-[0.4em] italic">Reg_Luxe_2026</div>
               <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-accent flex flex-col items-center">
                  <ChevronDown size={14} strokeWidth={3} />
               </motion.div>
            </div>
          </div>
        </aside>

        {/* Product Listing Area */}
        <div className="flex-1 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-borderCustom/10">
            <div className="space-y-4">
              {user?.role === 'retailer' && (
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-accent hover:text-textMain mb-4 transition-colors group">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Back to Terminal</span>
                </button>
              )}
              <h1 className="text-6xl font-black text-textMain tracking-tighter uppercase italic leading-none">
                {user?.role === 'retailer' ? 'Inventory' : 'Marketplace'}
              </h1>
              <p className="text-subtext max-w-xl text-[11px] font-medium uppercase tracking-widest leading-relaxed">
                {user?.role === 'retailer' 
                  ? 'Manage your authorized stock manifest and active listings.' 
                  : 'Curated selection of high-fidelity assets from verified luxury outlets.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end gap-5">
              {user?.role === 'retailer' && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-textMain text-background px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-premium hover:bg-accent hover:text-white"
                >
                  Add Asset Entry +
                </button>
              )}
              <div className="flex bg-surface p-1 rounded-xl border border-borderCustom/20 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-background text-textMain shadow-md' : 'text-subtext/40 hover:text-textMain'}`}><LayoutGrid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-background text-textMain shadow-md' : 'text-subtext/40 hover:text-textMain'}`}><List size={18} /></button>
              </div>
            </div>
          </div>

          {/* Grid Area */}
          <div className={`grid gap-10 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {status === 'loading' ? (
               [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[3/4] bg-surface rounded-[2.5rem] animate-pulse border border-borderCustom/20" />)
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map((product) => <ProductCard key={product._id} product={product} viewMode={viewMode} />)
            ) : (
              <div className="col-span-full py-40 text-center border border-dashed border-borderCustom/20 rounded-[3rem] bg-surface/40">
                <p className="text-subtext/40 font-black uppercase tracking-[0.5em] text-xs italic mb-8">Manifest Entry Empty</p>
                <button onClick={() => { setPriceRange(150000); setMaxDistance('Anywhere'); handleApplyFilters(); }} className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline italic">Reset Protocol</button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-16 flex items-center justify-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 rounded-xl bg-surface border border-borderCustom/20 flex items-center justify-center text-subtext/40 hover:text-textMain transition-all disabled:opacity-20" 
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page} 
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-xl text-[10px] font-black transition-all ${
                    page === currentPage 
                      ? 'bg-textMain text-background shadow-premium' 
                      : 'bg-surface border border-borderCustom/20 text-subtext hover:bg-sectionSurface'
                  }`}
                >
                  {page.toString().padStart(2, '0')}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-12 h-12 rounded-xl bg-surface border border-borderCustom/20 flex items-center justify-center text-subtext/40 hover:text-textMain transition-all disabled:opacity-20"
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-borderCustom/20 bg-surface/50 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-textMain tracking-[0.3em] uppercase italic">Luxe Retail</h2>
            <p className="text-subtext/60 text-[11px] font-medium uppercase tracking-widest leading-loose italic">The global standard for premium asset discovery and inventory coordination.</p>
          </div>
          {['Platform', 'Resources', 'Corporate'].map(cat => (
            <div key={cat}>
              <h4 className="text-textMain font-black mb-8 text-[10px] uppercase tracking-[0.4em] italic">{cat}</h4>
              <ul className="space-y-4 text-subtext/60 text-[10px] font-black uppercase tracking-widest">
                <li><a href="#" className="hover:text-accent transition-colors">Manifest Hub</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Retail Ledger</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Sync Protocol</a></li>
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-borderCustom/10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black text-subtext/40 uppercase tracking-[0.4em] italic">© 2026 Luxe Atelier Terminal // All Systems Go</p>
           <div className="flex gap-10 text-[10px] font-black text-subtext/40 uppercase tracking-widest italic">
             <a href="#" className="hover:text-textMain transition-colors">Privacy_Log</a>
             <a href="#" className="hover:text-textMain transition-colors">Security_Audit</a>
           </div>
        </div>
      </footer>

      {/* Theme-Aware Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 20 }} className="relative w-full max-w-4xl bg-surface border border-borderCustom/20 rounded-[3rem] shadow-premium overflow-hidden z-10 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-12 border-b border-borderCustom/10 bg-sectionSurface/40">
                <div className="space-y-2">
                   <h3 className="text-4xl font-black text-textMain tracking-tighter uppercase italic leading-none">New Asset Entry</h3>
                   <p className="text-[10px] font-black text-subtext/40 uppercase tracking-[0.4em] italic">Registry // Inventory Command</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-background border border-borderCustom/20 text-subtext hover:text-textMain transition-all shadow-md"><X size={24} /></button>
              </div>
              <div className="p-12 overflow-y-auto custom-scrollbar bg-background/20">
                <form onSubmit={handleAddSubmit} className="space-y-16">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                     <div className="space-y-4">
                        <h4 className="text-sm font-black text-textMain uppercase tracking-widest italic">Core Parameters</h4>
                        <p className="text-[10px] text-subtext leading-relaxed font-medium uppercase tracking-widest">Provide high-fidelity identification for the new inventory line.</p>
                     </div>
                     <div className="lg:col-span-2 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <InputField label="Asset Name" name="name" placeholder="Signature Series..." icon={Package} value={formData.name} onChange={handleFormChange} required />
                           <InputField label="Category" name="category" placeholder="Apparel, Gear..." icon={Tag} value={formData.category} onChange={handleFormChange} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <InputField label="Valuation (₹)" name="price" type="number" placeholder="45000" icon={IndianRupee} value={formData.price} onChange={handleFormChange} required />
                           <InputField label="Description" name="description" placeholder="Technical specifications..." icon={AlignLeft} value={formData.description} onChange={handleFormChange} required />
                        </div>
                     </div>
                  </div>
                  <div className="h-[1px] bg-borderCustom/10 w-full" />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                     <div className="space-y-4">
                        <h4 className="text-sm font-black text-textMain uppercase tracking-widest italic">Visual Manifest</h4>
                        <p className="text-[10px] text-subtext leading-relaxed font-medium uppercase tracking-widest">Integrate visual proofing for the registry. Main cover required.</p>
                     </div>
                     <div className="lg:col-span-2 space-y-8">
                        <InputField label="Primary Manifest Photo" name="image1" placeholder="URL" icon={ImageIcon} value={formData.image1} onChange={(e) => setFormData({...formData, image1: e.target.value})} required />
                        <div className="grid grid-cols-3 gap-4">
                           {[2,3,4].map(i => <InputField key={i} name={`image${i}`} placeholder={`URL ${i}`} icon={ImageIcon} value={formData[`image${i}`]} onChange={(e) => setFormData({...formData, [`image${i}`]: e.target.value})} />)}
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-6 pt-12 border-t border-borderCustom/10">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-subtext/40 hover:text-textMain transition-all italic">Discard Entry</button>
                    <Button type="submit" isLoading={isSubmitting} className="flex-[2] !rounded-2xl !py-5 !text-[10px] !font-black uppercase tracking-[0.3em] shadow-premium italic">Save Entry & Sync &rarr;</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllProducts;
