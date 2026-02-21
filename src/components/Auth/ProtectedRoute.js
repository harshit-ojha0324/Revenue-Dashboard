import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles = ['user', 'admin'] }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and authorized, render the child route
  return <Outlet />;
};

export default ProtectedRoute;