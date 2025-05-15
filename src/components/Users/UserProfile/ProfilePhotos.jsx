// components/UserProfile/ProfilePhotos.jsx
import React from 'react';

const ProfilePhotos = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="profile-section">
      <h3>Photos</h3>
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <img key={index} src={`${process.env.REACT_APP_BACKEND_URL}${photo}`} alt="User upload" />
        ))}
      </div>
    </div>
  );
};

export default ProfilePhotos;
