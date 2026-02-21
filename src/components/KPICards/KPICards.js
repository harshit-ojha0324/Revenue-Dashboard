import React from 'react';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

const KPICards = ({ salesStats }) => {
  if (!salesStats) return null;
  
  // Extract metrics
  const { 
    totalSales, 
    totalRevenue, 
    averageOrderValue, 
    salesByCategory, 
    monthlyTrend 
  } = salesStats;
  
  // Calculate growth (last month vs previous month)
  let revenueGrowth = 0;
  let salesGrowth = 0;
  
  if (monthlyTrend && monthlyTrend.length >= 2) {
    const currentMonth = monthlyTrend[monthlyTrend.length - 1];
    const previousMonth = monthlyTrend[monthlyTrend.length - 2];
    
    revenueGrowth = previousMonth.revenue > 0 
      ? (currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue 
      : 0;
      
    salesGrowth = previousMonth.count > 0 
      ? (currentMonth.count - previousMonth.count) / previousMonth.count 
      : 0;
  }
  
  // Get top category and region
  const topCategory = salesByCategory && salesByCategory.length > 0 
    ? salesByCategory.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current) 
    : null;
    
  // topRegion intentionally omitted (not currently displayed)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Revenue */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</h2>
          </div>
          <div className={`p-2 rounded-full ${revenueGrowth >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            {revenueGrowth >= 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
          </div>
        </div>
        <div className="mt-2">
          <p className={`text-sm ${revenueGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {revenueGrowth >= 0 ? '+' : ''}{formatPercentage(revenueGrowth)} vs last month
          </p>
        </div>
      </div>
      
      {/* Total Sales */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(totalSales)}</h2>
          </div>
          <div className={`p-2 rounded-full ${salesGrowth >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            {salesGrowth >= 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
          </div>
        </div>
        <div className="mt-2">
          <p className={`text-sm ${salesGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {salesGrowth >= 0 ? '+' : ''}{formatPercentage(salesGrowth)} vs last month
          </p>
        </div>
      </div>
      
      {/* Average Order Value */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Order Value</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(averageOrderValue)}</h2>
          </div>
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lifetime average
          </p>
        </div>
      </div>
      
      {/* Top Category/Region */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Performer</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {topCategory ? topCategory._id : 'N/A'}
            </h2>
          </div>
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {topCategory ? `${formatCurrency(topCategory.revenue)} in revenue` : 'No data available'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KPICards;