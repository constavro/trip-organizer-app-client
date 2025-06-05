import React, { useEffect, useState } from 'react';
import BookingList from './BookingList';
import HostTripsList from './HostTripsList';

const HostDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/host/${token}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError('Error fetching bookings');
      }
    };

    const fetchTrips = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
        const data = await res.json();
        setTrips(data.createdTrips);
      } catch (err) {
        setError('Error fetching trips');
      }
    };

    fetchBookings();
    fetchTrips();
  }, [token,userId]);

  const handleAction = async (bookingId, action) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/host/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) throw new Error();
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch {
      setError('Error updating booking');
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="host-dashboard">
      <BookingList bookings={bookings} onAction={handleAction} />
      <HostTripsList trips={trips} />
    </div>
  );
};

export default HostDashboard;
