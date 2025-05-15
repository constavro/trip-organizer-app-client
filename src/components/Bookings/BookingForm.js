import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Booking.css';

const BookingForm = () => {
  const { id } = useParams();  // Trip ID from URL params
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    tripId: id,
    numberOfPeople: '',
    totalPrice: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchTripDetails = async () => {

        const token = localStorage.getItem('token');  // Get JWT token from localStorage
        if (!token) {
          return setError('You must be logged in to create a trip');
        }

      try {

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
        });
        if (res.ok) {
            const data = await res.json(); // Parse the response body as JSON
            console.log(data); // Log the parsed JSON
            setTrip(data);
        } else {
        console.error('Error fetching trip:', res.statusText);
      }
     } catch (err) {
        setError('Error fetching trip details');
    }
};

    fetchTripDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');  // Get JWT token from localStorage
        if (!token) {
          return setError('You must be logged in to create a trip');
        }
    //   const userId = localStorage.getItem('userId'); // Assume user ID is stored in localStorage

      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(formData)
      });

      setSuccess('Booking successful!');
    } catch (err) {
      setError('Error making booking');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!trip) {
    return <p>Loading trip details...</p>;
  }

  return (
    <div>
      <h2>Book Trip: {trip.title}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Number of People:
          <input
            type="number"
            name="numberOfPeople"
            placeholder="numberOfPeople"
            onChange={handleChange}
            min="1"
          />
        </label>
        <button type="submit">Book Now</button>
      </form>
      {success && <p>{success}</p>}
    </div>
  );
};

export default BookingForm;
