import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CreateAccount from './pages/CreateAccount';
import SignIn from './pages/SignIn';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import StoreDetail from './pages/StoreDetail';
import AllStores from './pages/AllStores';
import AllProducts from './pages/AllProducts';
import Cart from './pages/Cart';
import Negotiation from './pages/Negotiation';
import RetailerDashboard from './pages/RetailerDashboard';
import CreateStore from './pages/CreateStore';
import AddProduct from './pages/AddProduct';
import CartInitializer from './components/CartInitializer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartInitializer />
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />
      <Routes>
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/dashboard" element={<RetailerDashboard />} />
        <Route path="/dashboard/create-store" element={<CreateStore />} />
        <Route path="/dashboard/add-product" element={<AddProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/stores" element={<AllStores />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/negotiate/:productId" element={<Negotiation />} />
        <Route path="/" element={<Navigate to="/marketplace" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
