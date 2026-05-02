import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const response = await api.get('/negotiations/notifications');
    return response.data;
  }
);

export const markNotificationsRead = createAsyncThunk(
  'notifications/markRead',
  async () => {
    await api.patch('/negotiations/notifications/read');
    return true;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false
  },
  reducers: {
    addNotification: (state, action) => {
      // Check if notification already exists to avoid duplicates from socket + fetch
      const exists = state.items.find(item => item._id === action.payload._id);
      if (!exists) {
        state.items.unshift({
          ...action.payload,
          id: action.payload._id || Date.now(),
          time: 'Just Now',
          isRead: false
        });
        state.unreadCount += 1;
      }
      if (state.items.length > 20) {
        state.items.pop();
      }
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // Transform backend messages to notification format
        state.items = action.payload.map(msg => ({
          _id: msg._id,
          title: msg.negotiation?.product?.name || 'New Message',
          message: msg.content,
          category: msg.negotiation?.product?.name,
          type: msg.type === 'OFFER' ? 'offer' : 'message',
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          link: msg.negotiation ? `/negotiation/${msg.negotiation._id}` : '/marketplace',
          isRead: msg.isRead
        }));
        state.unreadCount = state.items.filter(i => !i.isRead).length;
      })
      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map(item => ({ ...item, isRead: true }));
        state.unreadCount = 0;
      });
  }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
