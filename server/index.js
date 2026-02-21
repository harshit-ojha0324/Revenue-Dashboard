const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables first (before using any env vars)
dotenv.config({ path: path.join(__dirname, '.env') });

// Import routes
const authRoutes = require('./routes/auth');
const salesRoutes = require('./routes/sales');
const usersRoutes = require('./routes/users');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Connect to MongoDB
require('./config/db')();

// Middleware
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/users', usersRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.MONGO_URI) {
    console.warn('Warning: MONGO_URI is not set. Using local/default configuration may fail.');
  }
});

module.exports = app; // For testing purposes