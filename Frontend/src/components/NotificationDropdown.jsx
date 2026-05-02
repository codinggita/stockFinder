import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, MessageSquare, Zap, Target, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ isOpen, onClose, notifications = [] }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile or close on click outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-4 w-[380px] bg-surface shadow-premium border border-borderCustom/20 rounded-[2.5rem] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-6 border-b border-borderCustom/20 flex items-center justify-between bg-sectionSurface/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Bell size={14} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-textMain">Registry_Alerts</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-background border border-borderCustom/20 flex items-center justify-center text-subtext/40 hover:text-textMain transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-20 px-10 text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full animate-pulse" />
                    <BellOff size={40} className="relative text-white/5 mx-auto" strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-subtext/20 italic">No_Active_Alerts</p>
                    <p className="text-[9px] text-subtext/40 font-medium leading-relaxed max-w-[200px] mx-auto">
                      Your synchronization ledger is currently clear. New updates will appear here in real-time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-borderCustom/10">
                  {notifications.map((notification, index) => (
                    <div 
                      key={index}
                      className="p-6 hover:bg-sectionSurface/40 transition-all cursor-pointer group"
                      onClick={() => {
                        if (notification.link) navigate(notification.link);
                        onClose();
                      }}
                    >
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-borderCustom/20 shadow-sm ${
                          notification.type === 'message' ? 'bg-primary text-background' : 
                          notification.type === 'offer' ? 'bg-accent text-white' : 
                          'bg-emerald-600 text-white'
                        }`}>
                          {notification.type === 'message' ? <MessageSquare size={16} /> : 
                           notification.type === 'offer' ? <Zap size={16} /> : 
                           <Target size={16} />}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-start">
                             <span className="text-[8px] font-black uppercase tracking-widest text-subtext/40 group-hover:text-accent transition-colors">
                                {notification.category || 'System_Update'}
                             </span>
                             <span className="text-[7px] font-bold text-subtext/20 uppercase tracking-tighter">
                                {notification.time || 'Just Now'}
                             </span>
                          </div>
                          <p className="text-xs font-bold text-textMain group-hover:text-accent transition-colors leading-tight tracking-tight italic">
                            {notification.title}
                          </p>
                          <p className="text-[10px] text-subtext/60 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <button 
                className="w-full py-5 bg-sectionSurface/40 hover:bg-sectionSurface border-t border-borderCustom/20 text-[9px] font-black uppercase tracking-[0.4em] text-subtext/40 hover:text-textMain transition-all flex items-center justify-center gap-2"
              >
                <History size={10} />
                View_Full_Audit_Log
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
