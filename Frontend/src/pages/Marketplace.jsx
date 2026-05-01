import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import StoreCard from '../components/StoreCard';
import ProductCard from '../components/ProductCard';
import { fetchNearbyStores } from '../redux/storeSlice';
import { fetchProducts } from '../redux/productSlice';
import { clearSearch } from '../redux/searchSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import Button from '../components/Button';
import heroBg from '../assets/hero_bg.png';


const Marketplace = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [storePage, setStorePage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  const STORE_ITEMS_PER_PAGE = 6;
  const PRODUCT_ITEMS_PER_PAGE = 8;
  const { items: stores, status: storesStatus } = useSelector((state) => state.stores);
  const { items: products, status: productsStatus } = useSelector((state) => state.products);
  const { results: searchResults, status: searchStatus, query } = useSelector((state) => state.search);

  useEffect(() => {
    dispatch(fetchNearbyStores({ lat: 23.0225, lng: 72.5714 }));
    dispatch(fetchProducts());
  }, [dispatch]);

  const isSearching = searchStatus === 'succeeded' && query;
  const displayStores = isSearching ? (searchResults?.stores || []).slice(0, 6) : stores.slice(0, 6);
  const displayProducts = isSearching ? (searchResults?.products || []).slice(0, 8) : products.slice(0, 8);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/40">
      <Navbar />
      
      {/* Subtle Retailer Banner */}
      {user?.role === 'retailer' && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-primary/5 border-b border-borderCustom backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-primary/80 flex items-center gap-2">
              <ShieldCheck size={10} />
              Partner Account Active
            </p>
            <Link to="/dashboard" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">
              Dashboard Control &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Refined & Compact Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroBg}
            alt="Luxury Retail" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40"></div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 mb-6"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent/80">Luxe Retail Intelligence</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-textMain mb-8 tracking-tighter leading-[0.9] uppercase"
          >
            Instant <span className="text-primary italic block md:inline">Stock</span> <br className="hidden md:block" /> Intelligence
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-subtext text-[11px] max-w-lg mx-auto mb-10 font-medium uppercase tracking-[0.2em] leading-relaxed opacity-80"
          >
            Real-time inventory discovery across Gujarat's premier retail nodes. 
            Search, negotiate, and secure assets instantly.
          </motion.p>

          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full space-y-24">
        
        {/* Stores Section */}
        <section>
          <div className="flex justify-between items-end mb-12 border-b border-borderCustom pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[1px] bg-accent" />
                <span className="text-[9px] font-black text-accent uppercase tracking-[0.3em]">Network Hubs</span>
              </div>
              <h2 className="text-3xl font-black text-textMain tracking-tighter uppercase italic">
                {isSearching ? 'Matched Stores' : 'Curated Outlets'}
              </h2>
            </div>
            {!isSearching && (
              <Link to="/stores" className="text-[9px] font-black text-subtext hover:text-accent uppercase tracking-[0.2em] flex items-center transition-all group">
                View All <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayStores.length > 0 ? (
              displayStores.map((store) => (
                <motion.div key={store._id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <StoreCard store={store} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-borderCustom rounded-3xl bg-surface/5">
                <p className="text-subtext font-black uppercase tracking-[0.3em] text-[10px]">No results located in registry</p>
              </div>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="flex justify-between items-end mb-12 border-b border-borderCustom pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[1px] bg-primary" />
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Active Feed</span>
              </div>
              <h2 className="text-3xl font-black text-textMain tracking-tighter uppercase italic">
                {isSearching ? 'Relevant Items' : 'Prime Selection'}
              </h2>
            </div>
            {!isSearching && (
              <Link to="/products" className="text-[9px] font-black text-subtext hover:text-primary uppercase tracking-[0.2em] flex items-center transition-all group">
                Full Feed <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-borderCustom rounded-3xl bg-surface/5">
                <p className="text-subtext font-black uppercase tracking-[0.3em] text-[10px]">Asset manifest empty</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-borderCustom bg-surface/30 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 text-[9px] font-black text-subtext uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Registry Active
            </div>
            <span>85K+ Active SKU</span>
            <span>1.2K verified Hubs</span>
          </div>
          
          <div className="flex items-center gap-6">
             <span className="text-[9px] font-black text-subtext uppercase tracking-[0.4em]">Luxe Retail © 2026</span>
             <div className="w-[1px] h-4 bg-borderCustom" />
             <div className="flex gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-subtext/60">
               <a href="#" className="hover:text-primary">Privacy</a>
               <a href="#" className="hover:text-primary">Terms</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
