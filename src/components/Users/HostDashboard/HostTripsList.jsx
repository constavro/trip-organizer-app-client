import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HostTripsList.css'

const HostTripsList = ({ trips }) => {
  const navigate = useNavigate();

  const handleTripClick = (id) => {
    navigate(`/trips/${id}`);
  };

  return (
    <div className="dashboard-section trip-list-section">
      <h2>Your Trips</h2>
      {trips.length === 0 ? (
        <p>You haven't created any trips.</p>
      ) : (
        <ul className="host-trips-grid">
        {trips.map((trip) => (
          <li
            key={trip._id}
            onClick={() => handleTripClick(trip._id)}
            className="host-trip-item-card"
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
      )}
    </div>
  );
};

export default HostTripsList;
