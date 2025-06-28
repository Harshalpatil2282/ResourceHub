import React from 'react';

function FileCard({ file }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '5px', borderRadius: '8px' }}>
      <b>{file.name}</b> ({file.type})
      <br />
      <a href={file.url} target="_blank" rel="noopener noreferrer">🔗 View</a>
      {file.canDownload && (
        <>
          {" | "}
          <a href={file.url} download>⬇️ Download</a>
        </>
      )}
    </div>
  );
}

export default FileCard;
