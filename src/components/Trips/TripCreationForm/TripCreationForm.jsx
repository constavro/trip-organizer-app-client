import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TripBasicInfoStep from './TripBasicInfoStep';
import TripDescriptionStep from './TripDescriptionStep';
import TripItineraryStep from './TripItineraryStep';
import TripPricingStep from './TripPricingStep';
import TripTagsStep from './TripTagsStep';
import './TripCreationForm.css';

const steps = [TripBasicInfoStep, TripDescriptionStep, TripItineraryStep, TripPricingStep, TripTagsStep];

const TripCreationForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: {
      overview: '',
      inclusions: [''],
      exclusions: [''],
    },
    itinerary: [{
      order: 1, location: '', startDate: '', endDate: '',
      photos: [], notes: '', transportation: [],
      accommodation: '', geoLocation: { lat: '', lng: '' },
      activities: [], costEstimate: ''
    }],
    minParticipants: '',
    maxParticipants: '',
    price: '',
    tags: [],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const StepComponent = steps[step];

  const validateStep = () => {
    const { title, startDate, endDate, description, itinerary, minParticipants, maxParticipants, price, tags } = formData;

    switch (step) {
      case 0: // Basic Info
        return title.trim() && startDate && endDate;
      case 1: // Description
        return description.overview.trim();
      case 2: // Itinerary
        return itinerary.length > 0 && itinerary.every(item =>
          item.location.trim() && item.startDate && item.endDate
        );
      case 3: // Pricing
        return minParticipants && maxParticipants && price;
      case 4: // Tags
        return tags.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      setError('Please fill in all required fields before continuing.');
      return;
    }
    setError('');
    setStep(step + 1);
  };


  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return setError('Not logged in');

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
      })),
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

      if (!res.ok) throw new Error((await res.json()).message);
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

      <StepComponent formData={formData} setFormData={setFormData} />

      <div className="form-navigation">
        {step > 0 && <button onClick={() => setStep(step - 1)}>Previous</button>}
        {step < steps.length - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Submit'}
          </button>
        )}
      </div>
      <div className='progress-container'>
      <div className="progress-bar" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
      </div>

      <div className="ai-suggestion-link">
  <p>Need help planning?</p>
  <Link to="/trip-ai-suggestion">
    <button className="ai-suggestion-button">Get AI Trip Suggestion</button>
  </Link>
</div>

      </div>

  );
};

export default TripCreationForm;
