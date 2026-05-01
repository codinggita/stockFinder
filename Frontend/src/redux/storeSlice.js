import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchNearbyStores = createAsyncThunk(
  'stores/fetchNearby',
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const response = await api.get('/marketplace/stores/nearby', { 
        params: { lat, lng } 
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMyStore = createAsyncThunk(
  'stores/fetchMyStore',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/stores/my-store');
      return response.data.store;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

export const createMyStore = createAsyncThunk(
  'stores/createMyStore',
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await api.post('/stores/my-store', storeData);
      return response.data.store;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

const loadMyStore = () => {
  try {
    const saved = localStorage.getItem('luxe_myStore');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveMyStore = (store) => {
  if (store) {
    localStorage.setItem('luxe_myStore', JSON.stringify(store));
  } else {
    localStorage.removeItem('luxe_myStore');
  }
};

const initialState = {
  items: [],
  myStore: loadMyStore(),
  status: 'idle',
  myStoreStatus: 'idle',
  error: null,
};

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    clearMyStore: (state) => {
      state.myStore = null;
      state.myStoreStatus = 'idle';
      saveMyStore(null);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyStores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNearbyStores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.stores || action.payload.data || [];
      })
      .addCase(fetchNearbyStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch stores';
      })
      .addCase(fetchMyStore.pending, (state) => {
        state.myStoreStatus = 'loading';
      })
      .addCase(fetchMyStore.fulfilled, (state, action) => {
        state.myStoreStatus = 'succeeded';
        state.myStore = action.payload;
        saveMyStore(action.payload);
      })
      .addCase(fetchMyStore.rejected, (state, action) => {
        state.myStoreStatus = 'failed';
        // 404 means no store, which is fine
        if (action.payload?.message === 'Store not found') {
          state.myStore = null;
          saveMyStore(null);
        } else {
          state.error = action.payload?.message;
        }
      })
      .addCase(createMyStore.fulfilled, (state, action) => {
        state.myStoreStatus = 'succeeded';
        state.myStore = action.payload;
        saveMyStore(action.payload);
      });
  },
});

export const { clearMyStore } = storeSlice.actions;
export default storeSlice.reducer;
