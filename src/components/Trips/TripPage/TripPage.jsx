import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // For "View All" buttons
import TripList from './TripList';
import CreateTripButton from './CreateTripButton';
import MyTripsButton from './MyTrips';
import TripCard from './TripCard'; // For preview sections
import './TripPage.css'; // Main page styles
import './TripPreviewSection.css'; // Styles for preview sections

// Helper component for special trip sections
const TripPreviewSection = ({ title, trips, error, loading, onTripClick, viewAllLink, viewAllText = "View All" }) => {
  const navigate = useNavigate();

  if (loading) return <div className="trip-preview-section"><h3>{title}</h3><p className="loading">Loading...</p></div>;
  if (error) return <div className="trip-preview-section"><h3>{title}</h3><p className="error">{error}</p></div>;
  if (!trips || trips.length === 0) return null; // Don't render if no trips

  return (
    <div className="trip-preview-section">
      <div className="trip-preview-header">
        <h3>{title}</h3>
        {viewAllLink && (
          <button onClick={() => navigate(viewAllLink)} className="view-all-button">
            {viewAllText}
          </button>
        )}
      </div>
      <div className="trip-preview-grid">
        {trips.map(trip => (
          <TripCard key={trip._id} trip={trip} onClick={() => onTripClick(trip._id)} />
        ))}
      </div>
    </div>
  );
};


const TripsPage = () => {
  // Filters for the main TripList
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState(''); // e.g., 'open', 'confirmed'
  const [sortOption, setSortOption] = useState('createdAtDesc'); // Default sort: newest first

  // State for special sections
  const [lastSpotTrips, setLastSpotTrips] = useState({ data: [], loading: true, error: null });
  const [confirmedTrips, setConfirmedTrips] = useState({ data: [], loading: true, error: null });
  const [bookingSoonTrips, setBookingSoonTrips] = useState({ data: [], loading: true, error: null });
  const [newlyAddedTrips, setNewlyAddedTrips] = useState({ data: [], loading: true, error: null });
  // Add more sections as needed, e.g., startingSoonTrips

  const navigate = useNavigate();
  const handleTripClick = useCallback((id) => navigate(`/trips/${id}`), [navigate]);

  // Generic fetcher for preview sections
  const fetchPreviewTrips = useCallback(async (specialQuery, setter, previewLimit = 3) => {
    setter(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips?special=${specialQuery}&previewLimit=${previewLimit}`);
      if (res.ok) {
        const result = await res.json();
        setter({ data: result.trips || [], loading: false, error: null });
      } else {
        const errData = await res.json();
        throw new Error(errData.message || `Failed to fetch ${specialQuery} trips`);
      }
    } catch (err) {
      console.error(`Error fetching ${specialQuery} trips:`, err);
      setter({ data: [], loading: false, error: err.message });
    }
  }, []);

  useEffect(() => {
    fetchPreviewTrips('lastSpot', setLastSpotTrips);
    fetchPreviewTrips('confirmed', setConfirmedTrips);
    fetchPreviewTrips('bookingSoon', setBookingSoonTrips);
    fetchPreviewTrips('newlyAdded', setNewlyAddedTrips, 4); // Show 4 newly added
    // fetchPreviewTrips('startingSoon', setStartingSoonTrips);
  }, [fetchPreviewTrips]);

  const currentFilters = {
    searchQuery,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    status,
  };
  
  // Debounce handler for search input
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  const handleClearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setStartDate('');
    setEndDate('');
    setStatus('');
    setSortOption('createdAtDesc'); // Reset sort to default
    // Any other filter states should be reset here
  };


  return (
    <div className="trips-page">
      <div className="trips-page-header">
        <h1>Explore Trips</h1>
        <div className="trips-page-buttons">
          <MyTripsButton />
          <CreateTripButton />
        </div>
      </div>




      {/* --- Filter Controls for Main List --- */}
      <div className="trip-filters-container">
        <h2>Find Your Next Adventure</h2>
        <div className="trip-filters">
          <input
            type="text"
            className="filter-input filter-search"
            placeholder="Search by title or location..."
            value={searchQuery} // Use direct searchQuery for input responsiveness
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="filter-group">
            <label>Price Range:</label>
            <input
              type="number"
              className="filter-input"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              className="filter-input"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Trip Dates:</label>
            <input
              type="date"
              className="filter-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Trip start date on or after"
            />
            <span>-</span>
            <input
              type="date"
              className="filter-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Trip end date on or before"
            />
          </div>

          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)} 
            className="filter-select"
          >
            <option value="createdAtDesc">Sort by: Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="dateAsc">Date: Soonest First</option>
            {/* <option value="dateDesc">Date: Latest First</option> Backend sorts by startDate */}
          </select>
          <button onClick={handleClearFilters} className="clear-filters-button">Clear Filters</button>
        </div>
      </div>

      {/* Trip List with filters/sorting applied */}
      <TripList
        filters={{...currentFilters, searchQuery: debouncedSearchQuery}} // Pass debounced search
        sortOption={sortOption}
      />

            {/* --- Special Preview Sections --- */}
            <TripPreviewSection
        title="Last Spot Left!"
        trips={lastSpotTrips.data}
        loading={lastSpotTrips.loading}
        error={lastSpotTrips.error}
        onTripClick={handleTripClick}
        // viewAllLink="/trips?filter=lastSpot" // Future: Link to a pre-filtered list
      />

      <TripPreviewSection
        title="They're Happening!"
        trips={confirmedTrips.data}
        loading={confirmedTrips.loading}
        error={confirmedTrips.error}
        onTripClick={handleTripClick}
        // viewAllLink="/trips?status=confirmed"
      />

      <TripPreviewSection
        title="⏳ Book Now & Save These Trips!"
        trips={bookingSoonTrips.data}
        loading={bookingSoonTrips.loading}
        error={bookingSoonTrips.error}
        onTripClick={handleTripClick}
        // viewAllLink="/trips?filter=bookingSoon"
      />
      
      <TripPreviewSection
        title="Newly Added Adventures"
        trips={newlyAddedTrips.data}
        loading={newlyAddedTrips.loading}
        error={newlyAddedTrips.error}
        onTripClick={handleTripClick}
        // viewAllLink="/trips?sort=createdAtDesc"
      />
    </div>
  );
};

export default TripsPage;