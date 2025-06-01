import React from 'react';

const TripPricingStep = ({ formData, setFormData, setError }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, })); // Keep as string for input, parse on submit
    if (setError) setError('');
  };

  return (
    <div className="form-step">
      {/* Title handled in parent component */}
      <div className="form-group">
        <label htmlFor="minParticipants">Minimum Participants</label>
        <input
          type="number"
          id="minParticipants"
          name="minParticipants"
          placeholder="e.g., 2"
          value={formData.minParticipants || ''}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="maxParticipants">Maximum Participants</label>
        <input
          type="number"
          id="maxParticipants"
          name="maxParticipants"
          placeholder="e.g., 10"
          value={formData.maxParticipants || ''}
          onChange={handleChange}
          min={formData.minParticipants || 1} // Max should be >= min
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price per person</label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="e.g., 500"
          value={formData.price || ''}
          onChange={handleChange}
          min="0"
          required
        />
      </div>
    </div>
  );
};

export default TripPricingStep;