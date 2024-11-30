import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';  // Assuming you have styles defined in a separate CSS file

function Header() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove the token from localStorage if it exists
    localStorage.removeItem('userId');  // Remove the userId from localStorage if it exists
    navigate('/');  // Redirect to the landing page
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">Travel Buddy</Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/trips">Trips</Link></li>
          <li><Link to="/createtrip">Create Trip</Link></li>
          <li><Link to="/mytrips">My trips</Link></li>
          <li><Link to="/host/dashboard">Host Dashboard</Link></li>
          <li><Link to={`/profile/${userId}`}>Profile</Link></li>
        </ul>
        <ul className="navbar-auth">
          {/* Always show Log Out button */}
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
