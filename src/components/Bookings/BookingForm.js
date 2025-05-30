import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Booking.css';

const BookingForm = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setError('You must be logged in to book a trip.');

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });

        if (!res.ok) throw new Error('Failed to fetch trip');

        const data = await res.json();
        setTrip(data);
      } catch (err) {
        setError('Error fetching trip details');
      }
    };

    fetchTripDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return setError('You must be logged in to book a trip.');

    if (!window.confirm('Do you want to confirm this booking?')) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ tripId: id })
      });

      if (!res.ok) throw new Error('Booking failed');

      setSuccess('Booking successful!');
    } catch (err) {
      setError('Error making booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!trip) return <p>Loading trip details...</p>;

  return (
    <div className="booking-form-container">
      <h2>{trip.title}</h2>
      <p><strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</p>
      <p><strong>Price:</strong> ${trip.price || 'N/A'}</p>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Booking...' : 'Book Now'}
        </button>
      </form>
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default BookingForm;
