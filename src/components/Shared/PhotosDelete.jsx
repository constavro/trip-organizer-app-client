import React from 'react';
// CSS is imported by UserProfile.jsx

const PhotosDelete = ({ photos, onPhotoRemoved, feature, onPhotoDeleteError }) => {
  if (!photos || photos.length === 0) {
    return <p className="text-muted" style={{fontSize: '0.9rem'}}>No photos in your gallery yet. Add some below!</p>;
  }

  const handleRemovePhoto = async (photoUrlToRemove) => {
    if (!window.confirm('Are you sure you want to delete this photo from your gallery? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/${feature}/delete-photos`, { // Ensure this endpoint exists
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ photoUrl: photoUrlToRemove }),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to delete photo');
      }
      onPhotoRemoved(photoUrlToRemove);
      alert('Photo deleted successfully.');
    } catch (err) {
      console.error('Error deleting gallery photo:', err);
      if (onPhotoDeleteError) {
        onPhotoDeleteError(err.message);
      } else {
        alert(err.message || 'An error occurred while deleting the photo.');
      }
    }
  };

  return (
    <div className="photos-management-gallery">
      {photos.map((photoUrl, index) => (
        <div key={photoUrl || index} className="photo-management-item"> {/* Use photoUrl as key if unique */}
          <img
            src={photoUrl.startsWith('http') ? photoUrl : `${process.env.REACT_APP_BACKEND_URL}${photoUrl}`}
            alt={`Gallery ${index + 1}`}
            onError={(e) => { e.target.style.display='none'; /* Hide broken image icon */ }}
          />
          <button
            type="button"
            className="btn-delete-gallery-photo"
            onClick={() => handleRemovePhoto(photoUrl)}
            aria-label={`Delete photo ${index + 1}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
export default PhotosDelete;