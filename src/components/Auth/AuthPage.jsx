import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import './AuthPage.css';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true); // State to toggle between login and signup
  const navigate = useNavigate();

  // Function to verify token and navigate
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
        navigate('/trips'); // Navigate to trips page if the token is valid
      } else {
        localStorage.removeItem('token'); // Remove invalid/expired token
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
    }
  }, [navigate]);

  // Verify token on initial load
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <div className="auth-container">
      <header className="auth-header">
        <h1>waylo</h1>
        <div className="auth-options">
          <button
            className={showLogin ? 'active' : ''}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={!showLogin ? 'active' : ''}
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Conditional rendering for Login and Signup */}
      <div className="auth-form">
        {showLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
};

export default AuthPage;