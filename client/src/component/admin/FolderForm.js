// src/components/admin/FolderForm.js
import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function FolderForm() {
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [folders, setFolders] = useState([]);

  const [universityId, setUniversityId] = useState('');
  const [programId, setProgramId] = useState('');
  const [parentFolderId, setParentFolderId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Fetch universities on mount
  useEffect(() => {
    API.get('/universities')
      .then(res => setUniversities(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch programs for selected university
  useEffect(() => {
    if (universityId) {
      API.get(`/programs/university/${universityId}`)
        .then(res => setPrograms(res.data))
        .catch(err => console.error(err));
    } else {
      setPrograms([]);
      setProgramId('');
      setFolders([]);
      setParentFolderId('');
    }
  }, [universityId]);

  // Fetch folders for selected program
  useEffect(() => {
    if (programId) {
      API.get(`/folders/program/${programId}`)
        .then(res => setFolders(res.data))
        .catch(err => console.error(err));
    } else {
      setFolders([]);
      setParentFolderId('');
    }
  }, [programId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/folders', {
        name,
        universityId,
        programId,
        parentFolderId
      });
      setMessage('✅ Folder created successfully.');
      setName('');
      setParentFolderId('');
      API.get(`/folders/program/${programId}`).then(res => setFolders(res.data));
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create folder.');
    }
  };

  return (
    <div>
      <h3>📂 Create Folder / Subfolder</h3>
      <form onSubmit={handleSubmit}>

        {/* University Selection */}
        <select
          value={universityId}
          onChange={e => setUniversityId(e.target.value)}
          required
        >
          <option value="">Select University</option>
          {universities.map(uni => (
            <option key={uni._id} value={uni._id}>{uni.name}</option>
          ))}
        </select>

        {/* Program Selection */}
        <select
          value={programId}
          onChange={e => setProgramId(e.target.value)}
          required
          disabled={!universityId}
        >
          <option value="">Select Program</option>
          {programs.map(prog => (
            <option key={prog._id} value={prog._id}>{prog.name}</option>
          ))}
        </select>

        {/* Parent Folder Selection (optional) */}
        <select
          value={parentFolderId}
          onChange={e => setParentFolderId(e.target.value)}
          disabled={!programId}
        >
          <option value="">Root Folder (Semester)</option>
          {folders.map(f => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Folder Name (e.g., Sem-1)"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <button type="submit">Create Folder</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FolderForm;
