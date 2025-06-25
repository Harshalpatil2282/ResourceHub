// src/components/admin/ProgramForm.js
import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function ProgramForm() {
  const [universities, setUniversities] = useState([]);
  const [universityId, setUniversityId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/universities').then(res => setUniversities(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/programs', { name, universityId });
      setMessage('Program created!');
      setName('');
    } catch (err) {
      setMessage('Error creating program');
    }
  };

  return (
    <div>
      <h3>Create Program</h3>
      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setUniversityId(e.target.value)} value={universityId}>
          <option value="">Select University</option>
          {universities.map((u) => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Program Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ProgramForm;
