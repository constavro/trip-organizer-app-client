import React, { useState } from 'react';
import TripList from './TripList';
import CreateTripButton from './CreateTripButton';
import './TripPage.css';

const TripsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  return (
    <div className="trips-page">
      <div className="trips-page-header">
        <h1>Explore Trips</h1>
        <CreateTripButton />
      </div>

      {/* Filter Controls */}
      <div className="trip-filters">
        <input
          type="text"
          placeholder="Search by title or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Adventure">Adventure</option>
          <option value="Workation">Workation</option>
          <option value="Weekend">Weekend</option>
        </select>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort by</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="dateAsc">Date: Soonest First</option>
          <option value="dateDesc">Date: Latest First</option>
        </select>
      </div>

      {/* Trip List with filters/sorting applied */}
      <TripList
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
      />
    </div>
  );
};

export default TripsPage;
