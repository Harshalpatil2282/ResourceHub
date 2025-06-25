import React, { useState } from 'react';
import { searchFiles } from '../../services/api';

function SearchBar({ onResults }) {
  const [name, setName] = useState('');
  const [folderId, setFolderId] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const results = await searchFiles({ name, folderId });
    onResults(results);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="🔍 File Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="📁 Folder ID (optional)"
        value={folderId}
        onChange={(e) => setFolderId(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
