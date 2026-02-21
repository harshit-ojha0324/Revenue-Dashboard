import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { prepareChartColors } from '../../utils/chartHelpers';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const CategoryDistribution = ({ 
  data, 
  nameKey = '_id', 
  valueKey = 'revenue' 
}) => {
  // Prepare chart data
  const chartData = data ? data.map(item => ({
    name: item[nameKey],
    value: item[valueKey]
  })) : [];
  
  // Generate colors for chart
  const colors = prepareChartColors(chartData);
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{payload[0].name}</p>
          <p style={{ color: payload[0].color }}>
            {valueKey === 'revenue' 
              ? `Revenue: ${formatCurrency(payload[0].value)}` 
              : `Count: ${formatNumber(payload[0].value)}`}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  // Custom renderer for the pie chart labels
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
      </text>
    );
  };
  
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryDistribution;