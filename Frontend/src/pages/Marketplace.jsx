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
import { ArrowRight } from 'lucide-react';
import Button from '../components/Button';

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
  const totalStores = isSearching ? (searchResults?.stores?.length || 0) : stores.length;
  const totalProducts = isSearching ? (searchResults?.products?.length || 0) : products.length;
  const displayStores = isSearching ? (searchResults?.stores || []).slice(0, storePage * STORE_ITEMS_PER_PAGE) : stores.slice(0, storePage * STORE_ITEMS_PER_PAGE);
  const displayProducts = isSearching ? (searchResults?.products || []).slice(0, productPage * PRODUCT_ITEMS_PER_PAGE) : products.slice(0, productPage * PRODUCT_ITEMS_PER_PAGE);
  const hasMoreStores = storePage * STORE_ITEMS_PER_PAGE < totalStores;
  const hasMoreProducts = productPage * PRODUCT_ITEMS_PER_PAGE < totalProducts;
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/40">
      <Navbar />
      
      {/* Retailer Dashboard Link Banner */}
      {user?.role === 'retailer' && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">
              Authenticated Partner Access
            </p>
            <Link 
              to="/dashboard" 
              className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-5 py-1.5 rounded-lg hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
            >
              Partner Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-56 pb-40 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" 
            alt="Retail Store" 
            className="w-full h-full object-cover scale-105 opacity-80 dark:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10 dark:from-dark/60 dark:via-dark dark:to-dark"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-10"></div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent">Defining Luxury Retail Excellence</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-black text-textMain mb-8 tracking-tighter leading-[0.9] uppercase"
          >
            Instant <span className="text-primary italic">Stock</span><br />Intelligence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-subtext text-[11px] max-w-lg mx-auto mb-14 font-black uppercase tracking-[0.3em] leading-relaxed"
          >
            Real-time inventory visualization for Gujarat's premier retail landscape. 
            Discover, Negotiate, and Secure.
          </motion.p>

          <div className="max-w-2xl mx-auto p-2 bg-surface/40 backdrop-blur-3xl border border-borderCustom rounded-[2rem] shadow-2xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full space-y-40">
        
        {/* Stores Section */}
        <section>
          <div className="flex justify-between items-end mb-16 px-4">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Elite Network</span>
              </div>
              <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase">
                {isSearching ? 'Matched Outlets' : 'Curated Stores'}
              </h2>
            </div>
            {!isSearching && (
              <Link to="/stores" className="text-[10px] font-black text-subtext hover:text-accent uppercase tracking-[0.3em] flex items-center transition-all group border-b border-transparent hover:border-accent pb-2">
                Discovery Protocol <span className="ml-3 text-base group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {searchStatus === 'loading' ? (
              [1, 2, 3].map(i => <div key={i} className="h-80 bg-surface/20 rounded-3xl animate-pulse border border-borderCustom"></div>)
            ) : displayStores.length > 0 ? (
              displayStores.slice(0, 6).map((store) => (
                <motion.div key={store._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <StoreCard store={store} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center border border-dashed border-borderCustom rounded-[3rem] bg-surface/5">
                <p className="text-subtext font-black uppercase tracking-[0.4em] text-[10px]">Registry Empty: No matching entities found</p>
              </div>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="flex justify-between items-end mb-16 px-4">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Active Inventory</span>
              </div>
              <h2 className="text-4xl font-black text-textMain tracking-tighter uppercase">
                {isSearching ? 'Relevant Items' : 'Prime Selection'}
              </h2>
            </div>
            {!isSearching && (
              <Link to="/products" className="text-[10px] font-black text-subtext hover:text-primary uppercase tracking-[0.3em] flex items-center transition-all group border-b border-transparent hover:border-primary pb-2">
                Full Catalogue <span className="ml-3 text-base group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {searchStatus === 'loading' ? (
               [1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/5] bg-surface/20 rounded-3xl animate-pulse border border-borderCustom"></div>)
            ) : displayProducts.length > 0 ? (
              displayProducts.slice(0, 8).map((product) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center border border-dashed border-borderCustom rounded-[3rem] bg-surface/5">
                <p className="text-subtext font-black uppercase tracking-[0.4em] text-[10px]">Manifest Empty: Item not located</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer Stats */}
      <footer className="border-t border-borderCustom bg-surface/30 py-24 mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-16">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-subtext uppercase tracking-[0.3em]">Verified Outlets</p>
            <p className="text-5xl font-black text-textMain tracking-tighter italic">1.2K<span className="text-accent text-2xl not-italic ml-1">+</span></p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black text-subtext uppercase tracking-[0.3em]">Global SKU Count</p>
            <p className="text-5xl font-black text-textMain tracking-tighter italic">85K<span className="text-primary text-2xl not-italic ml-1">+</span></p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black text-subtext uppercase tracking-[0.3em]">Latency (ms)</p>
            <p className="text-5xl font-black text-textMain tracking-tighter italic">0.8<span className="text-primary text-2xl not-italic ml-1">s</span></p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black text-subtext uppercase tracking-[0.3em]">Network Integrity</p>
            <div className="flex items-center gap-4 pt-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse"></span>
              <p className="text-[11px] font-black text-textMain tracking-[0.2em] uppercase">Secured</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
