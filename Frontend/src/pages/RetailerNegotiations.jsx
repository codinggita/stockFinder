import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

const RetailerNegotiations = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'retailer') {
      navigate('/login');
      return;
    }

    const fetchNegotiations = async () => {
      try {
        const res = await api.get('/negotiations/store');
        setNegotiations(res.data);
      } catch (err) {
        toast.error('Failed to load negotiations');
      } finally {
        setLoading(false);
      }
    };

    fetchNegotiations();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-textMain font-black tracking-widest uppercase">
        Loading Intelligence...
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'ACCEPTED': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'REJECTED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-subtext bg-surface border-borderCustom';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock size={14} />;
      case 'ACCEPTED': return <CheckCircle2 size={14} />;
      case 'REJECTED': return <XCircle size={14} />;
      default: return null;
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this negotiation? This action cannot be undone.')) {
      try {
        await api.delete(`/negotiations/${id}`);
        setNegotiations(negotiations.filter(n => n._id !== id));
        toast.success('Negotiation deleted successfully');
      } catch (err) {
        toast.error('Failed to delete negotiation');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-textMain font-sans selection:bg-primary/30 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border border-borderCustom shadow-lg shadow-primary/20">
            <MessageSquare size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Active Negotiations</h1>
            <p className="text-subtext text-xs font-bold uppercase tracking-widest mt-1">Manage customer offers</p>
          </div>
        </div>

        {negotiations.length === 0 ? (
          <div className="bg-surface border border-borderCustom rounded-[2rem] p-12 text-center">
            <MessageSquare size={48} className="mx-auto text-subtext mb-4" />
            <h3 className="text-xl font-bold mb-2">No Active Negotiations</h3>
            <p className="text-subtext">When customers send offers, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {negotiations.map((neg, idx) => (
              <motion.div
                key={neg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/negotiation/${neg._id}`)}
                className="bg-surface border border-borderCustom rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="flex items-center gap-6 w-full md:w-auto flex-1">
                  <div className="w-24 h-24 rounded-2xl bg-sectionSurface overflow-hidden border border-borderCustom shrink-0 p-2">
                    <img src={neg.product?.image} alt={neg.product?.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border ${getStatusColor(neg.status)}`}>
                      {getStatusIcon(neg.status)}
                      {neg.status}
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-1">{neg.product?.name}</h3>
                    <p className="text-subtext text-xs font-bold uppercase tracking-widest">
                      Customer: <span className="text-textMain">{neg.user?.name}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                  <div className="text-center md:text-right w-full md:w-auto">
                    <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Listing Price</p>
                    <p className="text-lg font-bold text-subtext line-through">₹{neg.initialPrice?.toLocaleString()}</p>
                  </div>
                  
                  <div className="h-12 w-px bg-borderCustom hidden md:block"></div>
                  
                  <div className="text-center md:text-right w-full md:w-auto">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Current Offer</p>
                    <p className="text-2xl font-black tracking-tighter text-textMain">₹{neg.currentOffer?.toLocaleString()}</p>
                  </div>

                  <button className="w-full md:w-auto px-8 py-4 bg-sectionSurface hover:bg-primary text-textMain hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-borderCustom hover:border-primary">
                    Review Offer
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, neg._id)}
                    className="w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-4 bg-sectionSurface hover:bg-red-500/20 text-subtext hover:text-red-400 rounded-2xl flex items-center justify-center transition-all border border-borderCustom hover:border-red-500/50"
                    title="Delete Negotiation"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RetailerNegotiations;
