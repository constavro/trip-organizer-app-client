import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTripButton.css';

const CreateTripButton = () => {
  const navigate = useNavigate();

  return (
    <div className="create-trip-button-container">
      <button className="btn create-trip-button" onClick={() => navigate('/createtrip')}>
        Create New Trip
      </button>
    </div>
  );
};

export default CreateTripButton;
