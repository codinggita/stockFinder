import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShieldCheck, Lock, Tag, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart, addToCart, applyNegotiatedPrices } from '../redux/cartSlice';
import { fetchProducts } from '../redux/productSlice';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { items: allProducts, status: productsStatus } = useSelector((state) => state.products);
  const [promoCode, setPromoCode] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.12;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (allProducts.length === 0 && productsStatus !== 'loading') {
      dispatch(fetchProducts());
    }
    dispatch(applyNegotiatedPrices());
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => { window.scrollTo(0, 0); }, 100);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getStockBadge = (status) => {
    switch (status) {
      case 'IN_STOCK': return { color: 'text-green-500', dot: 'bg-green-500', label: 'IN STOCK' };
      case 'LOW_STOCK': return { color: 'text-yellow-500', dot: 'bg-yellow-500', label: 'LOW STOCK' };
      default: return { color: 'text-subtext', dot: 'bg-gray-400', label: status?.replace('_', ' ') || 'AVAILABLE' };
    }
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty >= 1) dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const cartIds = cartItems.map(i => i._id);
  const recommended = allProducts
    .filter(p => !cartIds.includes(p._id) && p.status !== 'OUT_OF_STOCK')
    .slice(0, 4);

  const handleAddRecommended = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background text-textMain font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-subtext hover:text-textMain mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Your Shopping Cart</span>
        </button>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 border border-dashed border-borderCustom rounded-3xl bg-surface/20"
          >
            <ShoppingBag size={64} className="text-subtext mb-6" />
            <h2 className="text-2xl font-bold text-textMain mb-2">Your Cart is Empty</h2>
            <p className="text-subtext text-sm mb-8 font-medium">Discover premium products in our marketplace</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all transform hover:scale-105"
            >
              Browse Marketplace
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => {
                  const badge = getStockBadge(item.status);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-surface border border-borderCustom rounded-2xl p-5 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex gap-5">
                        {/* Product Image */}
                        <div
                          onClick={() => navigate(`/product/${item._id}`)}
                          className="w-24 h-24 rounded-xl bg-sectionSurface border border-borderCustom overflow-hidden flex-shrink-0 cursor-pointer group/img"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2 group-hover/img:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <h3
                                onClick={() => navigate(`/product/${item._id}`)}
                                className="text-textMain font-bold text-lg leading-tight cursor-pointer hover:text-primary transition-colors truncate"
                              >
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-subtext font-bold uppercase tracking-widest">
                                  {item.category}
                                </span>
                                {item.description && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-borderCustom"></span>
                                    <span className="text-[10px] text-subtext font-medium truncate max-w-[200px]">
                                      {item.description.split('.')[0]}
                                    </span>
                                  </>
                                )}
                              </div>
                              {/* Stock Badge */}
                              <div className="flex items-center gap-1.5 mt-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                                <span className={`text-[10px] font-bold ${badge.color}`}>{badge.label}</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0 ml-4">
                              <p className="text-textMain font-black text-lg tracking-tight">{formatPrice(item.price)}</p>
                              {item.isNegotiated && (
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 mt-1 block">
                                  Negotiated
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantity & Remove */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 bg-sectionSurface border border-borderCustom rounded-xl p-1">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-surface rounded-lg transition-colors text-subtext hover:text-textMain"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-surface rounded-lg transition-colors text-subtext hover:text-textMain"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemove(item._id, item.name)}
                              className="flex items-center gap-2 text-subtext hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors group/rm"
                            >
                              <Trash2 size={14} className="group-hover/rm:scale-110 transition-transform" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-borderCustom rounded-2xl p-7 sticky top-28"
              >
                <h2 className="text-lg font-black uppercase tracking-widest mb-6">Order Summary</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-subtext font-medium">Subtotal ({totalItems} items)</span>
                    <span className="text-textMain font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext font-medium">Shipping</span>
                    <span className="text-green-500 font-bold text-xs uppercase tracking-widest">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext font-medium">Tax (GST 12%)</span>
                    <span className="text-textMain font-bold">{formatPrice(tax)}</span>
                  </div>

                  <div className="border-t border-borderCustom pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-subtext uppercase tracking-widest">Total Amount</span>
                    </div>
                    <p className="text-3xl font-black text-textMain tracking-tighter mt-1">{formatPrice(total)}</p>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => toast.success('Proceeding to checkout...')}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  Proceed to Checkout
                </button>

                {/* Promo Code */}
                <div className="mt-6">
                  <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-3 text-center">Promo Code</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-sectionSurface border border-borderCustom rounded-xl px-4 py-3 text-xs text-textMain placeholder:text-subtext font-medium focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button className="px-5 py-3 bg-sectionSurface border border-borderCustom rounded-xl text-[10px] font-black uppercase tracking-widest text-textMain hover:bg-surface transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 space-y-3 pt-4 border-t border-borderCustom">
                  <div className="flex items-center gap-3 text-subtext">
                    <ShieldCheck size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Authenticity Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-3 text-subtext">
                    <Lock size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Transaction SSL</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommended.length > 0 && (
          <section className="mt-20">
            <h2 className="text-xl font-bold text-textMain mb-8">Frequently Bought Together</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommended.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-surface border border-borderCustom rounded-2xl overflow-hidden hover:border-primary/30 transition-all group"
                >
                  <div
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="aspect-square bg-sectionSurface overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-textMain font-bold text-sm truncate">{product.name}</h4>
                    <p className="text-primary font-black text-sm mt-1">{formatPrice(product.price)}</p>
                    <button
                      onClick={() => handleAddRecommended(product)}
                      className="w-full mt-3 py-2.5 bg-sectionSurface hover:bg-surface border border-borderCustom rounded-xl text-[10px] font-black uppercase tracking-widest text-textMain transition-all hover:border-primary/30"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-borderCustom bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-textMain text-sm font-bold tracking-[0.2em] uppercase">LUXE RETAIL</span>
            <span className="text-subtext text-xs">&copy; 2024 Intelligent Commerce Systems.</span>
          </div>
          <div className="flex gap-6">
            <span className="text-subtext text-xs hover:text-textMain cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-subtext text-xs hover:text-textMain cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-subtext text-xs hover:text-textMain cursor-pointer transition-colors">Help Center</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
