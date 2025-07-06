import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Cart.slice.js';
import authReducer from './AuthSlice.js'; 
const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

export default store;
