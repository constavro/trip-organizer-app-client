const TripInfo = ({ description, price, departureDate }) => (
    <div className="trip-info-section">
      <p><strong>Overview:</strong> {description.overview}</p>
      <p><strong>Inclusions:</strong> {description.inclusions.join(', ')}</p>
      <p><strong>Exclusions:</strong> {description.exclusions.join(', ')}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Departure:</strong> {new Date(departureDate).toLocaleDateString()}</p>
    </div>
  );
  export default TripInfo;
  