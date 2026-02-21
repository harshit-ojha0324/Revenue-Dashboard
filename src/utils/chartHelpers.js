import { generateChartColors } from './formatters';

// Transform category distribution data for pie chart
export const prepareCategoryData = (salesByCategory) => {
  if (!salesByCategory || !salesByCategory.length) return [];
  
  const data = salesByCategory.map(item => ({
    name: item._id,
    value: item.revenue
  }));
  
  return data;
};

// Transform monthly trend data for line chart
export const prepareMonthlyTrendData = (monthlyTrend) => {
  if (!monthlyTrend || !monthlyTrend.length) return [];
  
  return monthlyTrend.map(item => ({
    name: `${item.month} ${item.year}`,
    revenue: item.revenue,
    count: item.count
  }));
};

// Transform region comparison data for bar chart
export const prepareRegionData = (salesByRegion) => {
  if (!salesByRegion || !salesByRegion.length) return [];
  
  return salesByRegion.map(item => ({
    name: item._id,
    revenue: item.revenue,
    count: item.count
  }));
};

// Prepare cumulative growth data
export const prepareCumulativeData = (monthlyTrend) => {
  if (!monthlyTrend || !monthlyTrend.length) return [];
  
  let cumulativeRevenue = 0;
  
  return monthlyTrend.map(item => {
    cumulativeRevenue += item.revenue;
    return {
      name: `${item.month} ${item.year}`,
      revenue: cumulativeRevenue
    };
  });
};

// Prepare category performance data for radar chart
export const prepareCategoryPerformanceData = (salesByCategory) => {
  if (!salesByCategory || !salesByCategory.length) return [];
  
  // Find the max revenue to calculate percentage
  const maxRevenue = Math.max(...salesByCategory.map(item => item.revenue));
  
  return salesByCategory.map(item => ({
    category: item._id,
    performance: (item.revenue / maxRevenue) * 100,
    revenue: item.revenue,
    count: item.count
  }));
};

// Prepare colors for charts
export const prepareChartColors = (data) => {
  if (!data || !data.length) return [];
  
  return generateChartColors(data.length);
};

// Calculate period-over-period growth
export const calculatePeriodGrowth = (currentPeriodData, previousPeriodData) => {
  if (!currentPeriodData || !previousPeriodData) return 0;
  
  const currentTotal = currentPeriodData.reduce((sum, item) => sum + item.revenue, 0);
  const previousTotal = previousPeriodData.reduce((sum, item) => sum + item.revenue, 0);
  
  if (previousTotal === 0) return 0;
  
  return (currentTotal - previousTotal) / previousTotal;
};

// Prepare data for metrics comparison
export const prepareMetricsComparisonData = (salesStats) => {
  if (!salesStats) return [];
  
  // Get the most recent 12 months
  const monthlyTrend = salesStats.monthlyTrend || [];
  const recentMonths = monthlyTrend.slice(-12);
  
  // Prepare summary metrics for the last 12 months
  const totalRevenue = recentMonths.reduce((sum, month) => sum + month.revenue, 0);
  const totalSales = recentMonths.reduce((sum, month) => sum + month.count, 0);
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // Compare last 6 months vs previous 6 months
  const last6Months = recentMonths.slice(-6);
  const previous6Months = recentMonths.slice(-12, -6);
  
  const last6MonthsRevenue = last6Months.reduce((sum, month) => sum + month.revenue, 0);
  const previous6MonthsRevenue = previous6Months.reduce((sum, month) => sum + month.revenue, 0);
  
  const revenueGrowth = previous6MonthsRevenue > 0 
    ? (last6MonthsRevenue - previous6MonthsRevenue) / previous6MonthsRevenue 
    : 0;
  
  const last6MonthsSales = last6Months.reduce((sum, month) => sum + month.count, 0);
  const previous6MonthsSales = previous6Months.reduce((sum, month) => sum + month.count, 0);
  
  const salesGrowth = previous6MonthsSales > 0 
    ? (last6MonthsSales - previous6MonthsSales) / previous6MonthsSales 
    : 0;
  
  const last6MonthsAOV = last6MonthsSales > 0 ? last6MonthsRevenue / last6MonthsSales : 0;
  const previous6MonthsAOV = previous6MonthsSales > 0 ? previous6MonthsRevenue / previous6MonthsSales : 0;
  
  const aovGrowth = previous6MonthsAOV > 0 
    ? (last6MonthsAOV - previous6MonthsAOV) / previous6MonthsAOV 
    : 0;
  
  return {
    totalRevenue,
    totalSales,
    averageOrderValue,
    revenueGrowth,
    salesGrowth,
    aovGrowth
  };
};