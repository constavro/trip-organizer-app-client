import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Trip.css';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Navigate to a specific trip detail page
  const handleTripClick = useCallback((id) => navigate(`/trips/${id}`), [navigate]);

  // Fetch trips based on the current page
  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/trips?page=${currentPage}&limit=5`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setTrips(data.trips);
        setTotalPages(data.pagination.totalPages);
      } else {
        throw new Error('Failed to fetch trips');
      }
    } catch (err) {
      console.error(err.message);
      setError('Error fetching trips. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Fetch trips when the current page changes
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  if (loading) return <p className="loading">Loading trips...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="trip-list-container">
      <h2>Available Trips</h2>

      {/* Trip Cards */}
      <div className="trip-list">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div
              key={trip._id}
              className="trip-card"
              onClick={() => handleTripClick(trip._id)}
              role="button"
              tabIndex="0"
              aria-label={`View details for ${trip.title}`}
            >
              <h3>{trip.title}</h3>
              <p>{trip.description?.overview || 'No description available'}</p>
              <p>
                <strong>Location:</strong> {trip.itinerary.map((item) => item.location).join(', ')}
              </p>
              <p>
                <strong>Price:</strong> ${trip.price}
              </p>
              <p>
                <strong>Departure Date:</strong>{' '}
                {new Date(trip.departureDate).toLocaleDateString()}
              </p>
              {trip.host && (
                <p>
                  <strong>Host:</strong> {`${trip.host.firstName} ${trip.host.lastName}`}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No trips found. Be the first to create one!</p>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      aria-label="Previous Page"
    >
      Previous
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      aria-label="Next Page"
    >
      Next
    </button>
  </div>
);

export default TripList;