// TripBasicInfoStep.js
import React from 'react';

const TripBasicInfoStep = ({ formData, setFormData, setError }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (setError) setError(''); // Clear error on change
  };

  return (
    <div className="form-step">
      {/* Step title is now handled in TripCreationForm */}
      <div className="form-group">
        <label htmlFor="title">Trip Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="e.g., Summer Adventure in the Alps"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
          <label>Will you be participating?</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="isParticipating" value="yes" checked={formData.isParticipating === 'yes'} onChange={handleChange} /> Yes
            </label>
            <label>
              <input type="radio" name="isParticipating" value="no" checked={formData.isParticipating === 'no'} onChange={handleChange} /> No
            </label>
          </div>
        </div>

        {/* --- NEW SECTION: Trip Privacy --- */}
        <div className="form-group">
          <label>Trip Privacy</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="privacy" value="public" checked={formData.privacy === 'public'} onChange={handleChange} /> Public
            </label>
            <label>
              <input type="radio" name="privacy" value="private" checked={formData.privacy === 'private'} onChange={handleChange} /> Private
            </label>
            {/* You can add 'unlisted' here if your backend and model support it
            <label>
              <input type="radio" name="privacy" value="unlisted" checked={input.privacy === 'unlisted'} onChange={handleChange} /> Unlisted
            </label>
            */}
          </div>
        </div>
    </div>
  );
};

export default TripBasicInfoStep;