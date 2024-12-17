// import React, { useState, useEffect } from 'react';
// import TripList from '../Trips/TripList'; // Assuming this component lists trips
// import './LandingPage.css';
// import { useNavigate } from 'react-router-dom';
// import Signup from '../Auth/Signup';
// import Login from '../Auth/Login';

// const LandingPage = () => {
//   const [showLogin, setShowLogin] = useState(true); // Toggle between login and signup
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkToken = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/protected`, {
//             method: 'GET', // or GET depending on your backend implementation
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: token,
//             },
//           });

//           if (response.ok) {
//             // Token is valid, navigate to the trips page
//             navigate('/trips');
//           } else {
//             // Token is invalid or expired, remove it
//             localStorage.removeItem('token');
//           }
//         } catch (error) {
//           console.error('Error verifying token:', error);
//           localStorage.removeItem('token');
//         }
//       }
//     };

//     checkToken();
//   }, [navigate]);

//   return (
//     <div className="landing-page">
//       <div className="landing-header">
//         <h1>Welcome to Travel Buddy</h1>
//         <div className="auth-options">
//           <button
//             className={showLogin ? 'active' : ''}
//             onClick={() => setShowLogin(true)}
//           >
//             Login
//           </button>
//           <button
//             className={!showLogin ? 'active' : ''}
//             onClick={() => setShowLogin(false)}
//           >
//             Sign Up
//           </button>
//         </div>

//         {/* Show either the login or signup forms based on state */}
//         <div className="auth-form">
//           {showLogin ? (
//             <div>
//               <Login />
//             </div>
//           ) : (
//             <div>
//               <Signup />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Section for displaying available trips */}
//       <TripList />
//     </div>
//   );
// };

// export default LandingPage;


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TripList from '../Trips/TripList';
import Signup from '../Auth/Signup';
import Login from '../Auth/Login';
import './LandingPage.css';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(true); // State to toggle between login and signup
  const navigate = useNavigate();

  // Function to verify token and navigate
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/protected`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        navigate('/trips'); // Navigate to trips page if the token is valid
      } else {
        localStorage.removeItem('token'); // Remove invalid/expired token
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
    }
  }, [navigate]);

  // Verify token on initial load
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to Travel Buddy</h1>
        <div className="auth-options">
          <button
            className={showLogin ? 'active' : ''}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={!showLogin ? 'active' : ''}
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Conditional rendering for Login and Signup */}
      <div className="auth-form">
        {showLogin ? <Login /> : <Signup />}
      </div>

      {/* Display TripList */}
      <section className="trips-section">
        <TripList />
      </section>
    </div>
  );
};

export default LandingPage;