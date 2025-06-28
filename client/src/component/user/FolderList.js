import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function FolderList({ programId, onSelect }) {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    API.get(`/folders/program/${programId}`)
      .then(res => setFolders(res.data))
      .catch(err => console.error(err));
  }, [programId]);

  return (
    <div>
      <h3>🗂️ Semesters / Folders</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {folders.map((f) => (
          <button key={f._id} onClick={() => onSelect(f._id)}>
            {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FolderList;
