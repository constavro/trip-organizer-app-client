// TripAISuggestion.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TripAISuggestion = () => {
  const [input, setInput] = useState({ area: '', startDate: '', endDate: '', participants: '' });
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/ai-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) throw new Error((await res.json()).message);
      const data = await res.json();
      setSuggestion(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(suggestion),
      });

      if (!res.ok) throw new Error((await res.json()).message);
      navigate('/trips');
    } catch (err) {
      alert(err.message || 'Failed to save trip');
    }
  };

  return (
    <div className="trip-ai-suggestion-container">
      <h2>Get AI-Generated Trip Plan</h2>
      <input type="text" name="area" placeholder="Area" value={input.area} onChange={handleChange} />
      <input type="date" name="startDate" value={input.startDate} onChange={handleChange} />
      <input type="date" name="endDate" value={input.endDate} onChange={handleChange} />
      <input type="number" name="participants" placeholder="Participants" value={input.participants} onChange={handleChange} />
      <button onClick={handleGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate Trip'}</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {suggestion && (
        <div className="ai-suggestion-output">
          <h3>{suggestion.title}</h3>
          <p><strong>Overview:</strong> {suggestion.description.overview}</p>
          <p><strong>Inclusions:</strong> {suggestion.description.inclusions.join(', ')}</p>
          <p><strong>Exclusions:</strong> {suggestion.description.exclusions.join(', ')}</p>
          <h4>Itinerary:</h4>
          <ul>
            {suggestion.itinerary.map((stop, i) => (
              <li key={i}>
                <strong>{stop.location}</strong>: {stop.startDate} to {stop.endDate}, Accommodation: {stop.accommodation}
              </li>
            ))}
          </ul>
          <p><strong>Price per person:</strong> ${suggestion.price}</p>
          <button onClick={handleSave}>Save Trip</button>
        </div>
      )}
    </div>
  );
};

export default TripAISuggestion;
