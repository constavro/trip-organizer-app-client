// src/components/Trips/TripEditForm/TripEditForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TripEditForm.css';

// Import date utils
import {
  formatDateForInput,
} from './dateUtils'; // Adjusted path

// Import sub-components
import TripBasicInfo from './TripBasicInfo';
import TripDescription from './TripDescription';
import TripItinerary from './TripItinerary';
import TripParticipantsPricing from './TripParticipantsPricing';
import TripSettingsPolicy from './TripSettingsPolicy';

// Defined outside component to maintain stable identity
const initialTripData = {
    title: '',
    startDate: '',
    endDate: '',
    description: { overview: '', inclusions: [], exclusions: [] },
    coverImage: '',
    photos: [],
    itinerary: [],
    minParticipants: 1,
    maxParticipants: 10,
    price: 0,
    tags: [],
    privacy: 'public',
    status: 'open',
    cancellationPolicy: '',
    bookingDeadline: '',
};

const TripEditForm = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication required. Please log in.");
            setLoading(false);
            setFormData(null);
            return;
        }
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${tripId}`, {
          headers: { Authorization: token }
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch trip data.');
        }
        const data = await res.json();
        
        const formattedStartDate = formatDateForInput(data.startDate);
        const formattedEndDate = formatDateForInput(data.endDate);

        setFormData({
          ...initialTripData,
          ...data,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          bookingDeadline: data.bookingDeadline ? formatDateForInput(data.bookingDeadline) : '',
          description: { // Ensure description and its sub-properties are well-defined
            ...initialTripData.description, 
            ...(data.description || {}) 
          },
          tags: data.tags || [],
        });
        setError('');
      } catch (err) {
        console.error("Fetch trip error:", err);
        setError(err.message);
        setFormData(null);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    } else {
      setError('No Trip ID provided. Cannot load trip data.');
      setLoading(false);
      setFormData(null);
    }
  }, [tripId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setError('');

    setFormData(prev => {
        if (!prev) return null;
        const newState = { ...prev };
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            const parentObject = newState[parent] || {};
            newState[parent] = { ...parentObject, [child]: val };
        } else {
            newState[name] = val;
        }
        return newState;
    });
  };

  const handleListChange = (e, index, fieldName) => {
    const { value } = e.target;
    const path = fieldName.split('.');
    
    setFormData(prev => {
        if (!prev) return null;
        const newState = { ...prev };
        let currentLevel = newState;

        for (let i = 0; i < path.length - 1; i++) {
            if (!currentLevel[path[i]]) { // Ensure path segment exists
                currentLevel[path[i]] = {}; // Or handle error/return prev
            }
            currentLevel = currentLevel[path[i]];
        }
        const listName = path[path.length - 1];
        if (!Array.isArray(currentLevel[listName])) {
            currentLevel[listName] = [];
        }

        const list = [...currentLevel[listName]];
        list[index] = value;
        currentLevel[listName] = list;
        return newState;
    });
  };

  const addListItem = (fieldName) => {
    const path = fieldName.split('.');
    setFormData(prev => {
        if (!prev) return null;
        const newState = { ...prev };
        let currentLevel = newState;
        for (let i = 0; i < path.length - 1; i++) {
            if (!currentLevel[path[i]]) {
                currentLevel[path[i]] = {};
            }
            currentLevel = currentLevel[path[i]];
        }
        const listName = path[path.length - 1];
        currentLevel[listName] = Array.isArray(currentLevel[listName]) 
                                 ? [...currentLevel[listName], ''] 
                                 : [''];
        return newState;
    });
  };

  const removeListItem = (index, fieldName) => {
    const path = fieldName.split('.');
     setFormData(prev => {
        if (!prev) return null;
        const newState = { ...prev };
        let currentLevel = newState;
        for (let i = 0; i < path.length - 1; i++) {
            if (!currentLevel[path[i]]) return prev; // Path segment not found
            currentLevel = currentLevel[path[i]];
        }
        const listName = path[path.length - 1];
        if (!Array.isArray(currentLevel[listName])) return prev;

        const list = [...currentLevel[listName]];
        list.splice(index, 1);
        currentLevel[listName] = list;
        return newState;
    });
  };

  const handleItineraryChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prev => {
        if (!prev) return null;
        const updatedItinerary = [...prev.itinerary];
        const item = { ...updatedItinerary[index] };

        if (name.startsWith("geoLocation.")) {
            item.geoLocation = {};
        } else if (name === "days") {
            item[name] = parseInt(value) || 1; // Default to 1 if invalid
        } else {
            item[name] = value;
        }
        updatedItinerary[index] = item;
        
        if (name === "days") {
            return {
                ...prev,
                itinerary: updatedItinerary
            };
        }
        return { ...prev, itinerary: updatedItinerary };
    });
  };

  const addItineraryStop = () => {
    setFormData(prev => {
        if (!prev) return null;
        const newStop = {
            _id: `new_${Date.now()}`,
            location: '', days: 1, startDate: '', endDate: '', accommodation: '',
            notes: '', costEstimate: 0, geoLocation: { lat: '', lng: '' },
            transportation: [], activities: [], order: prev.itinerary.length
        };
        return {
            ...prev,
            itinerary: [...prev.itinerary, newStop]
        };
    });
  };

  const removeItineraryStop = (index) => {
    setFormData(prev => {
        if (!prev || !prev.itinerary) return null;
        if (prev.itinerary.length <= 1 && !window.confirm("Removing the last itinerary stop will clear the itinerary. Are you sure?")) {
            return prev;
        }
        const updatedItinerary = prev.itinerary.filter((_, i) => i !== index);
        return {
            ...prev,
            itinerary: updatedItinerary
        };
    });
  };

  const moveItineraryItem = (order, direction) => {
    setFormData(prev => {
      if (!prev) return null;
  
      // Clone and sort the itinerary by order
      const sorted = [...prev.itinerary].sort((a, b) => a.order - b.order);
      const currentIndex = sorted.findIndex(item => item.order === order);
      const newIndex = currentIndex + direction;
  
      if (newIndex < 0 || newIndex >= sorted.length) return prev;
  
      // Swap order values
      const temp = sorted[currentIndex].order;
      sorted[currentIndex].order = sorted[newIndex].order;
      sorted[newIndex].order = temp;
  
      return {
        ...prev,
        itinerary: sorted,
      };
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const durationInMs = new Date(formData.endDate) - new Date(formData.startDate) + 1;
    const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));

    if (!formData) {
        setError("Form data is not available. Cannot submit.");
        return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("Trip end date cannot be before the start date.");
      return;
    }
    if (formData.minParticipants > formData.maxParticipants) {
        setError("Min participants cannot exceed max participants.");
        return;
    }
    if (durationInDays !== formData.itinerary.reduce((sum, item) => sum + item.days, 0)) {
        setError("Days cannot be different from trip duration.");
        return;
    }
    if (formData.bookingDeadline && new Date(formData.bookingDeadline) > new Date(formData.endDate)) {
        setError("Booking deadline cannot be after the trip end date.");
        return;
    }


    const payload = {
      ...formData,
      description: { // Ensure all description fields are present
        overview: formData.description?.overview || '',
        inclusions: formData.description?.inclusions || [],
        exclusions: formData.description?.exclusions || [],
      },
      itinerary: formData.itinerary.map((item, index) => ({
        ...item,
        _id: item._id?.startsWith('new_') ? undefined : item._id,
        order: index, 
        days: parseInt(item.days) || 1,
        costEstimate: parseFloat(item.costEstimate) || 0,
        geoLocation: '',
      })),
    };


    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to update trip.');
      }
      setSuccessMessage('Trip updated successfully! Redirecting...');
      setError('');
      setTimeout(() => navigate(`/trips/${tripId}`), 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Potentially add a confirmation dialog here if there are unsaved changes
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate(`/trips/${tripId}`);
    }
  };

  if (loading && !formData) return <div className="loading-container"><p>Loading trip details...</p></div>;
  if (error && !formData) return <div className="error-container"><p>{error}</p><button onClick={() => window.location.reload()}>Try Again</button></div>;
  if (!formData) return <div className="error-container"><p>No trip data available or failed to load.</p></div>;

  return (
    <div className="trip-edit-form-container">
      <h2>Edit Trip: {formData.title || 'New Trip'}</h2>
      {error && <p className="error-message main-error">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <TripBasicInfo
          title={formData.title}
          startDate={formData.startDate}
          endDate={formData.endDate}
          coverImage={formData.coverImage}
          handleChange={handleChange}
        />

        <TripDescription
          description={formData.description}
          handleChange={handleChange}
          handleListChange={handleListChange}
          addListItem={addListItem}
          removeListItem={removeListItem}
        />
        
        <TripItinerary
          itinerary={formData.itinerary}
          tripStartDate={formData.startDate}
          tripEndDate={formData.endDate}
          onItineraryChange={handleItineraryChange}
          onAddStop={addItineraryStop}
          onRemoveStop={removeItineraryStop}
          onMoveItem={moveItineraryItem}
        />

        <TripParticipantsPricing
          minParticipants={formData.minParticipants}
          maxParticipants={formData.maxParticipants}
          currentParticipants={formData.currentParticipants}
          price={formData.price}
          handleChange={handleChange}
        />

        <TripSettingsPolicy
          privacy={formData.privacy}
          bookingDeadline={formData.bookingDeadline}
          tags={formData.tags}
          handleChange={handleChange}
          handleListChange={handleListChange}
          addListItem={addListItem}
          removeListItem={removeListItem}
        />
        
        <button type="submit" className="btn btn-primary btn-submit-edit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button 
            type="button" 
            className="btn btn-secondary btn-cancel" // Added a class for styling
            onClick={handleCancel}
            disabled={loading || successMessage} // Disable if loading or successfully submitted
          >
            Cancel
          </button>
      </form>
    </div>
  );
};

export default TripEditForm;