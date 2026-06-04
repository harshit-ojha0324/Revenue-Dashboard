import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/formatters';

const Row = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <span className="w-40 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm text-gray-900 dark:text-white">{value}</span>
  </div>
);

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Your account details</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
        <div className="flex items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold uppercase">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <Row label="Name" value={user?.name || '—'} />
        <Row label="Email" value={user?.email || '—'} />
        <Row label="Role" value={user?.role === 'admin' ? 'Administrator' : 'User'} />
        <Row label="Member since" value={user?.createdAt ? formatDate(user.createdAt) : '—'} />
      </div>
    </>
  );
};

export default ProfilePage;
