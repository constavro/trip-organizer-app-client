import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams
import ChatRoom from './ChatRoom';
import MessageInput from './MessageInput';

const ChatPage = () => {
  const { id } = useParams();  // Destructure tripId from URL params

  const user = localStorage.getItem('userId');

  if (!user) return <p>Loading user info...</p>;
  if (!id) return <p>Loading trip info...</p>;

  return (
    <div>
      <h2>Trip Chat</h2>
      <ChatRoom tripId={id} user={user} />
      <MessageInput tripId={id} user={user} />
    </div>
  );
};

export default ChatPage;
