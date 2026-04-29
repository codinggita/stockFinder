import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import storeReducer from './storeSlice';
import searchReducer from './searchSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    stores: storeReducer,
    search: searchReducer,
    cart: cartReducer,
  },
});
