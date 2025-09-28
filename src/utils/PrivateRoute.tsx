import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // In a real application, you would get this from a context, redux, or a hook
  const isAuthenticated = !!localStorage.getItem('user'); // Example: check if user is in local storage

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
