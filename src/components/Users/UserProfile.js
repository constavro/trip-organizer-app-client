import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';
import LanguageSelector from './LanguageSelector';

const UserProfile = () => {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view profiles.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
          headers: { Authorization: token },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error fetching user profile');
        }

        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleEditProfile = async (updatedProfile) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error updating profile');
      }
  
      const updatedData = await res.json();
  
      // updatedData likely returns full user data
      setProfileData((prevData) => ({
        ...prevData,
        user: { user: updatedData }, // match shape expected by `ProfileDetails`
      }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };
  

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!profileData) return <p>No profile found.</p>;

  const createdTrips = profileData.createdTrips;

  const user = profileData.user.user;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.profilePhoto || '/default-avatar.png'} alt={`${user.firstName}'s profile`} />
        <h2>{user.firstName} {user.lastName}</h2>
        <p>{user.bio || 'No bio provided'}</p>
      </div>

      {loggedInUserId === userId && (
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      )}

      {isEditing ? (
        <EditProfileForm profile={user} onSave={handleEditProfile} />
      ) : (
        <ProfileDetails user={user} createdTrips={createdTrips} />
      )}
    </div>
  );
};

const ProfileDetails = ({ user, createdTrips }) => (
  <>
    <div className="profile-section">
      <h3>About</h3>
      <p>{user.about || 'No details provided.'}</p>
    </div>
    <div className="profile-section">
      <h3>Spoken Languages</h3>
      <ul>
    {user.spokenLanguages && user.spokenLanguages.length > 0 ? (
      user.spokenLanguages.map((lang, index) => <li key={index}>{lang}</li>)
    ) : (
      <p>No spoken languages provided.</p>
    )}
  </ul>
    </div>
    <div className="profile-section">
      <h3>Countries Visited</h3>
      <ul>
      {user.countriesVisited && user.countriesVisited.length > 0 ? (
      user.countriesVisited.map((country, index) => <li key={index}>{country}</li>)
    ) : (
      <p>No countries provided.</p>
    )}
      </ul>
    </div>
    <div className="profile-section">
      <h3>Social Links</h3>
      <ul>
        {user.socialLinks.facebook && <li><a href={user.socialLinks.facebook}>Facebook</a></li>}
        {user.socialLinks.instagram && <li><a href={user.socialLinks.instagram}>Instagram</a></li>}
      </ul>
    </div>
    <div className="profile-section">
      <h3>Photos</h3>
      <div className="photo-gallery">
        {user.photos.map((photo, index) => (
          <img key={index} src={photo} alt="User uploaded" />
        ))}
      </div>
    </div>
    <div className="profile-section">
      <h3>Trips Created</h3>
      <ul>
        {createdTrips.map((trip) => (
          <li key={trip._id}>
            <h4>{trip.title}</h4>
            <p>{trip.description}</p>
          </li>
        ))}
      </ul>
    </div>
  </>
);

const EditProfileForm = ({ user, onSave }) => {
  const [formState, setFormState] = useState({
    profilePhoto: user.profilePhoto || '/default-avatar.png', 
    bio: user.bio || '',
    about: user.about || '',
    spokenLanguages: user.spokenLanguages || [],
    countriesVisited: user.countriesVisited || [],
    socialLinks: user.socialLinks || { facebook: '', instagram: '' },
    photos: user.photos || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formState);
  };

  const handleLanguagesSave = (updatedLanguages) => {
    setFormState((prev) => ({ ...prev, spokenLanguages: updatedLanguages }));
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="bio">Bio</label>
      <textarea
        id="bio"
        name="bio"
        value={formState.bio}
        onChange={handleChange}
        placeholder="Write a short bio about yourself"
      />
    </div>
    <div className="form-group">
      <label htmlFor="about">About</label>
      <textarea
        id="about"
        name="about"
        value={formState.about}
        onChange={handleChange}
        placeholder="Describe more about yourself"
      />
    </div>
    <LanguageSelector
        initialLanguages={formState.spokenLanguages}
        onSave={handleLanguagesSave}
      />
    <button type="submit">Save</button>
  </form>
  );
};

export default UserProfile;