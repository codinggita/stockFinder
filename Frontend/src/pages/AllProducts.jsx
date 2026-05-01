import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../redux/productSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowLeft, X, Package, Tag, IndianRupee, Image as ImageIcon, AlignLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/40">
      <Navbar />
      
      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full flex gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-80 flex-shrink-0 hidden lg:block">
          <div className="sticky top-32 space-y-8 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 scrollbar-thin">
            <div className="bg-surface/60 backdrop-blur-xl border border-borderCustom rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-10">
                 <SlidersHorizontal size={20} className="text-primary" />
                 <h2 className="text-xl font-bold text-textMain tracking-tight">Refine Search</h2>
              </div>

              {/* Price Range */}
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-subtext uppercase tracking-widest">Price Range (₹)</p>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="150000" 
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-sectionSurface rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] font-bold text-subtext">
                  <span>₹0</span>
                  <span className="text-textMain">₹{priceRange.toLocaleString()}+</span>
                </div>
              </div>

              {/* Max Distance */}
              <div className="space-y-5 mb-12">
                <p className="text-[10px] font-black text-subtext uppercase tracking-widest">Max Distance (KM)</p>
                <div className="grid grid-cols-2 gap-3">
                  {distanceOptions.map(dist => (
                    <button 
                      key={dist}
                      onClick={() => setMaxDistance(dist)}
                      className={`py-3 px-2 rounded-xl text-[10px] font-bold transition-all border ${
                        maxDistance === dist 
                          ? 'bg-primary/20 border-primary/50 text-textMain' 
                          : 'bg-sectionSurface border-borderCustom text-subtext hover:border-primary/30'
                      }`}
                    >
                      {dist}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-5 mb-10">
                <p className="text-[10px] font-black text-subtext uppercase tracking-widest">Availability</p>
                <div className="space-y-4">
                  {['In Stock', 'Out of Stock', 'Pre-order', 'Exclusive Access'].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => toggleAvailability(item)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          availability.includes(item) 
                            ? 'bg-primary border-primary' 
                            : 'bg-surface border-borderCustom group-hover:border-primary/40'
                        }`}
                      >
                        {availability.includes(item) && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <span className={`text-xs font-bold transition-colors ${availability.includes(item) ? 'text-textMain' : 'text-subtext'}`}>
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="w-full bg-primary/10 border border-primary/20 text-primary py-3 rounded-2xl text-xs font-bold text-center tracking-widest mt-4">
                Filters Apply Automatically
              </div>
            </div>

            {/* Join Elite Card */}
            <div className="bg-gradient-to-br from-primary/10 to-background border border-borderCustom rounded-3xl p-8 relative overflow-hidden group">
               <div className="relative z-10">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2">Member Exclusive</p>
                  <h3 className="text-2xl font-bold text-textMain leading-tight mb-4">Join the Elite</h3>
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-borderCustom group-hover:bg-primary transition-all">
                     <ChevronRight size={18} />
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
            </div>
          </div>
        </aside>

        {/* Product Listing Area */}
        <div className="flex-1 space-y-10">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {user?.role === 'retailer' && (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-subtext hover:text-textMain mb-6 transition-colors group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Dashboard</span>
                </button>
              )}
              <h1 className="text-5xl font-black text-textMain tracking-tighter mb-4">
                {user?.role === 'retailer' ? 'My Products' : 'Marketplace'}
              </h1>
              <p className="text-subtext max-w-2xl text-sm font-medium">
                {user?.role === 'retailer' 
                  ? 'Manage your existing inventory and track live stock.' 
                  : 'Discover premium inventory from verified luxury partners across India.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end gap-4">
              {user?.role === 'retailer' && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <span className="text-lg leading-none">+</span> Add Product
                </button>
              )}
              <div className="flex bg-surface p-1 rounded-xl border border-borderCustom">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-sectionSurface text-textMain shadow-lg' : 'text-subtext hover:text-textMain'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-sectionSurface text-textMain shadow-lg' : 'text-subtext hover:text-textMain'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {status === 'loading' ? (
               [1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="aspect-[4/5] bg-surface rounded-3xl animate-pulse border border-borderCustom"></div>
               ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-40 text-center border border-dashed border-borderCustom rounded-[3rem] bg-surface/20">
                <div className="mb-6 text-6xl opacity-20">🔍</div>
                <p className="text-subtext font-black uppercase tracking-widest text-sm">No premium items matched your criteria</p>
                <button 
                  onClick={() => {
                    setPriceRange(150000);
                    setMaxDistance('Anywhere');
                    setAvailability(user?.role === 'retailer' ? ['In Stock', 'Pre-order', 'Exclusive Access', 'Out of Stock'] : ['In Stock']);
                    handleApplyFilters();
                  }}
                  className="mt-6 text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="pt-10 flex items-center justify-center gap-3">
              <button className="w-10 h-10 rounded-xl bg-surface border border-borderCustom flex items-center justify-center text-subtext hover:bg-sectionSurface hover:text-textMain transition-all disabled:opacity-30" disabled>
                 <ChevronLeft size={20} />
              </button>
              
              {[1, 2, 3, '...', 12].map((page, i) => (
                <button 
                  key={i}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    page === 1 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-surface text-subtext hover:bg-sectionSurface hover:text-textMain'
                  } ${typeof page === 'string' ? 'cursor-default pointer-events-none' : ''}`}
                >
                  {page}
                </button>
              ))}

              <button className="w-10 h-10 rounded-xl bg-surface border border-borderCustom flex items-center justify-center text-subtext hover:bg-sectionSurface hover:text-textMain transition-all">
                 <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-borderCustom bg-background pt-20 pb-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h2 className="text-2xl font-black text-textMain tracking-[0.2em]">LUXE RETAIL</h2>
            <p className="text-subtext text-sm leading-relaxed max-w-xs">The definitive standard for luxury retail operations and high-end stock management.</p>
          </div>
          <div>
            <h4 className="text-textMain font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-subtext text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Retail Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Inventory API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-textMain font-bold mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-subtext text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary transition-colors">Brand Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Verification Process</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Store Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-textMain font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
            <ul className="space-y-4 text-subtext text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary transition-colors">Concierge Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Relations</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:row justify-between items-center pt-10 border-t border-borderCustom gap-4">
           <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">© 2024 Luxe Retail Platform. All Rights Reserved.</p>
           <div className="flex gap-10 text-[10px] font-bold text-subtext uppercase tracking-widest">
             <a href="#" className="hover:text-textMain">Terms of Service</a>
             <a href="#" className="hover:text-textMain">Corporate Identity</a>
           </div>
        </div>
      </footer>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface border border-borderCustom rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="flex justify-between items-center p-6 border-b border-borderCustom bg-sectionSurface">
                <h3 className="text-xl font-bold text-textMain">Add New Product</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 bg-surface hover:bg-sectionSurface rounded-full transition-colors text-subtext hover:text-textMain"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
                <form onSubmit={handleAddSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Product Name" name="name" placeholder="e.g. Premium Watch" icon={Package} value={formData.name} onChange={handleFormChange} required />
                    <InputField label="Category" name="category" placeholder="e.g. Watches, Electronic" icon={Tag} value={formData.category} onChange={handleFormChange} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Price (₹)" name="price" type="number" placeholder="e.g. 15000" icon={IndianRupee} value={formData.price} onChange={handleFormChange} required />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-subtext ml-1">Product Images (up to 4)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField name="image1" placeholder="Main Image URL" icon={ImageIcon} value={formData.image1 || ''} onChange={(e) => setFormData({ ...formData, image1: e.target.value })} required />
                      <InputField name="image2" placeholder="Image URL 2 (optional)" icon={ImageIcon} value={formData.image2 || ''} onChange={(e) => setFormData({ ...formData, image2: e.target.value })} />
                      <InputField name="image3" placeholder="Image URL 3 (optional)" icon={ImageIcon} value={formData.image3 || ''} onChange={(e) => setFormData({ ...formData, image3: e.target.value })} />
                      <InputField name="image4" placeholder="Image URL 4 (optional)" icon={ImageIcon} value={formData.image4 || ''} onChange={(e) => setFormData({ ...formData, image4: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Description" name="description" placeholder="Product description..." icon={AlignLeft} value={formData.description} onChange={handleFormChange} required />

                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-subtext mb-1 ml-1 block">Size Type</label>
                       <select 
                         name="sizeType"
                         value={formData.sizeType}
                         onChange={(e) => setFormData({ ...formData, sizeType: e.target.value, sizes: [] })}
                         className="w-full bg-surface border border-borderCustom rounded-lg py-2.5 px-3 text-[12px] font-bold text-textMain focus:outline-none focus:border-primary/40 transition-all appearance-none"
                       >
                         <option value="" className="bg-surface">No Sizes</option>
                         <option value="Clothing" className="bg-surface">Clothing (XS - XXL)</option>
                         <option value="Shoes" className="bg-surface">Shoes (6 - 12)</option>
                       </select>
                    </div>
                  </div>

                  {formData.sizeType && (
                    <div className="space-y-2 bg-sectionSurface border border-borderCustom p-4 rounded-xl">
                       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-subtext ml-1 mb-3 block">Select Available Sizes</label>
                       <div className="flex flex-wrap gap-2">
                          {(formData.sizeType === 'Clothing' ? ['XS', 'S', 'M', 'L', 'XL', 'XXL'] : ['6', '7', '8', '9', '10', '11', '12']).map(size => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`w-10 h-10 rounded-lg text-[11px] font-bold transition-colors border ${formData.sizes.includes(size) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-surface text-subtext hover:bg-sectionSurface border-borderCustom'}`}
                            >
                              {size}
                            </button>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-surface hover:bg-sectionSurface text-textMain rounded-full py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border border-borderCustom"
                    >
                      Cancel
                    </button>
                    <Button type="submit" isLoading={isSubmitting} className="flex-1">
                      Add Product &rarr;
                    </Button>
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
