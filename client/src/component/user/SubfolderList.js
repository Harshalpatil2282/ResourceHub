// src/components/user/SubfolderList.js
import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function SubfolderList({ parentFolderId, onSelect }) {
  const [subfolders, setSubfolders] = useState([]);

  useEffect(() => {
    if (!parentFolderId) return;
    API.get(`/folders/subfolders/${parentFolderId}`)
      .then(res => setSubfolders(res.data))
      .catch(err => console.error(err));
  }, [parentFolderId]);

  if (!parentFolderId) return null;

  return (
    <div>
      <h3>📂 Subjects in this Semester</h3>
      {subfolders.length === 0 ? (
        <p>No subjects/folders found inside this semester.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {subfolders.map((folder) => (
            <button key={folder._id} onClick={() => onSelect(folder._id)}>
              {folder.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubfolderList;
