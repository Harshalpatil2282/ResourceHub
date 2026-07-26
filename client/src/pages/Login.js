import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/login.css';
import { useTheme } from '../context/ThemeContext';
import Loader from '../component/Loader';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (theme !== 'dark') {
      toggleTheme();
    }
    // eslint-disable-next-line
  }, []); // Only run on mount

  // Standard email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('university', user.university);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || '❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-click guest access — no registration required
  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setMsg('');
    try {
      const res = await API.post('/auth/guest-login');
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.removeItem('university'); // guests have no university
      navigate('/user');
    } catch (err) {
      setMsg('❌ Guest access failed. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="login-container">
      {(loading || guestLoading) && <Loader />}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="card">
        <div className="badge">🎓 100% Free, Forever</div>
        <h2>Welcome to ResourceHub 🚀</h2>
        <p>
          Access <strong>Previous Year Question Papers, Notes, PDFs, PPTs, Experiments</strong> and much more,
          all organized <strong>university-wise</strong> to help you excel in your studies.
        </p>
        <p>
          Join thousands of students using ResourceHub to download and contribute study materials absolutely free.
          No hidden fees, no restrictions—only learning and sharing!
        </p>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <input
              type="email"
              placeholder="📧 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-field password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="🔒 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login Now'}
          </button>
          <div className="switch-link">
            <button type="button" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
          </div>
          {msg && <p className="error-msg">{msg}</p>}
        </form>

        {/* Separator */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* One-click guest access */}
        <button
          id="guest-login-btn"
          className="button guest-button"
          onClick={handleGuestLogin}
          disabled={guestLoading}
          title="Browse resources without an account"
        >
          {guestLoading ? '⏳ Entering as Guest...' : '👤 Continue as Guest'}
        </button>
        <p className="guest-hint">No registration needed — browse all resources instantly</p>

        <div className="switch-link">
          <span>Don't have an account? </span>
          <button type="button" onClick={() => navigate('/register')}>Register Now</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
