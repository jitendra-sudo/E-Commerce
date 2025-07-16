import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Cart.slice.js';
import authReducer from './AuthSlice.js';
import wishlistReducer from './WishListSlice.js'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
