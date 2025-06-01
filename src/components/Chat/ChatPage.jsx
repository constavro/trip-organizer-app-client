// src/components/Chat/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import MessageInput from './MessageInput';
import './Chat.css';

const ChatPage = () => {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const [tripTitle, setTripTitle] = useState('Trip Chat');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTripInfo = async () => {
      if (!tripId || !token) {
        setError("Missing trip ID or authentication.");
        setLoading(false);
        if (!token) navigate('/auth'); // Redirect if not authenticated
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trips/${tripId}`, {
          headers: { Authorization: token }
        });
        if (!res.ok) {
          if (res.status === 403 || res.status === 404) {
              throw new Error('Trip not found or access denied.');
          }
          throw new Error('Failed to fetch trip info');
        }
        const data = await res.json();
        setTripTitle(data.title || 'Trip Chat');
      } catch (err) {
        console.error("Error fetching trip title:", err);
        setError(err.message || "Could not load trip information.");
        // Optionally navigate away if trip info is crucial and fails to load
        // if (err.message.includes('access denied')) navigate('/trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTripInfo();
  }, [tripId, token, navigate]);

  if (!currentUserId) {
    // This should ideally be handled by a global auth context/router protection
    navigate('/auth');
    return <p className="error-message container">Redirecting to login...</p>;
  }
  if (!tripId) return <p className="error-message container">Trip ID missing. Cannot load chat.</p>;

  // Keep ChatRoom and MessageInput rendered even if tripTitle is loading/errored,
  // as they depend only on tripId and userId.
  return (
    <div className="chat-page-container">
      <header className="chat-page-header">
        {loading ? 'Loading Chat...' : error || tripTitle}
      </header>
      <ChatRoom tripId={tripId} currentUserId={currentUserId} />
      <MessageInput tripId={tripId} senderId={currentUserId} />
    </div>
  );
};

export default ChatPage;