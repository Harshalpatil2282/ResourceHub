import React from 'react';
import '../styles/loader.css'; // create for spinner styling

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
    </div>
  );
}

export default Loader;
