import { useNavigate } from 'react-router-dom';

const TripActions = ({ isHost, tripId }) => {
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

  return (
    <div className="trip-actions">
      <button onClick={() => navigate(`/trips/${tripId}/book`)}>Book Now</button>
      {isHost && (
        <>
          <button onClick={() => navigate(`/trips/edit/${tripId}`)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
      <button onClick={() => navigate(`/chat/${tripId}`)}>Chat</button>
    </div>
  );
};

export default TripActions;
