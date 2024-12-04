import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams(); // Get the userId from the route params

  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // To store the logged-in user's ID
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
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error fetching user profile');
        }

        const data = await res.json();
        setProfileData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleEditProfile = async (updatedProfile) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to edit your profile.');
      return;
    }

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
      setProfileData(updatedData); // Update the profile with new data
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!profileData) {
    return <p>No profile found.</p>;
  }

  const { user, profile, createdTrips } = profileData;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>{user.firstName} {user.lastName}</h2>
        <p>{profile.bio || 'No bio provided'}</p>
      </div>

      {loggedInUserId === userId && (
        <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      )}

      {isEditing ? (
        <EditProfileForm profile={profile} onSave={handleEditProfile} />
      ) : (
        <>
          <div className="profile-section">
            <h3>Spoken Languages</h3>
            {profile.spokenLanguages.length === 0 ? (
              <p>No languages specified.</p>
            ) : (
              <ul>
                {profile.spokenLanguages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="profile-section">
            <h3>Countries Visited</h3>
            {profile.countriesVisited.length === 0 ? (
              <p>No countries visited yet.</p>
            ) : (
              <ul>
                {profile.countriesVisited.map((country, index) => (
                  <li key={index}>{country}</li>
                ))}
              </ul>
            )}
          </div>

          {/* <div className="profile-section">
            <h3>Trips Created</h3>
            {createdTrips.length === 0 ? (
              <p>No trips created.</p>
            ) : (
              <ul>
                {createdTrips.map((trip) => (
                  <li key={trip._id}>
                    <h4>{trip.title}</h4>
                    <p>{trip.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div> */}
        </>
      )}
    </div>
  );
};

const EditProfileForm = ({ profile, onSave }) => {
  const [formState, setFormState] = useState({
    bio: profile.bio || '',
    spokenLanguages: profile.spokenLanguages || [],
    countriesVisited: profile.countriesVisited || [],
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteLanguage = (index) => {
    setFormState({
      ...formState,
      spokenLanguages: formState.spokenLanguages.filter((_, i) => i !== index),
    });
  };

  const handleDeleteCountry = (index) => {
    setFormState({
      ...formState,
      countriesVisited: formState.countriesVisited.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...formState,
      // Ensure spokenLanguages and countriesVisited are arrays when submitting
      spokenLanguages: formState.spokenLanguages,
      countriesVisited: formState.countriesVisited,
    };
    onSave(updatedProfile);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <div>
        <label>Bio</label>
        <textarea
          name="bio"
          value={formState.bio}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Spoken Languages</label>
        <ul>
          {formState.spokenLanguages.map((language, index) => (
            <li key={index}>
              {language}
              <button type="button" onClick={() => handleDeleteLanguage(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add new languages (comma-separated)"
          onChange={(e) =>
            setFormState({
              ...formState,
              spokenLanguages: e.target.value.split(',').map((lang) => lang.trim()),
            })
          }
        />
      </div>
      <div>
        <label>Countries Visited</label>
        <ul>
          {formState.countriesVisited.map((country, index) => (
            <li key={index}>
              {country}
              <button type="button" onClick={() => handleDeleteCountry(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add new countries (comma-separated)"
          onChange={(e) =>
            setFormState({
              ...formState,
              countriesVisited: e.target.value.split(',').map((country) => country.trim()),
            })
          }
        />
      </div>
      <button type="submit">Save Changes</button>
    </form>
  );
};


export default UserProfile;
