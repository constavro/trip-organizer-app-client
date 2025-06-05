import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './TripAISuggestion.css'; // Import new CSS

const TripAISuggestion = () => {
  const [input, setInput] = useState({
    area: '',
    startDate: '',
    endDate: '',
    participants: '',
    isParticipating: 'yes', // 'yes' or 'no'
    privacy: 'public',     // 'public' or 'private' (or 'unlisted' if you implement)
  });
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    setError('');
    setSuggestion(null);
    setSaveMessage('');
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSuggestion(null);
    setSaveMessage('');

    if (!input.area || !input.startDate || !input.endDate || !input.participants) {
      setError('Please fill in all fields to generate a suggestion.');
      setLoading(false);
      return;
    }
    if (parseInt(input.participants, 10) < 1) {
        setError('Number of participants must be at least 1.');
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
      // The 'input' object sent to AI now includes isParticipating and privacy
      // if your AI endpoint can leverage this information.
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/ai-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(input),
      });

      const aiGeneratedData = await res.json();
      if (!res.ok) throw new Error(aiGeneratedData.message || 'Failed to generate suggestion.');

      // Prepare the suggestion object for display and saving
      const finalSuggestion = {
        ...aiGeneratedData, // AI provides: title, description, itinerary, price, (optional) minParticipants
        // User inputs that define the core trip:
        startDate: input.startDate,
        endDate: input.endDate,
        maxParticipants: parseInt(input.participants, 10) || 1,
        // User preferences for the new trip:
        isParticipating: input.isParticipating,
        privacy: input.privacy, // User's explicit choice for privacy of the new trip
        // This custom field 'organizerWillParticipate' hints to the backend
        // that the organizer (current user) should be added to the participants list.
      };

      // Default minParticipants if AI doesn't provide it
      if (finalSuggestion.minParticipants === undefined) {
        finalSuggestion.minParticipants = 1;
      }
      // Ensure minParticipants is not greater than maxParticipants
      if (finalSuggestion.minParticipants > finalSuggestion.maxParticipants) {
        finalSuggestion.minParticipants = finalSuggestion.maxParticipants;
      }

      setSuggestion(finalSuggestion);
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

      // The 'suggestion' object now contains all necessary fields including privacy,
      // maxParticipants, minParticipants, and the organizerWillParticipate hint.
      // The backend /api/trips POST endpoint should:
      // 1. Use 'organizerWillParticipate' to add the logged-in user to the trip's 'participants' array.
      // 2. Set the 'organizer' field to the logged-in user's ID.
      // 3. Set a default 'status' (e.g., 'planning' or 'open') if not provided or override as needed.
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(suggestion),
      });
      
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || 'Failed to save trip.');
      setSaveMessage('✅ Trip saved successfully! Redirecting...');
      setSaveMessageType('success');
      setTimeout(() => navigate(`/trips/${responseData._id}`), 2000); // Redirect to the new trip's detail page

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
          <label htmlFor="participants">Total Number of Participants</label>
          <input type="number" id="participants" name="participants" placeholder="e.g., 2" value={input.participants} onChange={handleChange} min="1" required />
        </div>
        
        {/* --- NEW SECTION: User Participation --- */}
        <div className="form-group">
          <label>Will you be participating?</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="isParticipating" value="yes" checked={input.isParticipating === 'yes'} onChange={handleChange} /> Yes
            </label>
            <label>
              <input type="radio" name="isParticipating" value="no" checked={input.isParticipating === 'no'} onChange={handleChange} /> No
            </label>
          </div>
        </div>

        {/* --- NEW SECTION: Trip Privacy --- */}
        <div className="form-group">
          <label>Trip Privacy</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="privacy" value="public" checked={input.privacy === 'public'} onChange={handleChange} /> Public
            </label>
            <label>
              <input type="radio" name="privacy" value="private" checked={input.privacy === 'private'} onChange={handleChange} /> Private
            </label>
            {/* You can add 'unlisted' here if your backend and model support it
            <label>
              <input type="radio" name="privacy" value="unlisted" checked={input.privacy === 'unlisted'} onChange={handleChange} /> Unlisted
            </label>
            */}
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-generate" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Trip Suggestion'}
      </button>

      {error && <p className="error-message">{error}</p>}
      {saveMessage && <p className={`${saveMessageType}-message ${saveMessageType}`}>{saveMessage}</p>}


      {suggestion && (
        <div className="ai-suggestion-output">
          <h3>Your AI Trip: {suggestion.title}</h3>
          <p><strong>Is participanting:</strong>{suggestion.isParticipating}</p>
          <p><strong>Privacy:</strong> {suggestion.privacy || 'Not set'}</p>
          <p><strong>Min Participants:</strong> {suggestion.minParticipants}</p>
          <p><strong>Max Participants:</strong> {suggestion.maxParticipants}</p>

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
                    <strong>Day {stop.order || i+1}: {stop.location}</strong> ({new Date(stop.startDate).toLocaleDateString()} to {new Date(stop.endDate).toLocaleDateString()})
                    {stop.accommodation && <><br/>Accommodation: {stop.accommodation}</>}
                    {stop.notes && <><br/>Notes: {stop.notes}</>}
                    {stop.activities?.length > 0 && <><br/>Activities: {stop.activities.join(', ')}</>}
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {suggestion.price && (
            <>
            <h4>Pricing</h4>
            <p><strong>Estimated Price per person:</strong> ${suggestion.price.toFixed(2)}</p>
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