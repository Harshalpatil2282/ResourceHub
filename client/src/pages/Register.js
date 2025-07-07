import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/login.css';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '', role: 'user' });
  const [msg, setMsg] = useState('');
  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/universities').then(res => setUniversities(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await API.post('/auth/register', form);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        localStorage.setItem('userId', res.data.user.id);
        localStorage.setItem('university', res.data.user.university);
        alert("Regestered Successfully");
        navigate('/user');
      } else {
        setMsg('❌ Registration failed. No token received.');
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || '❌ Registration failed. Try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="card">
        <div className="badge">🚀 Join ResourceHub Today</div>
        <h2>Create Your Free Account</h2>
        <p>
          Register to access <strong>free study materials</strong> for your university, including PYQs, notes, experiments, PDFs, and PPTs.
          Share and download resources to help your peers and enhance your learning!
        </p>
        <form onSubmit={handleRegister}>
          <div className="input-field">
            <input
              name="name"
              placeholder="👤 Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <input
              name="email"
              type="email"
              placeholder="📧 Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <input
              name="password"
              type="password"
              placeholder="🔒 Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <select
              name="university"
              value={form.university}
              onChange={handleChange}
              required
            >
              <option value="">🏫 Select University</option>
              {universities.map(u => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="button">Register Now</button>
          {msg && <p className="error-msg">{msg}</p>}
        </form>
        <div className="switch-link">
          <span>Already have an account? </span>
          <button onClick={() => navigate('/login')}>Login Here</button>
        </div>
      </div>
    </div>
  );
}

export default Register;

