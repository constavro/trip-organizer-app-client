import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TripCreationForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    departureDate: '',
    description: {
      overview: '',
      aboutYou: '',
      accommodation: '',
      inclusions: [],
      exclusions: [],
    },
    itinerary: [{ order: 1, location: '', nights: '', itineraryDescription: '' }],
    minParticipants: '',
    maxParticipants: '',
    price: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('description')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        description: {
          ...prev.description,
          [key]: value,
        },
      }));
    } else if (name.startsWith('itinerary')) {
      const index = parseInt(name.split('.')[1]);
      const key = name.split('.')[2];
      setFormData((prev) => {
        const updatedItinerary = [...prev.itinerary];
        updatedItinerary[index][key] = value;
        return { ...prev, itinerary: updatedItinerary };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add a new item to inclusions or exclusions
  const addListItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [type]: [...prev.description[type], ''],
      },
    }));
  };

  // Handle inclusions or exclusions change
  const handleListChange = (type, index, value) => {
    setFormData((prev) => {
      const updatedList = [...prev.description[type]];
      updatedList[index] = value;
      return {
        ...prev,
        description: {
          ...prev.description,
          [type]: updatedList,
        },
      };
    });
  };

  // Add a new itinerary entry
  const addItineraryItem = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { order: prev.itinerary.length + 1, location: '', nights: '', itineraryDescription: '' },
      ],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form Data:', formData);

    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    if (!token) {
      return setError('You must be logged in to create a trip');
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          ...formData,
          itinerary: formData.itinerary.map((item) => ({
            ...item,
            nights: Number(item.nights),
          })),
          price: Number(formData.price),
          minParticipants: Number(formData.minParticipants),
          maxParticipants: Number(formData.maxParticipants),
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Error creating trip');
      }

      navigate('/trips'); // Redirect to the trips page after successful creation
    } catch (err) {
      setError(err.message || 'Error creating trip');
    }
  };

  return (
    <div>
      <h2>Create a New Trip</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} value={formData.title} required />
        <input type="date" name="departureDate" onChange={handleChange} value={formData.departureDate} required />

        <h3>Description</h3>
        <input
          type="text"
          name="description.overview"
          placeholder="Overview"
          onChange={handleChange}
          value={formData.description.overview}
          required
        />
        <input
          type="text"
          name="description.aboutYou"
          placeholder="About You"
          onChange={handleChange}
          value={formData.description.aboutYou}
          required
        />
        <input
          type="text"
          name="description.accommodation"
          placeholder="Accommodation"
          onChange={handleChange}
          value={formData.description.accommodation}
          required
        />

        <h4>Inclusions</h4>
        {formData.description.inclusions.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleListChange('inclusions', index, e.target.value)}
              placeholder={`Inclusion ${index + 1}`}
              required
            />
          </div>
        ))}
        <button type="button" onClick={() => addListItem('inclusions')}>
          Add Inclusion
        </button>

        <h4>Exclusions</h4>
        {formData.description.exclusions.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleListChange('exclusions', index, e.target.value)}
              placeholder={`Exclusion ${index + 1}`}
              required
            />
          </div>
        ))}
        <button type="button" onClick={() => addListItem('exclusions')}>
          Add Exclusion
        </button>

        <h3>Itinerary</h3>
        {formData.itinerary.map((item, index) => (
          <div key={index}>
            <input
              type="number"
              name={`itinerary.${index}.order`}
              placeholder="Order"
              onChange={handleChange}
              value={item.order}
              required
            />
            <input
              type="text"
              name={`itinerary.${index}.location`}
              placeholder="Location"
              onChange={handleChange}
              value={item.location}
              required
            />
            <input
              type="number"
              name={`itinerary.${index}.nights`}
              placeholder="Nights"
              onChange={handleChange}
              value={item.nights}
              required
            />
            <input
              type="text"
              name={`itinerary.${index}.itineraryDescription`}
              placeholder="Itinerary Description"
              onChange={handleChange}
              value={item.itineraryDescription}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addItineraryItem}>
          Add Itinerary Item
        </button>

        <h3>Other Details</h3>
        <input
          type="number"
          name="minParticipants"
          placeholder="Min Participants"
          onChange={handleChange}
          value={formData.minParticipants}
          required
        />
        <input
          type="number"
          name="maxParticipants"
          placeholder="Max Participants"
          onChange={handleChange}
          value={formData.maxParticipants}
          required
        />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} value={formData.price} required />

        <button type="submit">Create Trip</button>
      </form>
    </div>
  );
};

export default TripCreationForm;
