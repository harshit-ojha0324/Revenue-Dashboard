import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../redux/slices/uiSlice';

const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform mt-0.5 ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your preferences</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Appearance</h2>
        <Toggle
          enabled={darkMode}
          onChange={() => dispatch(toggleDarkMode())}
          label="Dark mode"
          description="Use a dark color theme across the dashboard."
        />
      </div>
    </>
  );
};

export default SettingsPage;
