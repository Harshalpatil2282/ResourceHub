import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/VisitorMessagesDashboard.css';

const VisitorMessagesDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/visitor/all-messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/visitor/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/visitor/${messageId}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyMessage: replyText })
      });

      const data = await response.json();
      if (data.success) {
        alert('Reply sent successfully!');
        setReplyText('');
        setSelectedMessage(null);
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply');
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/visitor/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          fetchMessages();
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.read;
    if (filter === 'replied') return msg.replied;
    if (filter === 'pending') return !msg.replied;
    return true;
  });

  if (loading) {
    return (
      <div className="visitor-dashboard" data-theme={theme}>
        <div className="loading-spinner">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="visitor-dashboard" data-theme={theme}>
      <div className="dashboard-header">
        <h1>📧 Visitor Messages</h1>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">{messages.length}</span>
            <span className="stat-label">Total Messages</span>
          </div>
          <div className="stat-card unread">
            <span className="stat-number">{unreadCount}</span>
            <span className="stat-label">Unread</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{messages.filter(m => m.replied).length}</span>
            <span className="stat-label">Replied</span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Messages
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending Reply
          </button>
          <button 
            className={`filter-btn ${filter === 'replied' ? 'active' : ''}`}
            onClick={() => setFilter('replied')}
          >
            Replied
          </button>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="no-messages">
            <p>No messages found</p>
          </div>
        ) : (
          <div className="messages-list">
            {filteredMessages.map(message => (
              <div 
                key={message._id}
                className={`message-card ${!message.read ? 'unread' : ''} ${message.replied ? 'replied' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="message-header">
                  <h3>{message.name}</h3>
                  <span className="message-date">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="message-subject">{message.subject}</p>
                <p className="message-preview">{message.message.substring(0, 100)}...</p>
                <div className="message-footer">
                  <span className="message-email">{message.email}</span>
                  {message.replied && <span className="badge replied">✓ Replied</span>}
                  {!message.read && <span className="badge unread">New</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMessage.subject}</h2>
              <button className="close-btn" onClick={() => setSelectedMessage(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="message-info">
                <div className="info-item">
                  <strong>From:</strong> {selectedMessage.name}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                </div>
                {selectedMessage.phone && (
                  <div className="info-item">
                    <strong>Phone:</strong> {selectedMessage.phone}
                  </div>
                )}
                <div className="info-item">
                  <strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="message-body">
                <h4>Message:</h4>
                <p>{selectedMessage.message}</p>
              </div>

              {selectedMessage.replied && (
                <div className="reply-section">
                  <h4>Your Reply:</h4>
                  <p>{selectedMessage.replyMessage}</p>
                </div>
              )}

              {!selectedMessage.replied && (
                <div className="reply-form">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="5"
                  />
                  <div className="reply-buttons">
                    <button 
                      className="reply-btn"
                      onClick={() => handleReply(selectedMessage._id)}
                    >
                      Send Reply
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(selectedMessage._id)}
                    >
                      Delete Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorMessagesDashboard;
