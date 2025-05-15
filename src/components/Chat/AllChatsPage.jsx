import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat/user`, {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch chats');

        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token]);

  console.log(chats)

  if (loading) return <p>Loading chats...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Chats</h2>
      {chats.length === 0 ? (
        <p>No chats found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chats.map((chat) => (
            <li key={chat.tripId} style={{ marginBottom: 15 }}>
              <Link to={`/chat/${chat.tripId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ border: '1px solid #ccc', padding: 10, borderRadius: 8 }}>
                  <strong>{chat.tripTitle}</strong>
                  <p style={{ margin: '5px 0' }}>
                    {chat.lastMessage
                      ? `${chat.lastMessage.senderName}: ${chat.lastMessage.text}`
                      : 'No messages yet.'}
                  </p>
                  {chat.lastMessage && (
                    <small>{new Date(chat.lastMessage.time).toLocaleString()}</small>
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

export default ChatsPage;
