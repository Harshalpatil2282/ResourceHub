import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function ProgramList({ universityId, onSelect }) {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    API.get(`/programs/university/${universityId}`)
      .then(res => setPrograms(res.data))
      .catch(err => console.error(err));
  }, [universityId]);

  return (
    <div>
      <h3>📘 Programs Available</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {programs.map((p) => (
          <button key={p._id} onClick={() => onSelect(p._id)}>
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProgramList;
