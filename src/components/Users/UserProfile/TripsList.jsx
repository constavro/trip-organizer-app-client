// src/components/Users/UserProfile/TripsList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// CSS is imported by UserProfile.jsx or ProfileDetails.jsx

const TripsList = ({ trips }) => {
  const navigate = useNavigate();

  if (!trips || trips.length === 0) {
    return <p className="text-muted">This user hasn't created any trips yet.</p>; // UX: Clearer empty state
  }

  const handleTripClick = (id) => {
    navigate(`/trips/${id}`);
  };

  return (
    // The section wrapper and title are handled in ProfileDetails.jsx
    <ul className="profile-trips-list-container">
      {trips.map((trip) => (
        <li
          key={trip._id}
          onClick={() => handleTripClick(trip._id)}
          className="profile-trip-card" // Can also add global .card if needed
          role="button"
          tabIndex="0"
          aria-label={`View details for trip: ${trip.title}`}
          onKeyPress={(e) => e.key === 'Enter' && handleTripClick(trip._id)} // Accessibility
        >
          <h4 className="trip-card-title">{trip.title || 'Untitled Trip'}</h4>
          <p className="trip-card-dates">
            <strong>Starts:</strong> {new Date(trip.startDate).toLocaleDateString()}
          </p>
          <p className="trip-card-dates">
            <strong>Ends:</strong> {new Date(trip.endDate).toLocaleDateString()}
          </p>
          {/* Optionally, add more info like price or number of participants */}
        </li>
      ))}
    </ul>
  );
};

export default TripsList;