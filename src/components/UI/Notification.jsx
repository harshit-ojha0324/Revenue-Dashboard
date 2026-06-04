import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '../../redux/slices/uiSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const { notification } = useSelector(state => state.ui);
  
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5001);
      
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);
  
  if (!notification) return null;
  
  // Determine the background color based on notification type
  let bgColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  let iconColor = 'text-blue-500 dark:text-blue-400';
  
  if (notification.type === 'success') {
    bgColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    iconColor = 'text-green-500 dark:text-green-400';
  } else if (notification.type === 'error') {
    bgColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    iconColor = 'text-red-500 dark:text-red-400';
  } else if (notification.type === 'warning') {
    bgColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    iconColor = 'text-yellow-500 dark:text-yellow-400';
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`rounded-lg shadow-md p-4 ${bgColor} flex items-start`}>
        {/* Icon */}
        <div className={`mr-3 flex-shrink-0 ${iconColor}`}>
          {notification.type === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.type === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.type === 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {notification.type !== 'success' && notification.type !== 'error' && notification.type !== 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="font-medium">
            {notification.title || (
              notification.type === 'success' ? 'Success' :
              notification.type === 'error' ? 'Error' :
              notification.type === 'warning' ? 'Warning' : 'Notification'
            )}
          </div>
          <div className="mt-1 text-sm">
            {notification.message}
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={() => dispatch(clearNotification())}
          className="ml-4 flex-shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;