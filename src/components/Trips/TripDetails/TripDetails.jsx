import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TripHeader from './TripHeader';
import TripInfo from './TripInfo';
import TripHost from './TripHost';
import TripActions from './TripActions';
import TripItinerary from './TripItinerary';
import TripParticipants from './TripParticipants';
import './TripDetails.css'
// import TripReviews from './TripReviews';
// import './TripDetails.css';

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${id}`, {
          headers: { 'Content-Type': 'application/json', Authorization: token }
        });
        if (!res.ok) throw new Error('Failed to fetch trip');
        const data = await res.json();
        setTrip({
          ...data,
          isHost: data.organizer?._id === userId,
          isParticipant: data.participants?.some(p => p._id === userId),
          canBook: (data.status === 'open' || data.status === 'confirmed')? null: data.status
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    // const fetchReviews = async () => {
    //   try {
    //     const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${id}`);
    //     const data = await res.json();
    //     setReviews(data);
    //   } catch {
    //     setError('Error fetching reviews');
    //   }
    // };

    fetchTrip();
    // fetchReviews();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!trip) return <p>Trip not found</p>;

  return (
    <div className="trip-details-container">
      <TripHeader title={trip.title} />
      <div className="trip-details-content">
      <TripInfo description={trip.description} price={trip.price} departureDate={trip.startDate} minParticipants={trip.minParticipants} maxParticipants={trip.maxParticipants} />
      <TripItinerary itinerary={trip.itinerary} />
      <TripHost organizer={trip.organizer} />
      <TripParticipants participants={trip.participants} />
      <TripActions isParticipant={trip.isParticipant} isHost={trip.isHost} tripId={id} canBook={trip.canBook} />
      {/* <TripReviews reviews={reviews} tripId={id} /> */}
      </div>
    </div>
  );
};

export default TripDetails;
