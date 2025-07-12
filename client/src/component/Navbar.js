// src/component/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css'; // Create this if not present

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>
        <img
          src="/ResourceHub_Logo1.png" // If in public
          alt="ResourceHub Logo"
          className="navbar-logo"
        />
        <span className="navbar-title">ResourceHub</span>
      </div>
      <div className="navbar-right">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
        <a href="https://hp-portfolio-ujjo.onrender.com" target="_blank" rel="noopener noreferrer">
          <button>About Admin</button>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
