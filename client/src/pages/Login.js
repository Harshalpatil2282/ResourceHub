import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/login.css';
import { useTheme } from '../context/ThemeContext'; // adjust path if needed

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (theme !== 'dark') {
      toggleTheme();
    }
    // eslint-disable-next-line
  }, []); // Only run on mount

  const handleLogin = async (e) => {
    e.preventDefault();
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
      setMsg('❌ Login failed. Check your credentials.');
    }
  };

  return (
    <div className="login-container">
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
          
          
          <button type="submit" className="button">Login Now</button>
          <div className="switch-link">
            <button onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
          </div>
          {msg && <p className="error-msg">{msg}</p>}
        </form>
        <div className="switch-link">
          <span>Don’t have an account? </span>
          <button onClick={() => navigate('/register')}>Register Now</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
