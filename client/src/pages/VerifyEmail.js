import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        setMsg(res.data.msg || "✅ Email verified successfully. Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (err) {
        setMsg(err.response?.data?.msg || "❌ Verification failed or link expired.");
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="login-container">
      <div className="card">
        <h2>📧 Email Verification</h2>
        <p>{msg}</p>
        <p>You will be redirected to login shortly...</p>
      </div>
    </div>
  );
}

export default VerifyEmail;
