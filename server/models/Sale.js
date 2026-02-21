const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  product: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a product category'],
    enum: ['Electronics', 'Clothing', 'Food', 'Home', 'Beauty', 'Office', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be positive']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please add a total amount']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  region: {
    type: String,
    required: [true, 'Please add a region'],
    enum: ['North', 'South', 'East', 'West', 'Central']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: ['Credit Card', 'Debit Card', 'Cash', 'PayPal', 'Other']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for better query performance
SaleSchema.index({ customer: 1, date: -1 });

// Virtual for total profit (assuming a 30% profit margin for simplicity)
SaleSchema.virtual('profit').get(function() {
  return this.totalAmount * 0.3;
});

module.exports = mongoose.model('Sale', SaleSchema);