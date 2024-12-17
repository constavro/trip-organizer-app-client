import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddReview from '../Reviews/SubmitReview'; // Import the AddReview component
import './Trip.css';

const TripByUser = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState(null); // Track booking for review
  const navigate = useNavigate();

  const handleTripClick = (id) => {
    navigate(`/trips/${id}`); // Navigate to the specific trip detail page
  };

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return setError('You must be logged in to cancel your bookings');
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        setBookings((prevBookings) =>
          prevBookings.map((b) =>
            b._id === bookingId ? { ...b, status: 'cancelled' } : b
          )
        );
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Error cancelling booking');
      }
    } catch (err) {
      console.error(err);
      setError('Error cancelling booking');
    }
  };

  const handleAddReview = (bookingId) => {
    setSelectedBookingId(bookingId); // Set the booking ID for the AddReview component
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return setError('You must be logged in to view your trips');
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/tripsbyuser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings);
          setTotalPages(data.totalPages || 1);
          setLoading(false);
        } else {
          const errorData = await res.json();
          setError(errorData.message || 'Error fetching bookings');
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching bookings');
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentPage]);

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Your Bookings</h2>
      <div className="booking-list">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking">
            <h3>{booking.trip.title}</h3>
            <h3>Status: {booking.status}</h3>
            <button onClick={() => handleTripClick(booking.trip._id)} className="view-button">
              View Trip
            </button>
            {(booking.status === 'pending' || booking.status === 'accepted') && (
              <button
                onClick={() => handleCancel(booking._id)}
                className="cancel-button"
              >
                Cancel Booking
              </button>
            )}
            {booking.status === 'completed' && (
              <button
                onClick={() => handleAddReview(booking._id)}
                className="review-button"
              >
                Add Review
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Review Section */}
      {selectedBookingId && (
        <AddReview
          tripId={bookings.find((booking) => booking._id === selectedBookingId)?.trip._id} bookingId={selectedBookingId}
          onClose={() => setSelectedBookingId(null)} // Close the AddReview component
        />
      )}

      {/* Pagination Controls */}
      <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TripByUser;