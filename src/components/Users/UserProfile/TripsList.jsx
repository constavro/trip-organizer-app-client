import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TripsList.css';

const TripsList = ({ trips }) => {
  const navigate = useNavigate();

  if (!trips || trips.length === 0) return null;

  const handleTripClick = (id) => {
    navigate(`/trips/${id}`);
  };

  return (
    <div className="profile-section trips-list">
      <h3>Trips Created</h3>
      <ul>
        {trips.map((trip) => (
          <li
            key={trip._id}
            onClick={() => handleTripClick(trip._id)}
            className="trip-item"
            role="button"
            tabIndex="0"
            aria-label={`Go to trip ${trip.title}`}
          >
            <h4>{trip.title}</h4>
            <p><strong>Start:</strong> {new Date(trip.startDate).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(trip.endDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripsList;
