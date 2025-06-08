import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TripEditForm.css';
import PhotoUploader from '../../Shared/PhotoUploader'; 
import PhotosDelete from '../../Shared/PhotosDelete';

// Import date utils
import {
  formatDateForInput,
} from './dateUtils'; // Adjusted path

// Import sub-components
import TripBasicInfo from './TripBasicInfo';
import TripDescription from './TripDescription';
import TripItinerary from './TripItinerary'; // For detail editing
import TripItineraryReorder from './TripItineraryReorder'; // For reordering
import TripParticipantsPricing from './TripParticipantsPricing';
import TripSettingsPolicy from './TripSettingsPolicy';
import FormSection from './FormSection';

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

        const sortedItinerary = (data.itinerary || []).sort((a, b) => a.order - b.order);

        setFormData({
          ...initialTripData,
          ...data,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          bookingDeadline: data.bookingDeadline ? formatDateForInput(data.bookingDeadline) : '',
          description: {
            ...initialTripData.description, 
            ...(data.description || {}) 
          },
          tags: data.tags || [],
          itinerary: sortedItinerary,
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
            if (!currentLevel[path[i]]) { 
                currentLevel[path[i]] = {};
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
            if (!currentLevel[path[i]]) return prev; 
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
        if (!prev || !prev.itinerary) return null;
        const updatedItinerary = [...prev.itinerary];
        const itemToUpdate = { ...updatedItinerary[index] };

        if (name.startsWith("geoLocation.")) {
            const geoField = name.split('.')[1];
            itemToUpdate.geoLocation = { ...(itemToUpdate.geoLocation || {}), [geoField]: value };
        } else if (name === "days") {
            itemToUpdate[name] = parseInt(value) || 1; 
        } else {
            itemToUpdate[name] = value;
        }
        updatedItinerary[index] = itemToUpdate;
        
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
            transportation: [], activities: [], 
            order: prev.itinerary ? prev.itinerary.length : 0
        };
        const newItinerary = prev.itinerary ? [...prev.itinerary, newStop] : [newStop];
        return {
            ...prev,
            itinerary: newItinerary
        };
    });
  };

  const removeItineraryStop = (indexToRemove) => {
    setFormData(prev => {
        if (!prev || !prev.itinerary) return null;
        if (prev.itinerary.length <= 1 && !window.confirm("Removing the last itinerary stop will clear the itinerary. Are you sure?")) {
            return prev;
        }
        let updatedItinerary = prev.itinerary.filter((_, i) => i !== indexToRemove);
        updatedItinerary = updatedItinerary.map((item, i) => ({ ...item, order: i }));
        
        return {
            ...prev,
            itinerary: updatedItinerary
        };
    });
  };

  const moveItineraryItem = (sourceIndex, destinationIndex) => {
    setFormData(prev => {
      if (!prev || !prev.itinerary) return null;
      if (sourceIndex === destinationIndex) return prev;

      const newItinerary = Array.from(prev.itinerary); 
      const [movedItem] = newItinerary.splice(sourceIndex, 1); 
      newItinerary.splice(destinationIndex, 0, movedItem); 

      const updatedItineraryWithOrder = newItinerary.map((item, index) => ({
        ...item,
        order: index,
      }));

      return {
        ...prev,
        itinerary: updatedItineraryWithOrder,
      };
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData) {
        setError("Form data is not available. Cannot submit.");
        return;
    }

    const durationInMs = new Date(formData.endDate) - new Date(formData.startDate) + 1;
    const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("Trip end date cannot be before the start date.");
      return;
    }
    if (formData.minParticipants > formData.maxParticipants) {
        setError("Min participants cannot exceed max participants.");
        return;
    }
    const itineraryDays = formData.itinerary ? formData.itinerary.reduce((sum, item) => sum + (parseInt(item.days) || 0), 0) : 0;
    if (formData.itinerary && formData.itinerary.length > 0 && durationInDays !== itineraryDays) {
        setError("Total days in itinerary must match the trip duration.");
        return;
    }
    if (formData.bookingDeadline && new Date(formData.bookingDeadline) > new Date(formData.endDate)) {
        setError("Booking deadline cannot be after the trip end date.");
        return;
    }

    const payload = {
      ...formData,
      description: { 
        overview: formData.description?.overview || '',
        inclusions: formData.description?.inclusions || [],
        exclusions: formData.description?.exclusions || [],
      },
      itinerary: (formData.itinerary || []).map((item, index) => ({
        ...item,
        _id: item._id?.startsWith('new_') ? undefined : item._id, 
        order: index, 
        days: parseInt(item.days) || 1,
        costEstimate: parseFloat(item.costEstimate) || 0,
        geoLocation: item.geoLocation || { lat: '', lng: '' }, 
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
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate(`/trips/${tripId}`);
    }
  };

  if (loading && !formData) return (
    <div className="trip-edit-form-container">
      <div className="loading-container"><p>Loading trip details...</p></div>
    </div>
  );
  if (error && !formData) return (
    <div className="trip-edit-form-container">
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    </div>
  );
  if (!formData) return (
    <div className="trip-edit-form-container">
      <div className="error-container"><p>No trip data available or failed to load.</p></div>
    </div>
  );

  return (
    <div className="trip-edit-form-container">
      <div className="trip-edit-form-header">
        <h2>Edit Trip: {formData.title || 'New Trip'}</h2>
      </div>
      
      {error && <p className="error-message main-error">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="trip-edit-form-content">
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
            itinerary={formData.itinerary || []}
            tripStartDate={formData.startDate}
            tripEndDate={formData.endDate}
            onItineraryChange={handleItineraryChange}
            onAddStop={addItineraryStop}
            onRemoveStop={removeItineraryStop}
          />

          <TripItineraryReorder
            itinerary={formData.itinerary || []}
            onMoveItem={moveItineraryItem}
          />

        <FormSection title="Photos">
          <PhotosDelete
          photos={formData.photos}
          feature= "trips"
          onPhotoRemoved={(removedPath) =>
            setFormData((prev) => ({
              ...prev,
              photos: prev.photos.filter((photo) => photo !== removedPath),
            }))
          }
          onPhotoDeleteError={(errMsg) => setError(errMsg || "Failed to delete photo.")} // UX: Show error for photo deletion
        />

        <PhotoUploader
          feature = "trips"
          onUpload={(imagePath) =>
            setFormData((prev) => ({
              ...prev,
              photos: [...prev.photos, imagePath],
            }))
          }
          // endpoint="/api/users/upload-gallery-photo" // Example if different endpoint
        />
        </FormSection>

          <TripParticipantsPricing
            minParticipants={formData.minParticipants}
            maxParticipants={formData.maxParticipants}
            currentParticipants={formData.currentParticipants || 0}
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
          
          <div className="trip-edit-actions-section">
            <button type="submit" className="btn btn-primary" disabled={loading || !!successMessage}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading || !!successMessage} 
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripEditForm;