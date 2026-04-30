import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
