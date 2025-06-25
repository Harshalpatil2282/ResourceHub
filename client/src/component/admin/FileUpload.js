// // src/components/admin/FileUpload.js
// import React, { useState } from 'react';
// import API from '../../services/api';

// function FileUpload({ folderId }) {
//   const [file, setFile] = useState(null);
//   const [canDownload, setCanDownload] = useState(true);
//   const [msg, setMsg] = useState('');

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file || !folderId) return;

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('folderId', folderId);
//     formData.append('canDownload', canDownload);

//     try {
//       await API.post('/files/upload', formData);
//       setMsg('File uploaded!');
//     } catch (err) {
//       setMsg('Upload failed');
//     }
//   };

//   return (
//     <div>
//       <h4>Upload File</h4>
//       <form onSubmit={handleUpload}>
//         <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//         <label>
//           <input
//             type="checkbox"
//             checked={canDownload}
//             onChange={(e) => setCanDownload(e.target.checked)}
//           /> Can Download?
//         </label>
//         <button type="submit">Upload</button>
//       </form>
//       <p>{msg}</p>
//     </div>
//   );
// }

// export default FileUpload;
