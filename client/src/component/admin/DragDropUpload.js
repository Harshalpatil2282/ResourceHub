// src/components/admin/DragDropUpload.js
import React, { useState } from 'react';
import API from '../../services/api';

function DragDropUpload({ folderId }) {
  const [file, setFile] = useState(null);
  const [canDownload, setCanDownload] = useState(true);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('❌ Please select a file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId);
      formData.append('canDownload', canDownload);

      await API.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ File uploaded successfully.');
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage('❌ Upload failed.');
    }
  };

  return (
    <div>
      <h3>Upload File to Selected Folder</h3>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <label>
          <input
            type="checkbox"
            checked={canDownload}
            onChange={e => setCanDownload(e.target.checked)}
          />
          Allow Download
        </label>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DragDropUpload;
