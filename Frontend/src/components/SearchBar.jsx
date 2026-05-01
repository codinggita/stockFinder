import React, { useState } from 'react';
import { Search, MapPin, Clock, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, performSearch, clearSearch } from '../redux/searchSlice';

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const { status, query } = useSelector((state) => state.search);
  const isLoading = status === 'loading';

  React.useEffect(() => {
    if (!query) setInputValue('');
  }, [query]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      dispatch(setSearchQuery(inputValue));
      dispatch(performSearch({ q: inputValue, location: 'Ahmedabad, GJ' }));
    } else {
      dispatch(clearSearch());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative flex items-center bg-surface/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 group-focus-within:border-primary/40 group-focus-within:bg-surface/60 group-focus-within:scale-[1.01]">
          <div className="pl-7 text-subtext group-focus-within:text-primary transition-colors duration-300">
            <Search size={20} strokeWidth={2.5} />
          </div>
          
          <input
            type="text"
            className="w-full bg-transparent text-textMain placeholder:text-subtext/40 py-6 px-5 focus:outline-none text-[15px] font-bold uppercase tracking-[0.15em]"
            placeholder="Search Registry..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          
          <div className="pr-3 py-3">
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] tracking-[0.25em] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/25 active:scale-95"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                'LOCATE'
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="flex items-center justify-center gap-8 mt-6 text-[9px] font-black text-subtext uppercase tracking-[0.4em] opacity-80">
        <div className="flex items-center gap-2 group cursor-default">
          <MapPin size={11} className="text-accent animate-pulse" />
          <span className="text-textMain/80 group-hover:text-textMain transition-colors">Sector: Ahmedabad, GJ</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-40">
          <Clock size={10} />
          <span>Sync Active</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
