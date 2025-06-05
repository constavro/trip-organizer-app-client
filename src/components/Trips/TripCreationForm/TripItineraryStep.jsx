import React from 'react';

const TripItineraryStep = ({ formData, setFormData, setError }) => {
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItinerary = [...formData.itinerary];

    updatedItinerary[index][name] = value;

    setFormData((prev) => ({ ...prev, itinerary: updatedItinerary, }));
    if (setError) setError('');
  };

  const addItineraryItem = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          location: '', days: '', accommodation: '',
          notes: '', costEstimate: '', geoLocation: { lat: '', lng: '' },
          // Default other fields from your model if necessary
          photos: [], transportation: [], activities: [],
        },
      ],
    }));
    if (setError) setError('');
  };

  const removeItineraryItem = (index) => {
    if (formData.itinerary.length <= 1) {
        setError("At least one itinerary stop is required."); // Prevent removing the last item directly
        return;
    }
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary.splice(index, 1);
    setFormData((prev) => ({ ...prev, itinerary: updatedItinerary }));
    if (setError) setError('');
  };

  return (
    <div className="form-step">
      {formData.itinerary.map((item, index) => (
        <div className="itinerary-item" key={index}>
          <h4>Stop {index + 1}</h4>
          <div className="form-group">
            <label htmlFor={`itinerary-location-${index}`}>Location</label>
            <input
              type="text"
              id={`itinerary-location-${index}`}
              name="location"
              placeholder="City or specific place"
              value={item.location}
              onChange={(e) => handleChange(e, index)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`itinerary-days-${index}`}>Number of days in this stop</label>
            <input
              type="number"
              id={`itinerary-days-${index}`}
              name="days"
              placeholder="e.g. 2"
              value={item.days || ''}
              min="1"
              onChange={(e) => handleChange(e, index)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`itinerary-accommodation-${index}`}>Accommodation</label>
            <input
              type="text"
              id={`itinerary-accommodation-${index}`}
              name="accommodation"
              placeholder="Hotel name, Airbnb link, etc."
              value={item.accommodation}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`itinerary-notes-${index}`}>Notes / Activities</label>
            <textarea
              id={`itinerary-notes-${index}`}
              name="notes"
              placeholder="Details about this stop, planned activities..."
              value={item.notes}
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`itinerary-costEstimate-${index}`}>Cost Estimate for this stop</label>
            <input
              type="number"
              id={`itinerary-costEstimate-${index}`}
              name="costEstimate"
              placeholder="e.g., 200"
              value={item.costEstimate || ''}
              min="0"
              onChange={(e) => handleChange(e, index)}
            />
          </div>

          {formData.itinerary.length > 1 && (
            <button className="btn-remove-item" type="button" onClick={() => removeItineraryItem(index)}>
              Remove Stop {index + 1}
            </button>
          )}
        </div>
      ))}
      <button className="btn btn-add-item btn-secondary" type="button" onClick={addItineraryItem}>
        + Add Another Stop
      </button>
    </div>
  );
};

export default TripItineraryStep;