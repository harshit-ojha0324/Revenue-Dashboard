const express = require('express');
const {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  getSalesStats
} = require('../controllers/salesController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);

// Stats route
router.get('/stats', getSalesStats);

// Main routes
router
  .route('/')
  .get(getSales)
  .post(createSale);

router
  .route('/:id')
  .get(getSale)
  .put(updateSale)
  .delete(deleteSale);

module.exports = router;