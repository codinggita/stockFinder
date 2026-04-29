import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Send, Paperclip, Smile, ShieldCheck, 
  ChevronRight, Zap, Target, TrendingUp, Phone, 
  MoreVertical, CheckCircle2, XCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';

const Negotiation = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [negotiation, setNegotiation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef(null);
  const emojis = [
    '😊', '🤝', '💰', '🔥', '✨', '🏷️', '📦', '💯', 
    '👍', '🙌', '🙏', '❤️', '🎉', '🚀', '⭐', '✅',
    '😍', '😎', '🤩', '🤔', '😲', '😥', '😭', '😡',
    '💵', '💎', '🛒', '🛍️', '🎁', '📱', '⌚', '👟'
  ];

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji);
    setShowEmojis(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to negotiate prices');
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initNegotiation = async () => {
      try {
        // Start or get negotiation
        const res = await api.post('/negotiations', { productId });
        setNegotiation(res.data);
        
        // Get details and messages
        const detailsRes = await api.get(`/negotiations/${res.data._id}`);
        setNegotiation(detailsRes.data.negotiation);
        setMessages(detailsRes.data.messages);
      } catch (err) {
        toast.error('Failed to start negotiation');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    initNegotiation();
  }, [productId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e, type = 'TEXT', customOffer = null) => {
    if (e) e.preventDefault();
    if (!newMessage && !customOffer && type === 'TEXT') return;

    try {
      const res = await api.post(`/negotiations/${negotiation._id}/messages`, {
        content: customOffer ? `Offer: ₹${customOffer.toLocaleString()}` : newMessage,
        type: type,
        offerAmount: customOffer || null
      });
      
      setMessages([...messages, res.data]);
      setNewMessage('');
      if (customOffer) setOfferAmount('');
      
      // Update negotiation state if it was an offer
      if (customOffer) {
        setNegotiation({ ...negotiation, currentOffer: customOffer });
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const handleAcceptDeal = async () => {
    try {
      const res = await api.patch(`/negotiations/${negotiation._id}/accept`);
      setNegotiation(res.data);
      toast.success('Deal accepted! Price updated in cart.');
      // Refresh messages
      const detailsRes = await api.get(`/negotiations/${negotiation._id}`);
      setMessages(detailsRes.data.messages);
    } catch (err) {
      toast.error('Failed to accept deal');
    }
  };

  if (loading || !negotiation) return <div className="min-h-screen bg-dark flex items-center justify-center text-white font-black tracking-widest uppercase">Initializing Intelligence...</div>;

  const product = negotiation.product;
  const store = negotiation.store;
  const isRetailer = user?.role === 'retailer'; // Simple check for now, can be more specific if store.owner is populated

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-10 flex gap-6 overflow-hidden">
        
        {/* Left Column: Product Intelligence */}
        <motion.aside 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide hidden xl:flex"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-2"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Marketplace</span>
          </button>

          {/* Product Hero Card */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden p-8 space-y-8">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#0a0f1e] border border-white/5 group">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-10 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-[10px] font-black tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  IN STOCK
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tighter leading-none">{product.name}</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                {product.category} <span className="w-1 h-1 rounded-full bg-gray-800"></span> SKU: {product._id.slice(-6).toUpperCase()}
              </p>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Listing Price</p>
                <p className="text-3xl font-black tracking-tighter">₹{product.price.toLocaleString()}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Stock Level</p>
                <p className="text-xl font-bold text-green-400 uppercase tracking-tighter">12 Units</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">Negotiation Status</span>
                <span className="text-yellow-500">Target Margin: 15.2%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-primary"
                ></motion.div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <TrendingUp size={16} className="text-primary" />
               Market Insights
            </h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Avg. Sale Price</p>
                  <p className="text-lg font-black tracking-tighter">₹{(product.price * 0.95).toLocaleString()}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Recent Demand</p>
                  <p className="text-lg font-black tracking-tighter text-green-400">+12.4% KM</p>
               </div>
            </div>
          </div>
        </motion.aside>

        {/* Right Column: Chat Interface */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl relative"
        >
          {/* Chat Header */}
          <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border border-white/10 shadow-lg">
                <Zap size={24} className="text-white fill-white" />
              </div>
              <div>
                <h2 className="font-black text-lg tracking-tight flex items-center gap-2">
                  Vendor: {store.name}
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                </h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verified Trusted Partner</p>
              </div>
            </div>
          </header>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
            <div className="flex justify-center">
               <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest">Today, Oct 24</span>
            </div>

            {messages.map((msg, i) => {
              const isMe = msg.sender === user?._id;
              return (
                <motion.div 
                  key={msg._id}
                  initial={{ opacity: 0, y: 10, x: isMe ? -10 : 10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  className={`flex ${isMe ? 'justify-start' : 'justify-end'} group`}
                >
                  <div className={`max-w-[70%] space-y-2`}>
                    <div className={`p-6 rounded-[2rem] text-sm font-medium leading-relaxed ${
                      isMe 
                        ? 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none' 
                        : 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-600/10'
                    }`}>
                      {msg.content}
                      {msg.type === 'OFFER' && (
                        <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center"><Zap size={14} /></div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Proposed Offer</p>
                              <p className="text-lg font-black tracking-tight">₹{msg.offerAmount.toLocaleString()} Total</p>
                           </div>
                        </div>
                      )}
                      {msg.type === 'ACCEPT' && (
                        <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center"><CheckCircle2 size={14} className="text-green-400" /></div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-green-400">Deal Finalized</p>
                              <p className="text-lg font-black tracking-tight text-green-400">₹{msg.offerAmount.toLocaleString()} Settled</p>
                           </div>
                        </div>
                      )}
                    </div>
                    <p className={`text-[9px] font-bold text-gray-600 uppercase tracking-widest ${isMe ? 'text-left' : 'text-right'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {isMe ? 'Sent' : 'Read'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Area */}
          <footer className="p-8 space-y-6 bg-black/20 border-t border-white/5">
            <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-4 items-center">
              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your counter-message here..."
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 px-8 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
                />
                <input type="file" id="file-upload" className="hidden" onChange={() => toast.success('File attached')} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('file-upload').click()}
                    className="text-gray-600 hover:text-white transition-colors"
                  >
                    <Paperclip size={20} />
                  </button>
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setShowEmojis(!showEmojis)}
                      className={`transition-colors ${showEmojis ? 'text-primary' : 'text-gray-600 hover:text-white'}`}
                    >
                      <Smile size={20} />
                    </button>
                    {showEmojis && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute bottom-12 right-0 bg-[#0f172a] border border-white/10 rounded-2xl p-4 grid grid-cols-6 gap-3 shadow-2xl z-50 min-w-[220px] max-h-[250px] overflow-y-auto scrollbar-hide"
                      >
                        {emojis.map(e => (
                          <button 
                            key={e} 
                            onClick={() => addEmoji(e)}
                            className="text-xl hover:scale-125 transition-transform"
                          >
                            {e}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                className="w-14 h-14 rounded-[1.5rem] bg-primary hover:bg-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 transition-all transform active:scale-95"
              >
                <Send size={24} className="text-white" />
              </button>
            </form>

            <div className="flex gap-4">
              {negotiation.status === 'PENDING' ? (
                <>
                  {isRetailer ? (
                    <>
                      <button 
                        onClick={handleAcceptDeal}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <CheckCircle2 size={20} />
                        Accept Deal
                      </button>
                      <button 
                        className="flex-1 bg-transparent border-2 border-yellow-500/30 hover:border-yellow-500/60 text-yellow-500 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => {
                           const amount = prompt("Enter counter offer amount (₹):");
                           if (amount) handleSendMessage(null, 'COUNTER', parseInt(amount));
                        }}
                      >
                        <TrendingUp size={20} />
                        Counter Offer
                      </button>
                    </>
                  ) : null}
                </>
              ) : (
                <div className="flex-1 py-5 bg-green-500/10 border border-green-500/20 rounded-[1.5rem] text-green-400 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                   <CheckCircle2 size={20} />
                   Negotiation Finalized: ₹{negotiation.negotiatedPrice?.toLocaleString()}
                </div>
              )}
            </div>
          </footer>

          {/* Footer Branding Removed */}
        </motion.section>
      </main>
    </div>
  );
};

const MapPin = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default Negotiation;
