// src/component/user/FileCard.js

import React, { useState } from 'react';
import PreviewModal from './PreviewModal';

function FileCard({ file }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📕';
    if (type.includes('word') || type.includes('doc')) return '📄';
    if (type.includes('ppt')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📁';
  };

  const handleView = () => {
    setIsPreviewOpen(true);
  };

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
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fafafa'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '10px' }}>
            {getFileIcon(file.type)}
          </span>
          <div>
            <div style={{ fontWeight: 'bold' }}>{file.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {new Date(file.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleView}
            style={{
              padding: '5px 10px',
              marginRight: '5px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#007bff',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            👁️ Preview
          </button>

          {file.canDownload ? (
            <button
              onClick={handleDownload}
              style={{
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#28a745',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              ⬇️ Download
            </button>
          ) : (
            <span style={{ color: 'red', fontSize: '12px' }}>View Only</span>
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
