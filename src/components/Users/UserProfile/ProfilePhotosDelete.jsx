// components/UserProfile/ProfilePhotosDelete.jsx
import React from 'react';
import './ProfilePhotosDelete.css';

const ProfilePhotosDelete = ({ photos, onPhotoRemoved, onPhotoDeleteError }) => {
  if (!photos || photos.length === 0) return null;

  const handleRemovePhoto = async (photoUrlToRemove) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/delete-photos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, // Assuming token is 'Bearer <your_token>' format
        },
        body: JSON.stringify({ photoUrl: photoUrlToRemove }), // Send the full Azure URL
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to delete photo');
      }

      // If backend confirms deletion, call the callback to update UI
      onPhotoRemoved(photoUrlToRemove);
      alert('Photo deleted successfully.');

    } catch (err) {
      console.error('Error deleting photo:', err);
      if (onPhotoDeleteError) {
        onPhotoDeleteError(err.message);
      } else {
        alert(err.message || 'An error occurred while deleting the photo.');
      }
    }
  };

  return (
    <div className="profile-section">
      <h3>Photos</h3>
      <div className="photo-gallery">
        {photos.map((photoUrl, index) => (
          <div key={index} className="photo-item">
            {/* Assuming photoUrl is the full Azure Blob URL */}
            <img src={photoUrl} alt={`User upload ${index + 1}`} />
            <button type="button" onClick={() => handleRemovePhoto(photoUrl)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePhotosDelete;