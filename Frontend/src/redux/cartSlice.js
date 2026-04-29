import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../services/cartService';
import api from '../services/api';

// Load cart from localStorage
const loadCart = () => {
  try {
    const saved = localStorage.getItem('luxe_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('luxe_cart', JSON.stringify(items));
};

// Async thunks
export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.fetchCart();
      return data.cart; // Backend returns formatted cart
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const syncCartWithServer = createAsyncThunk(
  'cart/syncWithServer',
  async (cartItems, { rejectWithValue }) => {
    try {
      const data = await cartService.updateCart(cartItems);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const applyNegotiatedPrices = createAsyncThunk(
  'cart/applyNegotiations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/negotiations/accepted');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item._id === product._id);
      if (existing) {
        existing.quantity += product.quantity || 1;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          status: product.status,
          store: product.store,
          description: product.description,
          quantity: product.quantity || 1,
        });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
        saveCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
    setCart: (state, action) => {
      state.items = action.payload;
      saveCart(state.items);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.loading = false;
        // Merge server cart with local cart (server takes priority for quantity, but local items not on server stay)
        const serverItems = action.payload.map(item => ({
          ...item,
          _id: item.product // Backend uses 'product' for ID
        }));
        
        // Simple overwrite for now as it's cleaner for "user data" persistence
        state.items = serverItems;
        saveCart(state.items);
      })
      .addCase(fetchCartFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyNegotiatedPrices.fulfilled, (state, action) => {
        const negotiations = action.payload; // List of { product: id, negotiatedPrice: price }
        state.items = state.items.map(item => {
          const neg = negotiations.find(n => n.product === item._id);
          if (neg) {
            return { ...item, price: neg.negotiatedPrice, isNegotiated: true };
          }
          return item;
        });
        saveCart(state.items);
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
