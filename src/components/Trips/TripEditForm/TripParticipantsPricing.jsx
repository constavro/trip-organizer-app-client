// src/components/Trips/TripEditForm/TripParticipantsPricing.jsx
import React from 'react';
import FormSection from './FormSection';

const TripParticipantsPricing = ({ minParticipants, maxParticipants, currentParticipants, price, handleChange }) => {
  return (
    <FormSection title="Participants & Pricing">
      <div className="form-group-inline">
        <div className="form-group">
          <label htmlFor="minParticipants">Min Participants</label>
          <input type="number" id="minParticipants" name="minParticipants" value={minParticipants} min="1" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="maxParticipants">Max Participants</label>
          <input type="number" id="maxParticipants" name="maxParticipants" value={maxParticipants} min={currentParticipants} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="price">Price per Person ($)</label>
        <input type="number" id="price" name="price" value={price} min="0" onChange={handleChange} required />
      </div>
    </FormSection>
  );
};

export default TripParticipantsPricing;