// src/components/Users/UserProfile/ProfileDetails.jsx
import React, { useState } from 'react';
import SocialLinks from './SocialLinks';
import ProfilePhotos from './ProfilePhotos';
import TripsList from './TripsList';
import CountriesVisited from './CountriesVisited';
import SpokenLanguages from './SpokenLanguages';
import PhotoModal from './PhotoModal'; // Import the new modal component
// CSS is imported by UserProfile.jsx

const ProfileDetails = ({ userData, createdTripsData }) => {
  // State for the new photo modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!userData) return <p className="status-message">Loading user details...</p>;

  const profilePhotoUrl = userData.profilePhoto
    ? (userData.profilePhoto.startsWith('http') ? userData.profilePhoto : `${process.env.REACT_APP_BACKEND_URL}${userData.profilePhoto}`)
    : '/default-avatar.png';

  // Handlers for the photo modal
  const handlePhotoClick = (index) => {
    setCurrentPhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  const handleClosePhotoModal = () => {
    setIsPhotoModalOpen(false);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1 < userData.photos.length ? prevIndex + 1 : prevIndex));
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  return (
    <>
      <div className="profile-view-header">
        <img
          className="profile-view-photo"
          src={profilePhotoUrl}
          alt={`${userData.firstName || 'User'}'s profile`}
          onError={(e) => { e.target.onerror = null; e.target.src='/default-avatar.png'; }}
        />
        <div className="profile-view-info">
          <h1>{userData.firstName || ''} {userData.lastName || ''}</h1>
          <p className="profile-bio">{userData.bio || 'No bio provided. This user is a mystery!'}</p>
        </div>
      </div>

      {userData.about && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">About Me</h3>
          <p className="about-text">{userData.about}</p>
        </section>
      )}

      {userData.spokenLanguages && userData.spokenLanguages.length > 0 && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">Languages Spoken</h3>
          <SpokenLanguages languages={userData.spokenLanguages} />
        </section>
      )}
      
      {userData.countriesVisited && userData.countriesVisited.length > 0 && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">Countries Visited</h3>
          <CountriesVisited visitedCountries={userData.countriesVisited} />
        </section>
      )}

      {createdTripsData && createdTripsData.length > 0 && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">Trips Created</h3>
          <TripsList trips={createdTripsData} />
        </section>
      )}
      
      {userData.photos && userData.photos.length > 0 && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">My Photo Gallery</h3>
          {/* Pass the new handler to ProfilePhotos, it now expects an index */}
          <ProfilePhotos photos={userData.photos} onPhotoClick={handlePhotoClick} />
        </section>
      )}

      {(userData.socialLinks?.facebook || userData.socialLinks?.instagram || userData.socialLinks?.twitter || userData.socialLinks?.linkedin) && (
         <section className="profile-view-section">
            <h3 className="profile-view-section-title">Connect With Me</h3>
            <SocialLinks links={userData.socialLinks} />
        </section>
      )}

      {/* Render the PhotoModal */}
      {userData.photos && userData.photos.length > 0 && (
        <PhotoModal
          isOpen={isPhotoModalOpen}
          photos={userData.photos}
          currentIndex={currentPhotoIndex}
          onClose={handleClosePhotoModal}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
        />
      )}
    </>
  );
};

export default ProfileDetails;