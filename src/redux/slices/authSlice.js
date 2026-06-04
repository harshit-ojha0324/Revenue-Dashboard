import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Cache only the non-sensitive user object for a faster first paint.
// The JWT lives in an httpOnly cookie and is never accessible to JS.
const cachedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    return null;
  }
})();

const initialState = {
  user: cachedUser || null,
  isAuthenticated: false,
  // Start in a loading state until the initial /auth/me check resolves.
  isLoading: true,
  // Becomes true once the initial session check has completed.
  authChecked: false,
  error: null
};

const extractMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(extractMessage(error, 'Registration failed'));
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', userData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(extractMessage(error, 'Login failed'));
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      // Even if the request fails, clear the local cache.
      localStorage.removeItem('user');
      return rejectWithValue(extractMessage(error, 'Logout failed'));
    }
  }
);

// Get current user profile (also used as the auth check on app load)
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data;
    } catch (error) {
      localStorage.removeItem('user');
      return rejectWithValue(extractMessage(error, 'Not authenticated'));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // Treat a failed logout request as logged out locally anyway.
        state.isAuthenticated = false;
        state.user = null;
      })

      // Get user profile (initial auth check)
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.authChecked = true;
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
