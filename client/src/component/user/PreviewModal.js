// src/component/user/PreviewModal.js

import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function PreviewModal({ isOpen, onRequestClose, fileUrl, fileType, fileName }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="File Preview"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          padding: '20px'
        }
      }}
    >
      <h2>Preview: {fileName}</h2>
      <button onClick={onRequestClose} style={{ float: 'right' }}>❌ Close</button>
      <div style={{ marginTop: '20px' }}>
        {fileType.includes('pdf') ? (
          <iframe
            src={fileUrl}
            title={fileName}
            width="100%"
            height="500px"
          />
        ) : fileType.includes('image') ? (
          <img
            src={fileUrl}
            alt={fileName}
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        ) : (
          <p>Preview not available for this file type.</p>
        )}
      </div>
    </Modal>
  );
}

export default PreviewModal;
