import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      // Navigate to auth page (login) with an info message
      navigate('/auth', { 
        state: { 
          infoMessage: '🎉 Signup successful! Please check your email to confirm your account. After confirmation, you can log in.' 
        } 
      });
    } catch (err) { // Renamed to avoid conflict with outer error state
      setError(err.message);
      console.error('Signup failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-card"> {/* Use common card style */}
      <h1>Signup</h1>
      {error && <p className="message error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="signup-firstName">First Name</label> {/* Unique ID for label */}
          <input
            type="text"
            name="firstName"
            id="signup-firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-lastName">Last Name</label> {/* Unique ID for label */}
          <input
            type="text"
            name="lastName"
            id="signup-lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter your last name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email</label> {/* Unique ID for label */}
          <input
            type="email"
            name="email"
            id="signup-email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password</label> {/* Unique ID for label */}
          <input
            type="password"
            name="password"
            id="signup-password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password (min. 6 characters)"
            minLength="6" // Basic client-side validation
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}> {/* Added .btn-primary */}
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
}

export default Signup;