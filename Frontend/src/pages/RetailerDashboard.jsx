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
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no store exists, display the Create Store form directly
  if ((myStoreStatus === 'succeeded' || myStoreStatus === 'failed') && !myStore) {
    return <CreateStore />;
  }

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-primary/30 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Store Banner */}
        {myStore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[300px] rounded-[2rem] overflow-hidden mb-12 border border-border group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent z-10" />
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

        {/* Quick Actions */}
        <div className="mb-12">
          <motion.button
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate('/products')}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-900/40 to-blue-600/20 border border-blue-500/30 hover:border-blue-400/60 rounded-3xl p-8 flex items-center justify-between transition-all group shadow-2xl"
          >
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <PlusCircle size={32} className="text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black tracking-tight text-white mb-1">Add New Product</h3>
                <p className="text-blue-200/60 font-medium">Expand your store's inventory and reach more customers</p>
              </div>
            </div>
            
            {/* Background glowing effects */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-400/20 transition-colors pointer-events-none"></div>
            
            <div className="relative z-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/10 hidden md:flex">
                <PlusCircle className="text-white opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" size={24} />
            </div>
          </motion.button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Monthly Sales Chart */}
          <div className="bg-navy border border-border rounded-3xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">Monthly Sales</h3>
                <p className="text-sm text-gray-400">Items sold this month</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <BarChart3 className="text-primary" size={20} />
              </div>
            </div>
            
            {/* Clean Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-4">
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-full relative group h-full flex items-end">
                  <div 
                    className="w-full bg-primary/80 rounded-t-lg transition-all duration-300 group-hover:bg-primary group-hover:shadow-glow"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-dark text-xs font-bold py-1 px-2 rounded-md pointer-events-none whitespace-nowrap">
                    {height * 12}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-semibold text-gray-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Yearly Sales Chart */}
          <div className="bg-navy border border-border rounded-3xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">Yearly Overview</h3>
                <p className="text-sm text-gray-400">Total revenue generated</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="text-emerald-400" size={20} />
              </div>
            </div>
            
            {/* Clean Stepped Line Chart */}
            <div className="h-48 flex items-end justify-between gap-2">
               {[20, 35, 25, 45, 60, 50, 75, 90, 80, 100].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full relative group">
                    <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-dark text-xs font-bold py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-20">
                      ₹{height}k
                    </div>
                    <div className="w-full flex justify-center h-full items-end group-hover:opacity-80 transition-opacity">
                      <div 
                        className="w-2 rounded-t-full bg-emerald-400 relative"
                        style={{ height: `${height}%` }}
                      >
                         <div className="absolute -top-2 -left-1 w-4 h-4 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                      </div>
                    </div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-semibold text-gray-400">
              <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Negotiation Section */}
        <div className="bg-navy border border-border rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <MessageSquare className="text-orange-400" size={20} />
            </div>
            <h3 className="text-xl font-bold">Active Negotiations</h3>
          </div>
          
          <div className="space-y-4">
             {[1, 2].map((item) => (
                <div key={item} className="flex flex-col md:flex-row items-center justify-between p-4 bg-dark/50 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                    <div className="w-14 h-14 rounded-xl bg-dark shrink-0 overflow-hidden border border-border">
                       <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80&sig=${item}`} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base">Premium Smartwatch {item}</h4>
                      <p className="text-xs md:text-sm text-gray-400 mt-1">
                        Customer offer: <span className="text-primary font-bold text-base ml-1">₹12,500</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-colors">
                      Accept
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-3 bg-dark text-white rounded-xl text-xs font-bold hover:bg-dark/80 border border-border transition-colors">
                      Counter
                    </button>
                  </div>
                </div>
             ))}
             
             <button className="mt-6 w-full py-4 text-xs font-bold text-gray-400 hover:text-white transition-colors border border-border rounded-2xl hover:bg-dark/50 bg-dark/30">
               View All Negotiations (12 Pending)
             </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default RetailerDashboard;
