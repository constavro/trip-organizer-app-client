import React, { useState, useEffect } from 'react';

const HostDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');  // Assuming host ID is stored in localStorage

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log(token)
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/host/${token}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },});

        if (!res.ok) {
          throw new Error('Error fetching bookings');
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError('Error fetching bookings');
      }
    };

    fetchBookings();
  }, [token]);

  const handleAction = async (bookingId, action) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) {
        throw new Error('Error updating booking');
      }

      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      setError('Error updating booking');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Pending Bookings</h2>
      {bookings.length === 0 ? (
        <p>No pending bookings</p>
      ) : (
        <ul>
          {bookings.map(booking => (
            <li key={booking._id}>
              <p><strong>User:</strong>{booking.user.firstName} {booking.user.firstName}</p>
              <p><strong>Trip:</strong> {booking.trip.title}</p>
              <p><strong>Total Price:</strong> ${booking.pricePaid}</p>
              <button onClick={() => handleAction(booking._id, 'accepted')}>Accept</button>
              <button onClick={() => handleAction(booking._id, 'declined')}>Decline</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HostDashboard;
