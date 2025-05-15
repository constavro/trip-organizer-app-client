// components/UserProfile/TripsList.jsx
import React from 'react';

const TripsList = ({ trips }) => {
  if (!trips || trips.length === 0) return null;

  return (
    <div className="profile-section">
      <h3>Trips Created</h3>
      <ul>
        {trips.map((trip) => (
          <li key={trip._id}>
            <h4>{trip.title}</h4>
            <p>{trip.startDate}</p>
            <p>{trip.endDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripsList;
