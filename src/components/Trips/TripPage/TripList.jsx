import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from './TripCard'; // Assuming TripCard exists
import Pagination from './Pagination'; // Use the enhanced Pagination
import './TripList.css';

const ITEMS_PER_PAGE = 9; // Or get from backend pagination.limit

const TripList = ({ filters, sortOption }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const handleTripClick = useCallback((id) => navigate(`/trips/${id}`), [navigate]);

  const fetchTrips = useCallback(async (page, currentFilters, currentSort) => {
    setLoading(true);
    setError('');
    try {
      let queryParams = `page=${page}&limit=${ITEMS_PER_PAGE}`;
      if (currentFilters.searchQuery) queryParams += `&search=${encodeURIComponent(currentFilters.searchQuery)}`;
      if (currentFilters.minPrice) queryParams += `&minPrice=${currentFilters.minPrice}`;
      if (currentFilters.maxPrice) queryParams += `&maxPrice=${currentFilters.maxPrice}`;
      if (currentFilters.startDate) queryParams += `&startDate=${currentFilters.startDate}`;
      if (currentFilters.endDate) queryParams += `&endDate=${currentFilters.endDate}`;
      if (currentFilters.status) queryParams += `&status=${currentFilters.status}`;
      // Add other filters like tags if you implement them:
      // if (currentFilters.tags && currentFilters.tags.length > 0) queryParams += `&tags=${currentFilters.tags.join(',')}`;

      if (currentSort) queryParams += `&sort=${currentSort}`;

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/trips?${queryParams}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setTrips(data.trips || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalItems(data.pagination.totalItems || 0);
          setCurrentPage(data.pagination.currentPage || 1);
        } else { // Should not happen for the main list
          setTotalPages(1);
          setTotalItems(data.trips ? data.trips.length : 0);
        }
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch trips');
      }
    } catch (err) {
      console.error("Fetch trips error:", err);
      setError(`Error fetching trips: ${err.message}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchTrips(currentPage, filters, sortOption);
  }, [fetchTrips, currentPage, filters, sortOption]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Optional: Scroll to top of list when page changes
    window.scrollTo({ top: document.querySelector('.trip-list-section')?.offsetTop || 0, behavior: 'smooth' });
  };

  if (loading) return <p className="loading">Loading trips...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="trip-list-section">
      <h2>Available Trips</h2>
      {trips.length > 0 ? (
        <>
          <div className="trip-list-grid">
            {trips.map((trip) => (
              <TripCard
                key={trip._id} // Make sure TripCard uses the key
                trip={trip}
                onClick={() => handleTripClick(trip._id)}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={totalItems}
          />
        </>
      ) : (
        <p>No trips match your current filters. Try adjusting them or explore our featured trips!</p>
      )}
    </div>
  );
};

export default TripList;