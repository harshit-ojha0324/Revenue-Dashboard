import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { toggleSidebar, toggleDarkMode } from '../../redux/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { sidebarOpen, darkMode } = useSelector(state => state.ui);
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Logo and menu toggle */}
        <div className="flex items-center">
          <button
            className="text-gray-500 dark:text-gray-400 focus:outline-none focus:text-gray-700 dark:focus:text-gray-200"
            onClick={() => dispatch(toggleSidebar())}
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Sales Dashboard</h1>
          </div>
        </div>
        
        {/* Right side - User menu & dark mode toggle */}
        <div className="flex items-center">
          {/* Dark mode toggle */}
          <button
            className="p-1 mr-4 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            onClick={() => dispatch(toggleDarkMode())}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {/* User menu */}
          <div className="relative">
            <button
              className="flex items-center text-gray-700 dark:text-gray-200 focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="ml-2 font-medium hidden md:block">{user?.name || 'User'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  <div className="font-semibold">{user?.name || 'User'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</div>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                  Role: {user?.role === 'admin' ? 'Administrator' : 'User'}
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                {user?.role === 'admin' && (
                  <a 
                    href="#admin"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                      setUserMenuOpen(false);
                    }}
                  >
                    Admin Panel
                  </a>
                )}
                <a 
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle profile click
                    setUserMenuOpen(false);
                  }}
                >
                  Your Profile
                </a>
                <a 
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle settings click
                    setUserMenuOpen(false);
                  }}
                >
                  Settings
                </a>
                <a 
                  href="#logout"
                  className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                    setUserMenuOpen(false);
                  }}
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;