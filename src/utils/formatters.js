// Format currency
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Format date
  export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format date with time
  export const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format number with commas
  export const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  // Format percentage
  export const formatPercentage = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  // Truncate text
  export const truncateText = (text, length = 30) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
  
  // Calculate growth rate
  export const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return (current - previous) / previous;
  };
  
  // Convert RGB to hex
  export const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };
  
  // Generate a random color
  export const randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Generate chart colors
  export const generateChartColors = (count) => {
    // Blue shades
    const blueShades = [
      '#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#2196F3', 
      '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD'
    ];
    
    // Red shades
    const redShades = [
      '#B71C1C', '#C62828', '#D32F2F', '#E53935', '#F44336', 
      '#EF5350', '#E57373', '#EF9A9A', '#FFCDD2', '#FFEBEE'
    ];
    
    // Black/Gray shades
    const grayShades = [
      '#212121', '#424242', '#616161', '#757575', '#9E9E9E', 
      '#BDBDBD', '#E0E0E0', '#EEEEEE', '#F5F5F5', '#FAFAFA'
    ];
    
    // Combine shades and create a color array based on count
    const combinedShades = [...blueShades, ...redShades, ...grayShades];
    const colors = [];
    
    for (let i = 0; i < count; i++) {
      colors.push(combinedShades[i % combinedShades.length]);
    }
    
    return colors;
  };
  
  // Format file size
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };