// src/components/admin/ZipUpload.js
import React, { useState } from 'react';
import API from '../../services/api';

function ZipUpload({ folderId }) {
  const [file, setFile] = useState(null);
  const [canDownload, setCanDownload] = useState(true);
  const [msg, setMsg] = useState('');

  const handleZipUpload = async (e) => {
    e.preventDefault();
    if (!file || !folderId) return;

    const formData = new FormData();
    formData.append('zip', file);
    formData.append('folderId', folderId);
    formData.append('canDownload', canDownload);

    try {
      const res = await API.post('/files/upload-zip', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMsg(res.data.msg);
      setFile(null);
    } catch (err) {
      setMsg('❌ Upload failed');
    }
  };

  return (
    <form onSubmit={handleZipUpload}>
      <h4>📦 Bulk ZIP Upload</h4>
      <input type="file" accept=".zip" onChange={(e) => setFile(e.target.files[0])} />
      <label>
        <input
          type="checkbox"
          checked={canDownload}
          onChange={(e) => setCanDownload(e.target.checked)}
        /> Can Download?
      </label>
      <button type="submit">Upload ZIP</button>
      <p>{msg}</p>
    </form>
  );
}

// const Activity = require('../models/Activity');

// After saving file
// await new Activity({
//   userId: req.user.userId,
//   fileId: newFile._id,
//   action: 'upload'
// }).save();

export default ZipUpload;
