import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleRoute from './routes/RoleRoute';
import AdminDashboard from './pages/AdminDashboard';
import UserViewPage from './pages/UserViewPage';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/user"
          element={
            <RoleRoute role="user">
              <UserViewPage />
            </RoleRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;
