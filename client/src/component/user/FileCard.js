// src/component/user/FileCard.js

import React, { useState } from 'react';
import PreviewModal from './PreviewModal';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/UserDashboard.css';


function FileCard({ file }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { theme } = useTheme();

  const getFileIcon = (type) => {
    if (!type) return '📁';
    if (type.includes('pdf')) return '📕';
    if (type.includes('word') || type.includes('doc')) return '📄';
    if (type.includes('ppt') || type.includes('presentation')) return '📊';
    if (type.includes('image')) return '🖼️';
    if (type.includes('zip') || type.includes('rar')) return '🗜️';
    return '📁';
  };

  /**
   * Returns the correct file extension from MIME type.
   * Used as a fallback when the stored filename has no extension.
   */
  const extFromMime = (mime = '') => {
    const map = {
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.ms-powerpoint': '.ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'application/zip': '.zip',
    };
    return map[mime] || '';
  };

  /**
   * Returns the correct download filename — preserves the original stored name,
   * and appends the extension from MIME type if the name has none.
   */
  const getDownloadName = () => {
    const name = file.name || 'download';
    const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(name);
    return hasExt ? name : name + extFromMime(file.type);
  };

  const handleView = () => setIsPreviewOpen(true);

  /**
   * Cross-origin aware download.
   * Fetches the file as a Blob (bypasses Cloudinary's attachment header
   * and the browser's "ignore download attr for cross-origin" restriction),
   * then triggers save with the correct filename including extension.
   */
  const handleDownload = async () => {
    setDownloading(true);
    const downloadName = getDownloadName();
    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Revoke after a short delay so the download starts
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch {
      // Fallback: open in new tab (browser may still download it)
      window.open(file.url, '_blank');
    } finally {
      setDownloading(false);
    }
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
              disabled={downloading}
              style={{ opacity: downloading ? 0.7 : 1, cursor: downloading ? 'wait' : 'pointer' }}
            >
              {downloading ? '⏳ Downloading...' : '⬇️ Download'}
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
