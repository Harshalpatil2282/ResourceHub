import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import ProgramList from './ProgramList';
import FolderList from './FolderList';
import SubfolderList from './SubfolderList';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

function ContributionForm() {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedSubfolder, setSelectedSubfolder] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [universityId, setUniversityId] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const uni = localStorage.getItem('university');
    if (!uni) {
      alert('University not found. Please login again.');
      navigate('/login');
    }
    setUniversityId(uni);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !selectedFolder || !selectedSubfolder || !file) {
      setMsg('❌ Please complete all fields before submitting.');
      return;
    }

    try {
      const payload = {
        universityId,
        programId: selectedProgram,
        folderId: selectedFolder,
        subfolderId: selectedSubfolder,
        fileName: file.name,
        fileType: file.type,
      };

      await API.post('/contributions', payload);

      setMsg('✅ Contribution submitted! Pending admin review.');
      setFile(null);
      setSelectedProgram('');
      setSelectedFolder('');
      setSelectedSubfolder('');
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to submit contribution.');
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '500px', margin: 'auto', marginTop: '30px', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: theme === 'dark' ? '#fff' : '#111' }}>📤 Contribute a File</h2>
      <form onSubmit={handleSubmit}>
        <ProgramList
          universityId={universityId}
          onSelect={setSelectedProgram}
        />
        {selectedProgram && (
          <FolderList
            programId={selectedProgram}
            onSelect={setSelectedFolder}
          />
        )}
        {selectedFolder && (
          <SubfolderList
            parentFolderId={selectedFolder}
            onSelect={setSelectedSubfolder}
          />
        )}
        {selectedSubfolder && (
          <div className="input-field" style={{ marginTop: '10px' }}>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
        )}
        <button type="submit" className="button" style={{ width: '100%', marginTop: '15px' }}>
          Submit Contribution
        </button>
        {msg && <p style={{ marginTop: '10px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#111' }}>{msg}</p>}
      </form>
    </div>
  );
}

export default ContributionForm;
