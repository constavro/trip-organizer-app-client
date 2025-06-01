import React, { useState, useEffect, useRef } from "react"; // Added useEffect, useRef
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Shared.css'; // Import consolidated CSS

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null); // Ref for dropdown

  const handleLogout = () => {
    localStorage.clear(); // Clears token and userId
    setShowProfileMenu(false); // Close dropdown on logout
    navigate("/");
  };

  const isActive = (path) => location.pathname === path || (path === "/trips" && location.pathname.startsWith("/trips/")); // More robust active check

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <header className="app-header"> {/* Changed class */}
      <div className="header-content container"> {/* Added container */}
        <div className="brand-title">
          <Link to={userId ? "/trips" : "/"}>waylo</Link> {/* Go to landing if not logged in */}
        </div>

        {userId && ( // Only show tabs if logged in
          <nav> {/* Added nav element for semantics */}
            <ul className="navbar-tabs">
              <li>
                <Link to="/trips" className={`btn btn-outline-primary tab ${isActive("/trips") ? "active" : ""}`}>
                  Trips
                </Link>
              </li>
              <li>
                <Link to="/allexpenses" className={`btn btn-outline-primary tab ${isActive("/allexpenses") ? "active" : ""}`}>
                  Expenses
                </Link>
              </li>
              <li>
                <Link to="/chats" className={`btn btn-outline-primary tab ${isActive("/chats") ? "active" : ""}`}>
                  Chat
                </Link>
              </li>
            </ul>
          </nav>
        )}

        {userId && (
          <div className="profile-menu" ref={profileMenuRef}>
            <button
              className="profile-icon-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-haspopup="true"
              aria-expanded={showProfileMenu}
              aria-label="User menu"
            >
              👤 {/* Consider an SVG icon here */}
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown" role="menu">
                <Link to={`/profile/${userId}`} className="profile-dropdown-item" role="menuitem" onClick={() => setShowProfileMenu(false)}>
                  My Profile
                </Link>
                <Link to={'/host/dashboard'} className="profile-dropdown-item" role="menuitem" onClick={() => setShowProfileMenu(false)}>
                  Host Dashboard
                </Link>
                {/* <Link to={'/settings'} className="profile-dropdown-item" role="menuitem" onClick={() => setShowProfileMenu(false)}>
                  Settings
                </Link> */}
                <button onClick={handleLogout} className="profile-dropdown-item" role="menuitem">Log Out</button>
              </div>
            )}
          </div>
        )}
        {!userId && location.pathname !== "/auth" && ( // Show login button if not logged in and not on auth page
             <Link to="/auth" className="btn">Login / Sign Up</Link>
        )}
      </div>
    </header>
  );
};

export default Header;