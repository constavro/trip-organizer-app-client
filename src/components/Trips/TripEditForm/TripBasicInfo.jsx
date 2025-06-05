// src/components/Trips/TripEditForm/TripBasicInfo.jsx
import React from 'react';
import FormSection from './FormSection';

const TripBasicInfo = ({ title, startDate, endDate, coverImage, handleChange }) => {
  return (
    <FormSection title="Basic Information">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" value={title} onChange={handleChange} required />
      </div>
      <div className="form-group-inline">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" name="startDate" value={startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input type="date" id="endDate" name="endDate" value={endDate} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="coverImage">Cover Image URL</label>
        <input type="text" id="coverImage" name="coverImage" value={coverImage || ''} onChange={handleChange} placeholder="https://example.com/image.jpg"/>
      </div>
    </FormSection>
  );
};

export default TripBasicInfo;