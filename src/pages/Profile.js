import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = useParams(userId);

  console.log(userId)


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${userId}`, {
          method: 'GET',
          headers: {
            // Include any required headers, such as authentication headers
            'Content-Type': 'application/json',
          },
          // You can include a request body if needed
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {profileData && (
        <React.Component>

<h1>Profile</h1>
          {/* Display user profile information */}
          <p>Email: {profileData.email}</p>
          <p>Other profile data: {profileData.someOtherField}</p>
          {/* Add more fields as needed */}

        </React.Component>

      )}
    </div>
  );
}

export default Profile;
