import React, { useState } from 'react';
import './ProfilePhotos.css';

const ProfilePhotos = ({ photos }) => {
  const [hovered, setHovered] = useState(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="profile-section">
      <h3>Photos</h3>
      <div className="photo-gallery">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="photo-wrapper"
            onMouseEnter={() => setHovered(photo)}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={`${process.env.REACT_APP_BACKEND_URL}${photo}`} alt="User upload" />
          </div>
        ))}
        {hovered && (
          <div className="photo-preview">
            <img src={`${process.env.REACT_APP_BACKEND_URL}${hovered}`} alt="Preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotos;