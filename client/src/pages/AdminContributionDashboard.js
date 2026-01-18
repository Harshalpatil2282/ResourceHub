import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import '../styles/AdminDashboard.css';

const AdminContributionDashboard = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState({});

  const fetchPendingContributions = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/contributions/pending');
      setContributions(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching pending contributions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingContributions();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.post(`/admin/contributions/approve/${id}`);
      toast.success('Contribution approved and added to files.');
      fetchPendingContributions();
    } catch (err) {
      console.error(err);
      toast.error('Error approving contribution.');
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post(`/admin/contributions/reject/${id}`, {
        adminNotes: adminNotes[id] || '',
      });
      toast.info('Contribution rejected.');
      fetchPendingContributions();
    } catch (err) {
      console.error(err);
      toast.error('Error rejecting contribution.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contribution?')) return;
    try {
      await API.delete(`/admin/contributions/${id}`);
      toast.info('Contribution deleted.');
      fetchPendingContributions();
    } catch (err) {
      console.error(err);
      toast.error('Error deleting contribution.');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Pending User Contributions</h2>
      {loading ? (
        <p>Loading contributions...</p>
      ) : contributions.length === 0 ? (
        <p>No pending contributions found.</p>
      ) : (
        <div className="contribution-list">
          {contributions.map((contribution) => (
            <div key={contribution._id} className="contribution-card">
              <h3>{contribution.title}</h3>
              <p><strong>Description:</strong> {contribution.description || 'N/A'}</p>
              <p><strong>User:</strong> {contribution.user?.name} ({contribution.user?.email})</p>
              <p><strong>University:</strong> {contribution.university?.name || 'N/A'}</p>
              <p><strong>Program:</strong> {contribution.program?.name || 'N/A'}</p>
              <p><strong>Folder:</strong> {contribution.folder?.name || 'N/A'}</p>
              <p><strong>Subfolder:</strong> {contribution.subfolder?.name || 'N/A'}</p>
              <a
                href={contribution.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="view-file-link"
              >
                📄 View File
              </a>
              <div className="admin-actions">
                <button onClick={() => handleApprove(contribution._id)} className="approve-btn">
                  ✅ Approve
                </button>
                <button onClick={() => handleReject(contribution._id)} className="reject-btn">
                  ❌ Reject
                </button>
                <button onClick={() => handleDelete(contribution._id)} className="delete-btn">
                  🗑️ Delete
                </button>
              </div>
              <textarea
                placeholder="Optional rejection notes..."
                value={adminNotes[contribution._id] || ''}
                onChange={(e) =>
                  setAdminNotes({ ...adminNotes, [contribution._id]: e.target.value })
                }
                className="notes-textarea"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContributionDashboard;
