import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TripBasicInfoStep from './TripBasicInfoStep';
import TripDescriptionStep from './TripDescriptionStep';
import TripItineraryStep from './TripItineraryStep';
import TripPricingStep from './TripPricingStep';
import TripTagsStep from './TripTagsStep';
import './TripCreationForm.css';

const steps = [
    { component: TripBasicInfoStep, name: "Basic Information" },
    { component: TripDescriptionStep, name: "Trip Details" },
    { component: TripItineraryStep, name: "Itinerary Plan" },
    { component: TripPricingStep, name: "Participants & Pricing" },
    { component: TripTagsStep, name: "Categorization Tags" }
];

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
      location: '', startDate: '', endDate: '', // order is auto-managed
      photos: [], notes: '', transportation: [],
      accommodation: '', geoLocation: { lat: '', lng: '' },
      activities: [], costEstimate: ''
    }],
    minParticipants: '',
    maxParticipants: '',
    price: '',
    tags: [''], // Start with one empty tag field
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const CurrentStepComponent = steps[step].component;

  const validateStep = () => {
    setError(''); // Clear previous errors
    const { title, startDate, endDate, description, itinerary, minParticipants, maxParticipants, price, tags } = formData;

    switch (step) {
      case 0: // Basic Info
        if (!title.trim()) { setError("Trip title is required."); return false; }
        if (!startDate) { setError("Start date is required."); return false; }
        if (!endDate) { setError("End date is required."); return false; }
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
          setError("End date cannot be before start date."); return false;
        }
        return true;
      case 1: // Description
        if (!description.overview.trim()) { setError("Trip overview is required."); return false; }
        // Optional: validate inclusions/exclusions if needed (e.g., at least one)
        return true;
      case 2: // Itinerary
        if (itinerary.length === 0) { setError("At least one itinerary stop is required."); return false;}
        for (let i = 0; i < itinerary.length; i++) {
          const item = itinerary[i];
          if (!item.location.trim()) { setError(`Location for itinerary item #${i + 1} is required.`); return false; }
          if (!item.startDate) { setError(`Start date for itinerary item #${i + 1} is required.`); return false; }
          if (!item.endDate) { setError(`End date for itinerary item #${i + 1} is required.`); return false; }
          if (item.startDate && item.endDate && new Date(item.startDate) > new Date(item.endDate)) {
            setError(`End date cannot be before start date for itinerary item #${i + 1}.`); return false;
          }
        }
        return true;
      case 3: // Pricing
        if (minParticipants === '' || Number(minParticipants) < 1) { setError("Minimum participants must be at least 1."); return false; }
        if (maxParticipants === '' || Number(maxParticipants) < Number(minParticipants)) { setError("Maximum participants must be equal to or greater than minimum participants."); return false; }
        if (price === '' || Number(price) < 0) { setError("Price cannot be negative."); return false; }
        return true;
      case 4: // Tags
        if (tags.filter(tag => tag.trim() !== "").length === 0) { setError("At least one tag is recommended."); return true; } // Making tags optional but recommended
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }
    setError('');
    setStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setError('');
    setStep(prevStep => Math.max(prevStep - 1, 0));
  };


  const handleSubmit = async () => {
    if (!validateStep()) { // Final validation before submit
        setError("Please review the form. Some fields might be missing or invalid in the current step.");
        return;
    }
    // Additional check for all steps if needed, or rely on step-by-step validation.
    setError('');
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
    }

    const payload = {
      ...formData,
      minParticipants: Number(formData.minParticipants) || 0,
      maxParticipants: Number(formData.maxParticipants) || 0,
      price: Number(formData.price) || 0,
      itinerary: formData.itinerary.map((item, index) => ({
        ...item,
        order: index + 1, // Ensure order is set correctly
        costEstimate: Number(item.costEstimate) || 0,
        geoLocation: {
          lat: Number(item.geoLocation.lat) || 0,
          lng: Number(item.geoLocation.lng) || 0,
        }
      })),
      tags: formData.tags.filter(tag => tag.trim() !== ""), // Filter out empty tags
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
      
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || 'Failed to create trip.');
      navigate('/trips'); // Or to the newly created trip's page
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-form-container">
      <h2>Create a New Trip</h2>
      {error && <p className="error-message">{error}</p>}

      <CurrentStepComponent formData={formData} setFormData={setFormData} error={error} setError={setError} />

      <div className='progress-container'>
        <div className="progress-bar" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <div style={{textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9em', color: 'var(--text-color-muted)'}}>
          Step {step + 1} of {steps.length}: {steps[step].name}
      </div>


      <div className="form-navigation">
        {step > 0 && <button className="btn btn-secondary" onClick={handlePrevious}>Previous</button>}
        {step < steps.length - 1 ? (
          <button className="btn btn-primary" onClick={handleNext}>Next</button>
        ) : (
          <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving Trip...' : 'Create Trip'}
          </button>
        )}
      </div>

      <div className="ai-suggestion-link-container">
        <p>Need inspiration or a quick plan?</p>
        <Link to="/trip-ai-suggestion">
          <button className="btn btn-outline-primary ai-suggestion-button">Get AI Trip Suggestion</button>
        </Link>
      </div>
    </div>
  );
};

export default TripCreationForm;