import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import useDashboardData from '../hooks/useDashboardData';

import Filters from '../components/Filters/Filters';
import Spinner from '../components/UI/Spinner';
import MonthlyTrend from '../components/Charts/MonthlyTrend';
import CategoryDistribution from '../components/Charts/CategoryDistribution';
import RegionComparison from '../components/Charts/RegionComparison';
import { prepareCumulativeData, prepareMetricsComparisonData } from '../utils/chartHelpers';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

const GrowthStat = ({ label, value, growth, isCurrency }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      {isCurrency ? formatCurrency(value) : formatNumber(value)}
    </h2>
    <p className={`mt-2 text-sm ${growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
      {growth >= 0 ? '+' : ''}{formatPercentage(growth)} <span className="text-gray-500 dark:text-gray-400">last 6 mo vs prior 6 mo</span>
    </p>
  </div>
);

const AnalyticsPage = () => {
  const { salesStats, isLoading, error } = useDashboardData();

  const cumulative = prepareCumulativeData(salesStats?.monthlyTrend);
  const metrics = salesStats ? prepareMetricsComparisonData(salesStats) : null;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Deeper trends and period-over-period comparisons</p>
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

          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <GrowthStat label="Revenue (12 mo)" value={metrics.totalRevenue} growth={metrics.revenueGrowth} isCurrency />
              <GrowthStat label="Orders (12 mo)" value={metrics.totalSales} growth={metrics.salesGrowth} />
              <GrowthStat label="Avg Order Value (12 mo)" value={metrics.averageOrderValue} growth={metrics.aovGrowth} isCurrency />
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Cumulative Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cumulative} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#1e40af" fill="url(#revGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Monthly Trend</h2>
            {salesStats?.monthlyTrend && <MonthlyTrend data={salesStats.monthlyTrend} />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue by Category</h2>
              {salesStats?.salesByCategory && <CategoryDistribution data={salesStats.salesByCategory} />}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Region Comparison</h2>
              {salesStats?.salesByRegion && <RegionComparison data={salesStats.salesByRegion} />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AnalyticsPage;
