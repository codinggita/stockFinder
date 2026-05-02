import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, User, Bell } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { fetchNotifications, markNotificationsRead } from '../redux/notificationSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { clearMyStore } from '../redux/storeSlice';
import { useSocket } from './../context/SocketContext';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const { items: notifications, unreadCount } = useSelector(state => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const socket = useSocket();

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearMyStore());
    navigate('/login');
  };

  const toggleNotifications = () => {
    if (!showNotifications) {
      dispatch(markNotificationsRead());
    }
    setShowNotifications(!showNotifications);
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || parts[0] === '') return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sectionSurface/80 backdrop-blur-2xl border-b border-borderCustom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-12">
            <h1 
              className="text-textMain text-xl font-black tracking-[0.3em] uppercase cursor-pointer flex items-center gap-2 group" 
              onClick={() => navigate(user?.role === 'retailer' ? '/dashboard' : '/marketplace')}
            >
              <div className="w-2 h-8 bg-accent group-hover:scale-y-110 transition-transform" />
              LUXE RETAIL
            </h1>

            <div className="hidden md:flex space-x-10">
              {user?.role === 'retailer' ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`${isActive('/dashboard') ? 'text-accent border-b-2 border-accent' : 'text-subtext hover:text-textMain'} pb-5 mt-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/dashboard/negotiations" 
                    className={`${isActive('/dashboard/negotiations') ? 'text-accent border-b-2 border-accent' : 'text-subtext hover:text-textMain'} pb-5 mt-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all`}
                  >
                    Negotiations
                  </Link>
                  <Link 
                    to="/products" 
                    className={`${isActive('/products') ? 'text-accent border-b-2 border-accent' : 'text-subtext hover:text-textMain'} pb-5 mt-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all`}
                  >
                    Add Product
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/marketplace" 
                    className={`${isActive('/marketplace') ? 'text-accent border-b-2 border-accent' : 'text-subtext hover:text-textMain'} pb-5 mt-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all`}
                  >
                    Marketplace
                  </Link>
                  <Link 
                    to="/stores" 
                    className={`${isActive('/stores') ? 'text-accent border-b-2 border-accent' : 'text-subtext hover:text-textMain'} pb-5 mt-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all`}
                  >
                    Stores
                  </Link>
                  <Link 
                    to="/products" 
                    className={`${isActive('/products') ? 'text-accent border-b-2 border-accent' : 'text-subtext hover:text-textMain'} pb-5 mt-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all`}
                  >
                    Inventory
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className={`p-2.5 rounded-xl border border-borderCustom transition-all relative group ${showNotifications ? 'bg-accent/20 border-accent/50 text-accent' : 'text-subtext bg-surface/40 hover:bg-surface/60'}`}
                >
                  <Bell size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                  notifications={notifications}
                />
              </div>
            )}

            {user?.role !== 'retailer' && (
              <button
                onClick={() => navigate('/cart')}
                className="text-subtext hover:text-textMain transition-all bg-surface/40 p-2.5 rounded-xl border border-borderCustom hover:bg-surface/60 relative group"
              >
                <ShoppingCart size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}


            {/* Account / Profile Button */}
            <button
              className="ml-1 w-10 h-10 rounded-xl bg-gradient-to-br from-surface to-background border border-borderCustom flex items-center justify-center overflow-hidden group hover:border-accent/50 transition-all shadow-xl"
              onClick={() => !user && navigate('/login')}
              title={user?.name || "Account"}
            >
              {user ? (
                <span className="text-[10px] font-black tracking-tighter text-textMain group-hover:scale-110 transition-transform">
                  {getInitials(user.name)}
                </span>
              ) : (
                <div className="w-full h-full bg-surface/50 flex items-center justify-center">
                   <User size={16} className="text-subtext" />
                </div>
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="ml-2 text-subtext hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
