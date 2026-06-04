import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './redux/slices/authSlice';
import api from './utils/api';

// Components
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Spinner from './components/UI/Spinner';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, authChecked } = useSelector(state => state.auth);

  useEffect(() => {
    // Prime the CSRF cookie, then verify the session via the httpOnly cookie.
    const init = async () => {
      try {
        await api.get('/auth/csrf');
      } catch (e) {
        /* CSRF priming is best-effort; the first response also sets it */
      }
      dispatch(getUserProfile());
    };
    init();
  }, [dispatch]);

  // Show a full-screen spinner only during the initial session check
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Spinner size="large" color="blue" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<Dashboard />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;