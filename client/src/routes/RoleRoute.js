import React from 'react';
import { Navigate } from 'react-router-dom';

function RoleRoute({ role, children }) {
  const userRole = localStorage.getItem('role');
  return userRole === role ? children : <Navigate to="/" />;
}

export default RoleRoute;
