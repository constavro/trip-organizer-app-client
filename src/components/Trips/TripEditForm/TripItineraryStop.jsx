// src/components/Trips/TripEditForm/TripItineraryStop.jsx
import React from 'react';

const TripItineraryStop = ({ item, index, onItineraryChange, onRemoveStop }) => {
  return (
    <div className="itinerary-item-edit">
      <div className="itinerary-item-header">
        <h4>Stop {index + 1}: {item.location || 'New Stop'}</h4>
        {/* Drag handles and related DND controls are removed */}
      </div>
      <div className="form-group">
        <label htmlFor={`itinerary-location-${index}`}>Location</label>
        <input type="text" id={`itinerary-location-${index}`} name="location" value={item.location || ''} onChange={(e) => onItineraryChange(e, index)} required />
      </div>
      <div className="form-group">
        <label htmlFor={`itinerary-days-${index}`}>Days for this stop</label>
        <input type="number" id={`itinerary-days-${index}`} name="days" value={item.days || '1'} min="1" onChange={(e) => onItineraryChange(e, index)} required />
      </div>
      <div className="form-group">
        <label htmlFor={`itinerary-accommodation-${index}`}>Accommodation</label>
        <input type="text" id={`itinerary-accommodation-${index}`} name="accommodation" value={item.accommodation || ''} onChange={(e) => onItineraryChange(e, index)} />
      </div>
      <div className="form-group">
        <label htmlFor={`itinerary-notes-${index}`}>Notes/Activities</label>
        <textarea id={`itinerary-notes-${index}`} name="notes" value={item.notes || ''} onChange={(e) => onItineraryChange(e, index)} />
      </div>
      <div className="form-group">
        <label htmlFor={`itinerary-costEstimate-${index}`}>Cost Estimate</label>
        <input type="number" id={`itinerary-costEstimate-${index}`} name="costEstimate" value={item.costEstimate || 0} min="0" step="any" onChange={(e) => onItineraryChange(e, index)} />
      </div>
      <button type="button" className="btn-remove-item" onClick={() => onRemoveStop(index)}>Remove Stop</button>
    </div>
  );
};

export default TripItineraryStop;