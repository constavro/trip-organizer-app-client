import React, { useState } from 'react';

const DeleteUser = ({ userId, onDeleteSuccess }) => {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete account');
      }

      // Clear local storage and notify parent
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-account">
      {!confirming ? (
        <button className="danger" onClick={() => setConfirming(true)}>
          Delete Account
        </button>
      ) : (
        <div>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <button className="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button onClick={() => setConfirming(false)} disabled={loading}>
            Cancel
          </button>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default DeleteUser;
