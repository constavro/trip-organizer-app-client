import React, { useEffect, useState } from 'react'; // Added useEffect, useState for trip title
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import MessageInput from './MessageInput';
import './Chat.css'; // Import consolidated CSS

const ChatPage = () => {
  const { id: tripId } = useParams(); // Renamed for clarity
  const [tripTitle, setTripTitle] = useState('Trip Chat'); // State for trip title
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId'); // Renamed for clarity

  useEffect(() => {
    // Optional: Fetch trip title to display
    const fetchTripInfo = async () => {
      if (!tripId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${tripId}`, {
            headers: { Authorization: token }
        });
        if (!res.ok) throw new Error('Failed to fetch trip info');
        const data = await res.json();
        setTripTitle(data.title || 'Trip Chat');
      } catch (err) {
        console.error("Error fetching trip title for chat:", err);
        setError("Could not load trip information.");
      } finally {
        setLoading(false);
      }
    };
    fetchTripInfo();
  }, [tripId]);


  if (!userId) return <p className="error-message container">User not identified. Please log in.</p>;
  if (!tripId) return <p className="error-message container">Trip ID missing. Cannot load chat.</p>;
  if (loading) return <p className="loading-message">Loading chat...</p>;
  if (error) return <p className="error-message container">{error}</p>


  return (
    <div className="chat-page-container">
      <header className="chat-page-header">{tripTitle}</header>
      <ChatRoom tripId={tripId} currentUserId={userId} /> {/* Pass currentUserId */}
      <MessageInput tripId={tripId} senderId={userId} /> {/* Pass senderId */}
    </div>
  );
};

export default ChatPage;