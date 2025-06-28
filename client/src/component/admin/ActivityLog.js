import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/activities')
      .then(res => setLogs(res.data))
      .catch(err => console.error("Failed to fetch activity logs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading activity logs...</p>;

  return (
    <div>
      <h3>📋 Activity Logs</h3>
      {logs.length === 0 ? (
        <p>No activity logs found.</p>
      ) : (
        <ul>
          {logs.map(log => (
            <li key={log._id}>
              <strong>{log.action?.toUpperCase()}</strong> — 
              File: {log.fileId?.name || "Unknown"} — 
              By: {log.userId?.name || "Unknown"} — 
              At: {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityLog;
