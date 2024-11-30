import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Trip.css';

const TripByUser = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const handleTripClick = (id) => {
        navigate(`/trips/${id}`); // Navigate to the specific trip detail page
      };

      const handleDeleteTrip = async (id) => {
        const token = localStorage.getItem('token');  // Get JWT token from localStorage
        if (!token) {
            return setError('You must be logged in to delete a trip');
        }

        try {
            const res = await fetch(`http://localhost:5000/api/trips/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            if (res.ok) {
                // Remove the deleted trip from the state
                setTrips(trips.filter(trip => trip._id !== id));
                setError('');  // Clear any errors if successful
            } else {
                const errorData = await res.json();
                console.error('Error deleting trip:', errorData.message);
                setError('Error deleting trip');
            }
        } catch (err) {
            setError('Error deleting trip');
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchTrips = async () => {
            const token = localStorage.getItem('token');  // Get JWT token from localStorage
            if (!token) {
              return setError('You must be logged in to view your trips');
            }

    
          try {
            const res = await fetch(`http://localhost:5000/api/trips/tripsbyuser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                  },
            });

            console.log('http://localhost:5000/api/trips/tripsbyuser')

            if (res.ok) {
                const data = await res.json(); // Parse the response body as JSON
                console.log(data); // Log the parsed JSON
                setTrips(data.trips);
                setTotalPages(data.totalPages);
                setLoading(false);
              } else {
                const errorData = await res.json(); // Parse the error response
                if (errorData.message === 'Invalid token') {
                  console.error('Invalid token, redirecting to login...');
                  navigate('/login'); // Redirect to the login page
                } else {
                  console.error('Error fetching trips:', res.statusText);
                  setError('Error fetching trips');
                }
                setLoading(false);
              }
          } catch (err) {
            setError('Error fetching trips');
            setLoading(false);
          }
        };
        fetchTrips();
    }, [currentPage, navigate]);

    if (loading) {
        return <p>Loading trips...</p>;
      }
    
    if (error) {
        return <p>{error}</p>;
      }

      return (
        <div>
          <h2>Your Hosted Trips</h2>
          <div className="trip-list">
            {trips.map(trip => (
              <div key={trip._id} className="trip" onClick={() => handleTripClick(trip._id)}>
                <h3>{trip.title}</h3>
                <p>{trip.description}</p>
                <p><strong>Location:</strong> {trip.location}</p>
                <p><strong>Price:</strong> ${trip.price}</p>
                <p><strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                <button onClick={() => handleDeleteTrip(trip._id)} className="delete-button">Delete Trip</button>
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          <div>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span> Page {currentPage} of {totalPages} </span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      );

}

export default TripByUser;
