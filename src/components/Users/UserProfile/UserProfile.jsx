import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import ProfileDetails from './ProfileDetails';
import EditProfileForm from './EditProfileForm';
import DeleteUser from './DeleteUser';
import ChangePasswordForm from './ChangePasswordForm';
import './UserProfile.css'; // Consolidated CSS

const UserProfile = () => {
  const { userId: viewedUserId } = useParams(); // Renamed for clarity
  const navigate = useNavigate(); // For navigation after delete

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const loggedInUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token'); // Get token once
  const isOwnProfile = loggedInUserId === viewedUserId;

  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setError('Authentication required to view profiles.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${viewedUserId}`, {
        headers: { Authorization: token },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error fetching user profile' }));
        throw new Error(errorData.message);
      }
      const data = await res.json();
      setProfileData(data); // data should contain { user: { user: userData, createdTrips: [] } }
    } catch (err) {
      setError(err.message || 'Could not load profile.');
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  }, [viewedUserId, token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleSaveProfile = async (updatedProfileData) => {
    if (!token || !isOwnProfile) return;
    setError(''); // Clear previous errors
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${loggedInUserId}`, { // Use loggedInUserId for update
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Error updating profile' }));
        throw new Error(errorData.message);
      }
      const updatedDataFromServer = await res.json(); // This should be the updated user object
      
      // Update profileData state correctly
      setProfileData(prevData => ({
        ...prevData,
        user: { // Assuming backend returns the updated user object directly or nested
            ...prevData.user, // keep other parts like createdTrips
            user: updatedDataFromServer.user || updatedDataFromServer // Adjust based on your API response
        }
      }));
      setIsEditing(false);
      setShowPasswordForm(false); // Close password form on successful profile save too
      alert("Profile updated successfully!"); // UX: Success feedback
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      console.error("Update profile error:", err);
    }
  };

  const handlePasswordChanged = () => {
    setShowPasswordForm(false);
    alert("Password changed successfully!"); // UX: Success feedback
  }

  const handleDeleteSuccess = () => {
    alert('Your account has been successfully deleted.');
    navigate('/'); // Redirect to landing page
  };

  if (loading) return <p className="loading-message container">Loading profile...</p>;
  if (error && !profileData) return <p className="error-message container">{error}</p>; // Show full page error if profileData is null
  if (!profileData || !profileData.user || !profileData.user.user) return <p className="empty-state-message container">User profile not found.</p>;

  const { user } = profileData.user; // Destructure after ensuring profileData.user.user exists
  const { createdTrips } = profileData;

  return (
    <div className="user-profile-page container">
      <div className="profile-card">
        {isOwnProfile && (
          <div className="profile-actions-bar">
            <button
              className={`btn ${isEditing ? 'btn-secondary' : 'btn-outline-primary'}`}
              onClick={() => { setIsEditing(!isEditing); if (showPasswordForm) setShowPasswordForm(false); }}
              aria-pressed={isEditing}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              className={`btn ${showPasswordForm ? 'btn-secondary' : 'btn-outline-primary'}`}
              onClick={() => { setShowPasswordForm(!showPasswordForm); if (isEditing) setIsEditing(false); }}
              aria-pressed={showPasswordForm}
            >
              {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
            </button>
            <DeleteUser
              userId={loggedInUserId}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        )}

        <div className="profile-content-area">
          {error && <p className="error-message">{error}</p>} {/* Display error related to updates here */}
          
          {isEditing && isOwnProfile ? (
            <EditProfileForm currentUserData={user} onSave={handleSaveProfile} />
          ) : showPasswordForm && isOwnProfile ? (
            <ChangePasswordForm userId={loggedInUserId} onSuccess={handlePasswordChanged} />
          ) : (
            <ProfileDetails userData={user} createdTripsData={createdTrips} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;