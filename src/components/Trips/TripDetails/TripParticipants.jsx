import { useNavigate } from 'react-router-dom';

const TripParticipants = ({ participants }) => {
  const navigate = useNavigate();

  console.log(participants)

  if (!participants || participants.length === 0) return null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <strong>Participants:</strong>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
        {participants.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/profile/${user._id}`)}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
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
