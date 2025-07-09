// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../compound/Api';
import { toast } from 'react-toastify';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  showOTP: false,
  otpVerified: false,
};

// Register
export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const res = await Api.post('/register', formData);
    toast.success(res.data.message || "Registered successfully!");
    localStorage.setItem('token', res?.accessToken);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    toast.error(message);
    return rejectWithValue(message);
  }
});

// Login
export const loginUser = createAsyncThunk('auth/login', async (loginInput, { rejectWithValue }) => {
  try {
    const res = await Api.post('/login', loginInput);
    toast.success("Login successful!");
      localStorage.setItem('token', res?.accessToken);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    toast.error(message);
    return rejectWithValue(message);
  }
});

// OTP Verify
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ otp, email }, { rejectWithValue }) => {
  try {
    const res = await Api.post('/verify-otp', { otp, email });
    if (res.data.success) toast.success("OTP verified successfully!");
    else toast.error("Invalid OTP");
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    toast.error(message);
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.showOTP = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
         state.loading = true;
         })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtp.pending, (state) => { state.loading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = action.payload.success;
        state.showOTP = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
