import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useDashboardData from '../hooks/useDashboardData';
import { getUsers } from '../redux/slices/userSlice';

import KPICards from '../components/KPICards/KPICards';
import Spinner from '../components/UI/Spinner';
import MonthlyTrend from '../components/Charts/MonthlyTrend';
import CategoryDistribution from '../components/Charts/CategoryDistribution';
import RegionComparison from '../components/Charts/RegionComparison';
import { formatNumber } from '../utils/formatters';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { salesStats, isLoading, error } = useDashboardData();
  const { users } = useSelector(state => state.users);

  useEffect(() => { dispatch(getUsers()); }, [dispatch]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Organization-wide sales across all users</p>
      </div>

      {isLoading && !salesStats ? (
        <div className="flex justify-center items-center h-64"><Spinner size="large" /></div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Link to="/admin/users" className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(users.length)}</h2>
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">Manage users →</p>
            </Link>
            <Link to="/admin/sales" className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{salesStats ? formatNumber(salesStats.totalSales) : '—'}</h2>
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">Manage sales →</p>
            </Link>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{salesStats?.salesByCategory ? formatNumber(salesStats.salesByCategory.length) : '—'}</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Regions</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{salesStats?.salesByRegion ? formatNumber(salesStats.salesByRegion.length) : '—'}</h2>
            </div>
          </div>

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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Sales by Region</h2>
            {salesStats?.salesByRegion && <RegionComparison data={salesStats.salesByRegion} />}
          </div>
        </>
      )}
    </>
  );
};

export default AdminDashboardPage;
