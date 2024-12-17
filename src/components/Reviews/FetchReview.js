import React, { useState, useEffect } from 'react';
// import './Reviews.css';

const Reviews = ({ tripId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${tripId}`);
                if (!response.ok) {
                    throw new Error('Error fetching reviews');
                }
                const data = await response.json();
                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [tripId]);

    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="reviews">
            <h3>Reviews</h3>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id} className="review">
                        <p><strong>{review.user.firstName} {review.user.lastName}</strong></p>
                        <p>Rating: {review.rating}</p>
                        <p>{review.comment}</p>
                    </div>
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
};

export default Reviews;