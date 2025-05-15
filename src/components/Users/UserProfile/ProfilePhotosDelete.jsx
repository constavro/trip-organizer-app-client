import React from 'react';

const ProfilePhotosDelete = ({ photos, onPhotoRemoved }) => {
  if (!photos || photos.length === 0) return null;

  const handleRemovePhoto = (photoPath) => {
    // Just update local state
    onPhotoRemoved(photoPath);
  };

  return (
    <div className="profile-section">
      <h3>Photos</h3>
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={`${process.env.REACT_APP_BACKEND_URL}${photo}`} alt="User upload" />
            <button type="button" onClick={() => handleRemovePhoto(photo)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePhotosDelete;
