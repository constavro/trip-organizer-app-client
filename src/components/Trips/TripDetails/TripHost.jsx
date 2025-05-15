import { useNavigate } from 'react-router-dom';

const TripHost = ({ organizer }) => {
  const navigate = useNavigate();
  if (!organizer) return null;

  return (
    <p>
      <strong>Host:</strong>{' '}
      <span
        onClick={() => navigate(`/profile/${organizer._id}`)}
        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
      >
        {organizer.firstName} {organizer.lastName}
      </span>
    </p>
  );
};

export default TripHost;
