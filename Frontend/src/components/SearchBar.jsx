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
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-[2rem] opacity-0 blur-xl group-focus-within:opacity-20 transition duration-700"></div>
        <div className="relative flex items-center bg-surface border border-borderCustom rounded-[1.8rem] overflow-hidden shadow-lg transition-all group-focus-within:border-primary/40">
          <div className="pl-6 text-subtext group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full bg-transparent text-textMain placeholder:text-subtext/60 py-5 px-5 focus:outline-none text-[13px] font-black uppercase tracking-[0.1em]"
            placeholder="Search Registry..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="pr-2 py-2">
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-8 py-3.5 rounded-[1.2rem] font-black text-[10px] tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
            >
              {isLoading ? (<><Loader2 size={14} className="animate-spin" />SYNCING</>) : 'LOCATE'}
            </button>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-center gap-8 mt-6 text-[9px] font-black text-subtext uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2 group cursor-default">
          <MapPin size={12} className="text-accent group-hover:animate-bounce" />
          <span className="text-textMain/60 group-hover:text-textMain transition-colors">Sector: Ahmedabad, GJ</span>
        </div>
        <div className="flex items-center gap-2 opacity-40">
          <Clock size={12} />
          <span>Last Query: Prime inventory</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
