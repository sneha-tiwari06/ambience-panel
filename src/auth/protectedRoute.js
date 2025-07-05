// src/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ModernSidebar from '../components/layout/ModernSidebar';

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    <ModernSidebar>
      <Outlet /> 
    </ModernSidebar>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;