import React, { useEffect, useState } from 'react';
import API from '../services/api';
import UniversitySelector from '../component/user/UniversitySelector';
import ProgramList from '../component/user/ProgramList';
import FolderList from '../component/user/FolderList';
import SubfolderList from '../component/user/SubfolderList';
import FileCard from '../component/user/FileCard';
import Breadcrumbs from '../component/user/Breadcrumbs';

function UserDashboard() {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedSubfolder, setSelectedSubfolder] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Fetch files whenever folder/subfolder or searchQuery changes
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>📚 ResourceHub by Harsh Patil</h1>
      <p style={{ color: '#555' }}>
        Your one-stop academic resource hub for PDFs, Notes, PPTs, and more.
      </p>
      <hr />

      {/* ✅ Breadcrumbs */}
      <Breadcrumbs
        university={selectedUniversity}
        program={selectedProgram}
        folder={selectedFolder}
        subfolder={selectedSubfolder}
        clearBelow={clearBelow}
      />

      {/* University Selection */}
      <UniversitySelector onSelect={(id) => {
        setSelectedUniversity(id);
        setSelectedProgram('');
        setSelectedFolder('');
        setSelectedSubfolder('');
        setFiles([]);
      }} />

      {/* Program Selection */}
      {selectedUniversity && (
        <ProgramList
          universityId={selectedUniversity}
          onSelect={(id) => {
            setSelectedProgram(id);
            setSelectedFolder('');
            setSelectedSubfolder('');
            setFiles([]);
          }}
        />
      )}

      {/* Folder (Semester) Selection */}
      {selectedProgram && (
        <FolderList
          programId={selectedProgram}
          onSelect={(id) => {
            setSelectedFolder(id);
            setSelectedSubfolder('');
            setFiles([]);
          }}
        />
      )}

      {/* Subfolder (Subject) Selection */}
      {selectedFolder && (
        <SubfolderList
          parentFolderId={selectedFolder}
          onSelect={(id) => {
            setSelectedSubfolder(id);
            setFiles([]);
          }}
        />
      )}

      {/* Search and File Display */}
      {(selectedFolder || selectedSubfolder) && (
        <>
          <input
            type="text"
            placeholder="🔍 Search files by name/type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '15px',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />

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
    </div>
  );
}

export default UserDashboard;
