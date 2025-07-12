// src/components/user/SubfolderList.js

import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/UserDashboard.css';
import HorizontalScroller from '../common/HorizontalScroller';

function SubfolderList({ parentFolderId, onSelect }) {
  const [subfolders, setSubfolders] = useState([]);
  const [browseAll, setBrowseAll] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!parentFolderId) return;
    API.get(`/folders/subfolders/${parentFolderId}`)
      .then(res => setSubfolders(res.data))
      .catch(err => console.error(err));
  }, [parentFolderId]);

  if (!parentFolderId) return null;

  // You can use a gradient list or a single gradient as you like
  const gradientList = [
    "linear-gradient(135deg, #36d1c4, #1e3c72)",
    "linear-gradient(135deg, #007cbe, #fff24E)",
    "linear-gradient(135deg, #414288, #b0db43)",
    "linear-gradient(135deg, #629460, #f4d35e)",
    "linear-gradient(135deg, #e57a44, #251351)",
  ];

  return (
    <div className="glass-card" style={{ padding: '1rem', marginTop: '1rem' }}>
      <h3
        style={{
          fontFamily: 'Comic Sans MS, cursive',
          fontSize: '1.2rem',
          color: theme === 'dark' ? '#fff' : '#111',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}
      >
        📂 Subjects in this Semester
      </h3>

      {subfolders.length === 0 ? (
        <p style={{ color: theme === 'dark' ? '#ccc' : '#555' }}>
          No subjects/folders found inside this semester.
        </p>
      ) : browseAll ? (
        <HorizontalScroller>
          {subfolders.map((folder, index) => (
            <button
              key={folder._id}
              onClick={() => onSelect(folder._id)}
              style={{
                minWidth: '150px',
                padding: '20px 30px',
                border: 'none',
                borderRadius: '30px',
                color: '#fff',
                background: gradientList[index % gradientList.length],
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {folder.name}
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
          {subfolders.map((folder, index) => (
            <button
              key={folder._id}
              onClick={() => onSelect(folder._id)}
              style={{
                minWidth: '150px',
                padding: '20px 30px',
                border: 'none',
                borderRadius: '30px',
                color: '#fff',
                background: gradientList[index % gradientList.length],
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {folder.name}
            </button>
          ))}
        </div>
      )}

      {/* Browse All Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
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

export default SubfolderList;
