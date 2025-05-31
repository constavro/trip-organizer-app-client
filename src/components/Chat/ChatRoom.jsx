import React, { useEffect, useState, useRef } from 'react';
import socket from './socket';
// No direct CSS import needed, Chat.css covers it

const ChatRoom = ({ tripId, currentUserId }) => { // Changed prop name
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        // Ensure API endpoint matches backend and includes auth if necessary
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat/user/${tripId}`);
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch messages');
        }
        const data = await res.json();
        // Assuming data is the array of messages, or data.messages
        setMessages(data.messages);
      } catch (err) {
        setError(err.message || 'Error fetching messages');
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchMessages();
    }
  }, [tripId]);

  useEffect(() => {
    if (!tripId) return;

    socket.emit('joinRoom', tripId);

    const handleNewMessage = (message) => {
      // Ensure message has a unique key if possible, otherwise use index or a generated ID
      // Also check if the message belongs to the current tripId if socket broadcasts globally
      if (message.tripId === tripId || !message.tripId) { // Add check if message contains tripId
         setMessages((prevMessages) => [...prevMessages, { ...message, _id: message._id || Date.now() + Math.random() }]);
      }
    };
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.emit('leaveRoom', tripId);
      socket.off('newMessage', handleNewMessage);
    };
  }, [tripId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <p className="loading-message">Loading messages...</p>;
  if (error) return <p className="error-message">{error}</p>; // Display error within chat area

  return (
    <div className="chat-room" role="log" aria-live="polite">
      {messages.length === 0 && !loading && <p className="empty-state-message">No messages yet. Be the first to say hello!</p>}
      {messages.map((msg) => (
        <div
          key={msg._id || msg.tempId || msg.timestamp} // Prefer _id from DB, use tempId or timestamp as fallback
          className={`message ${msg.sender._id === currentUserId ? 'current-user-message' : 'other-user-message'}`}
        >
          <span className="message-sender">
            {msg.sender?.firstName || msg.senderName || 'User'} {/* Adapt based on sender info structure */}
          </span>
          <div className="message-content">{msg.content || msg.text}</div> {/* Adapt based on content field */}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatRoom;