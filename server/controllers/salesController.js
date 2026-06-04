const Sale = require('../models/Sale');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all sales (with filtering, sorting, pagination)
// @route   GET /api/sales
// @access  Private
exports.getSales = asyncHandler(async (req, res) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from the field-equality filter
  // (startDate/endDate are handled separately as a date range below)
  const removeFields = ['select', 'sort', 'page', 'limit', 'startDate', 'endDate'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Build advanced operators ($gt, $gte, etc.)
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Build the base filter (shared by find + countDocuments)
  const baseFilter = JSON.parse(queryStr);

  // Apply date range filter if provided
  if (req.query.startDate && req.query.endDate) {
    baseFilter.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  // Regular users can only see their own sales; admins see all
  if (req.user.role !== 'admin') {
    baseFilter.customer = req.user.id;
  }

  let query = Sale.find(baseFilter);

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort (default: newest first)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-date');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Sale.countDocuments(baseFilter);

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const sales = await query.populate({
    path: 'customer',
    select: 'name email'
  });

  // Pagination metadata
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: sales.length,
    total,
    pagination,
    data: sales
  });
});

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
exports.getSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate({
    path: 'customer',
    select: 'name email'
  });

  if (!sale) {
    return res.status(404).json({
      success: false,
      message: `Sale not found with id of ${req.params.id}`
    });
  }

  // Make sure user is sale owner or admin
  if (req.user.role !== 'admin' && sale.customer._id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: `User ${req.user.id} is not authorized to view this sale`
    });
  }

  res.status(200).json({
    success: true,
    data: sale
  });
});

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
exports.createSale = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin' && req.body.customer) {
    // Admin can create sales for any user; verify the customer exists
    const userExists = await User.findById(req.body.customer);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: `User not found with id of ${req.body.customer}`
      });
    }
  } else {
    // Regular users can only create sales for themselves
    req.body.customer = req.user.id;
  }

  // The creator is always the authenticated user
  req.body.createdBy = req.user.id;

  // Calculate totalAmount if not provided
  if (!req.body.totalAmount && req.body.price && req.body.quantity) {
    req.body.totalAmount = req.body.price * req.body.quantity;
  }

  const sale = await Sale.create(req.body);

  res.status(201).json({
    success: true,
    data: sale
  });
});

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private
exports.updateSale = asyncHandler(async (req, res) => {
  let sale = await Sale.findById(req.params.id);

  if (!sale) {
    return res.status(404).json({
      success: false,
      message: `Sale not found with id of ${req.params.id}`
    });
  }

  // Make sure user is sale owner or admin
  if (req.user.role !== 'admin' && sale.customer.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: `User ${req.user.id} is not authorized to update this sale`
    });
  }

  // Recalculate totalAmount if price or quantity changed
  if ((req.body.price || req.body.quantity) && !req.body.totalAmount) {
    const price = req.body.price || sale.price;
    const quantity = req.body.quantity || sale.quantity;
    req.body.totalAmount = price * quantity;
  }

  sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: sale
  });
});

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private
exports.deleteSale = asyncHandler(async (req, res) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale) {
    return res.status(404).json({
      success: false,
      message: `Sale not found with id of ${req.params.id}`
    });
  }

  // Make sure user is sale owner or admin
  if (req.user.role !== 'admin' && sale.customer.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: `User ${req.user.id} is not authorized to delete this sale`
    });
  }

  await Sale.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get sales statistics (for dashboard)
// @route   GET /api/sales/stats
// @access  Private
exports.getSalesStats = asyncHandler(async (req, res) => {
  const match = req.user.role === 'admin' ? {} : { customer: req.user._id };

  // Filter by date range if provided
  if (req.query.startDate && req.query.endDate) {
    match.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  // Total sales count
  const totalSales = await Sale.countDocuments(match);

  // Total revenue
  const revenueResult = await Sale.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // Average order value
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Sales by category
  const salesByCategory = await Sale.aggregate([
    { $match: match },
    { $group: { _id: '$category', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    { $sort: { revenue: -1 } }
  ]);

  // Sales by region
  const salesByRegion = await Sale.aggregate([
    { $match: match },
    { $group: { _id: '$region', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    { $sort: { revenue: -1 } }
  ]);

  // Sales by payment method
  const salesByPaymentMethod = await Sale.aggregate([
    { $match: match },
    { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    { $sort: { count: -1 } }
  ]);

  // Monthly sales trend (last 12 months)
  const trendStart = new Date();
  trendStart.setMonth(trendStart.getMonth() - 11);
  trendStart.setDate(1); // Start from first day of the month

  const monthlySalesTrend = await Sale.aggregate([
    { $match: { ...match, date: { $gte: trendStart } } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Format monthly trend into a continuous 12-month series
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTrend = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed in JS

    const found = monthlySalesTrend.find(
      item => item._id.year === year && item._id.month === month
    );

    monthlyTrend.unshift({
      month: monthNames[month - 1],
      year,
      count: found ? found.count : 0,
      revenue: found ? found.revenue : 0
    });
  }

  res.status(200).json({
    success: true,
    data: {
      totalSales,
      totalRevenue,
      averageOrderValue,
      salesByCategory,
      salesByRegion,
      salesByPaymentMethod,
      monthlyTrend
    }
  });
});
