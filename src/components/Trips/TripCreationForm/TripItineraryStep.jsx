import React from 'react';

const TripItineraryStep = ({ formData, setFormData }) => {
  const handleChange = (e, index) => {
    const { name, value } = e.target;

    // Manually update the value of the field based on index
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index][name] = value;

    setFormData((prev) => ({
      ...prev,
      itinerary: updatedItinerary,
    }));
  };

  const addItineraryItem = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          order: prev.itinerary.length + 1,
          location: '',
          startDate: '',
          endDate: '',
          accommodation: '',
          notes: '',
          costEstimate: '',
          geoLocation: { lat: '', lng: '' },
        },
      ],
    }));
  };

  const removeItineraryItem = (index) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      itinerary: updatedItinerary.map((item, idx) => ({ ...item, order: idx + 1 })),
    }));
  };

  return (
    <div className="form-step">
      <h3>Itinerary</h3>
      {formData.itinerary.map((item, index) => (
        <div className="itinerary-item" key={index}>
          <input
            name="order"
            placeholder="Order"
            value={item.order}
            onChange={(e) => handleChange(e, index)}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={item.location}
            onChange={(e) => handleChange(e, index)}
            required
          />
          <input
            name="startDate"
            type="date"
            value={item.startDate}
            onChange={(e) => handleChange(e, index)}
            required
          />
          <input
            name="endDate"
            type="date"
            value={item.endDate}
            onChange={(e) => handleChange(e, index)}
            required
          />
          <input
            name="accommodation"
            placeholder="Accommodation"
            value={item.accommodation}
            onChange={(e) => handleChange(e, index)}
            required
          />
          <input
            name="notes"
            placeholder="Notes"
            value={item.notes}
            onChange={(e) => handleChange(e, index)}
          />
          <input
            name="costEstimate"
            type="number"
            placeholder="Cost Estimate"
            value={item.costEstimate || ''}
            onChange={(e) => handleChange(e, index)}
          />
          <button className="btn btn-remove-item" type="button" onClick={() => removeItineraryItem(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="btn btn-add-item" type="button" onClick={addItineraryItem}>
        Add Itinerary Item
      </button>
    </div>
  );
};

export default TripItineraryStep;
