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
        
        // Mark as read if chat is open and we are the receiver
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

  // Local Storage Sync
  useEffect(() => {
    if (negotiation?._id && messages.length > 0) {
      localStorage.setItem(`negotiation_history_${negotiation._id}`, JSON.stringify(messages));
    }
  }, [messages, negotiation?._id]);

  // Load from Local Storage on mount
  useEffect(() => {
    if (negotiation?._id) {
      const cached = localStorage.getItem(`negotiation_history_${negotiation._id}`);
      if (cached && messages.length === 0) {
        setMessages(JSON.parse(cached));
      }
    }
  }, [negotiation?._id]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (loading || !negotiation) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const product = negotiation?.product || {};
  const store = negotiation?.store || {};
  const isRetailer = user?.role === 'retailer';

  return (
    <div className="min-h-screen bg-background text-textMain font-sans overflow-hidden flex flex-col selection:bg-primary/30">
      <Navbar />
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/jpg" 
        className="hidden" 
      />
      
      <main className="flex-1 max-w-[1700px] mx-auto w-full px-4 lg:px-8 pt-28 pb-6 flex gap-6 overflow-hidden">
        
        {/* --- Left Column: Intelligence Sidebar --- */}
        <motion.aside 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[340px] flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar hidden xl:flex"
        >
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-subtext hover:text-textMain transition-all group mb-2"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Market Registry</span>
          </button>

          {/* Cinematic Asset Card */}
          <div className="premium-glass rounded-[2.5rem] overflow-hidden p-6 border border-white/10 shadow-2xl space-y-6 relative group">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
               <Cpu size={100} />
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square rounded-[2rem] overflow-hidden bg-background border border-white/5 shadow-inner group/img"
            >
              <img 
                src={product?.image || ''} 
                alt={product?.name || 'Asset'} 
                className="w-full h-full object-contain p-8 group-hover/img:scale-110 transition-transform duration-[2000ms] grayscale-[0.2] group-hover/img:grayscale-0" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="px-3 py-1 bg-background/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black tracking-widest text-white uppercase">Authenticated</span>
                </div>
              </div>
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-2xl font-black tracking-tighter leading-tight uppercase italic italic-shadow">{product?.name || 'Loading Asset...'}</h1>
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black text-subtext uppercase tracking-widest">
                   {product.category}
                 </span>
                 <span className="w-1 h-1 rounded-full bg-accent/50" />
                 <span className="text-[9px] font-mono text-subtext/40">ID: {product?._id ? product._id.slice(-8).toUpperCase() : 'PENDING'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                <p className="text-[8px] font-black text-subtext uppercase tracking-[0.2em] mb-1.5">Original Price</p>
                <p className="text-xl font-black tracking-tighter">₹{product?.price?.toLocaleString() || '0'}</p>
              </div>
              <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                <p className="text-[8px] font-black text-accent uppercase tracking-[0.2em] mb-1.5">Current Delta</p>
                <p className="text-xl font-black tracking-tighter text-accent italic">
                   {negotiation.currentOffer && product?.price ? `-₹${(product.price - negotiation.currentOffer).toLocaleString()}` : '0.00'}
                </p>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <Target size={14} className="text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Negotiation Margin</span>
                </div>
                <span className="text-primary font-mono text-xs">85% Match</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-primary via-indigo-400 to-accent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Technical Specs & Insights */}
          <div className="premium-glass rounded-[2.5rem] p-8 border border-white/10 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-accent text-glow">
               <History size={16} />
               Protocol Data
            </h3>
            <div className="space-y-4">
               {[
                 { label: 'Market Velocity', value: 'High', icon: Zap, color: 'text-yellow-500' },
                 { label: 'Demand Index', value: '9.4/10', icon: TrendingUp, color: 'text-emerald-500' },
                 { label: 'Negotiation Phase', value: 'Phase 03', icon: Activity, color: 'text-primary' }
               ].map((spec, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-3">
                       <spec.icon size={14} className={spec.color} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-subtext">{spec.label}</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight">{spec.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </motion.aside>

        {/* --- Right Column: Command Center --- */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.99, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 bg-surface border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Chat Header */}
          <header className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] backdrop-blur-2xl z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-background border border-white/10 flex items-center justify-center shadow-2xl group overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                  <Store size={24} className="text-primary relative z-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                   <h2 className="font-black text-xl tracking-tighter uppercase italic">{store.name}</h2>
                   <div className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-md">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest">Official Store</span>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-accent" />
                      <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Secured Line</span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-white/10" />
                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">EST Connection: 98ms</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                  <Phone size={18} className="text-subtext" />
               </button>
               <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                  <MoreVertical size={18} className="text-subtext" />
               </button>
            </div>
          </header>

          {/* Deal Status Banner */}
          <AnimatePresence>
            {negotiation.status !== 'PENDING' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-emerald-500/10 border-b border-emerald-500/20 px-8 py-4 flex items-center justify-between z-10"
              >
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      <CheckCircle2 size={16} className="text-white" />
                   </div>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol Finalized Successfully</p>
                </div>
                <p className="text-xl font-black text-emerald-500 tracking-tighter italic">₹{negotiation.negotiatedPrice?.toLocaleString()}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scrollbar z-10">
            <div className="flex justify-center mb-8">
               <div className="px-5 py-1.5 bg-white/[0.02] border border-white/5 rounded-full text-[9px] font-black text-subtext/40 uppercase tracking-[0.4em] backdrop-blur-md">
                 Protocol Initialization // {new Date(negotiation.createdAt).toLocaleDateString()}
               </div>
            </div>

            {messages.map((msg, i) => {
              const senderId = (msg.sender?._id || msg.sender)?.toString();
              const customerId = (negotiation.user?._id || negotiation.user)?.toString();
              const alignRight = senderId === customerId;
              const isMe = senderId === user?._id?.toString();
              
              return (
                <motion.div 
                  key={msg._id}
                  initial={{ opacity: 0, y: 20, x: alignRight ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] lg:max-w-[65%] space-y-3`}>
                    <div className={`p-6 lg:p-8 rounded-[2.5rem] border transition-all duration-500 shadow-2xl ${
                      alignRight 
                        ? 'bg-primary text-white border-primary/20 rounded-br-none shadow-primary/20' 
                        : 'premium-glass text-textMain border-white/5 rounded-bl-none shadow-black/40'
                    }`}>
                      {msg.type === 'PHOTO' ? (
                        <div className="space-y-4">
                          <img 
                            src={msg.content} 
                            alt="Protocol Evidence" 
                            className="max-w-full rounded-2xl border border-white/10 shadow-2xl cursor-zoom-in hover:scale-[1.02] transition-transform duration-500"
                            onClick={() => window.open(msg.content, '_blank')}
                          />
                        </div>
                      ) : (
                        <p className="text-sm lg:text-base font-medium leading-relaxed tracking-tight">{msg.content}</p>
                      )}

                      {msg.type === 'OFFER' && (
                        <div className={`mt-6 pt-6 border-t ${alignRight ? 'border-white/20' : 'border-white/10'} flex items-center justify-between`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${alignRight ? 'bg-white/20' : 'bg-primary/20 border border-primary/20'}`}>
                                 <Zap size={20} className={alignRight ? 'text-white' : 'text-primary'} />
                              </div>
                              <div>
                                 <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${alignRight ? 'text-white/60' : 'text-primary'}`}>Proposed Protocol</p>
                                 <p className="text-2xl font-black tracking-tighter italic">₹{msg.offerAmount.toLocaleString()}</p>
                              </div>
                           </div>
                           <Activity size={20} className={alignRight ? 'text-white/20' : 'text-white/5'} />
                        </div>
                      )}

                      {(msg.type === 'ACCEPT' || msg.type === 'FINAL') && (
                        <div className={`mt-6 pt-6 border-t ${alignRight ? 'border-white/20' : 'border-white/10'} flex items-center gap-4`}>
                           <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
                              <CheckCircle2 size={20} className="text-white" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Consensus Achieved</p>
                              <p className="text-2xl font-black tracking-tighter italic">₹{msg.offerAmount.toLocaleString()}</p>
                           </div>
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-3 px-4 ${alignRight ? 'flex-row-reverse' : 'flex-row'}`}>
                       <span className="text-[9px] font-black text-subtext/40 uppercase tracking-[0.2em]">
                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                       <div className="w-1 h-1 rounded-full bg-white/5" />
                       <span className={`text-[9px] font-black uppercase tracking-widest ${alignRight ? 'text-primary' : 'text-accent'}`}>
                         {alignRight ? 'Encrypted' : 'Authenticated'}
                       </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Console */}
          <footer className="p-6 lg:p-8 space-y-6 bg-white/[0.03] border-t border-white/5 z-10 backdrop-blur-3xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <form onSubmit={(e) => handleSendMessage(e)} className="flex-1 w-full flex gap-3 items-center">
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter command..."
                    className="w-full bg-background border border-white/5 rounded-xl py-4 px-6 text-xs focus:outline-none focus:border-primary/50 transition-all placeholder:text-subtext/40 text-textMain relative z-10 shadow-inner"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-20">
                    <button 
                      type="button" 
                      onClick={() => setShowEmojis(!showEmojis)}
                      className={`transition-all hover:scale-110 ${showEmojis ? 'text-primary' : 'text-subtext hover:text-textMain'}`}
                    >
                      <Smile size={18} />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSendPhoto}
                      className="text-subtext hover:text-textMain transition-all hover:scale-110"
                    >
                      <Paperclip size={18} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showEmojis && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-[calc(100%+15px)] right-0 premium-glass border border-white/10 rounded-[1.5rem] p-5 grid grid-cols-8 gap-3 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-50 min-w-[280px] backdrop-blur-3xl"
                      >
                        {emojis.map(e => (
                          <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-150 transition-transform active:scale-90">{e}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button 
                  type="submit"
                  disabled={!newMessage}
                  className="w-12 h-12 rounded-xl bg-primary hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_10px_20px_rgba(99,102,241,0.2)] transition-all transform active:scale-95 group relative overflow-hidden"
                >
                  <Send size={20} className="text-white relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
              </form>

              <div className="flex gap-3 w-full lg:w-auto">
                {negotiation.status === 'PENDING' ? (
                  <>
                    {isRetailer ? (
                      <>
                        <button 
                          onClick={handleAcceptDeal}
                          className="flex-1 lg:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.1em] shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] border border-emerald-400/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={14} />
                          Finalize
                        </button>
                        <button 
                          onClick={() => { const amt = prompt("Counter Offer (₹):"); if(amt) handleSendMessage(null, 'OFFER', null, parseInt(amt)); }}
                          className="flex-1 lg:flex-none px-6 py-3 bg-surface border border-accent/30 text-accent rounded-lg font-black text-[9px] uppercase tracking-[0.1em] hover:bg-accent hover:text-background transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Zap size={14} />
                          Counter
                        </button>
                        <button 
                          onClick={handleRejectDeal}
                          className="flex-1 lg:flex-none px-6 py-3 bg-red-600/10 border border-red-600/20 text-red-500 rounded-lg font-black text-[9px] uppercase tracking-[0.1em] hover:bg-red-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => { const amt = prompt("New Offer (₹):"); if(amt) handleSendMessage(null, 'OFFER', null, parseInt(amt)); }}
                        className="flex-1 lg:flex-none px-10 py-4 bg-accent text-background rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(198,169,105,0.2)]"
                      >
                        <DollarSign size={16} />
                        Propose
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-black text-[9px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 backdrop-blur-xl px-6">
                     <CheckCircle2 size={16} className="text-emerald-500" />
                     Consensus: ₹{negotiation.negotiatedPrice?.toLocaleString()}
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
