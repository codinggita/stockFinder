import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Star, 
  ChevronRight, Plus, Minus, Crosshair 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Navbar';
import { fetchNearbyStores } from '../redux/storeSlice';

// Custom Marker Icon
const storeIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div class="relative group">
      <div class="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500 animate-pulse"></div>
      <div class="relative w-8 h-8 bg-surface border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
        <div class="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.5, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
};

const StoreMarker = ({ store, isSelected, onClick }) => {
  const markerRef = useRef(null);
  useEffect(() => {
    if (isSelected && markerRef.current) markerRef.current.openPopup();
  }, [isSelected]);

  return (
    <Marker 
      ref={markerRef}
      position={[store.coordinates.coordinates[1], store.coordinates.coordinates[0]]}
      icon={storeIcon}
      eventHandlers={{ click: onClick }}
    >
      <Popup className="premium-popup" closeButton={false}>
        <div className="p-5 space-y-4 min-w-[240px]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Official Partner</p>
            </div>
            <h4 className="font-black text-lg tracking-tighter leading-none">{store.name}</h4>
          </div>
          <p className="text-[10px] text-subtext leading-relaxed font-medium">{store.location || store.fullAddress || 'Gujarat, India'}</p>
          <div className="pt-3 border-t border-borderCustom flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] font-black">
              <span className="text-subtext uppercase tracking-widest">Available Now</span>
              <span className="text-green-500">0.8 KM</span>
            </div>
            <button 
              onClick={() => window.location.href = `/store/${store._id}`}
              className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg transition-all"
            >
              View Store Details
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const AllStores = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: stores, status } = useSelector((state) => state.stores);
  const [activeFilter, setActiveFilter] = useState('All Stores');
  const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]);
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const filters = ['All Stores', 'Flagship', 'Boutique', 'Express'];

  useEffect(() => {
    if (stores.length === 0) {
      dispatch(fetchNearbyStores({ lat: 23.0225, lng: 72.5714 }));
    }
  }, [dispatch, stores.length]);

  // Watch for theme changes to swap map tiles
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (location.state?.selectedStoreId && stores.length > 0) {
      const store = stores.find(s => s._id === location.state.selectedStoreId);
      if (store) handleStoreClick(store);
    }
  }, [location.state, stores]);

  const handleStoreClick = (store) => {
    setSelectedStoreId(store._id);
    if (store.coordinates?.coordinates) {
      setMapCenter([store.coordinates.coordinates[1], store.coordinates.coordinates[0]]);
      setMapZoom(16);
    }
  };

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="h-screen bg-background text-textMain font-sans flex flex-col overflow-hidden selection:bg-primary/30">
      <Navbar />

      <div className="flex-1 flex pt-16 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-[320px] bg-background border-r border-borderCustom flex flex-col z-20 relative">
          <div className="p-5 pb-1 space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/marketplace')}
                className="w-7 h-7 flex items-center justify-center bg-surface hover:bg-sectionSurface rounded-full border border-borderCustom transition-all group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="space-y-0">
                <p className="text-[7px] font-black text-primary uppercase tracking-[0.3em] opacity-60">Intelligence</p>
                <h1 className="text-2xl font-black tracking-tighter leading-none">Nearby Outlets</h1>
              </div>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap snap-start border ${
                    activeFilter === filter 
                      ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-surface text-subtext hover:bg-sectionSurface hover:text-textMain border-borderCustom'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Area */}
          <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-3 scrollbar-hide perspective-1000">
            <AnimatePresence>
              {status === 'loading' ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-40 bg-surface border border-borderCustom rounded-xl animate-pulse"></div>
                ))
              ) : (
                stores.map((store, index) => (
                  <motion.div
                    key={store._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                    onClick={() => handleStoreClick(store)}
                    className={`group relative bg-surface backdrop-blur-3xl border rounded-xl overflow-hidden transition-all duration-500 cursor-pointer flex flex-col ${
                      selectedStoreId === store._id ? 'border-primary ring-1 ring-primary/20 shadow-xl scale-[1.01]' : 'border-borderCustom hover:border-primary/30'
                    }`}
                  >
                    <div className="relative h-28 overflow-hidden bg-sectionSurface">
                      <img 
                        src={store.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'} 
                        alt={store.name} 
                        className="w-full h-full object-cover opacity-70 dark:opacity-50 group-hover:scale-105 transition-transform duration-[3000ms]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"></div>
                      
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 bg-surface/80 border border-borderCustom text-green-500 text-[6px] font-black tracking-[0.2em] rounded-full uppercase flex items-center gap-1 backdrop-blur-xl">
                          <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                          Live
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pt-2 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black tracking-tighter truncate group-hover:text-primary transition-colors">{store.name}</h3>
                          <div className="flex items-center gap-1 mt-0.5">
                             <Star size={8} className="text-yellow-500 fill-yellow-500 opacity-80" />
                             <span className="text-[7px] font-black text-subtext uppercase tracking-widest">Partnered</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-base font-black tracking-tighter leading-none text-primary">0.8<span className="text-[8px] ml-0.5">KM</span></p>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/store/${store._id}`);
                        }}
                        className={`w-full py-2.5 rounded-lg font-black text-[8px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${
                          selectedStoreId === store._id 
                            ? 'bg-primary text-white' 
                            : 'bg-sectionSurface hover:bg-surface text-textMain border border-borderCustom'
                        }`}
                      >
                        Enter Space 
                        <ChevronRight size={10} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-borderCustom bg-background flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-subtext">
             <div className="flex gap-6">
                <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span> Active</span>
                <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-yellow-500"></span> Limited</span>
             </div>
             <span>© 2024 Luxe</span>
          </div>
        </aside>

        {/* Map */}
        <section className="flex-1 relative bg-background">
          <MapContainer center={mapCenter} zoom={mapZoom} zoomControl={false} className="w-full h-full">
            <TileLayer
              key={tileUrl}
              url={tileUrl}
              attribution='&copy; LUXE RETAIL INTELLIGENCE'
            />
            <MapController center={mapCenter} zoom={mapZoom} />
            
            {stores.map(store => (
              store.coordinates?.coordinates && (
                <StoreMarker 
                  key={store._id} 
                  store={store} 
                  isSelected={selectedStoreId === store._id}
                  onClick={() => handleStoreClick(store)}
                />
              )
            ))}
          </MapContainer>

          {/* Floating Controls */}
          <div className="absolute top-8 right-8 flex flex-col gap-5 z-[1000]">
             <div className="flex flex-col bg-surface/90 backdrop-blur-2xl border border-borderCustom rounded-[2rem] overflow-hidden shadow-2xl">
                <button onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))} className="p-5 hover:bg-sectionSurface transition-colors border-b border-borderCustom text-subtext hover:text-textMain">
                   <Plus size={20} />
                </button>
                <button onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))} className="p-5 hover:bg-sectionSurface transition-colors text-subtext hover:text-textMain">
                   <Minus size={20} />
                </button>
             </div>
             <button 
               onClick={() => {
                 setMapCenter([23.0225, 72.5714]);
                 setMapZoom(13);
                 setSelectedStoreId(null);
               }}
               className="p-5 bg-primary shadow-[0_20px_50px_rgba(59,130,246,0.3)] border border-primary rounded-[2rem] hover:scale-110 transition-all flex items-center justify-center text-white"
             >
                <Crosshair size={22} />
             </button>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container { background: var(--background) !important; }
        .premium-popup .leaflet-popup-content-wrapper {
          background: var(--surface) !important;
          backdrop-filter: blur(20px) !important;
          color: var(--text-main) !important;
          border: 1px solid var(--border-custom);
          border-radius: 2.5rem;
          padding: 0 !important;
          box-shadow: var(--card-shadow) !important;
        }
        .premium-popup .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .premium-popup .leaflet-popup-tip { background: var(--surface) !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-marker { background: none !important; border: none !important; }
        .perspective-1000 { perspective: 1000px; }
      `}} />
    </div>
  );
};

export default AllStores;
