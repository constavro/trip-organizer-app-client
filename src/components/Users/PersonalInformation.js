import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PersonalInformation = () => {
    const { userId } = useParams(); // Get the userId from the route params
  
    const [personalInformation, setPersonalInformation] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
  
    // To store the logged-in user's ID
    const loggedInUserId = localStorage.getItem('userId'); 
  
    useEffect(() => {
      const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view profiles.');
          setLoading(false);
          return;
        }
  
        try {
          const res = await fetch(`http://localhost:5000/api/users/personal-info/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          });
  
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error fetching user personal information');
          }
  
          const data = await res.json();
          setPersonalInformation(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [userId]);
  
    const handleEditPersonalInfo = async (updatedPersonalInfo) => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to edit your profile.');
        return;
      }
  
      try {
        const res = await fetch(`http://localhost:5000/api/users/personal-info/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(updatedPersonalInfo),
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error updating personal information');
        }
  
        const updatedData = await res.json();
        setPersonalInformation(updatedData); // Update the profile with new data
        setIsEditing(false); // Exit edit mode
      } catch (err) {
        setError(err.message);
      }
    };
  
    if (loading) {
      return <p>Loading personal information...</p>;
    }
  
    if (error) {
      return <p className="error-message">{error}</p>;
    }
  
    if (!personalInformation) {
      return <p>No user found.</p>;
    }
  
    const { user } = personalInformation;
  
    return (
      <div className="user-profile">
        <div className="profile-header">
          <h2>{user.firstName} {user.lastName}</h2>
        </div>
  
        {loggedInUserId === userId && (
          <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        )}
  
        {isEditing ? (
          <EditPersonalInfoForm user={user} onSave={handleEditPersonalInfo} />
        ) : (
          <>
            <div className="profile-section">
              <h3>Email</h3>
              <p>{user.email}</p>
            </div>
            <div className="profile-section">
              <h3>Password</h3>
              <p>{user.password}</p>
            </div>
          </>
        )}
      </div>
    );
  };

const EditPersonalInfoForm = ({ user, onSave }) => {
    const [formState, setFormState] = useState({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
     });
  
    const handleChange = (e) => {
      setFormState({
        ...formState,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedPersonalInfo = {
        ...formState,
      };
      onSave(updatedPersonalInfo);
    };
  
    return (
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div>
          <label>firstName</label>
          <textarea
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>lastName</label>
          <textarea
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>email</label>
          <textarea
            name="email"
            value={formState.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>password</label>
          <textarea
            name="password"
            value={formState.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    );
  };

export default PersonalInformation;