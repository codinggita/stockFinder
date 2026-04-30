import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createMyStore } from '../redux/storeSlice';
import { Store, MapPin, Image as ImageIcon, Briefcase, Phone, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import InputField from '../components/InputField';

const CreateStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    fullAddress: '',
    image: '',
    category: '',
    ownerName: '',
    ownerPhone: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resultAction = await dispatch(createMyStore(formData));
      if (createMyStore.fulfilled.match(resultAction)) {
        toast.success('Store created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(resultAction.payload?.message || 'Failed to create store');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Setup Your Store</h1>
          <p className="text-gray-400">Join Luxe Retail and start selling to our premium customer base.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Store Name"
              name="name"
              placeholder="e.g. Reliance Digital Hub"
              icon={Store}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Short Location"
              name="location"
              placeholder="e.g. Vastrapur, Ahmedabad"
              icon={MapPin}
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Owner Name"
              name="ownerName"
              placeholder="e.g. Vikram Mehta"
              icon={Briefcase}
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Owner Phone"
              name="ownerPhone"
              placeholder="e.g. +91 98765 00001"
              icon={Phone}
              value={formData.ownerPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Store Category"
              name="category"
              placeholder="e.g. Electronic, Clothe, Jewels"
              icon={Briefcase}
              value={formData.category}
              onChange={handleChange}
              required
            />
            <InputField
              label="Store Image URL"
              name="image"
              placeholder="https://example.com/image.jpg"
              icon={ImageIcon}
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <InputField
            label="Full Address"
            name="fullAddress"
            placeholder="Complete street address..."
            icon={MapPin}
            value={formData.fullAddress}
            onChange={handleChange}
            required
          />

          <InputField
            label="Store Description"
            name="description"
            placeholder="Tell customers about your premium offerings..."
            icon={AlignLeft}
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="pt-4">
            <Button type="submit" isLoading={isLoading} className="w-full">
              Create My Store &rarr;
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateStore;
