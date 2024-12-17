// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Trip.css';

// const TripList = () => {
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();

//   const handleTripClick = (id) => {
//     navigate(`/trips/${id}`); // Navigate to the specific trip detail page
//   };

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips?page=${currentPage}&limit=5`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (res.ok) {
//           const data = await res.json(); // Parse the response body as JSON
//           setTrips(data.trips);
//           setTotalPages(data.totalPages);
//           setLoading(false);
//         } else {
//           const errorData = await res.json(); // Parse the error response
//           if (errorData.message === 'Invalid token') {
//             console.error('Invalid token, redirecting to login...');
//             navigate('/login'); // Redirect to the login page
//           } else {
//             console.error('Error fetching trips:', res.statusText);
//             setError('Error fetching trips');
//           }
//           setLoading(false);
//         }
//       } catch (err) {
//         setError('Error fetching trips');
//         setLoading(false);
//       }
//     };

//     fetchTrips();
//   }, [currentPage, navigate]);

//   if (loading) {
//     return <p>Loading trips...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       <h2>Available Trips</h2>
//       <div className="trip-list">
//         {trips.map((trip) => (
//           <div key={trip._id} className="trip" onClick={() => handleTripClick(trip._id)}>
//             <h3>{trip.title}</h3>
//             <p>{trip.description.overview}</p>
//             <p>
//               <strong>Location:</strong> {trip.location}
//             </p>
//             <p>
//               <strong>Price:</strong> ${trip.price}
//             </p>
//             <p>
//               <strong>Departure Date:</strong> {new Date(trip.departureDate).toLocaleDateString()}
//             </p>
//             {trip.host && (
//               <p>
//                 <strong>Host:</strong> {`${trip.host.firstName} ${trip.host.lastName}`}
//               </p>
//             )}
//           </div>
//         ))}
//         <div key="create-trip" className="create-trip">
//           <button className="create-trip-button" onClick={() => navigate('/createTrip')}>
//             +
//           </button>
//         </div>
//       </div>

//       {/* Pagination Controls */}
//       <div className="pagination">
//         <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TripList;

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

        {/* "Create Trip" Button */}
        <div className="create-trip-card">
          <button
            className="create-trip-button"
            onClick={() => navigate('/createTrip')}
            aria-label="Create a new trip"
          >
          +
          </button>
        </div>
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