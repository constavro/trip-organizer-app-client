import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import UserProfile from './components/Users/UserProfile';
import PersonalInformation from './components/Users/PersonalInformation';
import HostDashboard from './components/Users/HostDashboard';
import TripCreationForm from './components/Trips/TripCreationForm';
import TripEditForm from './components/Trips/TripEditForm';
import TripByUser from './components/Trips/TripByUser';
import TripDetails from './components/Trips/TripDetails';
import TripList from './components/Trips/TripList';
import Itineraries from './components/Itineraries/Itineraries';
import BookingForm from './components/Bookings/BookingForm';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import LandingPage from './components/Shared/LandingPage';

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trips" element={<ProtectedRoute><Header /><TripList /></ProtectedRoute>} />
          <Route path="/host/dashboard" element={<ProtectedRoute><Header /><HostDashboard /></ProtectedRoute>} />
          <Route path="/trips/:id/book" element={<ProtectedRoute><Header /><BookingForm /></ProtectedRoute>} />
          <Route path="/itineraries" element={<Itineraries/>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><Header /><UserProfile /></ProtectedRoute>} />
          <Route path="/personal-info/:userId" element={<ProtectedRoute><Header /><PersonalInformation /></ProtectedRoute>} />
          <Route path="/mytrips" element={<ProtectedRoute><Header /><TripByUser /></ProtectedRoute>} />
         {/* <Route path="/coworking-spaces" element={<CoworkingSpaces />} /> */}
         {/* <Route path="/activities" element={<Activities />} /> */}
         {/* <Route path="/messages" element={<Messages />} /> */}
         {/* <Route path="/reviews" element={<Reviews />} /> */}
          <Route path="/createtrip" element={<ProtectedRoute><Header /><TripCreationForm /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><Header /><TripDetails /></ProtectedRoute>} />
          <Route path="/trips/edit/:id" element={<ProtectedRoute><Header /><TripEditForm /></ProtectedRoute>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');  // Check if user is authenticated

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;