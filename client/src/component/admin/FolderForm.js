// src/components/admin/FolderForm.js
import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function FolderForm() {
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState('');
  const [name, setName] = useState('');
  const [parentFolderId, setParentFolderId] = useState('');
  const [folders, setFolders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/programs').then(res => setPrograms(res.data));
  }, []);

  useEffect(() => {
    if (programId) {
      API.get(`/folders/program/${programId}`).then(res => setFolders(res.data));
    }
  }, [programId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/folders', { name, programId, parentFolderId });
      setMessage('Folder created!');
      setName('');
    } catch (err) {
      setMessage('Error creating folder');
    }
  };

  return (
    <div>
      <h3>Create Folder / Subfolder</h3>
      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setProgramId(e.target.value)} value={programId}>
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <select onChange={(e) => setParentFolderId(e.target.value)} value={parentFolderId}>
          <option value="">Root Folder (Semester)</option>
          {folders.map((f) => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Folder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default FolderForm;
