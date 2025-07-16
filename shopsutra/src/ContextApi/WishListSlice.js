import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../compound/Api'; 

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, {rejectWithValue}) => {
    try {
        const res = await Api.get('/wishlist');
        return res?.data?.products;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to load wishlist');
    }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (id, {rejectWithValue}) => {
    try {
        const res = await Api.post('/addWishlist', { id });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add to wishlist');
    }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, {rejectWithValue}) => {
    try {
        await Api.delete(`/removewishlist/${productId}`);
        return productId;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
    }
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export default wishlistSlice.reducer;

