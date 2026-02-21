const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserSales
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Apply protection to all routes
router.use(protect);
// Apply admin authorization to all routes
router.use(authorize('admin'));

// User sales route
router.get('/:id/sales', getUserSales);

// Main routes
router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;