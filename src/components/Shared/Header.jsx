import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        {/* Brand Logo */}
        <div className="brand-title">
          <Link to="/trips">waylo</Link>
        </div>

        {/* Tab Navigation */}
        <ul className="navbar-tabs">
          <li>
            <Link to="/trips" className={isActive("/trips") ? "tab active" : "tab"}>
              Trips
            </Link>
          </li>
          <li>
            <Link to="/chats" className={isActive("/chats") ? "tab active" : "tab"}>
              Chat
            </Link>
          </li>
          <li>
            <Link to="/allexpenses" className={isActive("/allexpenses") ? "tab active" : "tab"}>
              Expenses
            </Link>
          </li>
        </ul>

        {/* Profile Dropdown */}
        {userId && (
          <div className="profile-menu">
            <button
              className="profile-icon"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              👤
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <Link to={`/profile/${userId}`} onClick={() => setShowProfileMenu(false)}>
                  Open Profile
                </Link>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
