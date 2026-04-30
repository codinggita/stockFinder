import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { 
  Package, 
  MessageSquare, 
  TrendingUp, 
  Layers
} from 'lucide-react';

const RetailerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { title: 'Total Products', value: '1,248', icon: Package, color: 'from-blue-500/20 to-blue-600/5' },
    { title: 'Active Inventory Count', value: '482 Units', icon: Layers, color: 'from-emerald-500/20 to-emerald-600/5' },
    { title: 'Pending Offers', value: '12', icon: MessageSquare, color: 'from-amber-500/20 to-amber-600/5' },
    { title: 'Today’s Revenue', value: '₹14,500', icon: TrendingUp, color: 'from-primary/20 to-primary/5' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-px w-8 bg-primary"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Retailer Portal</p>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight"
          >
            📊 DASHBOARD <span className="text-gray-600 font-medium ml-2">(HOME PAGE)</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-4 font-medium tracking-wide"
          >
            Welcome back, {user?.name}. Here is your store's current performance overview.
          </motion.p>
        </header>

        {/* STATS CARDS (TOP ROW) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className={`bg-gradient-to-br ${stat.color} border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all`}
            >
              <div className="relative z-10">
                <div className="p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon size={24} className="text-white" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold tracking-tighter">{stat.value}</p>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
            </motion.div>
          ))}
        </div>

        {/* Empty Placeholder for future content if needed, but currently focused on stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 py-20 border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01] flex flex-col items-center justify-center text-center px-10"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Layers size={24} className="text-gray-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-400 mb-2">Inventory Management & Analytics</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed uppercase tracking-widest text-[9px] font-bold">
            Additional management tools and real-time data visualisations will appear here as your store grows.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default RetailerDashboard;
