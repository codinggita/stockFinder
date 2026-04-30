import React from 'react';
import { ShoppingCart, Bell, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const user = useSelector((state) => state.auth.user);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || parts[0] === '') return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-10">
            <h1 className="text-white text-lg font-bold tracking-[0.2em] uppercase cursor-pointer" onClick={() => navigate(user?.role === 'retailer' ? '/dashboard' : '/marketplace')}>
              LUXE RETAIL
            </h1>

            <div className="hidden md:flex space-x-8">
              {user?.role === 'retailer' ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`${isActive('/dashboard') ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'} pb-5 mt-5 text-[11px] font-bold uppercase tracking-widest transition-all`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/marketplace" 
                    className={`${isActive('/marketplace') ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'} pb-5 mt-5 text-[11px] font-bold uppercase tracking-widest transition-all`}
                  >
                    View Marketplace
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/marketplace" 
                    className={`${isActive('/marketplace') ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'} pb-5 mt-5 text-[11px] font-bold uppercase tracking-widest transition-all`}
                  >
                    Marketplace
                  </Link>
                  <Link 
                    to="/stores" 
                    className={`${isActive('/stores') ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'} pb-5 mt-5 text-[11px] font-bold uppercase tracking-widest transition-all`}
                  >
                    Stores
                  </Link>
                  <Link 
                    to="/products" 
                    className={`${isActive('/products') ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'} pb-5 mt-5 text-[11px] font-bold uppercase tracking-widest transition-all`}
                  >
                    Products
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2.5 rounded-lg hover:bg-white/10 relative"
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.5)] animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2.5 rounded-lg hover:bg-white/10 relative">
              <Bell size={18} strokeWidth={2.5} />
            </button>

            {/* Account / Profile Button */}
            <button
              className="ml-1 w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden group hover:border-primary transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
              onClick={() => !user && navigate('/login')}
              title={user?.name || "Account"}
            >
              {user ? (
                <span className="text-[11px] font-black tracking-tighter text-white group-hover:scale-110 transition-transform">
                  {getInitials(user.name)}
                </span>
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                   <ShoppingCart size={14} className="text-gray-500" />
                </div>
              )}
            </button>

            {/* Logout hidden in smaller profile menu or as separate icon */}
            {user && (
              <button
                onClick={handleLogout}
                className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

