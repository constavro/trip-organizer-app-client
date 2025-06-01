// TripAISuggestion.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './TripAISuggestion.css'; // Import new CSS

const TripAISuggestion = () => {
  const [input, setInput] = useState({ area: '', startDate: '', endDate: '', participants: '' });
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError(''); // Clear error on new input
    setSuggestion(null); // Clear previous suggestion
    setSaveMessage(''); // Clear save message
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSuggestion(null);
    setSaveMessage('');

    // Basic validation
    if (!input.area || !input.startDate || !input.endDate || !input.participants) {
        setError('Please fill in all fields to generate a suggestion.');
        setLoading(false);
        return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to generate suggestions.');
        setLoading(false);
        return;
      }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/ai-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(input),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || 'Failed to generate suggestion.');
      setSuggestion(responseData);
    } catch (err) {
      setError(err.message || 'Something went wrong while generating the trip.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSaveMessage('You must be logged in to save trips.');
        setSaveMessageType('error');
        setLoading(false);
        return;
      }
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(suggestion), // Assuming suggestion format matches create trip payload
      });
      
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || 'Failed to save trip.');
      setSaveMessage('✅ Trip saved successfully! Redirecting...');
      setSaveMessageType('success');
      setTimeout(() => navigate('/trips'), 2000);

    } catch (err) {
      setSaveMessage(`❌ ${err.message || 'Failed to save trip.'}`);
      setSaveMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-ai-suggestion-page-container">
      <h2>Get AI-Generated Trip Plan</h2>
      
      <div className="trip-ai-form">
        <div className="form-group">
          <label htmlFor="area">Destination Area or City</label>
          <input type="text" id="area" name="area" placeholder="e.g., Paris, France" value={input.area} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" name="startDate" value={input.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input type="date" id="endDate" name="endDate" value={input.endDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="participants">Number of Participants</label>
          <input type="number" id="participants" name="participants" placeholder="e.g., 2" value={input.participants} onChange={handleChange} min="1" required />
        </div>
      </div>

      <button className="btn btn-primary btn-generate" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Trip Suggestion'}
      </button>

      {error && <p className="error-message">{error}</p>}
      {saveMessage && <p className={`${saveMessageType}-message`}>{saveMessage}</p>}


      {suggestion && (
        <div className="ai-suggestion-output">
          <h3>Your AI Trip: {suggestion.title}</h3>
          
          <h4>Overview</h4>
          <p>{suggestion.description?.overview || 'No overview provided.'}</p>
          
          {suggestion.description?.inclusions?.length > 0 && (
            <>
              <h4>Inclusions</h4>
              <ul>
                {suggestion.description.inclusions.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </>
          )}

          {suggestion.description?.exclusions?.length > 0 && (
            <>
              <h4>Exclusions</h4>
              <ul>
                {suggestion.description.exclusions.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </>
          )}
          
          {suggestion.itinerary?.length > 0 && (
            <>
              <h4>Itinerary</h4>
              <ul>
                {suggestion.itinerary.map((stop, i) => (
                  <li key={i}>
                    <strong>{stop.location}</strong> ({stop.startDate} to {stop.endDate})
                    {stop.accommodation && <><br/>Accommodation: {stop.accommodation}</>}
                    {stop.notes && <><br/>Notes: {stop.notes}</>}
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {suggestion.price && (
            <>
            <h4>Pricing</h4>
            <p><strong>Estimated Price per person:</strong> ${suggestion.price}</p>
            </>
            )}

          <button className="btn btn-success btn-save" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save This Trip'}
          </button>
        </div>
      )}
      <div className="back-link-container">
        <Link to="/createtrip">Back to Manual Trip Creation</Link>
      </div>
    </div>
  );
};

export default TripAISuggestion;