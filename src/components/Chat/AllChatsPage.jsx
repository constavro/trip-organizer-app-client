// src/components/Chat/AllChatsPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import socket from './socket'; // Import frontend socket
import './Chat.css';

const AllChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  const sortChats = (chatArray) => {
    return [...chatArray].sort((a, b) => { // Create a new array before sorting
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
  };

  const fetchChats = useCallback(async () => {
    if (!token) {
      setError("Authentication required to view chats.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat/user`, {
        headers: { Authorization: token },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch chats');
      }
      const data = await res.json();
      // Backend already sorts, but we can ensure it if needed or rely on backend
      // setChats(sortChats(data));
      setChats(data); // Assuming backend provides sorted data
    } catch (err) {
      setError(err.message || 'An error occurred while fetching chats.');
      console.error("Fetch chats error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    const handleNewMessageRealtime = (newMessage) => {
      setChats(prevChats => {
        let chatUpdated = false;
        const updatedChats = prevChats.map(chat => {
          if (chat.tripId === newMessage.trip) { // 'trip' from populatedMessage on backend
            chatUpdated = true;
            const isOwnMessage = newMessage.sender._id === currentUserId;
            return {
              ...chat,
              lastMessage: {
                id: newMessage._id,
                content: newMessage.content,
                senderName: newMessage.sender.firstName || 'User',
                senderId: newMessage.sender._id,
                timestamp: newMessage.createdAt, // Use createdAt from populated message
                type: newMessage.type,
              },
              unreadCount: isOwnMessage ? chat.unreadCount : (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        });

        // If the new message was for a trip not in the current chat list (e.g., a brand new chat)
        // This case requires more info (like tripTitle) or a separate event for "new chat started"
        // For now, we assume the chat/trip already exists in the list.
        // If chatUpdated is true, it means an existing chat was updated.
        if (chatUpdated) {
            return sortChats(updatedChats); // Re-sort the array
        }
        return prevChats; // No change if the message wasn't for any of the currently listed chats
      });
    };

    const handleMessagesReadUpdate = ({ tripId: updatedTripId, userId: readerId }) => {
        if (readerId === currentUserId) {
            setChats(prevChats => prevChats.map(chat => {
                if (chat.tripId === updatedTripId) {
                    return { ...chat, unreadCount: 0 };
                }
                return chat;
            }));
        }
    };

    socket.on('newMessage', handleNewMessageRealtime);
    socket.on('messagesRead', handleMessagesReadUpdate);

    return () => {
      socket.off('newMessage', handleNewMessageRealtime);
      socket.off('messagesRead', handleMessagesReadUpdate);
    };
  }, [currentUserId]); // sortChats is stable if defined outside or memoized

  if (loading && chats.length === 0) return <p className="loading-message container">Loading your chats...</p>;
  if (error) return <p className="error-message container">{error}</p>;

  return (
    <div className="all-chats-page container">
      <h2>Your Chats</h2>
      {chats.length === 0 && !loading ? (
        <p className="empty-state-message">You have no active chats. Join or create a trip to start chatting!</p>
      ) : (
        <ul className="chat-list">
          {/* The chats array is now always sorted by last message time */}
          {chats.map((chat) => (
            <li key={chat.tripId} className="chat-list-item">
              <Link to={`/chat/${chat.tripId}`}>
                <div className="chat-list-card card">
                  {chat.tripCoverPhoto && <img src={chat.tripCoverPhoto} alt={`${chat.tripTitle} cover`} className="chat-trip-cover" />}
                  <div className="chat-info">
                    <span className="chat-title">{chat.tripTitle}</span>
                    {chat.lastMessage ? (
                      <>
                        <p className={`last-message ${chat.unreadCount > 0 && chat.lastMessage.senderId !== currentUserId ? 'unread' : ''}`}>
                          <strong>{chat.lastMessage.senderName}: </strong>
                          {chat.lastMessage.type === 'image' ? '📷 Image' : 
                           chat.lastMessage.type === 'file' ? '📄 File' : 
                           chat.lastMessage.content.length > 50 ? `${chat.lastMessage.content.substring(0,50)}...` : chat.lastMessage.content
                          }
                        </p>
                        <small className="message-time">{new Date(chat.lastMessage.timestamp).toLocaleString()}</small>
                      </>
                    ) : (
                      <p className="last-message">No messages yet.</p>
                    )}
                  </div>
                  {chat.unreadCount > 0 && chat.lastMessage && chat.lastMessage.senderId !== currentUserId && (
                    <span className="unread-badge">{chat.unreadCount}</span>
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