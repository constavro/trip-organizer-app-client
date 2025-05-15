import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip, isOrganizer }) => {
  const navigate = useNavigate();
  const handleView = () => navigate(`/trips/${trip._id}`);

  return (
    <div style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '10px' }}>
      <h3>{trip.title}</h3>
      <p>
        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
      </p>
      {isOrganizer && <p><strong>You are the organizer</strong></p>}
      <button onClick={handleView}>View Details</button>
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
        const now = new Date();

        setOrganizedTrips(data.organized || []);
        setUpcomingTrips(data.joined.filter(trip => new Date(trip.endDate) >= now));
        setPastTrips(data.joined.filter(trip => new Date(trip.endDate) < now));
      } catch (err) {
        console.error(err);
        setError('Error fetching trips');
      }
    };

    fetchTrips();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Trips You're Going On</h2>
      {upcomingTrips.length === 0 ? <p>No upcoming trips.</p> : (
        upcomingTrips.map(trip => <TripCard key={trip._id} trip={trip} />)
      )}

      <h2>Trips You Organized</h2>
      {organizedTrips.length === 0 ? <p>You haven’t organized any trips.</p> : (
        organizedTrips.map(trip => <TripCard key={trip._id} trip={trip} isOrganizer />)
      )}

      <h2>Past Trips</h2>
      {pastTrips.length === 0 ? <p>No past trips.</p> : (
        pastTrips.map(trip => <TripCard key={trip._id} trip={trip} />)
      )}
    </div>
  );
};

export default TripByUser;
