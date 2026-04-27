import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import StoreCard from '../components/StoreCard';
import { fetchNearbyStores } from '../redux/storeSlice';

const AllStores = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: stores, status } = useSelector((state) => state.stores);

  useEffect(() => {
    // Re-fetch stores if needed or ensure they are loaded
    if (stores.length === 0) {
      dispatch(fetchNearbyStores({ lat: 23.0225, lng: 72.5714 }));
    }
  }, [dispatch, stores.length]);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-primary/40">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/marketplace')}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-2"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Marketplace</span>
            </button>
            <h1 className="text-5xl font-black tracking-tighter leading-none">Gujarat Retail Network</h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              Exploring {stores.length} premium locations across the state
            </p>
          </div>

          {/* Search/Filter Bar */}
          <div className="w-full md:w-96 flex gap-3">
             <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by city or name..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
                />
             </div>
             <button className="bg-white/5 border border-white/10 p-4 rounded-2xl text-gray-400 hover:text-white hover:border-primary/30 transition-all">
                <Filter size={20} />
             </button>
          </div>
        </div>

        {/* Grid Section */}
        {status === 'loading' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] bg-white/5 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store, index) => (
              <motion.div
                key={store._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StoreCard store={store} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!status === 'loading' && stores.length === 0 && (
          <div className="py-40 text-center space-y-6">
            <div className="inline-flex p-8 bg-white/5 rounded-full text-gray-700">
               <Search size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">No stores found</h3>
              <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your search or filters to explore other locations in Gujarat.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-white/5 bg-[#020617] py-12 text-center">
         <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">RETAILBRIDGE INTELLIGENCE SYSTEM • STATEWIDE VIEW</p>
      </footer>
    </div>
  );
};

export default AllStores;
