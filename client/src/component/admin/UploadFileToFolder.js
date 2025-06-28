// src/components/admin/UploadFileToFolder.js
import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import DragDropUpload from './DragDropUpload';

function UploadFileToFolder() {
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subfolders, setSubfolders] = useState([]);

  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');

  useEffect(() => {
    API.get('/universities')
      .then(res => setUniversities(res.data))
      .catch(err => console.error("Error fetching universities:", err.response?.data || err.message));
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      API.get(`/programs/university/${selectedUniversity}`)
        .then(res => setPrograms(res.data))
        .catch(err => console.error("Error fetching programs:", err.response?.data || err.message));
    } else {
      setPrograms([]);
      setSelectedProgram('');
    }
    setSemesters([]);
    setSelectedSemester('');
    setSubfolders([]);
    setSelectedFolder('');
  }, [selectedUniversity]);

  useEffect(() => {
    if (selectedProgram) {
      API.get(`/folders/program/${selectedProgram}`)
        .then(res => setSemesters(res.data))
        .catch(err => console.error("Error fetching semesters:", err.response?.data || err.message));
    } else {
      setSemesters([]);
      setSelectedSemester('');
    }
    setSubfolders([]);
    setSelectedFolder('');
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedSemester) {
      API.get(`/folders/subfolders/${selectedSemester}`)
        .then(res => setSubfolders(res.data))
        .catch(err => console.error("Error fetching subfolders:", err.response?.data || err.message));
    } else {
      setSubfolders([]);
      setSelectedFolder('');
    }
  }, [selectedSemester]);

  return (
    <div>
      <h3>📤 Upload File to Specific Folder</h3>

      {/* Select University */}
      <select value={selectedUniversity} onChange={e => setSelectedUniversity(e.target.value)}>
        <option value="">Select University</option>
        {universities.map(u => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>

      {/* Select Program */}
      <select
        value={selectedProgram}
        onChange={e => setSelectedProgram(e.target.value)}
        disabled={!selectedUniversity}
      >
        <option value="">Select Program</option>
        {programs.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {/* Select Semester */}
      <select
        value={selectedSemester}
        onChange={e => setSelectedSemester(e.target.value)}
        disabled={!selectedProgram}
      >
        <option value="">Select Semester</option>
        {semesters.map(s => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      {/* Select Subfolder inside Semester */}
      <select
        value={selectedFolder}
        onChange={e => setSelectedFolder(e.target.value)}
        disabled={!selectedSemester}
      >
        <option value="">Select Specific Folder inside Semester</option>
        {subfolders.map(f => (
          <option key={f._id} value={f._id}>{f.name}</option>
        ))}
      </select>

      {/* Upload Component */}
      {selectedFolder && (
        <DragDropUpload folderId={selectedFolder} />
      )}
    </div>
  );
}

export default UploadFileToFolder;
