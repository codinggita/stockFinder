import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Tag, IndianRupee, Image as ImageIcon, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import InputField from '../components/InputField';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/stores/my-store/products', {
        ...formData,
        price: Number(formData.price)
      });
      if (response.data.success) {
        toast.success('Product added successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-textMain">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Add New Product</h1>
          <p className="text-subtext">List a new item in your store's inventory.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-borderCustom rounded-2xl p-8 backdrop-blur-xl space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Product Name" name="name" placeholder="e.g. Premium Watch" icon={Package} value={formData.name} onChange={handleChange} required />
            <InputField label="Category" name="category" placeholder="e.g. Watches, Electronic" icon={Tag} value={formData.category} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Price (₹)" name="price" type="number" placeholder="e.g. 15000" icon={IndianRupee} value={formData.price} onChange={handleChange} required />
            <InputField label="Image URL" name="image" placeholder="https://example.com/product.jpg" icon={ImageIcon} value={formData.image} onChange={handleChange} required />
          </div>

          <InputField label="Description" name="description" placeholder="Detailed description of the product..." icon={AlignLeft} value={formData.description} onChange={handleChange} required />

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-sectionSurface hover:bg-surface text-textMain rounded-full py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border border-borderCustom"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Add Product &rarr;
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
