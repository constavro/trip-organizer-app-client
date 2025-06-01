// src/components/Users/UserProfile/ProfilePhotos.jsx
import React from 'react';
// CSS is imported by UserProfile.jsx or ProfileDetails.jsx

const ProfilePhotos = ({ photos, onPhotoClick }) => { // onPhotoClick to open a modal/larger view
  if (!photos || photos.length === 0) {
    return <p className="text-muted">No photos in the gallery yet.</p>;
  }

  return (
    // The section wrapper and title are handled in ProfileDetails.jsx
    <div className="profile-photos-gallery">
      {photos.map((photoUrl, index) => (
        <div
          key={photoUrl || index} // Prefer photoUrl if unique, fallback to index
          className="gallery-photo-item"
          onClick={() => onPhotoClick(photoUrl)} // UX: Click to view larger
          onKeyPress={(e) => e.key === 'Enter' && onPhotoClick(photoUrl)} // Accessibility
          tabIndex={0} // Make it focusable
          role="button"
          aria-label={`View photo ${index + 1}`}
        >
          <img
            src={photoUrl.startsWith('http') ? photoUrl : `${process.env.REACT_APP_BACKEND_URL}${photoUrl}`}
            alt={`User gallery ${index + 1}`}
            loading="lazy" // UX: Lazy load images
            onError={(e) => { e.target.style.display='none'; /* Hide broken image */ }}
          />
        </div>
      ))}
    </div>
  );
};

export default ProfilePhotos;