import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import HorizontalScroller from '../common/HorizontalScroller';

function FolderList({ programId, onSelect }) {
  const [folders, setFolders] = useState([]);
  const [browseAll, setBrowseAll] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    API.get(`/folders/program/${programId}`)
      .then(res => setFolders(res.data))
      .catch(err => console.error(err));
  }, [programId]);

  const gradient = "linear-gradient(135deg,  #ff4081)";
    
  

  return (
    <div>
      <h2 style={{
        fontFamily: 'Comic Sans MS, cursive',
        color: theme === 'dark' ? '#fff' : '#111',
        textAlign: 'center'
      }}>
        🗂️ Semesters / Folders
      </h2>

      {browseAll ? (
        <HorizontalScroller>
          {folders.map((f) => (
            <button
              key={f._id}
              onClick={() => onSelect(f._id)}
              style={{
                minWidth: '150px',
                padding: '20px 30px',
                border: 'none',
                borderRadius: '30px',
                color: '#fff',
                background: gradient,
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {f.name}
            </button>
          ))}
        </HorizontalScroller>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            padding: '10px'
          }}
        >
          {folders.map((f) => (
            <button
              key={f._id}
              onClick={() => onSelect(f._id)}
              style={{
                minWidth: '150px',
                padding: '20px 30px',
                border: 'none',
                borderRadius: '30px',
                color: '#fff',
                background: gradient,
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}

      {/* Browse All Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={() => setBrowseAll(!browseAll)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: 'none',
            background: '#ffa500',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          →
        </button>
        <span style={{ marginTop: '5px', fontSize: '0.8rem', color: theme === 'dark' ? '#fff' : '#111' }}>
          {browseAll ? "Grid View" : "Browse All"}
        </span>
      </div>
    </div>
  );
}

export default FolderList;
