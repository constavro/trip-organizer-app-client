import React, { useState } from 'react';
import socket from './socket';

const MessageInput = ({ tripId, user }) => {
  const [text, setText] = useState('');

  const sendMessage = () => {

    console.log(text)
    console.log(user)

    if (text.trim()) {
      socket.emit('chatMessage', {
        tripId,
        content: text,
        senderId: user,
      });
      setText('');
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
