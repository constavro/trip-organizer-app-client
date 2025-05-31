import { useNavigate } from 'react-router-dom';

const TripParticipants = ({ participants }) => {
  const navigate = useNavigate();

  console.log(participants)

  if (!participants || participants.length === 0) return null;

  return (
    <div className="trip-participants-section">
      <strong>Participants:</strong>
      <div className="participants-list">
        {participants.map((user) => (
          <div
            className="participant-item"
            key={user._id}
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            <img
              src={user.profilePicture || '/default-avatar.png'}
              alt={`${user.firstName} ${user.lastName}`}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginRight: '0.5rem' }}
            />
            <span style={{ color: 'blue', textDecoration: 'underline', fontSize: '0.9rem' }}>
              {user.firstName} {user.lastName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripParticipants;
