import './TripCard.css'

const TripCard = ({ trip, onClick }) => (
    <div
      className="trip-card"
      onClick={() => onClick(trip._id)}
      role="button"
      tabIndex="0"
      aria-label={`View details for ${trip.title}`}
    >
      <h3>{trip.title}</h3>
      <p>{trip.description?.overview || 'No description available'}</p>
      <p><strong>Location:</strong> {trip.itinerary.map(i => i.location).join(', ')}</p>
      <p><strong>Price:</strong> ${trip.price}</p>
      <p><strong>Start Date:</strong> {new Date(trip.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(trip.endDate).toLocaleDateString()}</p>
      {trip.organizer && <p><strong>Organizer:</strong> {trip.organizer.firstName} {trip.organizer.lastName}</p>}
    </div>
  );

export default TripCard
