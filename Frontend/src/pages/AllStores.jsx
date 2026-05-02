import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Minus, Locate, 
  ArrowUpRight, Target
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Navbar';
import { fetchNearbyStores } from '../redux/storeSlice';



const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
};

const AllStores = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: stores } = useSelector((state) => state.stores);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]);
  const [mapZoom, setMapZoom] = useState(13);
  const reelRef = useRef(null);

  useEffect(() => {
    if (stores.length === 0) {
      dispatch(fetchNearbyStores({ lat: 23.0225, lng: 72.5714 }));
    }
  }, [dispatch, stores.length]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    const store = stores[index];
    if (store?.coordinates?.coordinates) {
      setMapCenter([store.coordinates.coordinates[1], store.coordinates.coordinates[0]]);
      setMapZoom(16);
    }
  };

  return (
    <div className="h-screen bg-black text-white font-sans flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 relative flex flex-col pt-16">
        
        {/* Top 65%: The Interactive Map */}
        <div className="h-[65%] w-full relative z-0 border-b border-white/5 overflow-hidden">
           <div className="w-full h-full brightness-[0.9] contrast-110">
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                zoomControl={false} 
                style={{ height: '100%', width: '100%' }}
              >
                 <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                 <MapController center={mapCenter} zoom={mapZoom} />
                 {stores.map((s, i) => s.coordinates?.coordinates && (
                    <Marker 
                      key={s._id} 
                      position={[s.coordinates.coordinates[1], s.coordinates.coordinates[0]]}
                      ref={(ref) => {
                        if (i === selectedIndex && ref) {
                          ref.openPopup();
                        }
                      }}
                      icon={new L.DivIcon({
                        className: 'custom-marker',
                        html: `
                          <div class="relative flex items-center">
                            <div class="w-4 h-4 bg-accent border-2 border-white rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"></div>
                            <div class="ml-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-full whitespace-nowrap">
                              <span class="text-[9px] font-black uppercase tracking-widest text-white">${s.name}</span>
                            </div>
                          </div>
                        `,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                      })}
                      eventHandlers={{ click: () => handleSelect(i) }}
                    >
                       <Popup className="luxe-popup">
                          <div className="w-[280px] bg-black border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl translate-y-[-10px]">
                             <div className="h-32 w-full relative">
                                <img src={s.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover grayscale-[30%]" alt="Store" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                             </div>
                             <div className="p-5">
                                <h4 className="text-xl font-black uppercase italic tracking-tighter text-white">{s.name}</h4>
                                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                                   <span className="text-[9px] font-black uppercase text-white/40">Range: 0.8 KM</span>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); navigate(`/store/${s._id}`); }}
                                     className="px-4 py-1.5 bg-white text-black text-[8px] font-black uppercase tracking-widest rounded-full hover:bg-accent transition-all"
                                   >
                                      Enter
                                   </button>
                                </div>
                             </div>
                          </div>
                       </Popup>
                    </Marker>
                 ))}
              </MapContainer>
           </div>

           {/* Floating Map HUD */}
           <div className="absolute top-10 left-10 z-20">
              <button onClick={() => navigate('/marketplace')} className="flex items-center gap-4 px-6 py-3 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-accent hover:bg-accent hover:text-white transition-all">
                 <ArrowLeft size={16} /> Registry Hub
              </button>
           </div>

           <div className="absolute top-10 right-10 z-20 flex flex-col gap-4">
              <div className="flex flex-col bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full overflow-hidden">
                 <button onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))} className="p-5 hover:text-accent transition-all"><Plus size={20} /></button>
                 <button onClick={() => setMapZoom(prev => Math.max(prev - 1, 3))} className="p-5 hover:text-accent transition-all border-l border-white/5"><Minus size={20} /></button>
              </div>
              <button 
                onClick={() => { setMapCenter([23.0225, 72.5714]); setMapZoom(13); setSelectedIndex(0); }}
                className="w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all text-black group"
              >
                 <Locate size={24} />
              </button>
           </div>
        </div>

        {/* Bottom 35%: Cinematic Reel */}
        <div className="h-[35%] bg-black relative z-10 flex flex-col justify-center overflow-hidden">
           {/* Decorative Scanner Line */}
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-pulse"></div>
           
           <div 
             ref={reelRef}
             className="flex items-center gap-10 overflow-x-auto scrollbar-hide px-[40%] py-10"
           >
              {stores.map((s, i) => (
                 <motion.div
                   key={s._id}
                   animate={{
                     scale: i === selectedIndex ? 1.2 : 0.8,
                     opacity: i === selectedIndex ? 1 : 0.3,
                     x: (i - selectedIndex) * 20
                   }}
                   transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                   onClick={() => handleSelect(i)}
                   className="relative flex-shrink-0 w-[350px] aspect-[16/9] cursor-pointer group"
                 >
                    <div className={`w-full h-full rounded-[2.5rem] overflow-hidden border-2 transition-all duration-700 ${i === selectedIndex ? 'border-accent shadow-[0_30px_60px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-white/20'}`}>
                       <img src={s.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-1000" alt="Store" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                       
                       <div className="absolute bottom-8 left-10 right-10">
                          <div className="flex justify-between items-end">
                             <div className="space-y-1">
                                <span className="text-[8px] font-black text-accent uppercase tracking-[0.5em]">Luxe Registry 0{i+1}</span>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{s.name}</h3>
                             </div>
                             {i === selectedIndex && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); navigate(`/store/${s._id}`); }}
                                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-xl"
                                >
                                   <ArrowUpRight size={20} />
                                </button>
                             )}
                          </div>
                       </div>
                    </div>
                    
                    {/* Floating Info Tag */}
                    {i === selectedIndex && (
                       <motion.div 
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full whitespace-nowrap"
                       >
                          <Target size={12} className="text-accent" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/60 italic">Location Locked: 0.8 KM</span>
                       </motion.div>
                    )}
                 </motion.div>
              ))}
           </div>

           {/* Navigation Progress */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {stores.map((_, i) => (
                 <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === selectedIndex ? 'w-12 bg-accent' : 'w-4 bg-white/10'}`} />
              ))}
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container { background: #000 !important; }
        .custom-marker { background: none !important; border: none !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: transparent !important;
          box-shadow: none !important;
          color: white !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .leaflet-popup-close-button { display: none !important; }
      `}} />
    </div>
  );
};

export default AllStores;









