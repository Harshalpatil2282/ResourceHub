import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/UserDashboard.css';
import HorizontalScroller from '../common/HorizontalScroller';

function ProgramList({ universityId, onSelect }) {
  const [programs, setPrograms] = useState([]);
  const [browseAll, setBrowseAll] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    API.get(`/programs/university/${universityId}`)
      .then(res => setPrograms(res.data))
      .catch(err => console.error(err));
  }, [universityId]);

  const gradientList = [
    "linear-gradient(135deg, #ff416c, #ff4b2b)",
    "linear-gradient(135deg, #6a11cb, #2575fc)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
    "linear-gradient(135deg, #f7971e, #ffd200)"
  ];

  return (
    <div>
      <h2 style={{
        fontFamily: 'Comic Sans MS, cursive',
        color: theme === 'dark' ? '#fff' : '#111',
        textAlign: 'center'
      }}>
        🎓 Programs Available
      </h2>

      {browseAll ? (
        <HorizontalScroller>
          {programs.map((p, index) => (
            <button
              key={p._id}
              onClick={() => onSelect(p._id)}
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
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {p.name}
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
          {programs.map((p, index) => (
            <button
              key={p._id}
              onClick={() => onSelect(p._id)}
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
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {p.name}
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

export default ProgramList;
