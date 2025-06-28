import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function UniversitySelector({ onSelect }) {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    API.get('/universities')
      .then(res => setUniversities(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>🎓 Select Your University</h3>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">-- Select University --</option>
        {universities.map((u) => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>
    </div>
  );
}

export default UniversitySelector;
