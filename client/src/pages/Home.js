import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import Navbar from '../component/Navbar';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar /> {/* Navbar now only for top-right buttons */}

      <div className="content">
         <img src="/Landing_Image.jpg" alt="Resources" className="resource-img" />

        <h1 className="title">Welcome to ResourceHub</h1>
        <p className="tagline">
          Empowering Students with Organized, Accessible Academic Resources anytime, anywhere
        </p>
        <p className="subtagline">
          Find semester-wise notes, PPTs, projects, and more – all in one place.
        </p>
        <div className="buttons">
        <button
          className="main-button"
          onClick={() => navigate('/login')}
        >
          Go to Resources
        </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
