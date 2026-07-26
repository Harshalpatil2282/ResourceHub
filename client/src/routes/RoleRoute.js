import React from 'react';
import { Navigate } from 'react-router-dom';

function RoleRoute({ role, children }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // No token at all → redirect to login
  if (!token) return <Navigate to="/login" />;

  // Guest can access user-level pages (read-only browsing)
  if (role === 'user' && userRole === 'guest') return children;

  return userRole === role ? children : <Navigate to="/" />;
}

export default RoleRoute;
