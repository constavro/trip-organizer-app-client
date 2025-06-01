// src/components/Users/UserProfile/ChangePasswordForm.jsx
import React, { useState } from 'react';
// CSS is imported by UserProfile.jsx

const ChangePasswordForm = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Kept for local success message
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
        setError('All password fields are required.');
        setLoading(false);
        return;
    }
    if (newPassword.length < 6) { // UX: Basic password strength
        setError('New password must be at least 6 characters long.');
        setLoading(false);
        return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication error. Please log in again.");
        setLoading(false);
        return;
      }
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Password change failed. Please check your current password.');
      }

      // setSuccessMessage('Password updated successfully.'); // Parent handles global success
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Clear form
      if (onSuccess) onSuccess(); // Notify parent
    } catch (err) {
      setError(err.message);
      console.error("Change password error:", err)
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="change-password-form-modal-or-section"> {/* Can be a section or a modal */}
      <h3 className="form-title">Change Your Password</h3>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>} {/* For immediate feedback */}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn btn-update-password" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;