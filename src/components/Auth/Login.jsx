import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState('');
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
    } catch (error) {
      setError(error.message);
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetStatus('');
    if (!formData.email) {
      return setResetStatus('Please enter your email address first.');
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

      setResetStatus(`✅ A reset email has been sent to ${formData.email}`);
    } catch (error) {
      console.error('Reset request failed:', error);
      setResetStatus(`❌ ${error.message}`);
    }
  };

  return (
    <div className="login-container card">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      {resetStatus && <p className="info-message">{resetStatus}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="reset-password-section">
        <p className="reset-link" onClick={() => setShowReset(!showReset)}>
          Forgot password?
        </p>
        {showReset && (
          <button className="btn secondary" onClick={handleResetPassword}>
            Send Reset Email
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
