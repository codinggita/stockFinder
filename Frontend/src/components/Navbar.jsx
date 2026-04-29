import React from 'react';
import { ShoppingCart, Bell, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-10">
            <h1 className="text-white text-lg font-bold tracking-[0.2em] uppercase cursor-pointer" onClick={() => navigate('/marketplace')}>
              LUXE RETAIL
            </h1>

            <div className="hidden md:flex space-x-8">
              <Link to="/marketplace" className="text-white border-b-2 border-primary pb-5 mt-5 text-[11px] font-bold uppercase tracking-widest transition-all">
                Marketplace
              </Link>
              <Link to="/stores" className="text-gray-400 hover:text-white pb-5 mt-5 text-[11px] font-bold uppercase tracking-widest transition-all">
                Stores
              </Link>
              <Link to="/products" className="text-gray-400 hover:text-white pb-5 mt-5 text-[11px] font-bold uppercase tracking-widest transition-all">
                Products
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2.5 rounded-lg hover:bg-white/10">
              <ShoppingCart size={18} strokeWidth={2.5} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2.5 rounded-lg hover:bg-white/10 relative">
              <Bell size={18} strokeWidth={2.5} />
            </button>

            {/* Account / Profile Button */}
            <button
              className="ml-1 w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center overflow-hidden group hover:border-primary/50 transition-all"
              onClick={() => navigate('/login')}
              title="Account"
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                alt="Profile"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </button>

            {/* Logout hidden in smaller profile menu or as separate icon */}
            <button
              onClick={handleLogout}
              className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
