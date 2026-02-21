import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSales, getSalesStats } from '../redux/slices/salesSlice';

/**
 * Custom hook to fetch and manage dashboard data
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoRefresh - Enable auto refresh of data
 * @param {number} options.refreshInterval - Refresh interval in ms (default: 60000)
 * @returns {Object} Dashboard data and state
 */
const useDashboardData = (options = {}) => {
  const { 
    autoRefresh = false, 
    refreshInterval = 60000 
  } = options;
  
  const dispatch = useDispatch();
  const { 
    salesData, 
    salesStats,
    pagination, 
    isLoading, 
    error,
    filters
  } = useSelector(state => state.sales);
  
  // Initial data fetch
  useEffect(() => {
    dispatch(getSales());
    dispatch(getSalesStats());
  }, [dispatch]);
  
  // Auto refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const intervalId = setInterval(() => {
      dispatch(getSales());
      dispatch(getSalesStats());
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [dispatch, autoRefresh, refreshInterval]);
  
  // Method to refresh data manually
  const refreshData = () => {
    dispatch(getSales());
    dispatch(getSalesStats());
  };
  
  // Method to load the next page
  const loadNextPage = () => {
    if (pagination && pagination.next) {
      dispatch(getSales({ page: pagination.next.page, limit: pagination.next.limit }));
    }
  };
  
  // Method to load the previous page
  const loadPrevPage = () => {
    if (pagination && pagination.prev) {
      dispatch(getSales({ page: pagination.prev.page, limit: pagination.prev.limit }));
    }
  };
  
  return {
    salesData,
    salesStats,
    pagination,
    isLoading,
    error,
    filters,
    refreshData,
    loadNextPage,
    loadPrevPage
  };
};

export default useDashboardData;