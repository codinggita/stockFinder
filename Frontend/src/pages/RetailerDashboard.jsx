import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  MessageSquare, 
  TrendingUp, 
  Store,
  PlusCircle,
  BarChart3,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  ChevronRight
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
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if ((myStoreStatus === 'succeeded' || myStoreStatus === 'failed') && !myStore) {
    return <CreateStore />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen bg-background text-textMain selection:bg-primary/30 pb-32 overflow-x-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        
        {/* --- Store Command Header --- */}
        {myStore && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[450px] rounded-[3.5rem] overflow-hidden mb-16 border border-white/10 group shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/20 z-10" />
            
            <motion.img 
              src={myStore.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80'} 
              alt={myStore.name}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-[0.5] group-hover:scale-105 transition-transform duration-[3000ms]"
            />

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
               <div className="w-full h-[2px] bg-primary/20 absolute top-0 animate-scanline shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            </div>

            {/* Header Content */}
            <div className="absolute inset-0 p-8 lg:p-16 z-20 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="px-4 py-2 rounded-xl bg-background/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">System Operational</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-background/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-textMain/70">Verified Retailer</span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-subtext text-[9px] font-black uppercase tracking-[0.3em] mb-1">Store Identity</p>
                    <p className="text-xs font-mono text-textMain/50">SR-{myStore._id?.substring(18).toUpperCase() || 'TX-402'}</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-subtext text-[9px] font-black uppercase tracking-[0.3em] mb-1">Director</p>
                      <p className="font-black text-sm tracking-tight uppercase">{myStore.ownerName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-[1px] bg-accent/50" />
                    <p className="text-accent font-black uppercase tracking-[0.5em] text-[10px] flex items-center gap-2">
                      <MapPin size={12} className="text-accent" /> {myStore.location}
                    </p>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
                    <span className="text-outline text-primary block lg:inline mr-4">LUXE</span>
                    <span className="italic italic-shadow text-white uppercase">{myStore.name}</span>
                  </h1>
                  <p className="text-subtext font-medium text-lg max-w-lg leading-relaxed line-clamp-2">
                    {myStore.description || 'Redefining the boundaries of premium retail through architectural excellence.'}
                  </p>
                </div>

                {/* Live Metrics Overlay */}
                <div className="flex gap-4 lg:mb-2">
                  {[
                    { label: 'Active', value: '12', icon: Package, color: 'text-primary' },
                    { label: 'Protocol', value: '04', icon: MessageSquare, color: 'text-accent' }
                  ].map((stat, i) => (stat && (
                    <div key={i} className="premium-glass p-6 rounded-[2rem] border border-white/5 min-w-[140px] group/stat hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <stat.icon size={18} className={`${stat.color} group-hover/stat:scale-110 transition-transform`} />
                        <Activity size={14} className="text-subtext/30" />
                      </div>
                      <p className="text-2xl font-black tracking-tighter mb-1">{stat.value}</p>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-subtext">{stat.label}</p>
                    </div>
                  )))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Inventory Command Module --- */}
        <div className="mb-16">
          <motion.button
            whileHover={{ y: -8, scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onClick={() => navigate('/products')}
            className="w-full relative overflow-hidden bg-surface border border-white/5 hover:border-primary/40 rounded-[3rem] p-8 lg:p-12 flex items-center justify-between transition-all group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
          >
            {/* Background Glows */}
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/5 blur-[100px] rounded-full group-hover:bg-accent/10 transition-all pointer-events-none" />

            <div className="flex items-center gap-8 lg:gap-12 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2rem] bg-background border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all duration-700 shadow-inner">
                  <PlusCircle size={48} className="text-primary group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-surface shadow-xl">
                    <Cpu size={14} className="text-white" />
                  </div>
                </div>
                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-[2rem] border-2 border-primary/40 scale-100 group-hover:scale-125 group-hover:opacity-0 transition-all duration-1000 pointer-events-none" />
              </div>

              <div className="text-left">
                <div className="flex items-center gap-3 mb-3">
                  <Layers size={14} className="text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Central Registry</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-black tracking-tighter text-textMain uppercase mb-3">Expand Inventory</h3>
                <div className="flex items-center gap-4">
                   <p className="text-subtext text-[11px] font-black uppercase tracking-[0.2em] max-w-md">Deploy new assets to the global marketplace manifest</p>
                   <div className="hidden lg:block h-px w-20 bg-white/5" />
                   <span className="hidden lg:block text-[9px] font-mono text-textMain/20">v2.4.0-STABLE</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-[9px] font-black text-subtext uppercase tracking-[0.2em] mb-1">Queue Status</span>
                <span className="text-xs font-black text-emerald-500">READY</span>
              </div>
              <div className="w-16 h-16 rounded-[1.5rem] bg-sectionSurface border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all shadow-xl">
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
              </div>
            </div>
          </motion.button>
        </div>

        {/* --- Analytical Visualization --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16"
        >
          {/* Monthly Sales Chart */}
          <motion.div variants={itemVariants} className="bg-surface border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group/chart">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] rounded-full group-hover/chart:bg-primary/10 transition-all" />
            
            {/* Background Grid */}
            <div className="absolute inset-0 p-10 flex flex-col justify-between opacity-[0.03] pointer-events-none">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-full h-px bg-white" />
               ))}
            </div>

            <div className="flex justify-between items-center mb-12 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-[1px] bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary text-glow">Velocity</h3>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Monthly Volume</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10 group-hover/chart:border-primary/50 transition-colors">
                <BarChart3 className="text-primary" size={24} />
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-4 lg:gap-6 relative z-10">
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-full relative group h-full flex flex-col justify-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1.2, delay: 0.5 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                    className="w-full bg-gradient-to-t from-primary/10 to-primary/30 rounded-2xl transition-all duration-500 group-hover:from-primary/40 group-hover:to-primary/60 group-hover:shadow-[0_0_50px_rgba(99,102,241,0.3)] relative overflow-hidden border border-white/5 group-hover:border-white/20"
                  >
                    {/* Gloss Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Top Glow Edge */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary group-hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                  </motion.div>
                  
                  {/* Floating Label */}
                  <div className="absolute bottom-[calc(100%+20px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none z-20">
                    <div className="premium-glass text-white text-[10px] font-black py-2.5 px-4 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap flex flex-col items-center">
                       <span className="text-primary mb-1">{height * 12}</span>
                       <span className="text-[8px] opacity-40 uppercase tracking-widest">Units</span>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="w-3 h-3 bg-[#111] border-b border-r border-white/10 rotate-45 mx-auto -mt-1.5 backdrop-blur-xl" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-10 text-[9px] font-black text-subtext uppercase tracking-[0.4em] px-2 relative z-10">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="hover:text-primary transition-colors cursor-default">{day}</span>
              ))}
            </div>
          </motion.div>

          {/* Yearly Sales Chart */}
          <motion.div variants={itemVariants} className="bg-surface border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group/chart">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full group-hover/chart:bg-emerald-500/10 transition-all" />
            
            {/* Background Architectural Grid */}
            <div className="absolute inset-0 p-10 flex flex-col justify-between opacity-[0.03] pointer-events-none">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="w-full h-px bg-white" />
               ))}
            </div>

            <div className="flex justify-between items-center mb-12 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-[1px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 text-glow">Revenue</h3>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Annual Projection</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10 group-hover/chart:border-emerald-500/50 transition-colors">
                <TrendingUp className="text-emerald-500" size={24} />
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-3 relative z-10 px-4">
               {[20, 35, 25, 45, 60, 50, 75, 90, 80, 100].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full relative group">
                    <div className="absolute bottom-[calc(100%+20px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none z-30">
                       <div className="bg-emerald-500 text-white text-[10px] font-black py-2.5 px-4 rounded-xl shadow-2xl whitespace-nowrap flex flex-col items-center">
                          <span>₹{height}K</span>
                          <span className="text-[8px] opacity-60 uppercase tracking-widest mt-0.5">Projected</span>
                       </div>
                       <div className="w-3 h-3 bg-emerald-500 rotate-45 mx-auto -mt-1.5" />
                    </div>

                    <div className="w-full flex justify-center h-full items-end">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1.5, delay: 0.7 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                        className="w-2.5 rounded-full bg-emerald-500/20 relative group-hover:bg-emerald-500 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                      >
                         <div className="absolute top-0 -left-1.5 w-5.5 h-5.5 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_40px_rgba(52,211,153,1)] border-4 border-emerald-500 z-10 scale-0 group-hover:scale-100 group-hover:-translate-y-1"></div>
                         
                         {/* Flowing Data Effect */}
                         <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                      </motion.div>
                    </div>
                  </div>
               ))}
            </div>
            <div className="flex justify-between mt-10 text-[9px] font-black text-subtext uppercase tracking-[0.5em] px-2 relative z-10">
              {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                <span key={q} className="hover:text-emerald-500 transition-colors cursor-default">{q}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* --- Active Protocol Registry --- */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-surface border border-white/5 rounded-[3.5rem] p-10 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-[1px] bg-accent" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Active Protocol</h3>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">Live Negotiations</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-lg shadow-accent/10">
              <MessageSquare className="text-accent" size={24} />
            </div>
          </div>
          
          <div className="space-y-6">
             {[1, 2].map((item) => (
                <div key={item} className="flex flex-col md:flex-row items-center justify-between p-8 bg-sectionSurface/50 rounded-[2.5rem] border border-white/5 hover:border-accent/40 transition-all duration-500 group/item hover:bg-sectionSurface">
                  <div className="flex items-center gap-8 w-full md:w-auto mb-6 md:mb-0">
                    <div className="w-24 h-24 rounded-3xl bg-background shrink-0 overflow-hidden border border-white/10 group-hover/item:border-accent/30 transition-all relative">
                       <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80&sig=${item}`} alt="Product" className="w-full h-full object-cover grayscale-[0.4] group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity size={10} className="text-accent animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-accent">Active Thread</span>
                      </div>
                      <h4 className="font-black text-xl uppercase tracking-tighter group-hover/item:text-accent transition-colors">Premium Artifact {item}</h4>
                      <div className="flex items-center gap-3 mt-3">
                         <span className="text-[9px] text-subtext font-black uppercase tracking-widest">Protocol Value:</span>
                         <span className="text-white font-black text-xl italic">₹12,500</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-12 py-5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)]">
                      Authorize
                    </button>
                    <button className="flex-1 md:flex-none px-12 py-5 bg-surface text-textMain rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-accent transition-all group/btn">
                      Counter <ChevronRight size={14} className="inline ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
             ))}
             
             <button 
               onClick={() => navigate('/dashboard/negotiations')}
               className="mt-10 w-full py-6 text-[10px] font-black text-subtext uppercase tracking-[0.5em] border border-white/5 rounded-[2rem] hover:bg-surface hover:text-textMain hover:border-white/20 transition-all group">
               Access Full Negotiation Registry <ArrowRight size={14} className="inline ml-2 group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default RetailerDashboard;
