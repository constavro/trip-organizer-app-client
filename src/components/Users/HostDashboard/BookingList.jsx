import React from 'react';
import './BookingList.css'
import { useNavigate } from 'react-router-dom';

const BookingList = ({ bookings, onAction }) => {

    const navigate = useNavigate();

    const handleUserClick = (id) => {
        navigate(`/profile/${id}`);
      };

      const handleTripClick = (id) => {
        navigate(`/trips/${id}`);
      };

  return (
    <div className="dashboard-section">
      <h2>Pending Bookings</h2>
      {bookings.length === 0 ? (
        <p>No pending bookings</p>
      ) : (
        <ul>
          {bookings.map(booking => (
            <li key={booking._id}>
              <p onClick={() => handleUserClick(booking.user._id)}><strong>User:</strong> {booking.user.firstName} {booking.user.lastName}</p>
              <p onClick={() => handleTripClick(booking.trip._id)}><strong>Trip:</strong> {booking.trip.title}</p>
              <div className="booking-buttons">
  <button
    className="bookings-button accept"
    onClick={() => onAction(booking._id, 'accepted')}
  >
    Accept
  </button>
  <button
    className="bookings-button decline"
    onClick={() => onAction(booking._id, 'declined')}
  >
    Decline
  </button>
</div>


            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingList;
