import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function FileListUser({ folderId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    API.get(`/files/user?folderId=${folderId}`)
      .then(res => setFiles(res.data))
      .catch(err => console.error(err));
  }, [folderId]);

  return (
    <div>
      <h3>📄 Files in Folder</h3>
      {files.length === 0 ? (
        <p>No files uploaded yet in this folder.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              {file.name}
              {file.canDownload ? (
                <a href={file.url} target="_blank" rel="noopener noreferrer"> 🔗 View / Download</a>
              ) : (
                <a href={file.url} target="_blank" rel="noopener noreferrer"> 🔗 View Only</a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileListUser;
