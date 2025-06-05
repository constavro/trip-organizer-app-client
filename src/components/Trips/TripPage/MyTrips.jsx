import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyTripsButton = () => {
  const navigate = useNavigate();

  return (
    <div className="create-trip-button-container">
      <button className="btn create-trip-button" onClick={() => navigate('/mytrips')}>
        My Trips
      </button>
    </div>
  );
};

export default MyTripsButton;
