import { useNavigate } from 'react-router-dom';

const TripHost = ({ organizer }) => {
  const navigate = useNavigate();
  if (!organizer) return null;

  return (
    <p className="trip-host-section">
      <strong>Host:</strong>{' '}
      <span
      className="host-link"
        onClick={() => navigate(`/profile/${organizer._id}`)}
      >
        {organizer.firstName} {organizer.lastName}
      </span>
    </p>
  );
};

export default TripHost;
