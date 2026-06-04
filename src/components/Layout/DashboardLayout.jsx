import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../redux/slices/uiSlice';

import Header from '../Header/Header';
import Sidebar from '../Header/Sidebar';
import Footer from '../Footer/Footer';
import Notification from '../UI/Notification';

// Shared chrome (header, sidebar, footer) for every authenticated page.
// Child routes render into the <Outlet />.
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { darkMode, sidebarOpen } = useSelector(state => state.ui);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Notification />
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        {/* Mobile backdrop: tap to close the sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
            onClick={() => dispatch(toggleSidebar())}
            aria-hidden="true"
          />
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
