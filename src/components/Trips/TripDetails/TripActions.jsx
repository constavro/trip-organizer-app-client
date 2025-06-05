import { useNavigate } from 'react-router-dom';

const TripActions = ({ isParticipant, isHost, tripId, canBook }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (!res.ok) throw new Error('Failed to delete');
      alert('Trip deleted');
      navigate('/trips');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelBooking = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/cancel/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (!res.ok) throw new Error('Failed to cancel booking');
      alert('Booking cancelled');
      navigate('/trips');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="trip-actions-section">
      {!isHost && !isParticipant && (
        canBook ? (
          <p className="text-muted">This trip is {canBook}.</p>
        ) : (
          <button className="btn" onClick={() => navigate(`/trips/${tripId}/book`)}>Book Now</button>
        )
      )}
  
      {isHost && (
        <>
          <button className="btn" onClick={() => navigate(`/trips/edit/${tripId}`)}>Edit</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </>
      )}
  
      {!isHost && isParticipant && (
        <button className="btn btn-warning" onClick={handleCancelBooking}>Cancel Booking</button>
      )}
    </div>
  );  
};

export default TripActions;
