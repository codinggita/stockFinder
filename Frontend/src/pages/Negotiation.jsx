import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Send, Paperclip, Smile, ShieldCheck, 
  ChevronRight, Zap, Target, TrendingUp, Phone, 
  MoreVertical, CheckCircle2, XCircle, Info, Activity,
  Cpu, Layout, MessageSquare, History, DollarSign,
  Store
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import { markNotificationsRead } from '../redux/notificationSlice';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import SEO from '../components/SEO';

const Negotiation = () => {
  const { productId, negotiationId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [negotiation, setNegotiation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socket = useSocket();
  const dispatch = useDispatch();
  const isChatOpen = useRef(true);
  const emojis = ['😊', '🤝', '💰', '🔥', '✨', '🏷️', '📦', '💯', '👍', '🙌', '🙏', '❤️', '🎉', '🚀', '⭐', '✅'];

  useEffect(() => {
    isChatOpen.current = true;
    dispatch(markNotificationsRead());
    return () => { isChatOpen.current = false; };
  }, [dispatch]);

  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji);
    setShowEmojis(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to negotiate prices');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initNegotiation = async () => {
      try {
        if (negotiationId) {
          const detailsRes = await api.get(`/negotiations/${negotiationId}`);
          setNegotiation(detailsRes.data.negotiation);
          setMessages(detailsRes.data.messages);
        } else if (productId) {
          const res = await api.post('/negotiations', { productId });
          const detailsRes = await api.get(`/negotiations/${res.data._id}`);
          setNegotiation(detailsRes.data.negotiation);
          setMessages(detailsRes.data.messages);
        }
      } catch (err) {
        toast.error('Failed to load negotiation');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    initNegotiation();
  }, [productId, negotiationId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && negotiation?._id) {
      socket.emit('join_negotiation', negotiation._id);

      const handleReceiveMessage = (message) => {
        setMessages((prev) => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
        
        const senderId = (message.sender?._id || message.sender)?.toString();
        if (isChatOpen.current && senderId !== user?._id?.toString()) {
          dispatch(markNotificationsRead());
        }

        if (message.offerAmount) {
          setNegotiation(prev => ({ ...prev, currentOffer: message.offerAmount }));
        }
        if (message.type === 'ACCEPT') {
          setNegotiation(prev => ({ ...prev, status: 'ACCEPTED', negotiatedPrice: message.offerAmount }));
        }
        
        setTimeout(scrollToBottom, 100);
      };

      socket.on('receive_message', handleReceiveMessage);
      return () => { 
        socket.off('receive_message', handleReceiveMessage); 
      };
    }
  }, [socket, negotiation]);

  const handleSendMessage = async (e, type = 'TEXT', customContent = null, customOffer = null) => {
    if (e) e.preventDefault();
    if (!newMessage && !customOffer && !customContent && type === 'TEXT') return;

    try {
      const contentToSend = customContent || (customOffer ? `Offer: ₹${customOffer.toLocaleString()}` : newMessage);
      const res = await api.post(`/negotiations/${negotiation._id}/messages`, {
        content: contentToSend,
        type: type,
        offerAmount: customOffer || null
      });
      
      setMessages([...messages, res.data]);
      setNewMessage('');
      scrollToBottom();
      if (customOffer) setOfferAmount('');
      if (customOffer) {
        setNegotiation({ ...negotiation, currentOffer: customOffer });
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const handleSendPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = /\.(jpg|jpeg|png)$/i.test(file.name);
    if (!isImage) {
      toast.error('Only JPG and PNG formats are allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleSendMessage(null, 'PHOTO', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAcceptDeal = async () => {
    const lastPrice = prompt("Enter final agreed price (₹):", negotiation.currentOffer);
    if (!lastPrice) return;
    
    try {
      const res = await api.patch(`/negotiations/${negotiation._id}/accept`, { 
        finalPrice: parseInt(lastPrice) 
      });
      setNegotiation(res.data);
      toast.success('Deal accepted! Price updated in cart.');
      const detailsRes = await api.get(`/negotiations/${negotiation._id}`);
      setMessages(detailsRes.data.messages);
    } catch (err) {
      toast.error('Failed to accept deal');
    }
  };

  const handleRejectDeal = async () => {
    if (!window.confirm('Are you sure you want to cancel this negotiation?')) return;
    try {
      const res = await api.patch(`/negotiations/${negotiation._id}/reject`);
      setNegotiation(res.data);
      toast.success('Negotiation cancelled');
      const detailsRes = await api.get(`/negotiations/${negotiation._id}`);
      setMessages(detailsRes.data.messages);
    } catch (err) {
      toast.error('Failed to cancel negotiation');
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  if (loading || !negotiation) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  const product = negotiation?.product || {};
  const store = negotiation?.store || {};
  const isRetailer = user?.role === 'retailer';

  return (
    <div className="min-h-screen bg-background text-textMain font-sans overflow-hidden flex flex-col selection:bg-accent/30">
      <SEO title="Negotiation" robots="noindex, nofollow" />
      <Navbar />
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      
      <main className="flex-1 max-w-[1700px] mx-auto w-full px-4 lg:px-8 pt-28 pb-6 flex gap-6 overflow-hidden">
        
        {/* Intelligence Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[380px] hidden xl:flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-subtext hover:text-textMain transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Hub Registry</span>
          </button>

          <div className="bg-surface shadow-premium border border-borderCustom/20 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <Cpu size={120} />
            </div>

            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-background border border-borderCustom/20 shadow-inner group">
              <img src={product?.image} className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-[2000ms]" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-textMain leading-none">{product?.name}</h1>
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-sectionSurface rounded-lg border border-borderCustom/20 text-[9px] font-black text-accent uppercase tracking-widest">
                   {product.category}
                 </span>
                 <span className="text-[9px] font-mono text-subtext/40 italic">#Ref_{product?._id?.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-sectionSurface/40 rounded-2xl border border-borderCustom/20">
                <p className="text-[8px] font-black text-subtext/40 uppercase tracking-widest mb-1">Base Valuation</p>
                <p className="text-xl font-black tracking-tighter text-textMain">₹{product?.price?.toLocaleString()}</p>
              </div>
              <div className="p-5 bg-sectionSurface/40 rounded-2xl border border-borderCustom/20">
                <p className="text-[8px] font-black text-accent uppercase tracking-widest mb-1">Delta Shift</p>
                <p className="text-xl font-black tracking-tighter text-accent italic">
                   {negotiation.currentOffer && product?.price ? `-₹${(product.price - negotiation.currentOffer).toLocaleString()}` : '0.00'}
                </p>
              </div>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-subtext/60">
                 <span>Negotiation Matrix</span>
                 <span className="text-accent italic">Phase_03</span>
              </div>
              <div className="h-1.5 w-full bg-sectionSurface rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5 }} className="h-full bg-accent shadow-[0_0_15px_rgba(194,163,120,0.5)]" />
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Command Center */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 bg-surface border border-borderCustom/20 rounded-[3rem] flex flex-col overflow-hidden shadow-premium relative"
        >
          <header className="p-8 border-b border-borderCustom/10 flex justify-between items-center bg-sectionSurface/20 backdrop-blur-3xl z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-background border border-borderCustom/20 flex items-center justify-center shadow-xl">
                 <Store size={28} className="text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <h2 className="font-black text-2xl tracking-tighter uppercase italic text-textMain">{store.name}</h2>
                   <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[8px] font-black text-accent uppercase tracking-widest">Verified Hub</span>
                </div>
                <div className="flex items-center gap-4 text-subtext/60 text-[10px] font-black uppercase tracking-widest">
                   <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-accent" /> Encrypted Session</span>
                   <span className="w-1 h-1 rounded-full bg-borderCustom/20" />
                   <span className="text-accent italic">Live Protocol</span>
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence>
            {negotiation.status !== 'PENDING' && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="bg-emerald-50/50 border-b border-emerald-100 px-8 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                   <CheckCircle2 size={18} className="text-emerald-600" />
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Consensus Reached // Final Valuation Secured</p>
                </div>
                <p className="text-2xl font-black text-emerald-600 tracking-tighter">₹{negotiation.negotiatedPrice?.toLocaleString()}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 custom-scrollbar z-10 bg-background/20">
            {messages.map((msg) => {
              const senderId = (msg.sender?._id || msg.sender)?.toString();
              const customerId = (negotiation.user?._id || negotiation.user)?.toString();
              const alignRight = senderId === customerId;
              
              return (
                <div key={msg._id} className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[75%] lg:max-w-[60%] space-y-3">
                    <div className={`p-8 rounded-[2.5rem] shadow-premium border ${
                      alignRight 
                        ? 'bg-textMain text-background border-borderCustom/10 rounded-br-none' 
                        : 'bg-surface text-textMain border-borderCustom/20 rounded-bl-none'
                    }`}>
                      {msg.type === 'PHOTO' ? (
                        <img src={msg.content} className="max-w-full rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in" alt="" onClick={() => window.open(msg.content, '_blank')} />
                      ) : (
                        <p className="text-base font-medium leading-relaxed tracking-tight italic">{msg.content}</p>
                      )}

                      {msg.type === 'OFFER' && (
                        <div className={`mt-8 pt-8 border-t ${alignRight ? 'border-background/10' : 'border-borderCustom/10'} flex items-center justify-between`}>
                           <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${alignRight ? 'bg-background/10' : 'bg-sectionSurface'}`}>
                                 <Zap size={24} className={alignRight ? 'text-background' : 'text-accent'} />
                              </div>
                              <div>
                                 <p className={`text-[10px] font-black uppercase tracking-widest ${alignRight ? 'text-background/40' : 'text-accent'}`}>Proposed Allocation</p>
                                 <p className="text-3xl font-black tracking-tighter italic">₹{msg.offerAmount.toLocaleString()}</p>
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-4 px-4 text-[9px] font-black uppercase tracking-widest ${alignRight ? 'flex-row-reverse text-textMain/40' : 'text-subtext/40'}`}>
                       <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       <span className="w-1 h-1 rounded-full bg-borderCustom/20" />
                       <span className="italic">{alignRight ? 'Encrypted' : 'Verified'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <footer className="p-8 lg:p-12 space-y-6 bg-surface border-t border-borderCustom/10 z-10">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <form onSubmit={handleSendMessage} className="flex-1 w-full flex gap-4 items-center">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter command..."
                    className="w-full bg-sectionSurface border border-borderCustom/20 rounded-2xl py-5 px-8 text-sm focus:outline-none focus:border-accent/40 transition-all placeholder:text-subtext/30 text-textMain italic font-medium shadow-inner"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                    <button type="button" onClick={() => setShowEmojis(!showEmojis)} className={`transition-colors ${showEmojis ? 'text-accent' : 'text-subtext/40 hover:text-accent'}`}><Smile size={20} /></button>
                    <button type="button" onClick={handleSendPhoto} className="text-subtext/40 hover:text-accent transition-colors"><Paperclip size={20} /></button>
                  </div>
                </div>
                
                <button type="submit" disabled={!newMessage} className="w-16 h-16 rounded-2xl bg-textMain text-background hover:bg-accent hover:text-white disabled:opacity-20 transition-all flex items-center justify-center shadow-premium transform active:scale-95">
                  <Send size={22} className="relative z-10" />
                </button>
              </form>

              <div className="flex gap-4 w-full lg:w-auto">
                {negotiation.status === 'PENDING' ? (
                  <>
                    {isRetailer ? (
                      <>
                        <button onClick={handleAcceptDeal} className="flex-1 lg:flex-none px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl">Finalize</button>
                        <button onClick={() => { const amt = prompt("Counter Offer:"); if(amt) handleSendMessage(null, 'OFFER', null, parseInt(amt)); }} className="flex-1 lg:flex-none px-8 py-4 bg-accent text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-textMain transition-all shadow-xl">Counter</button>
                        <button onClick={handleRejectDeal} className="flex-1 lg:flex-none px-8 py-4 bg-red-50 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl">Abort</button>
                      </>
                    ) : (
                      <button onClick={() => { const amt = prompt("Propose Price:"); if(amt) handleSendMessage(null, 'OFFER', null, parseInt(amt)); }} className="flex-1 lg:flex-none px-12 py-5 bg-accent text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-textMain transition-all shadow-premium italic flex items-center gap-3">
                         <DollarSign size={18} /> Propose_Valuation
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex-1 py-5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 px-10 italic">
                     <CheckCircle2 size={20} /> Registry Secured // ₹{negotiation.negotiatedPrice?.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </footer>
        </motion.section>
      </main>
    </div>
  );
};

export default Negotiation;
