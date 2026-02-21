import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UnauthorizedPage = () => {
  const { darkMode } = useSelector(state => state.ui);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  React.useEffect(() => {
    // Apply dark mode to html
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-100 ${darkMode ? 'dark bg-gray-900' : ''}`}>
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-600 dark:text-red-400">403</h1>
        <h2 className="text-6xl font-medium py-8 text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-xl pb-8 px-12 text-gray-600 dark:text-gray-400">
          Sorry, you don&apos;t have permission to access this page.
        </p>
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="px-5 py-2 rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors"
        >
          {isAuthenticated ? "Back to Dashboard" : "Back to Login"}
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;