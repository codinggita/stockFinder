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
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans selection:bg-primary/40">
      <Navbar />
      
      {/* Retailer Dashboard Link Banner */}
      {user?.role === 'retailer' && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">
              Logged in as Retailer Partner
            </p>
            <Link 
              to="/dashboard" 
              className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-4 py-1 rounded-full hover:bg-primary/80 transition-all"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" 
            alt="Retail Store" 
            className="w-full h-full object-cover scale-105 opacity-40"
          />
          <div className="absolute inset-0 bg-[#020617]/90 z-10 backdrop-blur-[2px]"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-primary/5 blur-[150px] rounded-full z-10"></div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold text-white mb-6 tracking-tight leading-[1.05]"
          >
            Check Store Stock <br />Before You Go
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 text-sm max-w-xl mx-auto mb-10 font-bold uppercase tracking-widest"
          >
            Real-time inventory intelligence for Gujarat's elite retailers.
          </motion.p>

          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-28">
        
        {/* Search Results Summary if searching */}
        <AnimatePresence>
          {isSearching && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-10 border-b border-white/5 flex justify-between items-end"
            >
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Results for: <span className="text-primary">"{query}"</span>
                </h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">
                  Found {displayStores.length} stores and {displayProducts.length} products
                </p>
              </div>
              <button 
                onClick={() => dispatch(clearSearch())}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all mb-1"
              >
                &larr; Back to Marketplace
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stores Section */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-primary text-2xl">📍</span> {isSearching ? 'Matched Outlets' : 'Nearby Stores'}
              </h2>
              <p className="text-[11px] text-gray-500 mt-1 font-black uppercase tracking-widest">
                {isSearching ? `Displaying best matches for your search` : `Curated outlets within 10KM of Ahmedabad`}
              </p>
            </div>
            {!isSearching && (
              <Link to="/stores" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em] flex items-center transition-all group">
                View All Stores <span className="ml-2 text-base group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchStatus === 'loading' ? (
              [1, 2, 3].map(i => <div key={i} className="h-72 bg-white/5 rounded-2xl animate-pulse"></div>)
            ) : displayStores.length > 0 ? (
              displayStores.slice(0, 6).map((store) => (
                <StoreCard key={store._id} store={store} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No matching stores found</p>
              </div>
            )}
          </div>

          {/* New View More Button */}
          {!isSearching && (
            <div className="mt-12 flex justify-center">
               <Link 
                 to="/stores"
                 className="px-12 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4"
               >
                 Explore 48+ More Stores <ArrowRight size={16} className="text-primary" />
               </Link>
            </div>
          )}
        </section>

        {/* Products Section */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-primary text-2xl">💎</span> {isSearching ? 'Relevant Inventory' : 'Premium Inventory'}
              </h2>
              <p className="text-[11px] text-gray-500 mt-1 font-black uppercase tracking-widest">
                {isSearching ? `Specific items matching your request` : `Real-time stock availability across all locations`}
              </p>
            </div>
            {!isSearching && (
              <Link to="/products" className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em] flex items-center transition-all group">
                View All Products <span className="ml-2 text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {searchStatus === 'loading' ? (
               [1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-white/5 rounded-3xl animate-pulse"></div>)
            ) : displayProducts.length > 0 ? (
              displayProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No matching products found</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer Stats */}
      <footer className="border-t border-white/5 bg-[#020617] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em]">Active Stores</p>
            <p className="text-4xl font-bold text-white tracking-tighter">1,240+</p>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em]">Live Inventory</p>
            <p className="text-4xl font-bold text-white tracking-tighter">85.4K</p>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em]">Avg. Sync Time</p>
            <p className="text-4xl font-bold text-white tracking-tighter">0.8s</p>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em]">Network Status</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.6)]"></span>
              <p className="text-[10px] font-black text-white tracking-widest uppercase">Operational</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
