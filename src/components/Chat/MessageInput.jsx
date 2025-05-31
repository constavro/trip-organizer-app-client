import React, { useState } from 'react';
import socket from './socket';
// No direct CSS import needed

const MessageInput = ({ tripId, senderId }) => { // Changed prop 'user' to 'senderId'
  const [text, setText] = useState('');

  const sendMessage = (e) => {
    e.preventDefault(); // Prevent form submission if it's in a form
    if (text.trim() && senderId && tripId) {
      socket.emit('chatMessage', {
        tripId,
        content: text,
        senderId: senderId, // Ensure this matches backend expectation
      });
      setText('');
    } else {
        if (!senderId) console.warn("MessageInput: senderId is missing.");
        if (!tripId) console.warn("MessageInput: tripId is missing.");
    }
  };

  return (
    // Can be a form for better accessibility (Enter to send)
    <form className="message-input-container" onSubmit={sendMessage}>
      <input
        type="text" // Specify type
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        aria-label="Type your message"
        disabled={!senderId || !tripId} // Disable if essential info is missing
      />
      <button type="submit" className="btn" disabled={!text.trim() || !senderId || !tripId}> {/* Applied btn class */}
        Send
      </button>
    </form>
  );
};

export default MessageInput;