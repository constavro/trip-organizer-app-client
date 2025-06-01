// src/components/Chat/MessageInput.jsx
import React, { useState } from 'react';
import socket from './socket';

const MessageInput = ({ tripId, senderId }) => {
  const [text, setText] = useState('');
  // Add state for file uploads if you implement that
  // const [file, setFile] = useState(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (text.trim() && senderId && tripId) {
      socket.emit('chatMessage', {
        tripId,
        content: text,
        senderId: senderId,
        type: 'text', // Default to text
      });
      setText('');
    } else {
      if (!text.trim()) console.warn("MessageInput: Text is empty.");
      if (!senderId) console.warn("MessageInput: senderId is missing.");
      if (!tripId) console.warn("MessageInput: tripId is missing.");
    }
  };

  // Handle file input change (example)
  // const handleFileChange = (e) => setFile(e.target.files[0]);
  // Handle file upload and then emit chatMessage with type 'image' or 'file' and attachmentUrl

  return (
    <form className="message-input-container" onSubmit={sendMessage}>
      {/* Example file input - needs backend for upload */}
      {/* <input type="file" onChange={handleFileChange} /> */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        aria-label="Type your message"
        disabled={!senderId || !tripId}
      />
      <button type="submit" className="btn btn-primary" disabled={!text.trim() || !senderId || !tripId}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;