import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripCreationForm.css';

const TripCreationForm = () => {
  const totalSteps = 5;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    tags: [''],
    description: {
      overview: '',
      inclusions: [''],
      exclusions: [''],
    },
    itinerary: [{
      order: 1,
      location: '',
      startDate: '',
      endDate: '',
      photos: [],
      notes: '',
      transportation: [''],
      accommodation: '',
      geoLocation: { lat: '', lng: '' },
      activities: [''],
      costEstimate: ''
    }],
    minParticipants: '',
    maxParticipants: '',
    price: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('description')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [key]: value },
      }));
    } else if (name.startsWith('itinerary')) {
      const [, index, key, subkey] = name.split('.');
      const updatedItinerary = [...formData.itinerary];
      if (subkey) {
        updatedItinerary[index][key][subkey] = value;
      } else {
        updatedItinerary[index][key] = value;
      }
      setFormData((prev) => ({ ...prev, itinerary: updatedItinerary }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleListChange = (type, index, value, listRoot = 'description') => {
    const updatedList = [...formData[listRoot][type]];
    updatedList[index] = value;
    setFormData((prev) => ({
      ...prev,
      [listRoot]: {
        ...prev[listRoot],
        [type]: updatedList
      },
    }));
  };

  const addListItem = (type, listRoot = 'description') => {
    setFormData((prev) => ({
      ...prev,
      [listRoot]: {
        ...prev[listRoot],
        [type]: [...prev[listRoot][type], '']
      },
    }));
  };

  const removeListItem = (type, index, listRoot = 'description') => {
    const updatedList = [...formData[listRoot][type]];
    updatedList.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      [listRoot]: {
        ...prev[listRoot],
        [type]: updatedList
      },
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
          photos: [],
          notes: '',
          transportation: [''],
          accommodation: '',
          geoLocation: { lat: '', lng: '' },
          activities: [''],
          costEstimate: ''
        }
      ]
    }));
  };

  const removeItineraryItem = (index) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      itinerary: updatedItinerary.map((item, idx) => ({ ...item, order: idx + 1 }))
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

    const payload = {
      ...formData,
      minParticipants: Number(formData.minParticipants),
      maxParticipants: Number(formData.maxParticipants),
      price: Number(formData.price),
      itinerary: formData.itinerary.map(item => ({
        ...item,
        costEstimate: Number(item.costEstimate),
        geoLocation: {
          lat: Number(item.geoLocation.lat),
          lng: Number(item.geoLocation.lng),
        }
      }))
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create trip');
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
      <h2>Create a New Trip</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="trip-form">
        {step === 1 && (
          <>
            <input name="title" placeholder="Trip Title" value={formData.title} onChange={handleChange} required />
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
            <h4>Tags</h4>
            {formData.tags.map((tag, idx) => (
              <div key={idx}>
                <input value={tag} onChange={(e) => handleListChange('tags', idx, e.target.value, '')} />
                <button type="button" onClick={() => removeListItem('tags', idx, '')}>X</button>
              </div>
            ))}
            <button type="button" onClick={() => addListItem('tags', '')}>+ Add Tag</button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Description</h3>
            <input name="description.overview" placeholder="Overview" value={formData.description.overview} onChange={handleChange} required />
            {['inclusions', 'exclusions'].map((type) => (
              <div key={type}>
                <h4>{type}</h4>
                {formData.description[type].map((item, idx) => (
                  <div key={idx}>
                    <input value={item} onChange={(e) => handleListChange(type, idx, e.target.value)} />
                    <button type="button" onClick={() => removeListItem(type, idx)}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => addListItem(type)}>+ Add</button>
              </div>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <h3>Itinerary</h3>
            {formData.itinerary.map((item, index) => (
              <div key={index} className="itinerary-item">
                <input name={`itinerary.${index}.location`} placeholder="Location" value={item.location} onChange={handleChange} required />
                <input type="date" name={`itinerary.${index}.startDate`} value={item.startDate} onChange={handleChange} required />
                <input type="date" name={`itinerary.${index}.endDate`} value={item.endDate} onChange={handleChange} required />
                <input name={`itinerary.${index}.accommodation`} placeholder="Accommodation" value={item.accommodation} onChange={handleChange} required />
                <input name={`itinerary.${index}.notes`} placeholder="Notes" value={item.notes} onChange={handleChange} />
                <input name={`itinerary.${index}.geoLocation.lat`} placeholder="Latitude" value={item.geoLocation.lat} onChange={handleChange} />
                <input name={`itinerary.${index}.geoLocation.lng`} placeholder="Longitude" value={item.geoLocation.lng} onChange={handleChange} />
                <input type="number" name={`itinerary.${index}.costEstimate`} placeholder="Cost Estimate" value={item.costEstimate} onChange={handleChange} />
                <h5>Transportation</h5>
                {item.transportation.map((t, tIdx) => (
                  <div key={tIdx}>
                    <input value={t} onChange={(e) => handleListChange('transportation', tIdx, e.target.value, `itinerary[${index}]`)} />
                    <button type="button" onClick={() => removeListItem('transportation', tIdx, `itinerary[${index}]`)}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => addListItem('transportation', `itinerary[${index}]`)}>+ Transport</button>
                <h5>Activities</h5>
                {item.activities.map((a, aIdx) => (
                  <div key={aIdx}>
                    <input value={a} onChange={(e) => handleListChange('activities', aIdx, e.target.value, `itinerary[${index}]`)} />
                    <button type="button" onClick={() => removeListItem('activities', aIdx, `itinerary[${index}]`)}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => addListItem('activities', `itinerary[${index}]`)}>+ Activity</button>
                <button type="button" onClick={() => removeItineraryItem(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addItineraryItem}>+ Add Itinerary</button>
          </>
        )}

        {step === 4 && (
          <>
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
          </>
        )}

        <div className="form-navigation">
          {step > 1 && <button type="button" onClick={() => setStep(step - 1)}>Previous</button>}
          {step < totalSteps ? (
            <button type="button" onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
          )}
        </div>
      </form>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default TripCreationForm;
