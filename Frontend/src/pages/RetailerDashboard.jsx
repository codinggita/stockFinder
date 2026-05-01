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
  MapPin,
  ArrowRight
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
      <div className="min-h-screen bg-background text-textMain flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if ((myStoreStatus === 'succeeded' || myStoreStatus === 'failed') && !myStore) {
    return <CreateStore />;
  }

  return (
    <div className="min-h-screen bg-background text-textMain selection:bg-primary/30 pb-32">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        
        {/* Store Banner */}
        {myStore && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[360px] rounded-[3rem] overflow-hidden mb-16 border border-borderCustom group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
            <img 
              src={myStore.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80'} 
              alt={myStore.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] opacity-60"
            />
            <div className="absolute bottom-0 left-0 p-12 z-20 w-full flex justify-between items-end">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-[1px] bg-accent" />
                  <p className="text-accent font-black uppercase tracking-[0.4em] text-[9px] flex items-center gap-2">
                    <MapPin size={12} /> {myStore.location}
                  </p>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">
                  <span className="text-primary not-italic">Luxe</span><br/>{myStore.name}
                </h1>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-subtext text-[10px] font-black uppercase tracking-[0.3em] mb-2">Director</p>
                <p className="font-black text-xl tracking-tight uppercase">{myStore.ownerName}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="mb-16">
          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => navigate('/products')}
            className="w-full relative overflow-hidden bg-surface border border-borderCustom hover:border-primary/40 rounded-[2.5rem] p-10 flex items-center justify-between transition-all group shadow-2xl"
          >
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-xl group-hover:shadow-primary/40">
                <PlusCircle size={36} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-black tracking-tighter text-textMain uppercase mb-2">Expand Inventory</h3>
                <p className="text-subtext text-[11px] font-black uppercase tracking-[0.2em]">Deploy new assets to the global marketplace manifest</p>
              </div>
            </div>
            
            <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
            
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-sectionSurface border border-borderCustom flex items-center justify-center group-hover:border-accent transition-all hidden md:flex">
                <ArrowRight className="text-accent group-hover:translate-x-2 transition-transform" size={24} />
            </div>
          </motion.button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Monthly Sales Chart */}
          <div className="bg-surface border border-borderCustom rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-6 h-[1px] bg-primary" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Performance</h3>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Monthly Volume</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <BarChart3 className="text-primary" size={22} />
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-5">
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-full relative group h-full flex items-end">
                  <div 
                    className="w-full bg-primary/30 rounded-xl transition-all duration-700 group-hover:bg-primary group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary text-white text-[10px] font-black py-1.5 px-3 rounded-lg pointer-events-none whitespace-nowrap shadow-xl">
                    {height * 12} UNITS
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8 text-[9px] font-black text-subtext uppercase tracking-[0.3em]">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Yearly Sales Chart */}
          <div className="bg-surface border border-borderCustom rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-6 h-[1px] bg-emerald-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Revenue</h3>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Annual Projection</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <TrendingUp className="text-emerald-500" size={22} />
              </div>
            </div>
            
            <div className="h-56 flex items-end justify-between gap-3">
               {[20, 35, 25, 45, 60, 50, 75, 90, 80, 100].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full relative group">
                    <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-emerald-500 text-white text-[10px] font-black py-1.5 px-3 rounded-lg pointer-events-none whitespace-nowrap shadow-xl z-20">
                      ₹{height}K
                    </div>
                    <div className="w-full flex justify-center h-full items-end group-hover:opacity-80 transition-opacity">
                      <div 
                        className="w-1.5 rounded-full bg-emerald-500/30 relative group-hover:bg-emerald-400 transition-all duration-500"
                        style={{ height: `${height}%` }}
                      >
                         <div className="absolute top-0 -left-1 w-3.5 h-3.5 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_20px_rgba(52,211,153,0.8)] border-4 border-emerald-500"></div>
                      </div>
                    </div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between mt-8 text-[9px] font-black text-subtext uppercase tracking-[0.3em]">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
          </div>
        </div>

        {/* Negotiation Section */}
        <div className="bg-surface border border-borderCustom rounded-[3rem] p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-6 h-[1px] bg-accent" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Active Protocol</h3>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Live Negotiations</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <MessageSquare className="text-accent" size={22} />
            </div>
          </div>
          
          <div className="space-y-6">
             {[1, 2].map((item) => (
                <div key={item} className="flex flex-col md:flex-row items-center justify-between p-6 bg-sectionSurface rounded-[2rem] border border-borderCustom hover:border-accent/40 transition-all duration-500 group/item">
                  <div className="flex items-center gap-6 w-full md:w-auto mb-6 md:mb-0">
                    <div className="w-20 h-20 rounded-2xl bg-background shrink-0 overflow-hidden border border-borderCustom group-hover/item:border-accent/30 transition-all">
                       <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80&sig=${item}`} alt="Product" className="w-full h-full object-cover opacity-60 group-hover/item:opacity-90 transition-opacity" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg uppercase tracking-tighter group-hover/item:text-accent transition-colors">Premium Artifact {item}</h4>
                      <p className="text-[10px] text-subtext mt-2 font-black uppercase tracking-[0.2em]">
                        Counter-Offer Detected: <span className="text-accent font-black text-lg italic ml-2">₹12,500</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-10 py-4 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-xl">
                      Authorize
                    </button>
                    <button className="flex-1 md:flex-none px-10 py-4 bg-surface text-textMain rounded-xl text-[10px] font-black uppercase tracking-widest border border-borderCustom hover:border-accent transition-all">
                      Counter
                    </button>
                  </div>
                </div>
             ))}
             
             <button 
               onClick={() => navigate('/dashboard/negotiations')}
               className="mt-8 w-full py-5 text-[10px] font-black text-subtext uppercase tracking-[0.4em] border border-borderCustom rounded-2xl hover:bg-surface hover:text-textMain transition-all">
               Access Full Negotiation Registry &rarr;
             </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default RetailerDashboard;
