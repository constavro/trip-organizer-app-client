// src/components/Trips/TripEditForm/TripItinerary.jsx
import React from 'react';
import FormSection from './FormSection';
import TripItineraryStop from './TripItineraryStop';

const TripItinerary = ({
  itinerary,onItineraryChange,onRemoveStop,onMoveItem,onAddStop,tripStartDate,tripEndDate
}) => {

  return (
    <FormSection title="Itinerary">
      {itinerary.map((item, index) => (
        <TripItineraryStop
          key={item._id || `itinerary-item-${index}`} // Stable key for list items
          item={item}
          index={index}
          onItineraryChange={onItineraryChange}
          onRemoveStop={onRemoveStop}
          onMoveItem={onMoveItem}
          canMoveUp={index > 0}
          canMoveDown={index < itinerary.length - 1}
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
    </FormSection>
  );
};

export default TripItinerary;