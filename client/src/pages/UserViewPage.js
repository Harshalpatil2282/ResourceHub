import React, { useEffect, useState } from 'react';
import API from '../services/api';

function UserDashboard() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      fetchFolders();
    }
    // eslint-disable-next-line
  }, [selectedFolder, isSearching]);

  const fetchFolders = async () => {
    const res = await API.get(`/folders/user?parentId=${selectedFolder || ''}`);
    setFolders(res.data);
    const resFiles = await API.get(`/files/user?folderId=${selectedFolder || ''}`);
    setFiles(resFiles.data);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    const res = await API.get(`/files/search?search=${searchTerm}`);
    setFiles(res.data);
    setFolders([]); // hide folders when searching
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    fetchFolders(); // reload
  };

  return (
    <div>
      <h2>🎓 University Dashboard</h2>
      <div>
        <input
          type="text"
          placeholder="🔍 Search files by name/subject"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {isSearching && <button onClick={clearSearch}>❌ Clear</button>}
      </div>

      {!isSearching && selectedFolder && (
        <button onClick={() => setSelectedFolder(null)}>⬅️ Back</button>
      )}

      {!isSearching && (
        <>
          <h4>📁 Folders</h4>
          <ul>
            {folders.map((folder) => (
              <li key={folder._id}>
                <button onClick={() => setSelectedFolder(folder._id)}>
                  📂 {folder.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <h4>📄 Files</h4>
      <ul>
        {files.length > 0 ? (
          files.map((file) => (
            <li key={file._id}>
              {file.name}
              {file.canDownload ? (
                <a href={file.url} download>⬇️ Download</a>
              ) : (
                <a href={file.url} target="_blank" rel="noopener noreferrer">👁️ View</a>
              )}
            </li>
          ))
        ) : (
          <p>{isSearching ? 'No files found for your search.' : 'No files available.'}</p>
        )}
      </ul>
    </div>
  );
}

export default UserDashboard;
