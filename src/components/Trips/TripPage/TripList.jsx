import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from './TripCard';
import './TripList.css'

const TripList = ({ searchQuery, selectedCategory, sortOption }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [originalTrips, setOriginalTrips] = useState([]);
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
        setOriginalTrips(data.trips); 
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

  useEffect(() => {
    let filtered = [...originalTrips];

    // Search
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(lower) ||
          trip.itinerary.some((item) => item.location.toLowerCase().includes(lower))
      );
    }

    // Category
    if (selectedCategory) {
      filtered = filtered.filter((trip) => trip.tags?.includes(selectedCategory));
    }

    // Sort
    if (sortOption === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'dateAsc') {
      filtered.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
    } else if (sortOption === 'dateDesc') {
      filtered.sort((a, b) => new Date(b.departureDate) - new Date(a.departureDate));
    }

    setTrips(filtered);
  }, [searchQuery, selectedCategory, sortOption, originalTrips]);

  if (loading) return <p className="loading">Loading trips...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="trip-list-container">
      <h2>Available Trips</h2>

      {/* Trip Cards */}
      <div className="trip-list">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <TripCard
            trip={trip}
            onClick={handleTripClick}
            />
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