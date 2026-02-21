// Default configuration settings

module.exports = {
    // Server configuration
    server: {
      port: process.env.PORT || 5000,
      env: process.env.NODE_ENV || 'development'
    },
    
    // Database configuration
    db: {
      // Default to local MongoDB for development. Do NOT commit production credentials here.
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/sales-dashboard'
    },
    
    // JWT configuration
    jwt: {
      secret: process.env.JWT_SECRET,
      expire: process.env.JWT_EXPIRE || '30d',
      cookie_expire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 30
    },
    
    // CORS configuration
    cors: {
      // Default to the typical Create React App dev origin. In production set CORS_ORIGIN env var.
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    },
    
    // Pagination defaults
    pagination: {
      limit: 10,
      maxLimit: 100
    },
    
    // Product categories
    categories: [
      'Electronics',
      'Clothing',
      'Food',
      'Home',
      'Beauty',
      'Office',
      'Other'
    ],
    
    // Regions
    regions: [
      'North',
      'South',
      'East',
      'West',
      'Central'
    ],
    
    // Payment methods
    paymentMethods: [
      'Credit Card',
      'Debit Card',
      'Cash',
      'PayPal',
      'Other'
    ]
  };