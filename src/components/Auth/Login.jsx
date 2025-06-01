import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ infoMessage: initialInfoMessage }) { // Accept infoMessage prop
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState('');
  const [resetStatusType, setResetStatusType] = useState('info'); // 'info' or 'error'
  const [showReset, setShowReset] = useState(false);
  const [currentInfoMessage, setCurrentInfoMessage] = useState(initialInfoMessage);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentInfoMessage(initialInfoMessage); // Update if prop changes
  }, [initialInfoMessage]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
    setResetStatus(''); // Clear reset status on input change
    if (currentInfoMessage && e.target.name === 'email') { // Clear general info message on email interaction
        setCurrentInfoMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetStatus('');
    setCurrentInfoMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      navigate('/trips');
    } catch (err) { // Renamed to avoid conflict with outer error state
      setError(err.message);
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetStatus('');
    setError('');
    setCurrentInfoMessage('');
    if (!formData.email) {
      setResetStatus('Please enter your email address first to request a password reset.');
      setResetStatusType('error');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to send reset email');
      }

      setResetStatus(`✅ A reset email has been sent to ${formData.email}. Please check your inbox.`);
      setResetStatusType('success'); // Use success for positive outcome
    } catch (err) {
      console.error('Reset request failed:', err);
      setResetStatus(`❌ ${err.message}`);
      setResetStatusType('error');
    }
  };

  return (
    <div className="auth-form-card"> {/* Use common card style */}
      <h1>Login</h1>
      {currentInfoMessage && <p className="message info-message">{currentInfoMessage}</p>}
      {error && <p className="message error-message">{error}</p>}
      {resetStatus && <p className={`message ${resetStatusType}-message`}>{resetStatus}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label> {/* Unique ID for label */}
          <input
            type="email"
            name="email"
            id="login-email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label> {/* Unique ID for label */}
          <input
            type="password"
            name="password"
            id="login-password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}> {/* Added .btn-primary for global styling consistency */}
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="reset-password-section">
        <p className="reset-link" onClick={() => setShowReset(!showReset)}>
          Forgot password?
        </p>
        {showReset && (
          <button className="btn btn-outline-primary" onClick={handleResetPassword}>
            Send Reset Email
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;