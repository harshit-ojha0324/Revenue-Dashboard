import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  salesData: [],
  salesStats: null,
  activeSale: null,
  pagination: null,
  filters: {
    category: '',
    region: '',
    startDate: '',
    endDate: '',
    paymentMethod: ''
  },
  isLoading: false,
  error: null
};

// Get sales
export const getSales = createAsyncThunk(
  'sales/getSales',
  async (params, { rejectWithValue, getState }) => {
    try {
      // Get current filters from state
      const { filters } = getState().sales;
      
      // Build query params
      let queryString = '';
      if (params?.page) queryString += `page=${params.page}&`;
      if (params?.limit) queryString += `limit=${params.limit}&`;
      if (filters.category) queryString += `category=${filters.category}&`;
      if (filters.region) queryString += `region=${filters.region}&`;
      if (filters.paymentMethod) queryString += `paymentMethod=${filters.paymentMethod}&`;
      if (filters.startDate) queryString += `startDate=${filters.startDate}&`;
      if (filters.endDate) queryString += `endDate=${filters.endDate}&`;
      
      // Remove trailing &
      if (queryString.endsWith('&')) {
        queryString = queryString.slice(0, -1);
      }
      
      const url = queryString ? `/sales?${queryString}` : '/sales';
      const response = await api.get(url);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch sales');
    }
  }
);

// Get single sale
export const getSale = createAsyncThunk(
  'sales/getSale',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sales/${id}`);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch sale');
    }
  }
);

// Create new sale
export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/sales', saleData);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to create sale');
    }
  }
);

// Update sale
export const updateSale = createAsyncThunk(
  'sales/updateSale',
  async ({ id, saleData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/sales/${id}`, saleData);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update sale');
    }
  }
);

// Delete sale
export const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sales/${id}`);
      
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to delete sale');
    }
  }
);

// Get sales statistics for dashboard
export const getSalesStats = createAsyncThunk(
  'sales/getSalesStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get current filters from state
      const { filters } = getState().sales;
      
      // Build query params
      let queryString = '';
      if (filters.startDate) queryString += `startDate=${filters.startDate}&`;
      if (filters.endDate) queryString += `endDate=${filters.endDate}&`;
      
      // Remove trailing &
      if (queryString.endsWith('&')) {
        queryString = queryString.slice(0, -1);
      }
      
      const url = queryString ? `/sales/stats?${queryString}` : '/sales/stats';
      const response = await api.get(url);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch sales statistics');
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        region: '',
        startDate: '',
        endDate: '',
        paymentMethod: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get sales
      .addCase(getSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesData = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get single sale
      .addCase(getSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSale = action.payload.data;
      })
      .addCase(getSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create sale
      .addCase(createSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesData = [action.payload.data, ...state.salesData];
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update sale
      .addCase(updateSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesData = state.salesData.map(sale => 
          sale._id === action.payload.data._id ? action.payload.data : sale
        );
        state.activeSale = action.payload.data;
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete sale
      .addCase(deleteSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesData = state.salesData.filter(sale => sale._id !== action.payload);
        if (state.activeSale && state.activeSale._id === action.payload) {
          state.activeSale = null;
        }
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get sales statistics
      .addCase(getSalesStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSalesStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesStats = action.payload.data;
      })
      .addCase(getSalesStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, clearError } = salesSlice.actions;

export default salesSlice.reducer;