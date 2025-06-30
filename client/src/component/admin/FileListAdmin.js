import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function FileListAdmin({ folderId }) {
  const [files, setFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newName, setNewName] = useState('');
  const [canDownload, setCanDownload] = useState(true);

  useEffect(() => {
    if (!folderId) return;
    API.get(`/files/folder/${folderId}`).then(res => setFiles(res.data));
  }, [folderId]);

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this file?')) return;
  try {
    await API.delete(`/files/${id}`);
    setFiles(files.filter(f => f._id !== id));
  } catch (err) {
    console.error(err);
    alert('❌ Failed to delete file.');
  }
};


  const startEdit = (file) => {
    setEditId(file._id);
    setNewName(file.name);
    setCanDownload(file.canDownload);
  };

  const handleEdit = async () => {
    await API.put(`/files/${editId}`, {
      name: newName,
      canDownload,
    });
    setEditId(null);
    API.get(`/files/folder/${folderId}`).then(res => setFiles(res.data));
  };

  return (
    <div>
      <h3>📁 Files in Folder</h3>
      <ul>
        {files.map(file => (
          <li key={file._id}>
            <b>{file.name}</b>
            {editId === file._id ? (
              <>
                <input value={newName} onChange={e => setNewName(e.target.value)} />
                <label>
                  <input type="checkbox" checked={canDownload} onChange={e => setCanDownload(e.target.checked)} />
                  Can Download
                </label>
                <button onClick={handleEdit}>💾 Save</button>
                <button onClick={() => setEditId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(file)}>✏️ Edit</button>
                <button onClick={() => handleDelete(file._id)}>🗑️ Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileListAdmin;
