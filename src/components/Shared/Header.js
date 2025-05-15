import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // Importing external styles

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check for authentication token
  const userId = localStorage.getItem("userId"); // Retrieve user ID

  const [notifications, setNotifications] = useState([]); // Store user notifications
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification box

  // Fetch notifications (replace with API call)
  useEffect(() => {
    if (userId) {
      // Simulating an API call
      const fakeNotifications = [
        { id: 1, message: "Your trip to Paris is confirmed!" },
        { id: 2, message: "New message from a traveler." },
        { id: 3, message: "Your trip proposal was approved!" },
      ];
      setNotifications(fakeNotifications);
    }
  }, [userId]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="header">
      <nav className="navbar">
        {/* Brand Logo */}
        <div className="navbar-brand">
          <Link to="/trips">waylo</Link>
        </div>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li><Link to="/createtrip">Create Trip</Link></li>
          <li><Link to="/trips">Browse Trips</Link></li>
          <li><Link to="/mytrips">My Trips</Link></li>
          <li><Link to="/host/dashboard">Host Dashboard</Link></li>
          {userId && <li><Link to={`/profile/${userId}`}>Profile</Link></li>}
        </ul>

        {/* Right-side Buttons */}
        <ul className="navbar-auth">
          {/* Notifications Button */}
          {userId && (
  <>
    {/* Notifications */}
    <li className="notifications-container">
      <button
        className="notification-btn"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔 {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </button>

      {showNotifications && (
        <div className="notifications-box">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <p key={notif.id}>{notif.message}</p>
            ))
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      )}
    </li>

    {/* Chats Link Icon */}
    <li className="chat-icon-container">
      <Link to="/chats" className="chat-icon-link" title="Chats">
        💬
      </Link>
    </li>
  </>
)}

{userId && (
  <li>
    <Link to="/allexpenses" title="Expenses">
    🏦
    </Link>
  </li>
)}


          {/* Authentication Links */}
          {token ? (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Log Out
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="login-btn">Log In</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;