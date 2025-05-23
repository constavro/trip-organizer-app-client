// UserProfile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileDetails from './ProfileDetails';
import EditProfileForm from './EditProfileForm';
import DeleteUser from './DeleteUser';
import ChangePasswordForm from './ChangePasswordForm';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
      setProfileData((prevData) => ({
        ...prevData,
        user: updatedData,
      }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="status-message">Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!profileData) return <p className="status-message">No profile found.</p>;

  const user = profileData.user.user;

  return (
    <div className="user-profile-container">
        {loggedInUserId === userId && (
          <div className="profile-actions">
            <button className="btn" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className="btn secondary" onClick={() => setShowPasswordForm(!showPasswordForm)}>
              {showPasswordForm ? 'Cancel Password Change' : 'Change Password'}
            </button>
            <DeleteUser
              userId={userId}
              onDeleteSuccess={() => {
                alert('Your account has been deleted.');
                window.location.href = '/';
              }}
            />
          </div>
        )}

      {showPasswordForm && <ChangePasswordForm userId={userId} />}

      <div className="profile-content">
        {isEditing ? (
          <EditProfileForm user={user} onSave={handleEditProfile} />
        ) : (
          <ProfileDetails user={user} createdTrips={profileData.createdTrips} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;