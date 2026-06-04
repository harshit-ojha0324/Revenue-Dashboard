import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Spinner from '../components/UI/Spinner';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

// Aggregates sales by customer. With a single seeded user the table will be
// short — the aggregation is correct, it just reflects the underlying data.
const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const res = await api.get('/sales?limit=1000');
        const sales = res.data.data || [];

        const map = new Map();
        for (const sale of sales) {
          const c = sale.customer || {};
          const id = c._id || 'unknown';
          if (!map.has(id)) {
            map.set(id, {
              id,
              name: c.name || 'Unknown',
              email: c.email || '—',
              orders: 0,
              total: 0,
              lastOrder: null
            });
          }
          const entry = map.get(id);
          entry.orders += 1;
          entry.total += sale.totalAmount || 0;
          const d = sale.date ? new Date(sale.date) : null;
          if (d && (!entry.lastOrder || d > entry.lastOrder)) entry.lastOrder = d;
        }

        const rows = Array.from(map.values()).sort((a, b) => b.total - a.total);
        if (active) setCustomers(rows);
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Failed to load customers.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    run();
    return () => { active = false; };
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Customers</h1>
        <p className="text-gray-600 dark:text-gray-400">Spending and order activity, aggregated per customer</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="large" /></div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customers</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(customers.length)}</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(customers.reduce((s, c) => s + c.orders, 0))}</h2>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spend</p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(customers.reduce((s, c) => s + c.total, 0))}</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {['Customer', 'Email', 'Orders', 'Total Spent', 'Avg Order', 'Last Order'].map((h) => (
                      <th key={h} className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {customers.length > 0 ? customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{c.name}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{c.email}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatNumber(c.orders)}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(c.total)}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(c.orders ? c.total / c.orders : 0)}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{c.lastOrder ? formatDate(c.lastOrder) : '—'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="py-8 px-6 text-center text-sm text-gray-500 dark:text-gray-400">No customer data yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CustomersPage;
