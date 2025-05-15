import React, { useEffect, useState, useRef } from 'react';
import socket from './socket';

const ChatRoom = ({ tripId, user }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch the existing messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat/user/${tripId}`);
        const data = await res.json();
        setMessages(data.messages); // Assuming the response contains an array of messages
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [tripId]); // Fetch messages when tripId changes

  // Set up socket connection to join the chat room and listen for new messages
  useEffect(() => {
    socket.emit('joinRoom', tripId); // Join the room for the specific trip

    // Listen for new messages from the socket server
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]); // Add new message to state
    });

    // Cleanup when the component unmounts or tripId changes
    return () => {
      socket.emit('leaveRoom', tripId); // Leave the room when the component unmounts
      socket.off('newMessage'); // Remove the listener
    };
  }, [tripId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid gray', padding: 10 }}>
      {messages.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.sender?.firstName || 'Unknown'}:</strong> {msg.content}
        </div>
      ))}
      <div ref={messagesEndRef} /> {/* Scroll to the end of messages */}
    </div>
  );
};

export default ChatRoom;
