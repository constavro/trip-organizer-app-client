import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Chat.css'; // Import consolidated CSS

const AllChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) {
        setError("Authentication required to view chats.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat/user`, {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch chats');
        }

        const data = await res.json();
        setChats(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching chats.');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token]);

  if (loading) return <p className="loading-message">Loading chats...</p>;
  if (error) return <p className="error-message container">{error}</p>;

  return (
    <div className="all-chats-page container">
      <h2>Your Chats</h2>
      {chats.length === 0 ? (
        <p className="empty-state-message">You have no active chats. Join a trip to start chatting!</p>
      ) : (
        <ul className="chat-list">
          {chats.map((chat) => (
            <li key={chat.tripId || chat._id} className="chat-list-item"> {/* Use chat._id if tripId is nested */}
              <Link to={`/chat/${chat.tripId || chat._id}`}>
                <div className="chat-list-card card"> {/* Added card class */}
                  <span className="chat-title">{chat.tripTitle}</span>
                  <p className="last-message">
                    {chat.lastMessage
                      ? `${chat.lastMessage.senderName || 'User'}: ${chat.lastMessage.text}`
                      : 'No messages yet.'}
                  </p>
                  {chat.lastMessage && (
                    <small className="message-time">{new Date(chat.lastMessage.time).toLocaleString()}</small>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllChatsPage;