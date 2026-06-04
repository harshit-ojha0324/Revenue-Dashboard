const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { cookieBaseOptions } = require('../utils/cookieOptions');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  const user = await User.create({ name, email, password });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email and password'
    });
  }

  // Check for user (password is select:false, so request it explicitly)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  // Clear the auth cookie that sendTokenResponse set. Attributes must match the
  // ones used when setting it, or the browser won't overwrite/clear it.
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    ...cookieBaseOptions()
  });

  res.status(200).json({
    success: true,
    message: 'Successfully logged out'
  });
});

// @desc    Get a CSRF token (cookie is set by attachCsrfToken middleware)
// @route   GET /api/auth/csrf
// @access  Public
exports.getCsrfToken = (req, res) => {
  res.status(200).json({
    success: true,
    csrfToken: req.csrfToken
  });
};

// Helper: sign a JWT, set it as an httpOnly cookie, and return user info.
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Compute cookie expiry in days (fallback to 30)
  const cookieExpireDays = Number(process.env.JWT_COOKIE_EXPIRE) || 30;

  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    ...cookieBaseOptions()
  };

  res.cookie('token', token, options);

  res.status(statusCode).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
