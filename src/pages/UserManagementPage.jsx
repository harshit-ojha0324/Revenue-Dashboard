import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, createUser, updateUser, deleteUser } from '../redux/slices/userSlice';
import { setNotification } from '../redux/slices/uiSlice';

import Spinner from '../components/UI/Spinner';
import UserFormModal from '../components/Users/UserFormModal';
import { formatDate } from '../utils/formatters';

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector(state => state.users);
  const { user: currentUser } = useSelector(state => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(getUsers()); }, [dispatch]);

  const openCreate = () => { setEditingUser(null); setModalOpen(true); };
  const openEdit = (u) => { setEditingUser(u); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingUser(null); };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser._id, userData: payload })).unwrap();
        dispatch(setNotification({ type: 'success', message: 'User updated.' }));
      } else {
        await dispatch(createUser(payload)).unwrap();
        dispatch(setNotification({ type: 'success', message: 'User created.' }));
      }
      closeModal();
    } catch (err) {
      dispatch(setNotification({ type: 'error', message: err || 'Something went wrong.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    try {
      await dispatch(deleteUser(u._id)).unwrap();
      dispatch(setNotification({ type: 'success', message: 'User deleted.' }));
    } catch (err) {
      // The API blocks deleting a user who still has sales records.
      dispatch(setNotification({ type: 'error', message: err || 'Delete failed.' }));
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Create, edit, and remove user accounts</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New User
        </button>
      </div>

      {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan="5" className="py-12"><div className="flex justify-center"><Spinner /></div></td></tr>
              ) : users.length > 0 ? users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.email}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>{u.role}</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.createdAt ? formatDate(u.createdAt) : '—'}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(u)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                      {currentUser?._id !== u._id && (
                        <button onClick={() => handleDelete(u)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="py-8 px-6 text-center text-sm text-gray-500 dark:text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <UserFormModal user={editingUser} onClose={closeModal} onSubmit={handleSubmit} isSubmitting={submitting} />
      )}
    </>
  );
};

export default UserManagementPage;
