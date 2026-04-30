import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { 
  Package, 
  MessageSquare, 
  TrendingUp, 
  Store,
  PlusCircle,
  BarChart3,
  MapPin
} from 'lucide-react';
import { fetchMyStore } from '../redux/storeSlice';
import CreateStore from './CreateStore';

const RetailerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { myStore, myStoreStatus } = useSelector((state) => state.stores);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'retailer' && myStoreStatus === 'idle') {
      dispatch(fetchMyStore());
    }
  }, [user, myStoreStatus, dispatch]);

  if (myStoreStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no store exists, display the Create Store form directly
  // Note: if the store isn't found, the API returns 404 so status might be 'failed'
  if ((myStoreStatus === 'succeeded' || myStoreStatus === 'failed') && !myStore) {
    return <CreateStore />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        
        {/* Store Banner */}
        {myStore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[300px] rounded-[2rem] overflow-hidden mb-12 border border-white/10 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
            <img 
              src={myStore.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80'} 
              alt={myStore.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex justify-between items-end">
              <div>
                <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                  <MapPin size={12} /> {myStore.location}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{myStore.name}</h1>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">Owner</p>
                <p className="font-medium text-lg">{myStore.ownerName}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/dashboard/add-product')}
            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 hover:border-primary/50 rounded-2xl p-6 flex items-center gap-4 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors">
              <PlusCircle size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Add Product</h3>
              <p className="text-sm text-gray-400">List a new item in your store</p>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/products')}
            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 flex items-center gap-4 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white transition-colors">
              <Package size={24} className="text-white group-hover:text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold">View All Products</h3>
              <p className="text-sm text-gray-400">Manage your existing inventory</p>
            </div>
          </motion.button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Monthly Sales Chart (Mock) */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">Monthly Sales</h3>
                <p className="text-sm text-gray-400">Items sold this month</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <BarChart3 className="text-emerald-400" size={20} />
              </div>
            </div>
            {/* CSS Mock Chart */}
            <div className="h-48 flex items-end justify-between gap-3">
              {[40, 70, 45, 90, 65, 85, 110].map((height, i) => (
                <div key={i} className="w-full relative group h-full flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400/80 rounded-t-md transition-all duration-500 group-hover:from-emerald-400 group-hover:to-emerald-300"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-black py-1 px-2 rounded-md shadow-lg pointer-events-none">
                    {height * 12}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Yearly Sales Chart (Mock) */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">Yearly Overview</h3>
                <p className="text-sm text-gray-400">Total revenue generated</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="text-blue-400" size={20} />
              </div>
            </div>
            {/* CSS Mock Area Chart */}
            <div className="h-48 relative flex items-end">
               <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M0,100 L0,60 Q10,50 20,70 T40,40 T60,60 T80,30 T100,10 L100,100 Z" 
                    fill="url(#gradient)" 
                  />
                  <path 
                    d="M0,60 Q10,50 20,70 T40,40 T60,60 T80,30 T100,10" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                  />
                  {/* Data points */}
                  <circle cx="20" cy="70" r="3" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="40" cy="40" r="3" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="60" cy="60" r="3" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="80" cy="30" r="3" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="100" cy="10" r="3" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
               </svg>
            </div>
            <div className="flex justify-between mt-6 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
          </div>
        </div>

        {/* Negotiation Section */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageSquare className="text-primary" size={20} />
            </div>
            <h3 className="text-xl font-bold">Active Negotiations</h3>
          </div>
          
          <div className="space-y-4">
             {/* Mock Negotiation Items */}
             {[1, 2].map((item) => (
                <div key={item} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                    <div className="w-14 h-14 rounded-xl bg-gray-800 shrink-0 overflow-hidden border border-white/10">
                       <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80&sig=${item}`} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base">Premium Smartwatch {item}</h4>
                      <p className="text-xs md:text-sm text-gray-400 mt-1">
                        Customer offer: <span className="text-emerald-400 font-bold text-base ml-1">₹12,500</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/30 transition-colors">
                      Accept
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors">
                      Counter
                    </button>
                  </div>
                </div>
             ))}
             
             <button className="mt-6 w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors border border-dashed border-white/10 rounded-2xl hover:bg-white/5">
               View All Negotiations (12 Pending)
             </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default RetailerDashboard;
