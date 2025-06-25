import React, { useState } from 'react';
import API from '../../services/api';
import './dragdrop.css'; // optional styling

function DragDropUpload({ folderId }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [canDownload, setCanDownload] = useState(true);
  const [message, setMessage] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !folderId) return alert('Folder and file required');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);
    formData.append('canDownload', canDownload);

    try {
      await API.post('/files/upload', formData);
      setMessage('✅ File uploaded successfully!');
      setFile(null);
    } catch (err) {
      setMessage('❌ Upload failed!');
    }
  };

  return (
    <form
      className="dragdrop-upload"
      onSubmit={handleSubmit}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <label htmlFor="fileInput">
        <div className={dragActive ? "drop-zone active" : "drop-zone"}>
          {file ? (
            <p>📄 {file.name}</p>
          ) : (
            <p>Drag & Drop or Click to Upload</p>
          )}
        </div>
      </label>

      <input
        type="file"
        id="fileInput"
        onChange={handleFileInput}
        hidden
      />

      <label>
        <input
          type="checkbox"
          checked={canDownload}
          onChange={(e) => setCanDownload(e.target.checked)}
        />
        Can Download
      </label>

      <button type="submit">Upload</button>
      <p>{message}</p>
    </form>
  );
}

export default DragDropUpload;
