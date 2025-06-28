import React, { useState } from 'react';
import UniversitySelector from '../component/user/UniversitySelector';
import ProgramList from '../component/user/ProgramList';
import FolderList from '../component/user/FolderList';
import FileListUser from '../component/user/FileListUser';
import SubfolderList from '../component/user/SubfolderList';

function UserDashboard() {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedSubfolder, setSelectedSubfolder] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h1>📚 ResourceHub by Harsh Patil</h1>
      <p>Your one-stop academic resource hub for PDFs, Notes, PPTs, and more.</p>
      <hr />

      <UniversitySelector onSelect={setSelectedUniversity} />

      {selectedUniversity && (
        <ProgramList
          universityId={selectedUniversity}
          onSelect={setSelectedProgram}
        />
      )}

      {selectedProgram && (
        <FolderList
          programId={selectedProgram}
          onSelect={setSelectedFolder}
        />
      )}

      {selectedFolder && (
        <FileListUser folderId={selectedFolder} />
      )}
      {selectedFolder && !selectedSubfolder && (
        <SubfolderList
          parentFolderId={selectedFolder}
          onSelect={setSelectedSubfolder}
        />
      )}

      {selectedSubfolder && (
        <FileListUser folderId={selectedSubfolder} />
      )}
    </div>
  );
}

export default UserDashboard;
