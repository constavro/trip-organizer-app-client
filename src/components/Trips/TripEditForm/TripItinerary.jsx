// src/components/Trips/TripEditForm/TripItinerary.jsx
import React from 'react';
import FormSection from './FormSection';
import TripItineraryStop from './TripItineraryStop';

const TripItinerary = ({
  itinerary, onItineraryChange, onRemoveStop, onAddStop, tripStartDate, tripEndDate
  // onMoveItem is removed from props here
}) => {

  return (
    <FormSection title="Edit Itinerary Details">
      {itinerary.map((item, index) => (
        <TripItineraryStop
          key={item._id || `itinerary-detail-${index}`} // Use a distinct key prefix
          item={item}
          index={index}
          onItineraryChange={onItineraryChange}
          onRemoveStop={onRemoveStop}
        />
      ))}
      <button
        type="button"
        className="btn-add-item"
        onClick={onAddStop}
        disabled={!tripStartDate || !tripEndDate}
      >
        + Add Itinerary Stop
      </button>
      {itinerary.length === 0 && <p>No itinerary stops yet. Click "Add Itinerary Stop" above to begin. You can reorder stops in the section below.</p>}
    </FormSection>
  );
};

export default TripItinerary;