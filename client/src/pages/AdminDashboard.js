import React from 'react';
import UniversityForm from '../component/admin/UniversityForm';
import ProgramForm from '../component/admin/ProgramForm';
import FolderForm from '../component/admin/FolderForm';
import ActivityLog from '../component/admin/ActivityLog';
import AdminManageFiles from '../component/admin/AdminManageFiles';

function AdminDashboard() {
  return (
    <div>
      <h2>👨‍🏫 Admin Dashboard</h2>
      <UniversityForm />
      <ProgramForm />
      <FolderForm />
      <hr style={{ margin: '30px 0' }} />
      <AdminManageFiles />
      <hr style={{ margin: '30px 0' }} />
      <ActivityLog />
    </div>
  );
}

export default AdminDashboard;
