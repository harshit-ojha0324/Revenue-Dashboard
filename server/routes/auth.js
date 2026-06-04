const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  getCsrfToken
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/csrf', getCsrfToken);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;