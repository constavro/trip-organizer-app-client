// components/UserProfile/ProfileDetails.jsx
import React from 'react';
import SocialLinks from './SocialLinks';
import ProfilePhotos from './ProfilePhotos';
import TripsList from './TripsList';
import CountriesVisited from './CountriesVisited';
import SpokenLanguages from './SpokenLanguages';
import './ProfileDetails.css'

const ProfileDetails = ({ user, createdTrips }) => {
  if (!user) return null;

  console.log(`${process.env.REACT_APP_BACKEND_URL}${user.profilePhoto}`)

  return (
    <>

    <div className="profile-header">
      <img
        className="profile-photo"
        src={`${process.env.REACT_APP_BACKEND_URL}${user.profilePhoto}` || '/default_avatar.png'}
        alt={`${user.firstName}'s profile`}
      />
              <div className="profile-info">
    <h2>{user.firstName} {user.lastName}</h2>
    <p>{user.bio || 'No bio provided'}</p>
  </div>
        </div>
      <div className="profile-section">
        <h3>About</h3>
        <p>{user.about || 'No details provided.'}</p>
      </div>

      <div className="profile-section">
        <h3>Spoken Languages</h3>
        <SpokenLanguages languages={user.spokenLanguages} />
      </div>

      <div className="profile-section">
         <h3>Countries Visited</h3>
        <CountriesVisited visitedCountries={user.countriesVisited || []} />
        </div>
        <TripsList trips={createdTrips} />
        <ProfilePhotos photos={user.photos} />

      <SocialLinks links={user.socialLinks} />

    </>
  );
};

export default ProfileDetails;
