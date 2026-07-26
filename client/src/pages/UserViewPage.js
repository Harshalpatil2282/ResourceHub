import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import UniversitySelector from '../component/user/UniversitySelector';
import ProgramList from '../component/user/ProgramList';
import FolderList from '../component/user/FolderList';
import SubfolderList from '../component/user/SubfolderList';
import FileCard from '../component/user/FileCard';
import Breadcrumbs from '../component/user/Breadcrumbs';
import ThemeToggle from '../component/common/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import SearchBar from '../component/common/SearchBar';

import '../styles/UserDashboard.css';

function UserDashboard() {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedSubfolder, setSelectedSubfolder] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Detect guest session
  const isGuest = localStorage.getItem('role') === 'guest';

  const clearBelow = (level) => {
    if (level === 'university') {
      setSelectedUniversity('');
      setSelectedProgram('');
      setSelectedFolder('');
      setSelectedSubfolder('');
      setFiles([]);
    } else if (level === 'program') {
      setSelectedProgram('');
      setSelectedFolder('');
      setSelectedSubfolder('');
      setFiles([]);
    } else if (level === 'folder') {
      setSelectedFolder('');
      setSelectedSubfolder('');
      setFiles([]);
    } else if (level === 'subfolder') {
      setSelectedSubfolder('');
      setFiles([]);
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedFolder && !selectedSubfolder) return;
      setLoading(true);
      try {
        const folderId = selectedSubfolder || selectedFolder;
        const res = await API.get(`/files/user?folderId=${folderId}&search=${searchQuery}`);
        setFiles(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchFiles, 400);
    return () => clearTimeout(debounce);
  }, [selectedFolder, selectedSubfolder, searchQuery]);

  // Logout: clear all stored session data and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('university');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Guest session banner */}
      {isGuest && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '10px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '14px',
          boxShadow: '0 2px 12px rgba(102,126,234,0.3)'
        }}>
          <span>👤 You're browsing as a <strong>Guest</strong>. Register to contribute resources and save your progress.</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: '#fff',
                color: '#667eea',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Register Free
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.5)',
                borderRadius: '6px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Exit Guest
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1
            style={{
              fontFamily: 'Comic Sans MS, cursive',
              fontSize: '2rem',
              margin: 0,
              color: theme === 'dark' ? '#fff' : '#111',
              background: 'none'
            }}
          >
            <span>Resource</span>
            <span style={{ color: '#ff416c', marginLeft: 2 }}>Hub</span>
          </h1>
          <p
            style={{
              fontSize: '1.0rem',
              color: theme === 'dark' ? '#e0e0e0' : '#444',
              maxWidth: '400px'
            }}
          >
            Your one-stop academic resource hub for PYQs, PDFs, Notes, PPTs, and more.<br /><br />
            Access semester-wise notes, files, and more — all in one place.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          {/* Logout button for all users */}
          {!isGuest && (
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'rgba(255,65,108,0.12)',
                color: '#ff416c',
                border: '1px solid rgba(255,65,108,0.35)',
                borderRadius: '8px',
                padding: '7px 14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'background 0.2s ease'
              }}
            >
              🚪 Logout
            </button>
          )}
        </div>
      </div>



      <hr />
      <p style={{ fontFamily: 'Comic Sans MS, cursive', fontSize: '1rem', margin: '10px 0' }}>
        <Breadcrumbs
          university={selectedUniversity}
          program={selectedProgram}
          folder={selectedFolder}
          subfolder={selectedSubfolder}
          clearBelow={clearBelow}
        />
      </p>
      <hr />

      <div className="glass-card">
        <UniversitySelector onSelect={(id) => {
          setSelectedUniversity(id);
          setSelectedProgram('');
          setSelectedFolder('');
          setSelectedSubfolder('');
          setFiles([]);
        }} />
      </div>

      {selectedUniversity && (
        <div className="glass-card">
          <ProgramList
            universityId={selectedUniversity}
            onSelect={(id) => {
              setSelectedProgram(id);
              setSelectedFolder('');
              setSelectedSubfolder('');
              setFiles([]);
            }}
          />
        </div>
      )}

      {selectedProgram && (
        <div className="glass-card">
          <FolderList
            programId={selectedProgram}
            onSelect={(id) => {
              setSelectedFolder(id);
              setSelectedSubfolder('');
              setFiles([]);
            }}
          />
        </div>
      )}

      {selectedFolder && (
        <div className="glass-card">
          <SubfolderList
            parentFolderId={selectedFolder}
            onSelect={(id) => {
              setSelectedSubfolder(id);
              setFiles([]);
            }}
          />
        </div>
      )}

      {(selectedFolder || selectedSubfolder) && (
        <>
          <SearchBar onResults={({ name }) => setSearchQuery(name)} />

          {loading ? (
            <p>Loading files...</p>
          ) : files.length > 0 ? (
            <div style={{ marginTop: '20px' }}>
              {files.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          ) : (
            <p style={{ marginTop: '15px', color: '#999' }}>No files found in this folder.</p>
          )}
        </>
      )}
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          marginTop: '40px',
          marginBottom: '10px',
          fontFamily: "'Pacifico'",
          fontSize: '1.1rem',
          color: theme === 'dark' ? '#fff' : '#111',
          opacity: 0.85,
          letterSpacing: '1px',
          cursor: 'pointer'
        }}
      >
        Created by{' '}
        <a
          href="https://hp-portfolio-ujjo.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <span style={{
            color: '#ff416c',
            fontFamily: "'Pacifico', cursive"
          }}>
            H
          </span>
          <span style={{
            color: theme === 'dark' ? '#fff' : '#111',
            fontFamily: "'Pacifico', cursive"
          }}>
            arshal{' '}
          </span>
          <span style={{
            color: '#ff416c',
            fontFamily: "'Pacifico', cursive"
          }}>
            P
          </span>
          <span style={{
            color: theme === 'dark' ? '#fff' : '#111',
            fontFamily: "'Pacifico', cursive"
          }}>
            atil
          </span>
        </a>
      </div>

    </div>

  );
}

export default UserDashboard;
