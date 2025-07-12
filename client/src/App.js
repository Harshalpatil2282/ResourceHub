import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleRoute from './routes/RoleRoute';
import AdminDashboard from './pages/AdminDashboard';
import UserViewPage from './pages/UserViewPage';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';
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
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/register' element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Routes>
    </Router>

  );
}

export default App;
