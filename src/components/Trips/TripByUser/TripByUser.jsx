import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripByUser.css';


const TripCard = ({ trip, isOrganizer }) => {
  const navigate = useNavigate();
  const handleView = () => navigate(`/trips/${trip._id}`);

  return (
    <div className="trip-card">
      <h3 className="trip-card-title">{trip.title}</h3>
      <p className="trip-card-dates">
        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
      </p>
      {isOrganizer && <p className="trip-card-organizer-note"><strong>You are the organizer</strong></p>}
      <button className="btn trip-card-btn" onClick={handleView}>View Details</button>
    </div>
  );
};

const TripByUser = () => {
  const [organizedTrips, setOrganizedTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return setError('You must be logged in to view your trips');
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/tripsbyuser`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          return setError(err.message || 'Failed to fetch trips');
        }

        const data = await res.json();

        setOrganizedTrips(data.organized || []);
        setUpcomingTrips(data.joined.filter(trip => trip.status === 'open' || trip.status === 'confirmed'));
        setPastTrips(data.joined.filter(trip => trip.status === 'completed'));
        
      } catch (err) {
        console.error(err);
        setError('Error fetching trips');
      }
    };

    fetchTrips();
  }, []);

  if (error) return <p className="error-message container">{error}</p>;

  return (
    <div className="trips-by-user-container">
      <section className="trips-section">
        <h2>Trips organized by others</h2>
        {upcomingTrips.length === 0 ? <p className="empty-message">No upcoming trips.</p> : (
          upcomingTrips.map(trip => <TripCard key={trip._id} trip={trip} />)
        )}
      </section>

      <section className="trips-section">
        <h2>Trips organized by you</h2>
        {organizedTrips.length === 0 ? <p className="empty-message">You haven’t organized any trips.</p> : (
          organizedTrips.map(trip => <TripCard key={trip._id} trip={trip} isOrganizer />)
        )}
      </section>

      <section className="trips-section">
        <h2>Past trips</h2>
        {pastTrips.length === 0 ? <p className="empty-message">No past trips.</p> : (
          pastTrips.map(trip => <TripCard key={trip._id} trip={trip} />)
        )}
      </section>
    </div>
  );
};

export default TripByUser;
