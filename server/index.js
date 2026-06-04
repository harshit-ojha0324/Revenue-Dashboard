const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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
const { attachCsrfToken, verifyCsrf } = require('./middleware/csrf');

// Import jobs
const { startLiveSeeder } = require('./jobs/liveSeeder');

// Initialize express app
const app = express();

// Connect to MongoDB
require('./config/db')();

// Middleware
// CORS_ORIGIN may be a single origin or a comma-separated list (e.g. a Vercel
// production URL plus preview URLs). Empty entries are ignored.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header) and any allowed origin.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

// CSRF: ensure every client holds a token, then verify it on mutating requests
app.use(attachCsrfToken);
app.use(verifyCsrf);

// Health check — lightweight endpoint for uptime pingers (keeps the free-tier
// host awake) and deployment platform health probes.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/users', usersRoutes);

// Serve the React build only when explicitly requested (SERVE_FRONTEND=true),
// e.g. a single-host deployment. In the recommended split deployment the
// frontend lives on Vercel, so the API host should NOT serve static files.
if (process.env.SERVE_FRONTEND === 'true') {
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

  // Start the live demo seeder if enabled (opt-in via ENABLE_LIVE_SEED).
  startLiveSeeder().catch((err) =>
    console.error(`Failed to start live seeder: ${err.message}`)
  );
});

module.exports = app; // For testing purposes