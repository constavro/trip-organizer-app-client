import React, { useState } from 'react'; // Added useState for photo preview
import SocialLinks from './SocialLinks';
import ProfilePhotos from './ProfilePhotos';
import TripsList from './TripsList';
import CountriesVisited from './CountriesVisited';
import SpokenLanguages from './SpokenLanguages';
// CSS is imported by UserProfile.jsx

const ProfileDetails = ({ userData, createdTripsData }) => {
  const [previewImage, setPreviewImage] = useState(null); // For photo preview

  if (!userData) return <p className="status-message">Loading user details...</p>;

  const profilePhotoUrl = userData.profilePhoto
    ? (userData.profilePhoto.startsWith('http') ? userData.profilePhoto : `${process.env.REACT_APP_BACKEND_URL}${userData.profilePhoto}`)
    : '/default-avatar.png';


  return (
    <>
      <div className="profile-view-header">
        <img
          className="profile-view-photo"
          src={profilePhotoUrl}
          alt={`${userData.firstName || 'User'}'s profile`}
          onError={(e) => { e.target.onerror = null; e.target.src='/default-avatar.png'; }} // Fallback for broken images
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

      {userData.spokenLanguages && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">Languages Spoken</h3>
          <SpokenLanguages languages={userData.spokenLanguages} />
        </section>
      )}
      
      {userData.countriesVisited && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">Countries Visited</h3>
          <CountriesVisited visitedCountries={userData.countriesVisited} />
        </section>
      )}

      {createdTripsData && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">Trips Created</h3>
          <TripsList trips={createdTripsData} />
        </section>
      )}
      
      {userData.photos && (
        <section className="profile-view-section">
          <h3 className="profile-view-section-title">My Photo Gallery</h3>
          <ProfilePhotos photos={userData.photos} onPhotoClick={setPreviewImage} />
        </section>
      )}

      {(userData.socialLinks?.facebook || userData.socialLinks?.instagram) && (
         <section className="profile-view-section">
            <h3 className="profile-view-section-title">Connect With Me</h3>
            <SocialLinks links={userData.socialLinks} />
        </section>
      )}

      {/* Photo Preview Modal/Overlay */}
      {previewImage && (
        <div className="gallery-photo-preview-container" onClick={() => setPreviewImage(null)} style={{cursor: 'zoom-out'}}>
          <img src={previewImage.startsWith('http') ? previewImage : `${process.env.REACT_APP_BACKEND_URL}${previewImage}`} alt="Preview" />
        </div>
      )}
    </>
  );
};

export default ProfileDetails;