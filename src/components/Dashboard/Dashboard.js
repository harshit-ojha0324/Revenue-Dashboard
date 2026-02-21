import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSales, getSalesStats } from '../../redux/slices/salesSlice';

import Header from '../Header/Header';
import Sidebar from '../Header/Sidebar';
import Footer from '../Footer/Footer';
import KPICards from '../KPICards/KPICards';
import Filters from '../Filters/Filters';
import Spinner from '../UI/Spinner';
import Notification from '../UI/Notification';
import MonthlyTrend from '../Charts/MonthlyTrend';
import CategoryDistribution from '../Charts/CategoryDistribution';
import RegionComparison from '../Charts/RegionComparison';
import DataTable from '../Charts/DataTable';

import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, darkMode } = useSelector(state => state.ui);
  const { salesStats, salesData, isLoading, error } = useSelector(state => state.sales);

  useEffect(() => {
    // Apply dark mode to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Fetch data when component mounts
    dispatch(getSales());
    dispatch(getSalesStats());
  }, [dispatch]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Notification />
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="container mx-auto px-6 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back to your sales dashboard</p>
            </div>

            {isLoading && !salesStats ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="large" />
              </div>
            ) : error ? (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
                <h3 className="font-semibold">Error</h3>
                <p>{error}</p>
              </div>
            ) : (
              <>
                <Filters />
                <KPICards salesStats={salesStats} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Monthly Sales Trend</h2>
                    {salesStats?.monthlyTrend && <MonthlyTrend data={salesStats.monthlyTrend} />}
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sales by Category</h2>
                    {salesStats?.salesByCategory && <CategoryDistribution data={salesStats.salesByCategory} />}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sales by Region</h2>
                    {salesStats?.salesByRegion && <RegionComparison data={salesStats.salesByRegion} />}
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Payment Methods</h2>
                    {salesStats?.salesByPaymentMethod && <CategoryDistribution 
                      data={salesStats.salesByPaymentMethod} 
                      dataKey="_id"
                      nameKey="_id"
                      valueKey="count"
                    />}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Sales</h2>
                  <DataTable data={salesData} />
                </div>
              </>
            )}
          </div>
          
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;