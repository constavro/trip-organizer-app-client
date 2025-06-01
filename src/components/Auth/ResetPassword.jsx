// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Auth.css'; // Import common Auth styles

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'error'
  const [loading, setLoading] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }
    if (newPassword.length < 6) { // Example validation
        setMessage('Password must be at least 6 characters long.');
        setMessageType('error');
        return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Password reset successful!');
        setMessageType('success');
        setIsResetDone(true);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(`❌ ${data.message || 'Failed to reset password.'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Something went wrong. Please try again later.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-brand-header">
        <h1>waylo</h1>
      </header>
      <div className="auth-form-wrapper">
        <div className="auth-form-card">
          <h2>Reset Password</h2>
          {message && (
            <p className={`message ${messageType}-message`}>{message}</p>
          )}

          {!isResetDone ? (
            <form onSubmit={handleReset}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/auth')}
            >
              Proceed to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;