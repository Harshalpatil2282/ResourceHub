// src/components/user/FileList.js
import React, { useEffect, useState } from 'react';
import { getFilesByFolder } from '../../services/api';

function FileList({ folderId, files: externalFiles, customList }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!customList && folderId) {
      getFilesByFolder(folderId)
        .then((res) => setFiles(res))
        .catch(() => alert('Failed to load files'));
    }
  }, [folderId, customList]);

  const displayedFiles = customList ? externalFiles : files;

  const handleView = (url) => {
    window.open(url, '_blank');
  };

  const handleDownload = async (file) => {
  try {
    const res = await API.get(`/files/track-download/${file._id}`);
    const a = document.createElement('a');
    a.href = res.data.url;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch {
    alert("Download failed");
  }
};

  return (
    <div>
      <h3>📂 Files in Folder</h3>
      {displayedFiles.length === 0 && <p>No files found.</p>}
      <ul>
        {displayedFiles.map((file) => {
          const ext = file.name.split('.').pop().toLowerCase();
          const isDownloadable = file.canDownload && ['pdf', 'ppt', 'pptx'].includes(ext);

          return (
            <li key={file._id}>
              <strong>{file.name}</strong> ({ext.toUpperCase()})
              {' '}
              {isDownloadable ? (
                <button onClick={() => handleDownload(file)}>⬇️ Download</button>

              ) : (
                <button onClick={() => handleView(file.url)}>👁️ View Only</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FileList;
