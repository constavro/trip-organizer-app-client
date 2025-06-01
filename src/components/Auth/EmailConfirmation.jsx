// src/pages/ConfirmEmail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Auth.css'; // Import common Auth styles

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Confirming your email...');
  const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'error'
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const confirmEmailAction = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/confirm/${token}`);
        const data = await res.json(); // Try to parse JSON for more info, even on error

        if (!isMounted) return;

        if (res.ok) {
          setMessage('✅ Email confirmed successfully!');
          setMessageType('success');
          setIsConfirmed(true);
        } else {
          setMessage(`❌ ${data.message || 'Failed to confirm email.'}`);
          setMessageType('error');
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        if (isMounted) {
          setMessage('Something went wrong. Please try again later.');
          setMessageType('error');
        }
      }
    };

    confirmEmailAction();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="auth-container">
      <header className="auth-brand-header">
        <h1>waylo</h1>
      </header>
      <div className="auth-form-wrapper">
        <div className="auth-form-card"> {/* Use common card style */}
          <h2>Email Confirmation</h2>
          {message && (
            <p className={`message ${messageType}-message`}>{message}</p>
          )}
          {isConfirmed && (
            <button
              className="btn btn-primary" // Assuming .btn-primary is defined globally or via .btn
              onClick={() => navigate('/auth')}
            >
              Proceed to Login
            </button>
          )}
           {!isConfirmed && messageType === 'error' && (
             <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/auth')}
            >
              Go to Homepage
            </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;