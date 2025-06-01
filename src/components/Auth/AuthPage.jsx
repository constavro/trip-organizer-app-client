import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import './Auth.css';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // To get state passed from navigation

  // Check for messages passed via navigation state (e.g., after signup)
  const infoMessageFromRedirect = location.state?.infoMessage;

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/protected`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        navigate('/trips');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }, [navigate]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  // If coming from a redirect with a message, ensure Login tab is active if relevant
  useEffect(() => {
    if (infoMessageFromRedirect) {
      setShowLogin(true);
    }
  }, [infoMessageFromRedirect]);


  return (
    <div className="auth-container">
      <header className="auth-brand-header">
        <h1>waylo</h1>
      </header>
      <div className="auth-options">
        <button
          className={`btn btn-outline-primary ${showLogin ? 'active' : ''}`}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button
          className={`btn btn-outline-primary ${!showLogin ? 'active' : ''}`}
          onClick={() => setShowLogin(false)}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-form-wrapper">
        {showLogin ? <Login infoMessage={infoMessageFromRedirect} /> : <Signup />}
      </div>
    </div>
  );
};

export default AuthPage;