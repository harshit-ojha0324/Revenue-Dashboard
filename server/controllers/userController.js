const User = require('../models/User');
const Sale = require('../models/Sale');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User not found with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  // Use findById + save so Mongoose pre-save hooks (e.g. password hashing)
  // run when updating sensitive fields like `password`.
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User not found with id of ${req.params.id}`
    });
  }

  // Assign provided fields to the user document
  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });

  // Save runs validators and pre-save hooks
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User not found with id of ${req.params.id}`
    });
  }

  // Block deletion of users that still have sales records
  const salesCount = await Sale.countDocuments({ customer: req.params.id });

  if (salesCount > 0) {
    return res.status(400).json({
      success: false,
      message: `This user has ${salesCount} sales records and cannot be deleted. Consider deactivating instead.`
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user sales
// @route   GET /api/users/:id/sales
// @access  Private/Admin
exports.getUserSales = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User not found with id of ${req.params.id}`
    });
  }

  const sales = await Sale.find({ customer: req.params.id });

  res.status(200).json({
    success: true,
    count: sales.length,
    data: sales
  });
});
