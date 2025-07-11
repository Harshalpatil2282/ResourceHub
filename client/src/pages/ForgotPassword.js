import React, { useState } from 'react';
import API from '../services/api';
import Loader from '../component/Loader';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setMsg('✅ Password reset link sent to your email.');
    } catch (err) {
      setMsg(err.response?.data?.msg || '❌ Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader />}
      <div className="card">
        <h2>Forgot Password</h2>
        <p>Enter your registered email to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              placeholder="📧 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">Send Reset Link</button>
          {msg && <p className="error-msg">{msg}</p>}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
