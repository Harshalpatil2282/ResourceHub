// src/components/admin/UniversityForm.js
import React, { useState } from 'react';
import API from '../../services/api';

function UniversityForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/universities', { name });
      setMessage('University created!');
      setName('');
    } catch (err) {
      setMessage('Error creating university');
    }
  };

  return (
    <div>
      <h3>Create University</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="University Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default UniversityForm;
