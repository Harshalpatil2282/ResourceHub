import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Loader from '../component/Loader';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { token } = useParams();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { newPassword });
      setMsg('✅ Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.msg || '❌ Failed to reset password.');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader />}

      <div className="card">
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="password"
              placeholder="🔒 New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">Reset Password</button>
          {msg && <p className="error-msg">{msg}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
