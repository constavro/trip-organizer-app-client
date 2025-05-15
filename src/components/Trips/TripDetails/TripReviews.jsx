import Reviews from '../Reviews/FetchReview';

const TripReviews = ({ reviews, tripId }) => (
  <div className="reviews-section">
    <h2>Reviews</h2>
    <Reviews tripId={tripId} reviews={reviews} />
  </div>
);

export default TripReviews;
