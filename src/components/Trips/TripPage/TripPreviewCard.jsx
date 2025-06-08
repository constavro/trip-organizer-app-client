import './TripCard.css'

const TripPreviewCard = ({ trip, onClick }) => (
  <div className="trip-preview-card-wrapper">
    <div className="card trip-preview-card"
      onClick={() => onClick(trip._id)}
      role="button"
      tabIndex="0"
      aria-label={`View details for ${trip.title}`}
    >
      <h3>{trip.title}</h3>
      <p><strong>Location:</strong> {trip.itinerary.map(i => i.location).join(', ')}</p>
      <p><strong>Price:</strong> {trip.price}€</p>
      <p><strong>Start Date:</strong> {new Date(trip.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(trip.endDate).toLocaleDateString()}</p>
    </div>
    </div>
  );

export default TripPreviewCard