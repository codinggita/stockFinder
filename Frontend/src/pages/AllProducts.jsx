import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../redux/productSlice';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status } = useSelector((state) => state.products);
  const { results: searchResults, status: searchStatus } = useSelector((state) => state.search);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const displayProducts = searchStatus === 'succeeded' && searchResults?.products ? searchResults.products : products;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans selection:bg-primary/40">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full space-y-16">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Marketplace</span>
        </button>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-white">Full Inventory</h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">Explore our complete collection of premium products across all categories in Gujarat.</p>
          <div className="max-w-2xl mx-auto pt-4">
             <SearchBar />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {status === 'loading' ? (
             [1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-square bg-white/5 rounded-3xl animate-pulse"></div>)
          ) : (
            displayProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </main>

      <footer className="border-t border-white/5 bg-[#020617] py-12 text-center">
         <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">RETAILBRIDGE INTELLIGENCE SYSTEM • PRODUCT DIRECTORY</p>
      </footer>
    </div>
  );
};

export default AllProducts;
