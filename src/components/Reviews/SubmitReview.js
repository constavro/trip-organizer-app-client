import React, { useState } from 'react';
// import './Reviews.css';

const AddReview = ({ tripId, bookingId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to leave a review');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ tripId, bookingId, rating, comment }),
            });

            if (!response.ok) {
                throw new Error('Error submitting review');
            }

            const data = await response.json();
            onReviewAdded(data.review); // Callback to refresh reviews
            setRating(0);
            setComment('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-review-form">
            <h3>Leave a Review</h3>
            {error && <p className="error">{error}</p>}
            <label>
                Rating:
                <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    min="1"
                    max="5"
                    required
                />
            </label>
            <label>
                Comment:
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength="500"
                />
            </label>
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default AddReview;