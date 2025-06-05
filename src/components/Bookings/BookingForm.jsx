// === Frontend Update ===
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Booking.css';

const BookingForm = () => {
  const { id } = useParams(); // tripId
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [existingBooking, setExistingBooking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to book a trip.');
      setIsLoadingTrip(false);
      return;
    }

    const fetchTripAndBooking = async () => {
      try {
        const [tripRes, bookingRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${id}`, {
            headers: { 'Authorization': token },
          }),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/check/${id}`, {
            headers: { 'Authorization': token },
          })
        ]);

        if (!tripRes.ok) throw new Error('Failed to fetch trip');
        const tripData = await tripRes.json();
        setTrip(tripData);

        if (bookingRes.status === 200) {
          const bookingData = await bookingRes.json();
          setExistingBooking(bookingData);
        } else if (bookingRes.status === 204) {
          // No existing booking, do nothing
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingTrip(false);
      }
    };

    if (id) fetchTripAndBooking();
    else {
      setError('Trip ID is missing.');
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
          'Authorization': token,
        },
        body: JSON.stringify({ tripId: id })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Booking failed');
      }
      setSuccess('Booking successful! You can view your bookings in your profile.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTrip) return <p className="loading-message">Loading trip details...</p>;
  if (error && !trip) return <p className="error-message container">{error}</p>;
  if (!trip) return <p className="status-message container">Trip not found.</p>;

  return (
    <div className="booking-form-container card">
      <h2>Book: {trip.title}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="booking-form-details">
        <p><strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</p>
        <p><strong>Price:</strong> {trip.price != null ? trip.price.toFixed(2) : 'N/A'}€</p>
        {trip.description?.overview && <p><strong>Overview:</strong> {trip.description.overview}</p>}
      </div>

      {existingBooking ? (
        <p className="info-message">
          You have already {existingBooking.status === 'cancelled' ? 'cancelled' : 'requested'} a booking for this trip.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <button type="submit" className="btn btn-lg" disabled={isSubmitting || success}>
            {isSubmitting ? 'Booking...' : (success ? 'Booked!' : 'Confirm Booking')}
          </button>
        </form>
      )}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default BookingForm;