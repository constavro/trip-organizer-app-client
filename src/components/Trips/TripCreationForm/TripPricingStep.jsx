import React from 'react';

const TripPricingStep = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure the value is parsed as a number where necessary
    const parsedValue = name === 'price' || name === 'minParticipants' || name === 'maxParticipants' ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  return (
    <div className="form-step">
      <h3>Trip Settings</h3>
      <input
        type="number"
        name="minParticipants"
        placeholder="Minimum Participants"
        value={formData.minParticipants || ''}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="maxParticipants"
        placeholder="Maximum Participants"
        value={formData.maxParticipants || ''}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price per person"
        value={formData.price || ''}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default TripPricingStep;
