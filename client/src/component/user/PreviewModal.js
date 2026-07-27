// src/component/user/PreviewModal.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

/**
 * Derives the correct viewer URL based on file type.
 *
 * - PDF / PPT / PPTX / DOC / DOCX → Google Docs Viewer
 *   Works with any public URL; renders the document inline in an iframe.
 * - Images → direct <img>
 * - Everything else → Google Docs Viewer as fallback
 */
function getViewerUrl(fileUrl, fileType, fileName) {
  const type = (fileType || '').toLowerCase();
  const name = (fileName || '').toLowerCase();

  // Images render natively
  if (type.includes('image')) return null; // signal to render <img>

  // Always route docs through Google Docs Viewer — it handles PDFs,
  // PPT, PPTX, DOC, DOCX and strips Cloudinary attachment headers.
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
}

function PreviewModal({ isOpen, onRequestClose, fileUrl, fileType, fileName }) {
  const viewerUrl = getViewerUrl(fileUrl, fileType, fileName);
  const isImage = (fileType || '').toLowerCase().includes('image');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="File Preview"
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.75)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          inset: 'unset',
          width: '92vw',
          height: '90vh',
          maxWidth: '1100px',
          padding: 0,
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#1e293b',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }
      }}
    >
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{
          color: '#e2e8f0',
          fontWeight: 600,
          fontSize: '0.95rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '80%',
        }}>
          📄 {fileName}
        </span>
        <button
          onClick={onRequestClose}
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.35)',
            color: '#f87171',
            borderRadius: '6px',
            padding: '5px 12px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* Viewer body */}
      <div style={{ width: '100%', height: 'calc(100% - 49px)', background: '#0f172a' }}>
        {isImage ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '16px',
          }}>
            <img
              src={fileUrl}
              alt={fileName}
              style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <iframe
            src={viewerUrl}
            title={fileName}
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block' }}
            allow="fullscreen"
            // Google Docs Viewer loads asynchronously — no onload needed
          />
        )}
      </div>
    </Modal>
  );
}

export default PreviewModal;
