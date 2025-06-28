// // src/pages/AdminDashboard.js
// import React, { useState } from 'react';
// import UniversityForm from '../component/admin/UniversityForm';
// import ProgramForm from '../component/admin/ProgramForm';
// import FolderForm from '../component/admin/FolderForm';
// import DragDropUpload from '../component/admin/DragDropUpload';
// import UploadFileToFolder from '../components/admin/UploadFileToFolder';
// import ZipUpload from '../component/admin/ZipUpload';
// import ActivityLog from '../component/admin/ActivityLog';
// import FileListAdmin from '../component/admin/FileListAdmin';



// function AdminDashboard() {
//   const [selectedFolderId, setSelectedFolderId] = useState('');

//   return (
//     <div>
//       <h2>👨‍🏫 Admin Dashboard</h2>

//       {/* Admin Management Forms */}
//       <UniversityForm />
//       <ProgramForm />
//       <FolderForm />
//       <UploadFileToFolder />

//       <hr style={{ margin: '30px 0' }} />

//       {/* Folder ID input */}
//       <h3>📁 Upload Files to Folder</h3>
//       <input
//         type="text"
//         placeholder="Enter Folder ID"
//         value={selectedFolderId}
//         onChange={(e) => setSelectedFolderId(e.target.value)}
//       />

//       {selectedFolderId && (
//         <DragDropUpload folderId={selectedFolderId} />
//       )} 


//       {/* Conditional Upload Components */}
//       {selectedFolderId && (
//         <>
//           <DragDropUpload folderId={selectedFolderId} />
//           <ZipUpload folderId={selectedFolderId} />
//         </>
//       )}

//       <hr style={{ margin: '30px 0' }} />

//       {/* Admin Logs */}
//       <ActivityLog />
//       <FileListAdmin folderId={selectedFolderId} />
//     </div>
//   );
// }

// export default AdminDashboard;
// src/pages/AdminDashboard.js
import React from 'react';
import UniversityForm from '../component/admin/UniversityForm';
import ProgramForm from '../component/admin/ProgramForm';
import FolderForm from '../component/admin/FolderForm';
import UploadFileToFolder from '../component/admin/UploadFileToFolder';
import ActivityLog from '../component/admin/ActivityLog';
import FileListAdmin from '../component/admin/FileListAdmin';

function AdminDashboard() {
  return (
    <div>
      <h2>👨‍🏫 Admin Dashboard</h2>

      {/* Create University, Program, Folder */}
      <UniversityForm />
      <ProgramForm />
      <FolderForm />

      <hr style={{ margin: '30px 0' }} />

      {/* Upload File (Structured Flow) */}
      <UploadFileToFolder />

      <hr style={{ margin: '30px 0' }} />

      {/* Activity Logs and File Management */}
      <ActivityLog />
      <FileListAdmin />
    </div>
  );
}

export default AdminDashboard;
