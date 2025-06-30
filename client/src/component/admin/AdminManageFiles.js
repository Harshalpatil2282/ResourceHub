// src/components/admin/AdminManageFiles.js
import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function AdminManageFiles() {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [file, setFile] = useState(null);

  const [canDownload, setCanDownload] = useState(true);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // <-- NEW
  const [downloadingId, setDownloadingId] = useState(null); // <-- NEW

  // Fetch folders with university and program details
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await API.get('/folders/detailed');
        setFolders(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch folders.');
      }
    };
    fetchFolders();
  }, []);

  // Fetch files when a folder is selected
  useEffect(() => {
    if (!selectedFolderId) return;
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/files/folder/${selectedFolderId}`);
        setFiles(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [selectedFolderId]);

  const refreshFiles = async () => {
    try {
      const res = await API.get(`/files/folder/${selectedFolderId}`);
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFolderId || !file) return alert('Please select a folder and file.');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', selectedFolderId);
    formData.append('canDownload', canDownload);

    setUploading(true); // <-- NEW
    try {
      await API.post('/files/upload', formData);
      alert('✅ File uploaded.');
      setFile(null);
      document.getElementById('fileInput').value = '';
      refreshFiles();
    } catch (err) {
      console.error(err);
      alert('❌ File upload failed.');
    } finally {
      setUploading(false); // <-- NEW
    }
  };

  // Download handler with loader
  const handleDownload = async (file) => {
    setDownloadingId(file._id);
    try {
      window.open(file.url, '_blank');
    } finally {
      setTimeout(() => setDownloadingId(null), 1000); // Simulate loader for UX
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await API.delete(`/files/${fileId}`);
      alert('✅ File deleted.');
      refreshFiles();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete file.');
    }
  };

  return (
    <div>
      <h3>📂 Manage Files in Folder</h3>

      <select value={selectedFolderId} onChange={e => setSelectedFolderId(e.target.value)}>
        <option value="">-- Select Folder (University ➔ Program ➔ Folder) --</option>
        {folders.map(folder => (
          <option key={folder._id} value={folder._id}>
            {folder.university?.name} ➔ {folder.program?.name} ➔ {folder.name}
          </option>
        ))}
      </select>

      {selectedFolderId && (
        <>
          <div style={{ marginTop: '20px' }}>
            <h4>📤 Upload File</h4>
            <input id="fileInput" type="file" onChange={e => setFile(e.target.files[0])} />
            <label>
              <input
                type="checkbox"
                checked={canDownload}
                onChange={e => setCanDownload(e.target.checked)}
              /> Allow Download
            </label>
            <button onClick={handleFileUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

         
          <div style={{ marginTop: '30px' }}>
            <h4>🗂️ Files in Folder</h4>
            {loading ? (
              <p>Loading files...</p>
            ) : files.length === 0 ? (
              <p>No files found in this folder.</p>
            ) : (
              <ul>
                {files.map(file => (
                  <li key={file._id}>
                    <button
                      onClick={() => handleDownload(file)}
                      disabled={downloadingId === file._id}
                      style={{ marginRight: 8 }}
                    >
                      {downloadingId === file._id ? 'Downloading...' : '⬇️'}
                    </button>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name || 'Unnamed File'}
                    </a>
                    <button
                      onClick={() => handleDelete(file._id)}
                      style={{ marginLeft: 8 }}
                    >
                      🗑️ Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </>
      )}
    </div>
  );
}

export default AdminManageFiles;
