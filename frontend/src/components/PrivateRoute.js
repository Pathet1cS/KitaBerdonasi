import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly === 'admin' && role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  if (adminOnly === 'association' && role !== 'association_admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;