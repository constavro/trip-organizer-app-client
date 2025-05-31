import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Booking.css'; // Updated import

const BookingForm = () => {
  const { id } = useParams(); // tripId
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      setIsLoadingTrip(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to book a trip.');
        setIsLoadingTrip(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch trip details');
        }

        const data = await res.json();
        setTrip(data);
      } catch (err) {
        setError(err.message || 'Error fetching trip details');
        console.error("Fetch trip error:", err);
      } finally {
        setIsLoadingTrip(false);
      }
    };

    if (id) {
        fetchTripDetails();
    } else {
        setError("Trip ID is missing.");
        setIsLoadingTrip(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to book a trip.');
      return;
    }

    if (!window.confirm('Do you want to confirm this booking?')) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ tripId: id })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Booking failed');
      }

      setSuccess('Booking successful! You can view your bookings in your profile.');
    } catch (err) {
      setError(err.message || 'Error making booking');
      console.error("Booking submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTrip) return <p className="loading-message">Loading trip details...</p>;
  if (error && !trip) return <p className="error-message container">{error}</p>; // Show error prominently if trip fails to load
  if (!trip) return <p className="status-message container">Trip not found.</p>;


  return (
    <div className="booking-form-container card"> {/* Added card class */}
      <h2>Book: {trip.title}</h2>
      {error && <p className="error-message">{error}</p>} {/* Moved error inside card if trip loaded */}
      <div className="booking-form-details">
        <p><strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</p>
        <p><strong>Price:</strong> ${trip.price != null ? trip.price.toFixed(2) : 'N/A'}</p>
        {trip.description && trip.description.overview && <p><strong>Overview:</strong> {trip.description.overview}</p>}
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit" className="btn btn-lg" disabled={isSubmitting || success}> {/* Applied btn classes, disabled if successful */}
          {isSubmitting ? 'Booking...' : (success ? 'Booked!' : 'Confirm Booking')}
        </button>
      </form>
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default BookingForm;