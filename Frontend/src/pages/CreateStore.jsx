import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createMyStore } from '../redux/storeSlice';
import { Store, MapPin, Image as ImageIcon, Briefcase, Phone, AlignLeft, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import InputField from '../components/InputField';
import SEO from '../components/SEO';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background text-textMain overflow-hidden">
      <SEO title="Initialize Store" robots="noindex, nofollow" />
      <Navbar />
      
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* --- Left Column: Cinematic Monolith --- */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative lg:w-5/12 h-[40vh] lg:h-screen overflow-hidden hidden md:block"
        >
          <div className="absolute inset-0">
            <img 
              src="/images/luxury_store_bg.png" 
              alt="Luxury Store" 
              className="w-full h-full object-cover grayscale-[0.2] brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent lg:bg-gradient-to-b" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative h-full flex flex-col justify-center px-12 lg:px-20 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Sparkles size={12} />
                <span>Partner Program</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight mb-6">
                ELEVATE <br />
                <span className="text-accent italic font-serif">Your Presence.</span>
              </h1>
              
              <p className="text-subtext text-lg max-w-md font-medium leading-relaxed mb-8">
                Join our curated ecosystem of premium retailers. Reach a sophisticated audience that values architectural design and superior craftsmanship.
              </p>

              <div className="space-y-4">
                {[
                  "Global visibility for your boutique",
                  "Advanced negotiation tools",
                  "Direct connection with high-intent buyers",
                  "Priority support and analytics"
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (i * 0.1) }}
                    className="flex items-center space-x-3 text-sm font-semibold text-textMain/80"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Vertical Decorative Text */}
            <div className="absolute bottom-12 right-8 hidden lg:block">
              <span className="vertical-text text-[80px] font-black text-white/5 select-none pointer-events-none tracking-tighter uppercase">
                Architecture
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- Right Column: Form --- */}
        <div className="flex-1 flex flex-col pt-24 lg:pt-0 lg:justify-center overflow-y-auto custom-scrollbar">
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl mx-auto px-6 py-12"
          >
            <motion.div variants={itemVariants} className="mb-10 lg:hidden">
               <h2 className="text-3xl font-black tracking-tight mb-2">Setup Your Store</h2>
               <p className="text-subtext font-medium">Join STOCK FINDER and start selling.</p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit}
              className="premium-glass rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl space-y-8"
            >
              <motion.div variants={itemVariants}>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-8 flex items-center">
                  <span className="w-8 h-[1px] bg-accent mr-3" />
                  Store Identity
                </h3>
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
                    label="Store Category"
                    name="category"
                    placeholder="e.g. Electronic, Fashion"
                    icon={Briefcase}
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-8 flex items-center">
                  <span className="w-8 h-[1px] bg-accent mr-3" />
                  Visual & Ownership
                </h3>
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
                <div className="mt-6">
                  <InputField
                    label="Store Image URL"
                    name="image"
                    placeholder="https://images.unsplash.com/photo-..."
                    icon={ImageIcon}
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent mb-8 flex items-center">
                  <span className="w-8 h-[1px] bg-accent mr-3" />
                  Location & Narrative
                </h3>
                <div className="space-y-6">
                  <InputField
                    label="Short Location"
                    name="location"
                    placeholder="e.g. Vastrapur, Ahmedabad"
                    icon={MapPin}
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
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
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-6">
                <Button 
                  type="submit" 
                  isLoading={isLoading} 
                  className="w-full h-14 rounded-2xl bg-textMain text-background hover:bg-accent transition-all duration-500 group"
                >
                  <span className="flex items-center justify-center font-bold tracking-widest uppercase text-xs">
                    Initialize Store
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
                  </span>
                </Button>
              </motion.div>
            </motion.form>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default CreateStore;
