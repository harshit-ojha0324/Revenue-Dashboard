import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Home', 'Beauty', 'Office', 'Other'];
const REGIONS = ['North', 'South', 'East', 'West', 'Central'];
const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'Cash', 'PayPal', 'Other'];

const toDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

// Create/edit form for a sale. Pass `sale` to edit, omit to create.
// Pass `customers` (array of users) to show an owner picker (admin only).
const SaleFormModal = ({ sale, customers, onClose, onSubmit, isSubmitting }) => {
  const isEdit = Boolean(sale);

  const [form, setForm] = useState({
    product: '',
    category: 'Electronics',
    price: '',
    quantity: 1,
    date: toDateInput(new Date()),
    region: 'North',
    paymentMethod: 'Credit Card',
    customer: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (sale) {
      setForm({
        product: sale.product || '',
        category: sale.category || 'Electronics',
        price: sale.price ?? '',
        quantity: sale.quantity ?? 1,
        date: toDateInput(sale.date),
        region: sale.region || 'North',
        paymentMethod: sale.paymentMethod || 'Credit Card',
        customer: sale.customer?._id || sale.customer || ''
      });
    }
  }, [sale]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const price = parseFloat(form.price);
    const quantity = parseInt(form.quantity, 10);

    if (!form.product.trim()) return setFormError('Product name is required.');
    if (Number.isNaN(price) || price < 0) return setFormError('Enter a valid price.');
    if (Number.isNaN(quantity) || quantity < 1) return setFormError('Quantity must be at least 1.');

    const payload = {
      product: form.product.trim(),
      category: form.category,
      price,
      quantity,
      date: form.date,
      region: form.region,
      paymentMethod: form.paymentMethod
    };
    if (customers && form.customer) payload.customer = form.customer;

    onSubmit(payload);
  };

  const inputClass =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Sale' : 'New Sale'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {formError && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded text-sm">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product</label>
            <input name="product" value={form.product} onChange={handleChange} className={inputClass} placeholder="Product name" />
          </div>

          {customers && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
              <select name="customer" value={form.customer} onChange={handleChange} className={inputClass}>
                <option value="">Me (current user)</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
              <select name="region" value={form.region} onChange={handleChange} className={inputClass}>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
              <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} className={inputClass} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
              <input type="number" min="1" name="quantity" value={form.quantity} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={inputClass}>
                {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleFormModal;
