import api from './api';

const fetchCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

const updateCart = async (cartItems) => {
  const response = await api.post('/cart', { cartItems });
  return response.data;
};

const cartService = {
  fetchCart,
  updateCart,
};

export default cartService;
