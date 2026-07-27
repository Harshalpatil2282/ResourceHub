import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Data States
  const [stats, setStats] = useState({ universities: 0, programs: 0, folders: 0, files: 0 });
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Forms States
  const [newUniName, setNewUniName] = useState('');
  const [newProgram, setNewProgram] = useState({ name: '', universityId: '' });
  const [newFolder, setNewFolder] = useState({ name: '', universityId: '', programId: '', parentFolderId: '' });
  const [uploadData, setUploadData] = useState({ folderId: '', canDownload: true });
  const [selectedFile, setSelectedFile] = useState(null);

  // Selection states for cascading dropdowns
  const [selectedUniForProg, setSelectedUniForProg] = useState('');

  // File navigator state (University → Program → Semester → Subject)
  const [fileNav, setFileNav] = useState({ uniId: '', progId: '', semId: '', subjectId: '' });
  const [fileNavPrograms, setFileNavPrograms] = useState([]);
  const [fileNavSemesters, setFileNavSemesters] = useState([]);
  const [fileNavSubjects, setFileNavSubjects] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Inline Confirmations
  const [confirmDeleteFile, setConfirmDeleteFile] = useState(null);
  const [confirmDeleteMessage, setConfirmDeleteMessage] = useState(null);

  // Reply Message
  const [replyMessageId, setReplyMessageId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const showToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchUniversities(); fetchMessages(); }, []);

  useEffect(() => {
    if (activeTab === 'overview') fetchStats();
    if (activeTab === 'activity') fetchActivities();
    if (activeTab === 'folders') fetchAllFoldersDetailed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Fetches
  const fetchUniversities = useCallback(async () => {
    try {
      const res = await API.get('/universities');
      setUniversities(res.data);
    } catch (err) {
      showToast('Failed to load universities', 'error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const uRes = await API.get('/universities').catch(() => ({ data: [] }));
      const pRes = await API.get('/programs/university/all').catch(() => ({ data: [] }));
      const fRes = await API.get('/folders/detailed').catch(() => ({ data: [] }));
      setStats({
        universities: uRes.data.length || 0,
        programs: pRes.data?.length || 0,
        folders: fRes.data?.length || 0,
        files: 0 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrograms = async (uniId) => {
    if (!uniId) {
      setPrograms([]);
      return;
    }
    try {
      const res = await API.get(`/programs/university/${uniId}`);
      setPrograms(res.data);
    } catch (err) {
      showToast('Failed to load programs', 'error');
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFoldersByProg = useCallback(async (progId) => {
    if (!progId) { setFolders([]); return; }
    try {
      const res = await API.get('/folders/detailed');
      setFolders(res.data.filter(f => f.program && f.program._id === progId));
    } catch (err) {
      showToast('Failed to load folders', 'error');
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAllFoldersDetailed = useCallback(async () => {
    try {
      const res = await API.get('/folders/detailed');
      setFolders(res.data);
    } catch (err) {
      showToast('Failed to load folders', 'error');
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFiles = useCallback(async (folderId) => {
    if (!folderId) { setFiles([]); return; }
    try {
      const res = await API.get(`/files/folder/${folderId}`);
      setFiles(res.data);
    } catch (err) {
      showToast('Failed to load files', 'error');
    }
  }, []);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchActivities = useCallback(async () => {
    try {
      const res = await API.get('/activities');
      setActivities(res.data);
    } catch (err) {
      showToast('Failed to load activities', 'error');
    }
  }, []);


  const fetchMessages = useCallback(async () => {
    try {
      const res = await API.get('/visitor/all-messages');
      setMessages(res.data);
      const unreadRes = await API.get('/visitor/unread-count');
      setUnreadCount(unreadRes.data.count || 0);
    } catch (err) {
      console.error(err); // messages may not exist on first load
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleAddUniversity = async (e) => {
    e.preventDefault();
    if (!newUniName) return;
    try {
      await API.post('/universities', { name: newUniName });
      showToast('University added');
      setNewUniName('');
      fetchUniversities();
    } catch (err) {
      showToast('Error adding university', 'error');
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    if (!newProgram.name || !newProgram.universityId) return;
    try {
      await API.post('/programs', { name: newProgram.name, universityId: newProgram.universityId });
      showToast('Program added');
      setNewProgram({ name: '', universityId: newProgram.universityId });
      if (selectedUniForProg === newProgram.universityId) fetchPrograms(newProgram.universityId);
    } catch (err) {
      showToast('Error adding program', 'error');
    }
  };

  const handleAddFolder = async (e) => {
    e.preventDefault();
    if (!newFolder.name || !newFolder.universityId || !newFolder.programId) return;
    try {
      await API.post('/folders', newFolder);
      showToast('Folder created');
      setNewFolder({ ...newFolder, name: '' });
      fetchAllFoldersDetailed();
    } catch (err) {
      showToast('Error creating folder', 'error');
    }
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!selectedFile || !uploadData.folderId) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('folderId', uploadData.folderId);
    formData.append('canDownload', uploadData.canDownload);
    setUploading(true);
    try {
      await API.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('✅ File uploaded successfully');
      setSelectedFile(null);
      const inp = document.getElementById('adminFileInput');
      if (inp) inp.value = '';
      fetchFiles(uploadData.folderId);
    } catch (err) {
      showToast('❌ Upload failed: ' + (err.response?.data?.msg || err.message), 'error');
    } finally {
      setUploading(false);
    }
  };


  const handleDeleteFile = async (id) => {
    try {
      await API.delete(`/files/${id}`);
      showToast('File deleted');
      setConfirmDeleteFile(null);
      fetchFiles(uploadData.folderId);
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const handleReplyMessage = async (id) => {
    try {
      await API.put(`/visitor/${id}/reply`, { replyMessage: replyText });
      showToast('Reply sent');
      setReplyMessageId(null);
      setReplyText('');
      fetchMessages();
    } catch (err) {
      showToast('Reply failed', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await API.delete(`/visitor/${id}`);
      showToast('Message deleted');
      setConfirmDeleteMessage(null);
      fetchMessages();
    } catch (err) {
      showToast('Failed to delete message', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Render Helpers
  const renderNav = () => (
    <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="icon">🚀</span> AdminHub
      </div>
      <div className="sidebar-nav">
        {[
          { id: 'overview', icon: '📊', label: 'Overview' },
          { id: 'universities', icon: '🏫', label: 'Universities' },
          { id: 'programs', icon: '📚', label: 'Programs' },
          { id: 'folders', icon: '📂', label: 'Folders' },
          { id: 'files', icon: '📁', label: 'Files & Upload' },
          { id: 'activity', icon: '📋', label: 'Activity Log' },
          { id: 'messages', icon: '💬', label: `Messages ${unreadCount > 0 ? `(${unreadCount})` : ''}` },
        ].map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(item.id); closeSidebar(); }}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
        <button className="nav-item logout" onClick={handleLogout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {sidebarOpen && <div className="sidebar-overlay open" onClick={() => setSidebarOpen(false)}></div>}
      
      {renderNav()}

      <div className="admin-main">
        <div className="admin-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 className="header-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="header-actions">
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="panel">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏫</div>
                  <div className="stat-info">
                    <h3>{stats.universities}</h3>
                    <p>Total Universities</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <h3>{stats.programs}</h3>
                    <p>Total Programs</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📂</div>
                  <div className="stat-info">
                    <h3>{stats.folders}</h3>
                    <p>Total Folders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📁</div>
                  <div className="stat-info">
                    <h3>{stats.files}</h3>
                    <p>Total Files</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'universities' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Manage Universities</h2>
              </div>
              <form onSubmit={handleAddUniversity} className="glass-form" style={{ marginBottom: '24px' }}>
                <div className="form-group">
                  <label>University Name</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="Enter name..." 
                    value={newUniName} 
                    onChange={e => setNewUniName(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn-primary">Add University</button>
              </form>

              <div className="card-grid">
                {universities.map(u => (
                  <div key={u._id} className="item-card">
                    <div className="item-title">{u.name}</div>
                    <div className="item-badge">ID: {u._id.substring(0, 8)}...</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Manage Programs</h2>
              </div>
              
              <div className="glass-form" style={{ marginBottom: '24px' }}>
                <div className="form-group">
                  <label>Filter by University</label>
                  <select 
                    className="glass-select" 
                    value={selectedUniForProg} 
                    onChange={e => {
                      setSelectedUniForProg(e.target.value);
                      fetchPrograms(e.target.value);
                    }}
                  >
                    <option value="">-- Select University --</option>
                    {universities.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <form onSubmit={handleAddProgram} className="glass-form" style={{ marginBottom: '24px', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="form-group">
                  <label>Add New Program to University</label>
                  <select 
                    className="glass-select" 
                    value={newProgram.universityId}
                    onChange={e => setNewProgram({...newProgram, universityId: e.target.value})}
                    required
                  >
                    <option value="">-- Select University --</option>
                    {universities.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Program Name</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="E.g. Computer Science" 
                    value={newProgram.name}
                    onChange={e => setNewProgram({...newProgram, name: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Add Program</button>
              </form>

              <div className="card-grid">
                {programs.map(p => (
                  <div key={p._id} className="item-card">
                    <div className="item-title">{p.name}</div>
                    <div className="item-badge">Prog ID: {p._id.substring(0, 8)}...</div>
                  </div>
                ))}
                {programs.length === 0 && selectedUniForProg && <p>No programs found.</p>}
              </div>
            </div>
          )}

          {activeTab === 'folders' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Manage Folders</h2>
              </div>
              
              <form onSubmit={handleAddFolder} className="glass-form" style={{ marginBottom: '32px' }}>
                <div className="form-group">
                  <label>University</label>
                  <select 
                    className="glass-select" 
                    value={newFolder.universityId}
                    onChange={e => {
                      setNewFolder({...newFolder, universityId: e.target.value, programId: ''});
                      fetchPrograms(e.target.value);
                    }}
                    required
                  >
                    <option value="">-- Select --</option>
                    {universities.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Program</label>
                  <select 
                    className="glass-select" 
                    value={newFolder.programId}
                    onChange={e => setNewFolder({...newFolder, programId: e.target.value})}
                    required
                    disabled={!newFolder.universityId}
                  >
                    <option value="">-- Select --</option>
                    {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Parent Folder (Optional)</label>
                  <select 
                    className="glass-select" 
                    value={newFolder.parentFolderId}
                    onChange={e => setNewFolder({...newFolder, parentFolderId: e.target.value})}
                  >
                    <option value="">-- Root (None) --</option>
                    {folders.filter(f => f.program && f.program._id === newFolder.programId).map(f => (
                      <option key={f._id} value={f._id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Folder Name</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    value={newFolder.name}
                    onChange={e => setNewFolder({...newFolder, name: e.target.value})}
                    required 
                  />
                </div>
                <button type="submit" className="btn-primary">Create Folder</button>
              </form>

              <h3>All Folders Detailed</h3>
              <div className="card-grid">
                {folders.map(f => (
                  <div key={f._id} className="item-card">
                    <div className="item-title">📁 {f.name}</div>
                    <div className="item-badge">{f.university?.name || 'Unknown Uni'}</div>
                    <div className="item-badge">{f.program?.name || 'Unknown Prog'}</div>
                    {f.parentFolder && <div className="item-badge">Parent ID: {f.parentFolder.substring(0,6)}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'files' && (() => {
            return (
              <div className="admin-panel">
                <div className="panel-header">
                  <h2>📁 Files &amp; Upload</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '4px 0 0' }}>
                    Navigate the folder hierarchy, then drag &amp; drop or click to upload files
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  {[
                    { label: 'University', value: fileNav.uniId ? universities.find(u => u._id === fileNav.uniId)?.name : null },
                    { label: 'Program',    value: fileNav.progId ? fileNavPrograms.find(p => p._id === fileNav.progId)?.name : null },
                    { label: 'Semester',   value: fileNav.semId ? fileNavSemesters.find(f => f._id === fileNav.semId)?.name : null },
                    { label: 'Subject',    value: fileNav.subjectId ? fileNavSubjects.find(f => f._id === fileNav.subjectId)?.name : null },
                  ].map((step, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span style={{ color: 'var(--text-secondary)' }}>›</span>}
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: step.value ? 'linear-gradient(135deg,var(--accent-start),var(--accent-end))' : 'rgba(255,255,255,0.05)',
                        color: step.value ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid ' + (step.value ? 'transparent' : 'var(--border)'),
                      }}>
                        {step.value || step.label}
                      </span>
                    </React.Fragment>
                  ))}
                  {(fileNav.uniId) && (
                    <button
                      onClick={() => {
                        setFileNav({ uniId: '', progId: '', semId: '', subjectId: '' });
                        setFileNavPrograms([]); setFileNavSemesters([]); setFileNavSubjects([]);
                        setUploadData({ folderId: '', canDownload: true });
                        setFiles([]);
                      }}
                      style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      ↺ Reset
                    </button>
                  )}
                </div>

                <div className="glass-form" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>🏫 Step 1 — Select University</label>
                    <select
                      className="glass-select"
                      value={fileNav.uniId}
                      onChange={async e => {
                        const uniId = e.target.value;
                        setFileNav({ uniId, progId: '', semId: '', subjectId: '' });
                        setFileNavPrograms([]); setFileNavSemesters([]); setFileNavSubjects([]);
                        setUploadData({ folderId: '', canDownload: true });
                        setFiles([]);
                        if (!uniId) return;
                        try {
                          const res = await API.get(`/programs/university/${uniId}`);
                          setFileNavPrograms(res.data);
                        } catch { showToast('Failed to load programs', 'error'); }
                      }}
                    >
                      <option value="">-- Select University --</option>
                      {universities.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>

                {fileNav.uniId && (
                  <div className="glass-form" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label>📚 Step 2 — Select Program</label>
                      <select
                        className="glass-select"
                        value={fileNav.progId}
                        onChange={async e => {
                          const progId = e.target.value;
                          setFileNav(n => ({ ...n, progId, semId: '', subjectId: '' }));
                          setFileNavSemesters([]); setFileNavSubjects([]);
                          setUploadData({ folderId: '', canDownload: true });
                          setFiles([]);
                          if (!progId) return;
                          try {
                            const res = await API.get(`/folders/program/${progId}`);
                            setFileNavSemesters(res.data);
                          } catch { showToast('Failed to load semesters', 'error'); }
                        }}
                      >
                        <option value="">-- Select Program --</option>
                        {fileNavPrograms.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {fileNav.progId && (
                  <div className="glass-form" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label>📂 Step 3 — Select Semester <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(you can upload here directly)</span></label>
                      {fileNavSemesters.length === 0
                        ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No semester folders found. Create them in the Folders tab first.</p>
                        : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                            {fileNavSemesters.map(sem => (
                              <button
                                key={sem._id}
                                onClick={async () => {
                                  const semId = sem._id;
                                  setFileNav(n => ({ ...n, semId, subjectId: '' }));
                                  setFileNavSubjects([]);
                                  setUploadData(d => ({ ...d, folderId: semId }));
                                  fetchFiles(semId);
                                  try {
                                    const res = await API.get(`/folders/subfolders/${semId}`);
                                    setFileNavSubjects(res.data);
                                  } catch { }
                                }}
                                style={{
                                  padding: '10px 18px',
                                  borderRadius: '8px',
                                  border: '2px solid ' + (fileNav.semId === sem._id ? 'var(--accent-start)' : 'var(--border)'),
                                  background: fileNav.semId === sem._id ? 'linear-gradient(135deg,var(--accent-start),var(--accent-end))' : 'rgba(255,255,255,0.05)',
                                  color: fileNav.semId === sem._id ? '#fff' : 'var(--text-primary)',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  fontSize: '0.9rem',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                📂 {sem.name}
                              </button>
                            ))}
                          </div>
                        )
                      }
                    </div>
                  </div>
                )}

                {fileNav.semId && fileNavSubjects.length > 0 && (
                  <div className="glass-form" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label>📖 Step 4 — Select Subject <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional — or upload directly to semester above)</span></label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                        {fileNavSubjects.map(sub => (
                          <button
                            key={sub._id}
                            onClick={() => {
                              setFileNav(n => ({ ...n, subjectId: sub._id }));
                              setUploadData(d => ({ ...d, folderId: sub._id }));
                              fetchFiles(sub._id);
                            }}
                            style={{
                              padding: '10px 18px',
                              borderRadius: '8px',
                              border: '2px solid ' + (fileNav.subjectId === sub._id ? '#10b981' : 'var(--border)'),
                              background: fileNav.subjectId === sub._id ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                              color: fileNav.subjectId === sub._id ? '#10b981' : 'var(--text-primary)',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              transition: 'all 0.2s',
                            }}
                          >
                            📖 {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {uploadData.folderId && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '12px', padding: '10px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      📌 Uploading to: <strong>
                        {fileNav.subjectId
                          ? `${fileNavSemesters.find(s=>s._id===fileNav.semId)?.name} › ${fileNavSubjects.find(s=>s._id===fileNav.subjectId)?.name}`
                          : fileNavSemesters.find(s=>s._id===fileNav.semId)?.name
                        }
                      </strong>
                    </div>

                    <form onSubmit={handleUploadFile}>
                      <div
                        id="dropZone"
                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                        onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
                        onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
                        onDrop={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOver(false);
                          const dropped = e.dataTransfer.files[0];
                          if (dropped) setSelectedFile(dropped);
                        }}
                        onClick={() => document.getElementById('adminFileInput').click()}
                        style={{
                          border: `2px dashed ${dragOver ? 'var(--accent-start)' : selectedFile ? '#10b981' : 'var(--border)'}`,
                          borderRadius: '12px',
                          padding: '40px 20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: dragOver
                            ? 'rgba(99,102,241,0.08)'
                            : selectedFile
                              ? 'rgba(16,185,129,0.06)'
                              : 'rgba(255,255,255,0.02)',
                          transition: 'all 0.2s ease',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                          {dragOver ? '📂' : selectedFile ? '✅' : '☁️'}
                        </div>
                        <div style={{ color: selectedFile ? '#10b981' : 'var(--text-secondary)', fontWeight: 600 }}>
                          {dragOver
                            ? 'Drop it here!'
                            : selectedFile
                              ? selectedFile.name
                              : 'Drag & Drop a file here, or click to browse'}
                        </div>
                        {selectedFile && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                            {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || 'unknown type'}
                          </div>
                        )}
                        <input
                          id="adminFileInput"
                          type="file"
                          style={{ display: 'none' }}
                          onChange={e => setSelectedFile(e.target.files[0])}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={uploadData.canDownload}
                            onChange={e => setUploadData({ ...uploadData, canDownload: e.target.checked })}
                          />
                          <span className="toggle-slider"></span>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                            {uploadData.canDownload ? '✅ Allow Download' : '🔒 View Only'}
                          </span>
                        </label>

                        <button
                          type="submit"
                          className="btn-success"
                          disabled={!selectedFile || uploading}
                          style={{ flex: 1, minWidth: '160px', opacity: (!selectedFile || uploading) ? 0.6 : 1 }}
                        >
                          {uploading ? '⏳ Uploading...' : '⬆️ Upload File'}
                        </button>

                        {selectedFile && (
                          <button
                            type="button"
                            onClick={() => { setSelectedFile(null); document.getElementById('adminFileInput').value = ''; }}
                            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer' }}
                          >
                            ✕ Clear
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {uploadData.folderId && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                        🗂️ Files in folder ({files.length})
                      </h3>
                      <button
                        onClick={() => fetchFiles(uploadData.folderId)}
                        style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ↺ Refresh
                      </button>
                    </div>

                    {files.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed var(--border)' }}>
                        📭 No files in this folder yet
                      </div>
                    ) : (
                      <div className="card-grid">
                        {files.map(file => {
                          const ext = file.name?.split('.').pop()?.toLowerCase() || '';
                          const icon = ext === 'pdf' ? '📕' : ['ppt','pptx'].includes(ext) ? '📊' : ['doc','docx'].includes(ext) ? '📄' : ['jpg','jpeg','png','gif'].includes(ext) ? '🖼️' : ['zip','rar'].includes(ext) ? '🗜️' : '📁';
                          const badgeColor = ext === 'pdf' ? '#ef4444' : ['ppt','pptx'].includes(ext) ? '#f97316' : ['doc','docx'].includes(ext) ? '#3b82f6' : '#6366f1';
                          return (
                            <div key={file._id} className="item-card" style={{ position: 'relative' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.875rem', wordBreak: 'break-word', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                                    {file.name || 'Unnamed'}
                                  </div>
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, background: badgeColor + '22', color: badgeColor, border: `1px solid ${badgeColor}44` }}>
                                      .{ext.toUpperCase() || 'FILE'}
                                    </span>
                                    {file.size && (
                                      <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                                        {(file.size / 1024).toFixed(1)} KB
                                      </span>
                                    )}
                                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', background: file.canDownload ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: file.canDownload ? '#10b981' : '#ef4444' }}>
                                      {file.canDownload ? '⬇ Downloadable' : '👁 View Only'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="file-actions" style={{ marginTop: '12px' }}>
                                <a href={file.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, padding: '6px', fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}>
                                  👁 View
                                </a>
                                <button onClick={() => setConfirmDeleteFile(file._id)} className="btn-danger" style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}>
                                  🗑 Delete
                                </button>
                              </div>

                              {confirmDeleteFile === file._id && (
                                <div className="inline-confirm">
                                  <p>Delete <strong>{file.name}</strong>?</p>
                                  <div className="inline-confirm-actions">
                                    <button className="btn-danger" onClick={() => handleDeleteFile(file._id)}>Yes, Delete</button>
                                    <button className="btn-secondary" onClick={() => setConfirmDeleteFile(null)}>Cancel</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'activity' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Recent Activity</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>User</th>
                      <th>Details</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(act => (
                      <tr key={act._id}>
                        <td>
                          <span className={`type-badge ${act.action?.toLowerCase()}`}>
                            {act.action}
                          </span>
                        </td>
                        <td>{act.user?.name || act.user?.email || 'Unknown'}</td>
                        <td>{act.details}</td>
                        <td>{new Date(act.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                    {activities.length === 0 && (
                      <tr><td colSpan="4" style={{ textAlign: 'center' }}>No activities found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Visitor Messages</h2>
              </div>
              <div>
                {messages.map(msg => (
                  <div key={msg._id} className="message-card" style={{ borderLeft: msg.isRead ? '' : '4px solid var(--accent-start)' }}>
                    <div className="message-header">
                      <strong>{msg.name} ({msg.email})</strong>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="message-body">{msg.message}</div>
                    
                    {msg.replyMessage && (
                      <div className="message-reply-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7' }}>
                        <strong>Reply: </strong> {msg.replyMessage}
                      </div>
                    )}

                    <div className="message-actions">
                      {!msg.replyMessage && replyMessageId !== msg._id && (
                        <button className="btn-primary" onClick={() => setReplyMessageId(msg._id)}>Reply</button>
                      )}
                      <button className="btn-danger" onClick={() => setConfirmDeleteMessage(msg._id)}>Delete</button>
                    </div>

                    {replyMessageId === msg._id && (
                      <div className="message-reply-box">
                        <textarea 
                          className="glass-textarea" 
                          placeholder="Type your reply here..." 
                          value={replyText} 
                          onChange={e => setReplyText(e.target.value)} 
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-success" onClick={() => handleReplyMessage(msg._id)}>Send Reply</button>
                          <button className="btn-secondary" onClick={() => setReplyMessageId(null)}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {confirmDeleteMessage === msg._id && (
                      <div className="inline-confirm" style={{ maxWidth: '300px' }}>
                        <p>Delete this message permanently?</p>
                        <div className="inline-confirm-actions">
                          <button className="btn-danger" onClick={() => handleDeleteMessage(msg._id)}>Yes</button>
                          <button className="btn-secondary" onClick={() => setConfirmDeleteMessage(null)}>No</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {messages.length === 0 && <p>No messages available.</p>}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' && <span>✅</span>}
            {t.type === 'error' && <span>❌</span>}
            {t.type === 'info' && <span>ℹ️</span>}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
