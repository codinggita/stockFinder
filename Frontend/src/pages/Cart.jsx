import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShieldCheck, Lock, ShoppingBag, CreditCard, ChevronRight, Activity, Command, Zap } from 'lucide-react';
import { removeFromCart, updateQuantity, applyNegotiatedPrices } from '../redux/cartSlice';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [promoCode, setPromoCode] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  useEffect(() => {
    dispatch(applyNegotiatedPrices());
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background text-textMain font-sans selection:bg-accent/40">
      <Navbar />

      <main className="max-w-[1200px] mx-auto pt-32 pb-20 px-6">
        
        {/* COMMAND HEADER */}
        <div className="flex items-center justify-between mb-12 border-b border-borderCustom/20 pb-8">
           <div className="space-y-1">
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] italic">Archive_Terminal_v4</span>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-textMain">Shopping_Archive</h1>
           </div>
           <div className="flex gap-8">
              <div className="text-right">
                 <span className="text-[8px] font-black text-subtext/40 uppercase tracking-[0.4em] block">Active_Nodes</span>
                 <p className="text-lg font-black italic text-textMain">{cartItems.length.toString().padStart(2, '0')}</p>
              </div>
              <div className="text-right">
                 <span className="text-[8px] font-black text-subtext/40 uppercase tracking-[0.4em] block">Registry_Status</span>
                 <p className="text-lg font-black italic text-emerald-600">SYNC_OK</p>
              </div>
           </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-borderCustom/20 rounded-[2rem] bg-surface/40">
             <ShoppingBag size={48} className="mx-auto text-subtext/10 mb-6" />
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-subtext/40 mb-8">Archive_Is_Empty</p>
             <button onClick={() => navigate('/marketplace')} className="bg-textMain text-background px-10 py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.4em] hover:bg-accent transition-all">Browse_Inventory</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ASSET ARCHIVE LIST */}
            <div className="lg:col-span-8 space-y-3">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group bg-surface/50 border border-borderCustom/20 rounded-2xl p-6 hover:bg-surface hover:border-borderCustom/40 hover:shadow-premium transition-all"
                  >
                    <div className="flex gap-8 items-center">
                       {/* Compact Asset Thumbnail */}
                       <div className="w-24 h-24 rounded-xl bg-background border border-borderCustom/20 flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:border-accent/30 transition-all">
                          <img src={item.image} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt="" />
                          <div className="absolute top-1 right-1 text-[7px] font-black text-subtext/20">0{index+1}</div>
                       </div>

                       {/* Data Segment */}
                       <div className="flex-1 flex justify-between items-center">
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <span className="text-[8px] font-black text-accent uppercase tracking-[0.4em] italic">{item.category}</span>
                                <span className="text-[8px] font-black text-subtext/20 uppercase tracking-[0.2em]">{item._id.slice(-6)}</span>
                             </div>
                             <h3 className="text-xl font-black italic uppercase tracking-tight text-textMain">{item.name}</h3>
                             <p className="text-[9px] text-subtext leading-relaxed font-medium tracking-wide line-clamp-1">{item.description || "Technical asset parameters synchronized from registry."}</p>
                          </div>

                          <div className="flex items-center gap-10">
                             <div className="text-right space-y-1">
                                {item.isNegotiated && (
                                   <p className="text-[10px] font-bold text-accent uppercase tracking-widest italic mb-1">Deal_Price</p>
                                )}
                                <div className="flex items-center gap-3 justify-end text-textMain">
                                   <p className="text-xl font-black italic tracking-tighter">{formatPrice(item.price)}</p>
                                   {item.isNegotiated && (
                                      <span className="text-sm font-bold text-subtext/40 line-through tracking-tighter italic">{formatPrice(item.originalPrice)}</span>
                                   )}
                                </div>
                                <div className="flex items-center gap-4 justify-end">
                                   <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: Math.max(1, item.quantity - 1) }))} className="text-subtext/40 hover:text-textMain transition-colors"><Minus size={12} /></button>
                                   <span className="text-xs font-black italic text-textMain">{item.quantity}</span>
                                   <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))} className="text-subtext/40 hover:text-textMain transition-colors"><Plus size={12} /></button>
                                </div>
                             </div>
                             <button onClick={() => { dispatch(removeFromCart(item._id)); toast.success('DE_SYNC_OK'); }} className="text-subtext/20 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                             </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* VALUATION CONSOLE */}
            <div className="lg:col-span-4">
               <div className="bg-surface shadow-premium border border-borderCustom/20 rounded-[2.5rem] p-10 space-y-10 sticky top-32">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] italic">Valuation_Log</span>
                        <div className="h-[1px] flex-1 bg-borderCustom/20" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-subtext/60">
                           <span>Sub_Process</span>
                           <span className="text-textMain italic">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-subtext/60">
                           <span>Logistics</span>
                           <span className="text-emerald-600 italic">CREDIT_GRANTED</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-subtext/60">
                           <span>Regulatory_GST</span>
                           <span className="text-textMain italic">{formatPrice(tax)}</span>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-borderCustom/20">
                     <span className="text-[8px] font-black text-subtext/40 uppercase tracking-[0.4em] block mb-2 italic">Final_Allocation</span>
                     <p className="text-5xl font-black italic tracking-tighter text-textMain leading-none">{formatPrice(total)}</p>
                  </div>

                  <div className="space-y-4">
                     <button
                       onClick={() => toast.success('Initializing Checkout...')}
                       className="w-full bg-textMain text-background py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                     >
                       <CreditCard size={12} />
                       Process_Checkout
                     </button>
                     <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="PROMO_CODE"
                          className="flex-1 bg-sectionSurface border border-borderCustom/20 rounded-xl px-4 py-3 text-[9px] text-textMain placeholder:text-subtext/40 font-black tracking-widest focus:outline-none focus:border-accent/30 transition-all"
                        />
                        <button className="px-6 py-3 bg-sectionSurface border border-borderCustom/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-textMain hover:text-background transition-all">
                          Apply
                        </button>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-borderCustom/20 flex items-center justify-center gap-6 opacity-30">
                     <div className="flex items-center gap-2 text-textMain"><ShieldCheck size={12} /><span className="text-[7px] font-black uppercase tracking-widest">SSL_SYNC</span></div>
                     <div className="flex items-center gap-2 text-textMain"><Lock size={12} /><span className="text-[7px] font-black uppercase tracking-widest">AES_256</span></div>
                  </div>
               </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer Meta */}
      <footer className="mt-20 border-t border-borderCustom/20 py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center text-[10px] font-black text-subtext/40 uppercase tracking-[0.4em] italic">
           <span>Stock_Archive_Terminal_v4.2.1</span>
           <div className="flex gap-8">
              <span className="hover:text-textMain cursor-pointer transition-colors">Privacy_Log</span>
              <span className="hover:text-textMain cursor-pointer transition-colors">Audit_Support</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
