import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { prepareMonthlyTrendData } from '../../utils/chartHelpers';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const MonthlyTrend = ({ data }) => {
  // Prepare chart data
  const chartData = prepareMonthlyTrendData(data);
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-red-600 dark:text-red-400">
            Orders: {formatNumber(payload[1].value)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#9ca3af' }}
            axisLine={{ stroke: '#9ca3af' }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#9ca3af' }}
            axisLine={{ stroke: '#9ca3af' }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#9ca3af' }}
            axisLine={{ stroke: '#9ca3af' }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#1e40af"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="count"
            name="Orders"
            stroke="#b91c1c"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrend;