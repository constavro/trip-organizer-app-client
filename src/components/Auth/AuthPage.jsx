import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import './Auth.css'; // Changed import

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

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
        localStorage.removeItem('userId'); // Also remove userId if token is invalid
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

  return (
    <div className="auth-container">
      <header className="auth-brand-header"> {/* Changed class */}
        <h1>waylo</h1>
      </header>
      <div className="auth-options">
        <button
          className={`btn btn-outline-primary ${showLogin ? 'active' : ''}`} // Applied btn classes
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button
          className={`btn btn-outline-primary ${!showLogin ? 'active' : ''}`} // Applied btn classes
          onClick={() => setShowLogin(false)}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-form-wrapper"> {/* Added wrapper */}
        {showLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
};

export default AuthPage;