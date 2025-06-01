// src/components/Chat/ChatRoom.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import socket from './socket';
import { Link } from 'react-router-dom'; // For sender link

const ChatRoom = ({ tripId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const chatRoomRef = useRef(null);

  // Define markVisibleMessagesAsRead with useCallback because it depends on tripId and currentUserId
  // and is used in other hooks' dependency arrays.
  const markVisibleMessagesAsRead = useCallback((msgsToMark) => {
    if (!currentUserId || !tripId) return; // Guard against missing IDs

    const unreadMessageIds = msgsToMark
      .filter(msg => msg.sender?._id !== currentUserId && !msg.readBy.some(r => r.user === currentUserId))
      .map(msg => msg._id);

    if (unreadMessageIds.length > 0) {
      socket.emit('markMessagesAsRead', {
        tripId,
        userId: currentUserId,
        messageIds: unreadMessageIds,
      });
    }
  }, [tripId, currentUserId]); // Dependencies of markVisibleMessagesAsRead

  const fetchMessages = useCallback(async (pageNum = 1) => {
    if (!tripId) return;
    setLoading(true); // Moved setLoading to the beginning
    setError('');
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/trip/${tripId}?page=${pageNum}&limit=30`,
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch messages');
      }
      const data = await res.json();
      
      setMessages((prevMessages) => pageNum === 1 ? data.messages : [...data.messages, ...prevMessages]);
      setHasMoreMessages(data.messages.length === 30);
      if (pageNum === 1 && data.messages.length > 0) { // Check if messages exist before marking
        markVisibleMessagesAsRead(data.messages);
      }
    } catch (err) {
      setError(err.message || 'Error fetching messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [tripId, markVisibleMessagesAsRead]); // Added markVisibleMessagesAsRead to dependency array

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  useEffect(() => {
    if (!tripId) return;

    socket.emit('joinRoom', tripId);

    const handleNewMessage = (newMessage) => {
      if (newMessage.trip === tripId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (newMessage.sender?._id !== currentUserId && document.visibilityState === 'visible') {
            markVisibleMessagesAsRead([newMessage]);
        }
      }
    };

    const handleSocketError = (socketErr) => { // Renamed error to avoid conflict
        console.error("Socket Error:", socketErr.message);
        setError(`Chat connection error: ${socketErr.message}`);
    };

    const handleMessagesReadUpdate = ({ tripId: updatedTripId, userId: readerId, messageIds: readMsgIds }) => {
        if (updatedTripId === tripId) {
            setMessages(prevMsgs => prevMsgs.map(msg => {
                if (readMsgIds.includes(msg._id) && (!msg.readBy || !msg.readBy.some(r => r.user === readerId))) {
                    return {
                        ...msg,
                        readBy: [...(msg.readBy || []), { user: readerId, readAt: new Date() }]
                    };
                }
                return msg;
            }));
        }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('socketError', handleSocketError);
    socket.on('messagesRead', handleMessagesReadUpdate);

    return () => {
      socket.emit('leaveRoom', tripId);
      socket.off('newMessage', handleNewMessage);
      socket.off('socketError', handleSocketError);
      socket.off('messagesRead', handleMessagesReadUpdate);
    };
  }, [tripId, currentUserId, markVisibleMessagesAsRead]); // Added markVisibleMessagesAsRead

  useEffect(() => {
    if (page === 1) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleMessagesToMark = [];
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId;
            const message = messages.find(m => m._id === messageId);
            // Check message sender and if already read by current user
            if (message && message.sender?._id !== currentUserId && (!message.readBy || !message.readBy.some(r => r.user === currentUserId))) {
                visibleMessagesToMark.push(message);
            }
          }
        });
        if (visibleMessagesToMark.length > 0) {
            markVisibleMessagesAsRead(visibleMessagesToMark);
        }
      },
      { root: chatRoomRef.current, threshold: 0.8 }
    );

    const messageElements = chatRoomRef.current?.querySelectorAll('.message[data-message-id]');
    messageElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [messages, currentUserId, markVisibleMessagesAsRead]); // Added currentUserId & markVisibleMessagesAsRead. tripId is not directly used here but is a dep of markVisibleMessagesAsRead

  const handleScroll = useCallback(() => { // Memoize handleScroll
    if (chatRoomRef.current && chatRoomRef.current.scrollTop === 0 && !loading && hasMoreMessages) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchMessages(nextPage); // Call fetchMessages directly with the new page
        return nextPage;
      });
    }
  }, [loading, hasMoreMessages, fetchMessages]); // fetchMessages is now a dependency


  useEffect(() => {
    const currentChatRoomRef = chatRoomRef.current;
    currentChatRoomRef?.addEventListener('scroll', handleScroll);
    return () => currentChatRoomRef?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]); // Dependency is the memoized handleScroll

  return (
    <div className="chat-room" role="log" aria-live="polite" ref={chatRoomRef}>
      {loading && page === 1 && <p className="loading-message">Loading messages...</p>}
      {loading && page > 1 && <p className="loading-message loading-more">Loading more messages...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && messages.length === 0 && <p className="empty-state-message">No messages yet. Be the first to say hello!</p>}
      
      {messages.map((msg) => (
        <div
          key={msg._id}
          data-message-id={msg._id}
          className={`message ${msg.sender?._id === currentUserId ? 'current-user-message' : 'other-user-message'}`}
        >
          {msg.sender?._id !== currentUserId && msg.sender && (
            <span className="message-sender">
              {msg.sender.profilePhoto && <img src={msg.sender.profilePhoto} alt={msg.sender.firstName || 'User'} className="sender-avatar-small" />}
              <Link to={`/profile/${msg.sender._id}`} className="message-sender-link">
                {msg.sender.firstName || 'User'}
              </Link>
            </span>
          )}
          <div className="message-content">
            {msg.type === 'image' && msg.attachmentUrl ? (
              <img src={msg.attachmentUrl} alt="Chat attachment" style={{maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--border-radius-sm)'}}/>
            ) : msg.type === 'file' && msg.attachmentUrl ? (
              <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">View File: {msg.content || "Attachment"}</a>
            ) : (
              msg.content
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatRoom;