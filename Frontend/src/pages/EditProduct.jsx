import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Tag, IndianRupee, Image as ImageIcon, AlignLeft, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import InputField from '../components/InputField';

const EditProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    status: 'IN_STOCK',
    sizeType: '',
    sizes: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/marketplace/products/${id}`);
        if (response.data.success && response.data.product) {
          const prod = response.data.product;
          setFormData({
            name: prod.name || '',
            category: prod.category || '',
            price: prod.price || '',
            description: prod.description || '',
            image1: prod.images?.[0] || prod.image || '',
            image2: prod.images?.[1] || '',
            image3: prod.images?.[2] || '',
            image4: prod.images?.[3] || '',
            status: prod.status || 'IN_STOCK',
            sizeType: prod.sizeType || '',
            sizes: prod.sizes || []
          });
        }
      } catch (error) {
        toast.error('Failed to load product details');
        navigate('/products');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const imageUrls = [formData.image1, formData.image2, formData.image3, formData.image4].filter(url => url && url.trim() !== '');
      const response = await api.put(`/stores/my-store/products/${id}`, {
        ...formData,
        price: Number(formData.price),
        image: imageUrls[0] || '',
        images: imageUrls
      });
      if (response.data.success) {
        toast.success('Product updated successfully!');
        navigate('/products');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background text-textMain flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textMain">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Edit Product</h1>
          <p className="text-subtext">Update the details of your inventory item.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-borderCustom rounded-2xl p-8 backdrop-blur-xl space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Product Name" name="name" placeholder="e.g. Premium Watch" icon={Package} value={formData.name} onChange={handleChange} required />
            <InputField label="Category" name="category" placeholder="e.g. Watches, Electronic" icon={Tag} value={formData.category} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Price (₹)" name="price" type="number" placeholder="e.g. 15000" icon={IndianRupee} value={formData.price} onChange={handleChange} required />
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-subtext ml-1">Product Images (up to 4)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="image1" placeholder="Main Image URL" icon={ImageIcon} value={formData.image1 || ''} onChange={(e) => setFormData({ ...formData, image1: e.target.value })} required />
              <InputField name="image2" placeholder="Image URL 2 (optional)" icon={ImageIcon} value={formData.image2 || ''} onChange={(e) => setFormData({ ...formData, image2: e.target.value })} />
              <InputField name="image3" placeholder="Image URL 3 (optional)" icon={ImageIcon} value={formData.image3 || ''} onChange={(e) => setFormData({ ...formData, image3: e.target.value })} />
              <InputField name="image4" placeholder="Image URL 4 (optional)" icon={ImageIcon} value={formData.image4 || ''} onChange={(e) => setFormData({ ...formData, image4: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-black uppercase tracking-[0.2em] text-subtext ml-1">Stock Status</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-subtext">
                    <Info size={18} />
                 </div>
                 <select 
                   name="status"
                   value={formData.status}
                   onChange={handleChange}
                   className="w-full bg-surface border border-borderCustom rounded-2xl py-4 pl-12 pr-4 text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none font-bold"
                 >
                   <option value="IN_STOCK" className="bg-surface">In Stock</option>
                   <option value="LOW_STOCK" className="bg-surface">Low Stock</option>
                   <option value="OUT_OF_STOCK" className="bg-surface">Out of Stock</option>
                   <option value="PRE_ORDER" className="bg-surface">Pre-order</option>
                   <option value="EXCLUSIVE" className="bg-surface">Exclusive Access</option>
                 </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black uppercase tracking-[0.2em] text-subtext ml-1">Size Type</label>
               <select 
                 name="sizeType"
                 value={formData.sizeType}
                 onChange={(e) => setFormData({ ...formData, sizeType: e.target.value, sizes: [] })}
                 className="w-full bg-surface border border-borderCustom rounded-2xl py-4 px-4 text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none font-bold"
               >
                 <option value="" className="bg-surface">No Sizes</option>
                 <option value="Clothing" className="bg-surface">Clothing (XS - XXL)</option>
                 <option value="Shoes" className="bg-surface">Shoes (6 - 12)</option>
               </select>
            </div>
          </div>

          {formData.sizeType && (
            <div className="space-y-2 bg-sectionSurface border border-borderCustom p-6 rounded-2xl">
               <label className="text-xs font-black uppercase tracking-[0.2em] text-subtext ml-1 mb-4 block">Select Available Sizes</label>
               <div className="flex flex-wrap gap-3">
                  {(formData.sizeType === 'Clothing' ? ['XS', 'S', 'M', 'L', 'XL', 'XXL'] : ['6', '7', '8', '9', '10', '11', '12']).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`w-12 h-12 rounded-xl text-sm font-bold transition-colors border ${formData.sizes.includes(size) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-surface text-subtext hover:bg-sectionSurface border-borderCustom hover:border-primary/40'}`}
                    >
                      {size}
                    </button>
                  ))}
               </div>
               <p className="text-[10px] font-bold text-subtext uppercase tracking-widest mt-4">Unselected sizes will be marked as Not Available</p>
            </div>
          )}

          <InputField
            label="Description"
            name="description"
            placeholder="Detailed description of the product..."
            icon={AlignLeft}
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/products')}
              className="flex-1 bg-sectionSurface hover:bg-surface text-textMain rounded-full py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border border-borderCustom"
            >
              Cancel
            </button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Save Changes &rarr;
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProduct;
