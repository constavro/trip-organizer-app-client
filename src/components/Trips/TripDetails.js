import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Trip.css';

const TripDetails = () => {
  const { id } = useParams(); // Get trip ID from URL params
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleBookingClick = () => {
    navigate(`/trips/${id}/book`); // Navigate to the booking page for the trip
  };

  // const handleHostClick = () => {
  //   navigate(`/users/${hostid}`); // Navigate to the booking page for the trip
  // };

  const handleEditClick = () => {
    navigate(`/trips/edit/${id}`); // Navigate to the edit page for the trip
  };

  const handleDeleteClick = async () => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    if (!token) {
      return setError('You must be logged in to delete a trip');
    }

    console.log(id)

    try {
      const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (res.ok) {
        alert('Trip deleted successfully');
        navigate('/trips'); // Redirect to the trips page
      } else {
        setError('Error deleting trip');
      }
    } catch (err) {
      setError('Error deleting trip');
    }
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      const token = localStorage.getItem('token'); // Get JWT token from localStorage
      const userId = localStorage.getItem('userId'); // Get user ID from localStorage
      if (!token) {
        return setError('You must be logged in to view trip details');
      }

      try {
        const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (res.ok) {
          const data = await res.json(); // Parse the response body as JSON
          setTrip({ ...data, isHost: data.host?._id === userId }); // Check if the current user is the host
          setLoading(false);
        } else if (res.status === 404) {
          setError('Trip not found');
          setLoading(false);
        } else {
          setError('Error fetching trip details');
          setLoading(false);
        }
      } catch (err) {
        setError('Error fetching trip details');
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  if (loading) {
    return <p>Loading trip details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!trip) {
    return <p>Trip not found</p>;
  }

  return (
    <div className="trip-details">
      <h1>{trip.title}</h1>
      <p>
        <strong>Overview:</strong> {trip.description.overview}
      </p>
      <p>
        <strong>About the Host:</strong> {trip.description.aboutYou}
      </p>
      <p>
        <strong>Accommodation:</strong> {trip.description.accommodation}
      </p>
      <p>
        <strong>Inclusions:</strong> {trip.description.inclusions.join(', ')}
      </p>
      <p>
        <strong>Exclusions:</strong> {trip.description.exclusions.join(', ')}
      </p>
      <p>
        <strong>Location:</strong> {trip.location}
      </p>
      <p>
        <strong>Price:</strong> ${trip.price}
      </p>
      <p>
        <strong>Departure Date:</strong> {new Date(trip.departureDate).toLocaleDateString()}
      </p>
      {trip.host && (
  <p>
    <strong>Host:</strong>{' '}
    <span
      className="host-link"
      onClick={() => navigate(`/profile/${trip.host._id}`)} // Pass host ID to the function
      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // Add pointer and styling for clickable text
    >
      {`${trip.host.firstName} ${trip.host.lastName}`}
    </span>
  </p>
)}
      <button onClick={handleBookingClick} className="booking-button">
        Book Now
      </button>

      {/* Show edit and delete buttons if the user is the host */}
      {trip.isHost && (
        <div className="host-actions">
          <button onClick={handleEditClick} className="edit-button">
            Edit Trip
          </button>
          <button onClick={handleDeleteClick} className="delete-button">
            Delete Trip
          </button>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
