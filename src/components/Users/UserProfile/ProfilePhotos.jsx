// src/components/Users/UserProfile/ProfilePhotos.jsx
import React from 'react';
// CSS is imported by UserProfile.jsx or ProfileDetails.jsx

const ProfilePhotos = ({ photos, onPhotoClick }) => { // onPhotoClick now expects the index
  if (!photos || photos.length === 0) {
    return <p className="text-muted">No photos in the gallery yet.</p>;
  }

  return (
    <div className="profile-photos-gallery">
      {photos.map((photoUrl, index) => (
        <div
          key={photoUrl || index}
          className="gallery-photo-item"
          onClick={() => onPhotoClick(index)} // Pass the index
          onKeyPress={(e) => e.key === 'Enter' && onPhotoClick(index)} // Pass the index
          tabIndex={0}
          role="button"
          aria-label={`View photo ${index + 1}`}
        >
          <img
            src={photoUrl.startsWith('http') ? photoUrl : `${process.env.REACT_APP_BACKEND_URL}${photoUrl}`}
            alt={`User gallery ${index + 1}`}
            loading="lazy"
            onError={(e) => { e.target.style.display='none'; }}
          />
        </div>
      ))}
    </div>
  );
};

export default ProfilePhotos;