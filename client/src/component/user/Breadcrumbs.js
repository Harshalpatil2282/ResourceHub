// src/component/user/Breadcrumbs.js
import React from 'react';

function Breadcrumbs({ university, program, folder, subfolder, clearBelow }) {
  return (
    <div style={{ margin: '10px 0', fontSize: '14px', color: '#555' }}>
      <span
        style={{ cursor: 'pointer', color: university ? '#007bff' : '#555' }}
        onClick={() => clearBelow('university')}
      >
        Home
      </span>
      {university && (
        <>
          {' > '}
          <span
            style={{ cursor: 'pointer', color: program ? '#007bff' : '#555' }}
            onClick={() => clearBelow('program')}
          >
            University
          </span>
        </>
      )}
      {program && (
        <>
          {' > '}
          <span
            style={{ cursor: 'pointer', color: folder ? '#007bff' : '#555' }}
            onClick={() => clearBelow('folder')}
          >
            Program
          </span>
        </>
      )}
      {folder && (
        <>
          {' > '}
          <span
            style={{ cursor: 'pointer', color: subfolder ? '#007bff' : '#555' }}
            onClick={() => clearBelow('subfolder')}
          >
            Semester
          </span>
        </>
      )}
      {subfolder && <> {' > '} <span>Subject</span> </>}
    </div>
  );
}

export default Breadcrumbs;
