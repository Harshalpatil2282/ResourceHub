import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

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
        navigate('/user');
      } else {
        setMsg('❌ Registration failed. No token received.');
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || '❌ Registration failed. Try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>📝 Register</h2>
      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br />
        <select name="university" value={form.university} onChange={handleChange} required>
          <option value="">Select University</option>
          {universities.map(u => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select><br />
        <button type="submit">Register</button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}

export default Register;