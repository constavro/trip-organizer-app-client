import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripCreationForm.css';

const TripCreationForm = ({ tripToEdit = null }) => {
  const [formData, setFormData] = useState(
    tripToEdit || {
      title: '',
      departureDate: '',
      description: {
        overview: '',
        aboutYou: '',
        accommodation: '',
        inclusions: [''],
        exclusions: [''],
      },
      itinerary: [{ order: 1, location: '', nights: '', itineraryDescription: '' }],
      minParticipants: '',
      maxParticipants: '',
      price: '',
    }
  );

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('description')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [key]: value },
      }));
    } else if (name.startsWith('itinerary')) {
      const [_, index, key] = name.split('.');
      const updatedItinerary = [...formData.itinerary];
      updatedItinerary[index][key] = value;
      setFormData((prev) => ({ ...prev, itinerary: updatedItinerary }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleListChange = (type, index, value) => {
    const updatedList = [...formData.description[type]];
    updatedList[index] = value;
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [type]: updatedList },
    }));
  };

  const addListItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [type]: [...prev.description[type], ''] },
    }));
  };

  const removeListItem = (type, index) => {
    const updatedList = [...formData.description[type]];
    updatedList.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [type]: updatedList },
    }));
  };

  const addItineraryItem = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { order: prev.itinerary.length + 1, location: '', nights: '', itineraryDescription: '' },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a trip');
      setLoading(false);
      return;
    }

    // Payload validation
    const payload = {
      ...formData,
      minParticipants: Number(formData.minParticipants),
      maxParticipants: Number(formData.maxParticipants),
      price: Number(formData.price),
      itinerary: formData.itinerary.map((item) => ({
        ...item,
        nights: Number(item.nights),
      })),
    };

    if (payload.minParticipants > payload.maxParticipants) {
      setError('Minimum participants cannot exceed maximum participants.');
      setLoading(false);
      return;
    }

    try {
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/trips`;
      const method = tripToEdit ? 'PUT' : 'POST';
      const res = await fetch(tripToEdit ? `${url}/${tripToEdit._id}` : url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Error saving trip');
      }

      navigate('/trips');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-form-container">
      <h2>{tripToEdit ? 'Edit Trip' : 'Create a New Trip'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="trip-form">
        <input name="title" placeholder="Trip Title" value={formData.title} onChange={handleChange} required />
        <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />

        <h3>Description</h3>
        {['overview', 'aboutYou', 'accommodation'].map((field) => (
          <input
            key={field}
            name={`description.${field}`}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData.description[field]}
            onChange={handleChange}
            required
          />
        ))}

        {['inclusions', 'exclusions'].map((type) => (
          <div key={type} className="form-list">
            <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            {formData.description[type].map((item, idx) => (
              <div key={idx} className="list-item">
                <input
                  placeholder={`${type.slice(0, -1)} ${idx + 1}`}
                  value={item}
                  onChange={(e) => handleListChange(type, idx, e.target.value)}
                />
                <button type="button" onClick={() => removeListItem(type, idx)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem(type)}>
              Add {type.slice(0, -1)}
            </button>
          </div>
        ))}

        <h3>Itinerary</h3>
        {formData.itinerary.map((item, index) => (
          <div key={index} className="itinerary-item">
            {['order', 'location', 'nights', 'itineraryDescription'].map((key) => (
              <input
                key={key}
                name={`itinerary.${index}.${key}`}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={item[key]}
                onChange={handleChange}
                required
              />
            ))}
            <button type="button" onClick={() => removeItineraryItem(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItineraryItem}>
          Add Itinerary Item
        </button>

        {['minParticipants', 'maxParticipants', 'price'].map((field) => (
          <input
            key={field}
            type="number"
            name={field}
            placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
            value={formData[field]}
            onChange={handleChange}
            required
          />
        ))}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : tripToEdit ? 'Update Trip' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
};

export default TripCreationForm;