import React, { useEffect, useState } from 'react';
import API from '../../services/api';

function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get('/activity').then(res => setLogs(res.data));
  }, []);

  return (
    <div>
      <h3>📋 Activity Logs</h3>
      <ul>
        {logs.map(log => (
          <li key={log._id}>
            <strong>{log.action.toUpperCase()}</strong> — File: {log.fileId.name} — By: {log.userId.name} — At: {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLog;
