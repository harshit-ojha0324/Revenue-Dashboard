import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSales, createSale, updateSale, deleteSale } from '../redux/slices/salesSlice';
import { setNotification } from '../redux/slices/uiSlice';

import Filters from '../components/Filters/Filters';
import Spinner from '../components/UI/Spinner';
import SaleFormModal from '../components/Sales/SaleFormModal';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

const PAGE_SIZE = 10;

const SalesPage = () => {
  const dispatch = useDispatch();
  const { salesData, pagination, isLoading, error, filters } = useSelector(state => state.sales);

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback((targetPage) => {
    dispatch(getSales({ page: targetPage, limit: PAGE_SIZE }));
  }, [dispatch]);

  // Reload page 1 whenever filters change.
  useEffect(() => {
    setPage(1);
    load(1);
  }, [load, filters]);

  const goToPage = (target) => {
    setPage(target);
    load(target);
  };

  const openCreate = () => { setEditingSale(null); setModalOpen(true); };
  const openEdit = (sale) => { setEditingSale(sale); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingSale(null); };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingSale) {
        await dispatch(updateSale({ id: editingSale._id, saleData: payload })).unwrap();
        dispatch(setNotification({ type: 'success', message: 'Sale updated.' }));
      } else {
        await dispatch(createSale(payload)).unwrap();
        dispatch(setNotification({ type: 'success', message: 'Sale created.' }));
      }
      closeModal();
      load(page);
    } catch (err) {
      dispatch(setNotification({ type: 'error', message: err || 'Something went wrong.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (sale) => {
    if (!window.confirm(`Delete sale "${sale.product}" (${sale.orderId})?`)) return;
    try {
      await dispatch(deleteSale(sale._id)).unwrap();
      dispatch(setNotification({ type: 'success', message: 'Sale deleted.' }));
      // If we just removed the last row on a page, step back a page.
      const nextPage = salesData.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      load(nextPage);
    } catch (err) {
      dispatch(setNotification({ type: 'error', message: err || 'Delete failed.' }));
    }
  };

  const total = pagination?.total ?? 0;
  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Sales</h1>
          <p className="text-gray-600 dark:text-gray-400">Create, edit, and manage your sales records</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Sale
        </button>
      </div>

      <Filters />

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">{error}</div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Order ID', 'Product', 'Category', 'Date', 'Qty', 'Total', 'Region', 'Actions'].map((h) => (
                  <th key={h} className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan="8" className="py-12"><div className="flex justify-center"><Spinner /></div></td></tr>
              ) : salesData.length > 0 ? (
                salesData.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sale.orderId}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{sale.product}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{sale.category}</span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(sale.date)}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatNumber(sale.quantity)}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(sale.totalAmount)}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{sale.region}</span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(sale)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(sale)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="py-8 px-6 text-center text-sm text-gray-500 dark:text-gray-400">No sales found. Create your first one.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
              <span className="hidden sm:inline"> · {formatNumber(total)} total</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || isLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages || isLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <SaleFormModal
          sale={editingSale}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      )}
    </>
  );
};

export default SalesPage;
