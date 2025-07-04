// src/component/user/FileCard.js

import React, { useState } from 'react';
import PreviewModal from './PreviewModal';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/UserDashboard.css';


function FileCard({ file }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { theme } = useTheme();

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📕';
    if (type.includes('word') || type.includes('doc')) return '📄';
    if (type.includes('ppt')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📁';
  };

  const handleView = () => setIsPreviewOpen(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div
        className="glass-card file-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          background: theme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.4)',
        }}
        onClick={handleView}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 4px 12px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>{getFileIcon(file.type)}</span>
          <div>
            <div
              style={{
                fontWeight: 'bold',
                color: theme === 'dark' ? '#fff' : '#111',
                wordBreak: 'break-word',
              }}
            >
              {file.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: theme === 'dark' ? '#ccc' : '#555' }}>
              {new Date(file.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); handleView(); }}
            className="glass-button"
          >
            👁️ Preview
          </button>
          {file.canDownload ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              className="glass-button"
            >
              ⬇️ Download
            </button>
          ) : (
            <span style={{ color: 'red', fontSize: '0.75rem' }}>View Only</span>
          )}
        </div>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={() => setIsPreviewOpen(false)}
        fileUrl={file.url}
        fileType={file.type}
        fileName={file.name}
      />
    </>
  );
}

export default FileCard;
