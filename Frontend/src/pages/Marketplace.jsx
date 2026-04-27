import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import StoreCard from '../components/StoreCard';
import ProductCard from '../components/ProductCard';
import { fetchNearbyStores } from '../redux/storeSlice';
import { fetchProducts } from '../redux/productSlice';
import { motion } from 'framer-motion';

const Marketplace = () => {
  const dispatch = useDispatch();
  const { items: stores, status: storesStatus } = useSelector((state) => state.stores);
  const { items: products, status: productsStatus } = useSelector((state) => state.products);
  const { results: searchResults, status: searchStatus } = useSelector((state) => state.search);

  useEffect(() => {
    // Mock user location for nearby stores (Ahmedabad, Gujarat)
    dispatch(fetchNearbyStores({ lat: 23.0225, lng: 72.5714 }));
    dispatch(fetchProducts());
  }, [dispatch]);

  const displayStores = searchStatus === 'succeeded' && searchResults?.stores ? searchResults.stores : stores;
  const displayProducts = searchStatus === 'succeeded' && searchResults?.products ? searchResults.products : products;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans selection:bg-primary/40">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" 
            alt="Retail Store" 
            className="w-full h-full object-cover scale-105 opacity-60"
          />
          <div className="absolute inset-0 bg-[#020617]/85 z-10 backdrop-blur-[1px]"></div>
          
          {/* Subtle warm glow from the ceiling lights in the design */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-yellow-600/10 blur-[150px] rounded-full z-10"></div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold text-white mb-6 tracking-tight leading-[1.05]"
          >
            Check Store Stock Before You Go
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-base max-w-2xl mx-auto mb-2 font-medium opacity-80"
          >
            Real-time inventory intelligence across Gujarat's elite retailers. Precision data for the discerning shopper.
          </motion.p>

          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-28">
        
        {/* Stores Section 1 */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-primary text-2xl">📍</span> Nearby Stores
              </h2>
              <p className="text-[13px] text-gray-500 mt-1 font-medium">Curated outlets within 10KM of your location</p>
            </div>
            <Link to="/stores" className="text-[11px] font-black text-gray-400 hover:text-white uppercase tracking-[0.2em] flex items-center transition-all group">
              View All Stores <span className="ml-2 text-base group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storesStatus === 'loading' ? (
              [1, 2, 3].map(i => <div key={i} className="h-72 bg-white/5 rounded-2xl animate-pulse"></div>)
            ) : (
              displayStores.slice(0, 3).map((store) => (
                <StoreCard key={store._id} store={store} />
              ))
            )}
          </div>
        </section>

        {/* Stores Section 2 (Products) - DUPLICATING TITLES AS PER PHOTO DESIGN */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-primary text-2xl">💎</span> Premium Inventory
              </h2>
              <p className="text-[13px] text-gray-500 mt-1 font-medium">Real-time stock availability across all locations</p>
            </div>
            <Link to="/products" className="text-[11px] font-black text-gray-400 hover:text-white uppercase tracking-[0.2em] flex items-center transition-all group">
              View All Products <span className="ml-2 text-sm group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productsStatus === 'loading' ? (
               [1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-white/5 rounded-3xl animate-pulse"></div>)
            ) : (
              displayProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </section>

      </main>

      {/* Footer Stats */}
      <footer className="border-t border-white/5 bg-[#020617] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="space-y-3">
            <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.25em]">Active Stores</p>
            <p className="text-4xl font-bold text-white tracking-tighter">1,240+</p>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.25em]">Live Inventory</p>
            <p className="text-4xl font-bold text-white tracking-tighter">85.4K</p>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.25em]">Avg. Sync Time</p>
            <p className="text-4xl font-bold text-white tracking-tighter">0.8s</p>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.25em]">Support Status</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="w-3 h-3 rounded-full bg-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.6)]"></span>
              <p className="text-xs font-black text-white tracking-widest">OPERATIONAL</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;
