import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { sidebarOpen } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);
  
  // Check if user is admin
  const isAdmin = user && user.role === 'admin';
  
  return (
    <aside className={`bg-gray-800 text-white w-64 min-h-screen p-4 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-20`}>
      <div className="flex flex-col h-full">
        <div className="py-4">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">Sales Dashboard</h2>
          
          <nav>
            <h3 className="uppercase text-xs font-semibold text-gray-400 mb-2">Main</h3>
            <ul className="space-y-1">
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
                  end
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/dashboard/sales" 
                  className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sales
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/dashboard/analytics" 
                  className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/dashboard/customers" 
                  className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Customers
                </NavLink>
              </li>
            </ul>
          </nav>
          
          {isAdmin && (
            <nav className="mt-8">
              <h3 className="uppercase text-xs font-semibold text-gray-400 mb-2">Administration</h3>
              <ul className="space-y-1">
                <li>
                  <NavLink 
                    to="/admin" 
                    className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
                    end
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/admin/users" 
                    className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    User Management
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/admin/sales" 
                    className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Sales Management
                  </NavLink>
                </li>
              </ul>
            </nav>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-auto pb-4">
          <div className="border-t border-gray-700 pt-4">
            <NavLink 
              to="/dashboard/profile" 
              className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </NavLink>
            <NavLink 
              to="/dashboard/settings" 
              className={({isActive}) => `flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;