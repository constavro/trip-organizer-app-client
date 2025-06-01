// src/components/Users/UserProfile/DeleteUser.jsx
import React, { useState } from 'react';
// CSS is imported by UserProfile.jsx

const DeleteUser = ({ userId, onDeleteSuccess }) => {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setError("Authentication error. Please log in again to delete your account.");
        return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({message: "Failed to delete account due to a server error."}));
        throw new Error(data.message || 'Failed to delete account');
      }

      // Clear local storage (token, userId)
      localStorage.clear();
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      setError(err.message);
      console.error("Delete user error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-account-area"> {/* Simple wrapper */}
      {!confirming ? (
        <button
          className="btn btn-danger"
          onClick={() => setConfirming(true)}
          disabled={loading}
        >
          Delete My Account
        </button>
      ) : (
        <div className="delete-account-confirmation">
          <h4>Are you absolutely sure?</h4>
          <p>This action cannot be undone. All your data, including created trips and profile information, will be permanently deleted.</p>
          {error && <p className="error-message" style={{backgroundColor: 'transparent', borderColor: 'transparent'}}>{error}</p>}
          <div className="btn-group">
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
            <button className="btn btn-secondary" onClick={() => {setConfirming(false); setError('');}} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteUser;