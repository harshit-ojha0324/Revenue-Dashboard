import React from 'react';
import useDashboardData from '../hooks/useDashboardData';

import KPICards from '../components/KPICards/KPICards';
import Filters from '../components/Filters/Filters';
import Spinner from '../components/UI/Spinner';
import MonthlyTrend from '../components/Charts/MonthlyTrend';
import CategoryDistribution from '../components/Charts/CategoryDistribution';
import RegionComparison from '../components/Charts/RegionComparison';
import DataTable from '../components/Charts/DataTable';

const DashboardHome = () => {
  const { salesStats, salesData, isLoading, error } = useDashboardData();

  return (
    <>
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
              {salesStats?.salesByPaymentMethod && (
                <CategoryDistribution
                  data={salesStats.salesByPaymentMethod}
                  nameKey="_id"
                  valueKey="count"
                />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Sales</h2>
            <DataTable data={salesData} />
          </div>
        </>
      )}
    </>
  );
};

export default DashboardHome;
