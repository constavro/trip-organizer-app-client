// components/UserProfile/ProfileDetails.jsx
import React from 'react';
import SocialLinks from './SocialLinks';
import ProfilePhotos from './ProfilePhotos';
import TripsList from './TripsList';
import CountriesVisited from './CountriesVisited';

const ProfileDetails = ({ user, createdTrips }) => {
  if (!user) return null;

  return (
    <>

    <div className="profile-header">
      <img
        className="profile-photo"
        src={`${process.env.REACT_APP_BACKEND_URL}${user.profilePhoto}` || '/default-avatar.png'}
        alt={`${user.firstName}'s profile`}
      />
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.bio || 'No bio provided'}</p>
        </div>
      <div className="profile-section">
        <h3>About</h3>
        <p>{user.about || 'No details provided.'}</p>
      </div>

      <div className="profile-section">
        <h3>Spoken Languages</h3>
        {user.spokenLanguages && user.spokenLanguages.length > 0 ? (
          <ul>
            {user.spokenLanguages.map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>
        ) : (
          <p>No spoken languages provided.</p>
        )}
      </div>

      <div className="profile-section">
         <h3>Countries Visited</h3>
        <CountriesVisited visitedCountries={user.countriesVisited || []} />
        </div>

      <SocialLinks links={user.socialLinks} />
      <ProfilePhotos photos={user.photos} />
      <TripsList trips={createdTrips} />
    </>
  );
};

export default ProfileDetails;
