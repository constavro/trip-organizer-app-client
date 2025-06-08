// src/components/Users/UserProfile/PhotoModal.jsx
import React, { useEffect } from 'react';

const PhotoModal = ({ isOpen, photos, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && currentIndex < photos.length - 1) {
        onNext();
      } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        onPrev();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev, currentIndex, photos.length]);

  if (!isOpen || !photos || photos.length === 0) {
    return null;
  }

  const currentPhotoUrl = photos[currentIndex];
  const displayUrl = currentPhotoUrl.startsWith('http') ? currentPhotoUrl : `${process.env.REACT_APP_BACKEND_URL}${currentPhotoUrl}`;

  const handleOverlayClick = (e) => {
    // Close only if the click is on the overlay itself, not on its children (modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="photo-modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="photo-modal-content">
        <button className="photo-modal-close" onClick={onClose} aria-label="Close photo viewer">
          ×
        </button>
        
        {currentIndex > 0 && (
          <button className="photo-modal-prev" onClick={onPrev} aria-label="Previous photo">
            ❮
          </button>
        )}
        
        <img src={displayUrl} alt={`Gallery ${currentIndex + 1}`} className="photo-modal-image" />
        
        {currentIndex < photos.length - 1 && (
          <button className="photo-modal-next" onClick={onNext} aria-label="Next photo">
            ❯
          </button>
        )}
      </div>
    </div>
  );
};

export default PhotoModal;